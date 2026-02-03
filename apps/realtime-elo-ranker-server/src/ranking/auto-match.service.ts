import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { RankingService } from './ranking.service';

@Injectable()
export class AutoMatchService {
  private readonly logger = new Logger(AutoMatchService.name);

  constructor(private readonly rankingService: RankingService) {}

  @Interval(5000)
  async handleAutoMatch() {
    const players = await this.rankingService.findAll();

    if (players.length < 2) {
      return;
    }

    const shuffled = [...players].sort(() => 0.5 - Math.random());
    const [p1, p2] = shuffled;

    const random = Math.random();
    const isDraw = random < 0.2;
    const winnerId = random > 0.6 ? p1.id : p2.id;
    const loserId = winnerId === p1.id ? p2.id : p1.id;

    this.logger.log(`Match auto : ${winnerId} vs ${loserId} (Nul: ${isDraw})`);

    await this.rankingService.registerMatch(winnerId, loserId, isDraw);
  }
}
