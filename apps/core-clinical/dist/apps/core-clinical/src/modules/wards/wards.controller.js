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
exports.WardsController = void 0;
const common_1 = require("@nestjs/common");
const wards_service_1 = require("./wards.service");
let WardsController = class WardsController {
    constructor(wardsService) {
        this.wardsService = wardsService;
    }
    list(hospitalId) {
        return this.wardsService.getWards(hospitalId);
    }
    admit(data) {
        return this.wardsService.admitPatient(data);
    }
    discharge(id) {
        return this.wardsService.dischargePatient(id);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('hospitalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WardsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('admissions'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WardsController.prototype, "admit", null);
__decorate([
    (0, common_1.Patch)('admissions/:id/discharge'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WardsController.prototype, "discharge", null);
WardsController = __decorate([
    (0, common_1.Controller)('wards'),
    __metadata("design:paramtypes", [wards_service_1.WardsService])
], WardsController);
exports.WardsController = WardsController;
