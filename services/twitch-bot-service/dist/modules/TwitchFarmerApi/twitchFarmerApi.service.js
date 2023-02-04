"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchFarmerApiService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let TwitchFarmerApiService = class TwitchFarmerApiService {
    constructor() {
        this.api = axios_1.default.create({
            baseURL: process.env.TWITCH_FARMER_API_URL,
            headers: {
                authorization: process.env.MICROSERVICE_TOKEN,
            },
        });
    }
    async getAllUsers() {
        const allUsers = await this.api.get('/private/users');
        return allUsers.data;
    }
    async getAllTwitchAccountsByUser(userId) {
        const allAccounts = await this.api.get(`/private/users/${userId}/twitch-accounts`);
        return allAccounts.data;
    }
    async getAllTwitchChannelsByUser(userId) {
        const allChannels = await this.api.get(`/private/users/${userId}/twitch-channels`);
        return allChannels.data;
    }
};
TwitchFarmerApiService = __decorate([
    (0, common_1.Injectable)()
], TwitchFarmerApiService);
exports.TwitchFarmerApiService = TwitchFarmerApiService;
//# sourceMappingURL=twitchFarmerApi.service.js.map