"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WardsModule = void 0;
const common_1 = require("@nestjs/common");
const wards_service_1 = require("./wards.service");
const wards_controller_1 = require("./wards.controller");
const prisma_1 = require("@hospital/prisma");
let WardsModule = class WardsModule {
};
exports.WardsModule = WardsModule;
exports.WardsModule = WardsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_1.PrismaModule],
        providers: [wards_service_1.WardsService],
        controllers: [wards_controller_1.WardsController],
        exports: [wards_service_1.WardsService],
    })
], WardsModule);
//# sourceMappingURL=wards.module.js.map