import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankingModule } from './ranking/ranking.module';
import { Player } from './ranking/entities/player.entity';
import { Match } from './ranking/entities/match.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Player, Match],
      synchronize: true,
    }),
    RankingModule,
  ],
})
export class AppModule {}
