import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: '/cats',
        module: CatsModule,
      },
    ]),
  ],
})
export class AppModule {}