// apps/realtime-elo-ranker-server/src/ranking/ranking.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject, Observable } from 'rxjs';
import { Player } from './entities/player.entity';
import { Match } from './entities/match.entity';

@Injectable()
export class RankingService {
  private readonly K_FACTOR = 32;
  private rankingEvents$ = new Subject<any>();

  constructor(
    @InjectRepository(Player) private playerRepo: Repository<Player>,
    @InjectRepository(Match) private matchRepo: Repository<Match>,
  ) {}

  async findAll() {
    return this.playerRepo.find();
  }

  async findAllMatches() {
    return this.matchRepo.find({ order: { date: 'DESC' } });
  }

  getEvents(): Observable<any> {
    return this.rankingEvents$.asObservable();
  }

  async createPlayer(name: string) {
    let player = await this.playerRepo.findOneBy({ id: name });
    if (!player) {
      player = this.playerRepo.create({ id: name, name, rank: 1200 });
      await this.playerRepo.save(player);
      this.rankingEvents$.next({
        type: 'RankingUpdate',
        player: { id: player.id, rank: player.rank },
      });
    }
    return player;
  }

  async registerMatch(winnerId: string, loserId: string, isDraw: boolean) {
    const winner = await this.playerRepo.findOneBy({ id: winnerId });
    const loser = await this.playerRepo.findOneBy({ id: loserId });

    if (!winner || !loser) {
      return null;
    }

    const scoreA = isDraw ? 0.5 : 1;
    const expectedA = 1 / (1 + Math.pow(10, (loser.rank - winner.rank) / 400));

    winner.rank = Math.round(
      winner.rank + this.K_FACTOR * (scoreA - expectedA),
    );
    loser.rank = Math.round(
      loser.rank + this.K_FACTOR * (1 - scoreA - (1 - expectedA)),
    );

    await this.playerRepo.save([winner, loser]);
    const match = await this.matchRepo.save({ winnerId, loserId, isDraw });

    this.rankingEvents$.next({
      type: 'RankingUpdate',
      player: { id: winner.id, rank: winner.rank },
    });
    this.rankingEvents$.next({
      type: 'RankingUpdate',
      player: { id: loser.id, rank: loser.rank },
    });
    this.rankingEvents$.next({ type: 'MatchUpdate', match });

    return { winner, loser, match };
  }

  async resetData() {
    await this.matchRepo.clear();
    await this.playerRepo.clear();
    this.rankingEvents$.next({ type: 'ResetUpdate' });
    return { message: 'Base de données SQLite réinitialisée' };
  }
}
