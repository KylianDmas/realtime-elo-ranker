/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecordMatchDto {
  @ApiProperty({ example: 'Alice' })
  @IsString()
  @IsNotEmpty()
  winner: string;

  @ApiProperty({ example: 'Bob' })
  @IsString()
  @IsNotEmpty()
  loser: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  draw: boolean;
}
