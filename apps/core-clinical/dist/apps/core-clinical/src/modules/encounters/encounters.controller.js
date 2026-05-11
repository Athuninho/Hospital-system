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
exports.EncountersController = void 0;
const common_1 = require("@nestjs/common");
const encounters_service_1 = require("./encounters.service");
let EncountersController = class EncountersController {
    constructor(encountersService) {
        this.encountersService = encountersService;
    }
    list() {
        return this.encountersService.findAll();
    }
    get(id) {
        return this.encountersService.findOne(id);
    }
    create(payload) {
        return this.encountersService.create(payload);
    }
    addPrescription(id, payload) {
        return this.encountersService.addPrescription(id, payload);
    }
    update(id, payload) {
        return this.encountersService.update(id, payload);
    }
    addLabRequest(id, payload) {
        return this.encountersService.addLabRequest(id, payload);
    }
    addFile(id, payload) {
        return this.encountersService.addFileAttachment(id, payload);
    }
};
exports.EncountersController = EncountersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EncountersController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EncountersController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EncountersController.prototype, "create", null);
__decorate([
    (0, common_1.Param)('id'),
    (0, common_1.Post)(':id/prescriptions'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EncountersController.prototype, "addPrescription", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EncountersController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/lab-requests'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EncountersController.prototype, "addLabRequest", null);
__decorate([
    (0, common_1.Post)(':id/files'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EncountersController.prototype, "addFile", null);
exports.EncountersController = EncountersController = __decorate([
    (0, common_1.Controller)('encounters'),
    __metadata("design:paramtypes", [encounters_service_1.EncountersService])
], EncountersController);
//# sourceMappingURL=encounters.controller.js.map