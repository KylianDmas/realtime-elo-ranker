import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';
import { AutoMatchService } from './auto-match.service';
import { Player } from './entities/player.entity';
import { Match } from './entities/match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Player, Match])],
  controllers: [RankingController],
  providers: [RankingService, AutoMatchService],
})
export class RankingModule {}
