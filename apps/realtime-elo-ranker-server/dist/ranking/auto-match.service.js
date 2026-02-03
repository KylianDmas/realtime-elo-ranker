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
var AutoMatchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoMatchService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const ranking_service_1 = require("./ranking.service");
let AutoMatchService = AutoMatchService_1 = class AutoMatchService {
    rankingService;
    logger = new common_1.Logger(AutoMatchService_1.name);
    constructor(rankingService) {
        this.rankingService = rankingService;
    }
    async handleAutoMatch() {
        const players = await this.rankingService.findAll();
        if (players.length < 2) {
            return;
        }
        const shuffled = [...players].sort(() => 0.5 - Math.random());
        const [p1, p2] = shuffled;
        const random = Math.random();
        const isDraw = random < 0.2;
        const winnerId = random > 0.6 ? p1.id : p2.id;
        const loserId = winnerId === p1.id ? p2.id : p1.id;
        this.logger.log(`Match auto : ${winnerId} vs ${loserId} (Nul: ${isDraw})`);
        await this.rankingService.registerMatch(winnerId, loserId, isDraw);
    }
};
exports.AutoMatchService = AutoMatchService;
__decorate([
    (0, schedule_1.Interval)(5000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AutoMatchService.prototype, "handleAutoMatch", null);
exports.AutoMatchService = AutoMatchService = AutoMatchService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ranking_service_1.RankingService])
], AutoMatchService);
//# sourceMappingURL=auto-match.service.js.map