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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("@hospital/prisma");
let PharmacyService = class PharmacyService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async searchInventory(query, hospitalId) {
        return this.prisma.drugInventory.findMany({
            where: {
                hospitalId,
                name: { contains: query, mode: 'insensitive' },
            },
            take: 10,
        });
    }
    async getPendingPrescriptions(hospitalId) {
        return this.prisma.prescription.findMany({
            where: {
                encounter: {
                    patient: { hospitalId }
                }
            },
            include: {
                patient: true,
                items: true,
                encounter: {
                    include: { doctor: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async addInventory(data) {
        return this.prisma.drugInventory.create({
            data
        });
    }
    async fulfillPrescription(prescriptionId) {
        return this.prisma.prescription.update({
            where: { id: prescriptionId },
            data: { notes: 'FULFILLED' }
        });
    }
};
PharmacyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], PharmacyService);
exports.PharmacyService = PharmacyService;
