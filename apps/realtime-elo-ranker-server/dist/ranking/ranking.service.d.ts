import { Repository } from 'typeorm';
import { Observable } from 'rxjs';
import { Player } from './entities/player.entity';
import { Match } from './entities/match.entity';
export declare class RankingService {
    private playerRepo;
    private matchRepo;
    private readonly K_FACTOR;
    private rankingEvents$;
    constructor(playerRepo: Repository<Player>, matchRepo: Repository<Match>);
    findAll(): Promise<Player[]>;
    findAllMatches(): Promise<Match[]>;
    getEvents(): Observable<any>;
    createPlayer(name: string): Promise<Player>;
    registerMatch(winnerId: string, loserId: string, isDraw: boolean): Promise<{
        winner: Player;
        loser: Player;
        match: {
            winnerId: string;
            loserId: string;
            isDraw: boolean;
        } & Match;
    } | null>;
    resetData(): Promise<{
        message: string;
    }>;
}
