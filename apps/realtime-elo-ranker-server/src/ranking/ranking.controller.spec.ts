import { Test, TestingModule } from '@nestjs/testing';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';

describe('RankingController', () => {
  let controller: RankingController;
  let service: RankingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankingController],
      providers: [
        {
          provide: RankingService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            createPlayer: jest.fn().mockResolvedValue({ id: 'Alice' }),
            registerMatch: jest.fn().mockResolvedValue({}),
            resetData: jest.fn().mockResolvedValue({ message: 'ok' }),
            getEvents: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RankingController>(RankingController);
    service = module.get<RankingService>(RankingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Endpoints', () => {
    it('GET /ranking devrait appeler findAll', async () => {
      await controller.getRanking();
      expect(service.findAll).toHaveBeenCalled();
    });

    it('POST /player devrait appeler createPlayer', async () => {
      await controller.createPlayer({ id: 'Alice' });
      expect(service.createPlayer).toHaveBeenCalledWith('Alice');
    });

    it('POST /match devrait appeler registerMatch', async () => {
      const dto = { winner: 'Alice', loser: 'Bob', draw: false };
      await controller.recordMatch(dto);
      expect(service.registerMatch).toHaveBeenCalledWith('Alice', 'Bob', false);
    });

    it('POST /reset devrait appeler resetData', async () => {
      await controller.reset();
      expect(service.resetData).toHaveBeenCalled();
    });
  });
});
