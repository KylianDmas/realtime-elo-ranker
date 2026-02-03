import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { RankingModule } from './ranking/ranking.module';
import { Player } from './ranking/entities/player.entity';
import { Match } from './ranking/entities/match.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqljs',
      autoSave: true,
      location: 'database.sqlite',
      useLocalForage: false,
      entities: [Player, Match],
      synchronize: true,
    }),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ScheduleModule.forRoot(),
    RankingModule,
  ],
})
export class AppModule {}
