import { Controller, Get, Post, Body, Sse, MessageEvent } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { Observable, map } from 'rxjs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePlayerDto } from './dto/create-player.dto';
import { RecordMatchDto } from './dto/record-match.dto';

@ApiTags('ranking')
@Controller('api')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @ApiOperation({ summary: 'Obtenir le classement complet' })
  @Get('ranking')
  async getRanking() {
    return await this.rankingService.findAll();
  }

  @ApiOperation({ summary: 'Créer un nouveau joueur' })
  @ApiResponse({ status: 201, description: 'Joueur créé avec succès.' })
  @Post('player')
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    return await this.rankingService.createPlayer(createPlayerDto.id);
  }

  @ApiOperation({ summary: "Enregistrer le résultat d'un match" })
  @Post('match')
  async recordMatch(@Body() recordMatchDto: RecordMatchDto) {
    return await this.rankingService.registerMatch(
      recordMatchDto.winner,
      recordMatchDto.loser,
      recordMatchDto.draw,
    );
  }

  @ApiOperation({ summary: 'Flux temps réel des événements' })
  @Sse('ranking/events')
  sse(): Observable<MessageEvent> {
    return this.rankingService
      .getEvents()
      .pipe(map((data) => ({ data: JSON.stringify(data) }) as MessageEvent));
  }

  @ApiOperation({ summary: 'Réinitialiser toutes les données' })
  @Post('reset')
  async reset() {
    return await this.rankingService.resetData();
  }
}
