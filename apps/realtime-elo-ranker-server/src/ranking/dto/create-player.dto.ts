/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlayerDto {
  @ApiProperty({ example: 'Alice', description: 'Le nom unique du joueur' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  id: string;
}
