import { MessageEvent } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { Observable } from 'rxjs';
import { CreatePlayerDto } from './dto/create-player.dto';
import { RecordMatchDto } from './dto/record-match.dto';
export declare class RankingController {
    private readonly rankingService;
    constructor(rankingService: RankingService);
    getRanking(): Promise<import("./entities/player.entity").Player[]>;
    createPlayer(createPlayerDto: CreatePlayerDto): Promise<import("./entities/player.entity").Player>;
    recordMatch(recordMatchDto: RecordMatchDto): Promise<{
        winner: import("./entities/player.entity").Player;
        loser: import("./entities/player.entity").Player;
        match: {
            winnerId: string;
            loserId: string;
            isDraw: boolean;
        } & import("./entities/match.entity").Match;
    } | null>;
    sse(): Observable<MessageEvent>;
    reset(): Promise<{
        message: string;
    }>;
}
