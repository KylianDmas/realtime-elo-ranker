"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingController = void 0;
const common_1 = require("@nestjs/common");
const ranking_service_1 = require("./ranking.service");
const rxjs_1 = require("rxjs");
const swagger_1 = require("@nestjs/swagger");
const create_player_dto_1 = require("./dto/create-player.dto");
const record_match_dto_1 = require("./dto/record-match.dto");
let RankingController = class RankingController {
    rankingService;
    constructor(rankingService) {
        this.rankingService = rankingService;
    }
    async getRanking() {
        return await this.rankingService.findAll();
    }
    async createPlayer(createPlayerDto) {
        return await this.rankingService.createPlayer(createPlayerDto.id);
    }
    async recordMatch(recordMatchDto) {
        return await this.rankingService.registerMatch(recordMatchDto.winner, recordMatchDto.loser, recordMatchDto.draw);
    }
    sse() {
        return this.rankingService
            .getEvents()
            .pipe((0, rxjs_1.map)((data) => ({ data: JSON.stringify(data) })));
    }
    async reset() {
        return await this.rankingService.resetData();
    }
};
exports.RankingController = RankingController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir le classement complet' }),
    (0, common_1.Get)('ranking'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RankingController.prototype, "getRanking", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Créer un nouveau joueur' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Joueur créé avec succès.' }),
    (0, common_1.Post)('player'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_player_dto_1.CreatePlayerDto]),
    __metadata("design:returntype", Promise)
], RankingController.prototype, "createPlayer", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Enregistrer le résultat d'un match" }),
    (0, common_1.Post)('match'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [record_match_dto_1.RecordMatchDto]),
    __metadata("design:returntype", Promise)
], RankingController.prototype, "recordMatch", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Flux temps réel des événements' }),
    (0, common_1.Sse)('ranking/events'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", rxjs_1.Observable)
], RankingController.prototype, "sse", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Réinitialiser toutes les données' }),
    (0, common_1.Post)('reset'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RankingController.prototype, "reset", null);
exports.RankingController = RankingController = __decorate([
    (0, swagger_1.ApiTags)('ranking'),
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [ranking_service_1.RankingService])
], RankingController);
//# sourceMappingURL=ranking.controller.js.map