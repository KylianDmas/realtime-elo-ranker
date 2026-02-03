import { Test, TestingModule } from '@nestjs/testing';
import { RankingService } from './ranking.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { Match } from './entities/match.entity';
import { NotFoundException } from '@nestjs/common';

describe('RankingService', () => {
  let service: RankingService;

  const mockPlayerRepo = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(player => Promise.resolve(player)),
    clear: jest.fn().mockResolvedValue(undefined),
  };

  const mockMatchRepo = {
    find: jest.fn(),
    save: jest.fn().mockImplementation(match => Promise.resolve({ id: 'uuid', ...match })),
    clear: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RankingService,
        {
          provide: getRepositoryToken(Player),
          useValue: mockPlayerRepo,
        },
        {
          provide: getRepositoryToken(Match),
          useValue: mockMatchRepo,
        },
      ],
    }).compile();

    service = module.get<RankingService>(RankingService);
  });

  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });

  describe('Lectures et Création', () => {
    it('devrait retourner tous les joueurs', async () => {
      mockPlayerRepo.find.mockResolvedValue([{ id: 'Alice', rank: 1200 }]);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(mockPlayerRepo.find).toHaveBeenCalled();
    });

    it('devrait retourner tous les matchs', async () => {
      mockMatchRepo.find.mockResolvedValue([{ id: 'm1' }]);
      const result = await service.findAllMatches();
      expect(result).toHaveLength(1);
      expect(mockMatchRepo.find).toHaveBeenCalled();
    });

    it('devrait créer un nouveau joueur s il n existe pas', async () => {
      mockPlayerRepo.findOneBy.mockResolvedValue(null);
      const result = await service.createPlayer('Alice');
      expect(result.id).toBe('Alice');
      expect(mockPlayerRepo.save).toHaveBeenCalled();
    });

    it('devrait réinitialiser les données', async () => {
      const result = await service.resetData();
      expect(mockMatchRepo.clear).toHaveBeenCalled();
      expect(mockPlayerRepo.clear).toHaveBeenCalled();
      expect(result.message).toContain('réinitialisée');
    });
  });

  describe('calculateElo', () => {
    it('devrait augmenter le score du gagnant et baisser celui du perdant', async () => {
      const alice = { id: 'Alice', name: 'Alice', rank: 1200 };
      const bob = { id: 'Bob', name: 'Bob', rank: 1200 };

      mockPlayerRepo.findOneBy
        .mockResolvedValueOnce(alice)
        .mockResolvedValueOnce(bob);

      const result = await service.registerMatch('Alice', 'Bob', false);

      expect(result.winner.rank).toBe(1216);
      expect(result.loser.rank).toBe(1184);
    });

    it('devrait donner plus de points si un petit bat un gros', async () => {
      const petit = { id: 'Petit', name: 'Petit', rank: 1000 };
      const gros = { id: 'Gros', name: 'Gros', rank: 2000 };

      mockPlayerRepo.findOneBy
        .mockResolvedValueOnce(petit)
        .mockResolvedValueOnce(gros);

      const result = await service.registerMatch('Petit', 'Gros', false);

      expect(result.winner.rank).toBeGreaterThan(1030);
    });

    it('devrait équilibrer les scores en cas d égalité', async () => {
      const player1 = { id: 'P1', name: 'P1', rank: 1200 };
      const player2 = { id: 'P2', name: 'P2', rank: 1200 };

      mockPlayerRepo.findOneBy
        .mockResolvedValueOnce(player1)
        .mockResolvedValueOnce(player2);

      const result = await service.registerMatch('P1', 'P2', true);

      expect(result.winner.rank).toBe(1200);
      expect(result.loser.rank).toBe(1200);
    });
  });

  describe('error handling', () => {
    it('devrait retourner null si un joueur n existe pas (gestion silencieuse)', async () => {
      mockPlayerRepo.findOneBy.mockResolvedValue(null);

      const result = await service.registerMatch('Inconnu', 'Alice', false);

      expect(result).toBeNull();
    });
  });
});
