import { Test } from '@nestjs/testing';
import { AutoMatchService } from './auto-match.service';
import { RankingService } from './ranking.service';

describe('AutoMatchService', () => {
  let service: AutoMatchService;
  let rankingService: RankingService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AutoMatchService,
        {
          provide: RankingService,
          useValue: { 
            findAll: jest.fn(), 
            registerMatch: jest.fn() 
          },
        },
      ],
    }).compile();

    service = module.get<AutoMatchService>(AutoMatchService);
    rankingService = module.get<RankingService>(RankingService);
  });

  it('devrait ne rien faire s il y a moins de 2 joueurs', async () => {
    (rankingService.findAll as jest.Mock).mockResolvedValue([{ id: 'Alice' }]);
    await service.handleAutoMatch();
    expect(rankingService.registerMatch).not.toHaveBeenCalled();
  });

  it('devrait lancer un match s il y a assez de joueurs', async () => {
    (rankingService.findAll as jest.Mock).mockResolvedValue([
      { id: 'Alice', rank: 1200 }, 
      { id: 'Bob', rank: 1200 }
    ]);
    await service.handleAutoMatch();
    expect(rankingService.registerMatch).toHaveBeenCalled();
  });
});