import { RankingService } from './ranking.service';
export declare class AutoMatchService {
    private readonly rankingService;
    private readonly logger;
    constructor(rankingService: RankingService);
    handleAutoMatch(): Promise<void>;
}
