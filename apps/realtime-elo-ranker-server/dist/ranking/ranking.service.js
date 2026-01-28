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
exports.RankingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rxjs_1 = require("rxjs");
const player_entity_1 = require("./entities/player.entity");
const match_entity_1 = require("./entities/match.entity");
let RankingService = class RankingService {
    playerRepo;
    matchRepo;
    K_FACTOR = 32;
    rankingEvents$ = new rxjs_1.Subject();
    constructor(playerRepo, matchRepo) {
        this.playerRepo = playerRepo;
        this.matchRepo = matchRepo;
    }
    async findAll() {
        return this.playerRepo.find();
    }
    async findAllMatches() {
        return this.matchRepo.find({ order: { date: 'DESC' } });
    }
    getEvents() {
        return this.rankingEvents$.asObservable();
    }
    async createPlayer(name) {
        let player = await this.playerRepo.findOneBy({ id: name });
        if (!player) {
            player = this.playerRepo.create({ id: name, name, rank: 1200 });
            await this.playerRepo.save(player);
            this.rankingEvents$.next({
                type: 'RankingUpdate',
                player: { id: player.id, rank: player.rank },
            });
        }
        return player;
    }
    async registerMatch(winnerId, loserId, isDraw) {
        const winner = await this.playerRepo.findOneBy({ id: winnerId });
        const loser = await this.playerRepo.findOneBy({ id: loserId });
        if (!winner || !loser) {
            return null;
        }
        const scoreA = isDraw ? 0.5 : 1;
        const expectedA = 1 / (1 + Math.pow(10, (loser.rank - winner.rank) / 400));
        winner.rank = Math.round(winner.rank + this.K_FACTOR * (scoreA - expectedA));
        loser.rank = Math.round(loser.rank + this.K_FACTOR * (1 - scoreA - (1 - expectedA)));
        await this.playerRepo.save([winner, loser]);
        const match = await this.matchRepo.save({ winnerId, loserId, isDraw });
        this.rankingEvents$.next({
            type: 'RankingUpdate',
            player: { id: winner.id, rank: winner.rank },
        });
        this.rankingEvents$.next({
            type: 'RankingUpdate',
            player: { id: loser.id, rank: loser.rank },
        });
        this.rankingEvents$.next({ type: 'MatchUpdate', match });
        return { winner, loser, match };
    }
    async resetData() {
        await this.matchRepo.clear();
        await this.playerRepo.clear();
        this.rankingEvents$.next({ type: 'ResetUpdate' });
        return { message: 'Base de données SQLite réinitialisée' };
    }
};
exports.RankingService = RankingService;
exports.RankingService = RankingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __param(1, (0, typeorm_1.InjectRepository)(match_entity_1.Match)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RankingService);
//# sourceMappingURL=ranking.service.js.map