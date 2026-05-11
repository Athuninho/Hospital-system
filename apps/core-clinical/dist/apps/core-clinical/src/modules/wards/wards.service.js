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
exports.WardsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("@hospital/prisma");
let WardsService = class WardsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getWards(hospitalId) {
        return this.prisma.ward.findMany({
            where: { hospitalId },
            include: {
                beds: {
                    include: {
                        admission: {
                            include: { patient: true }
                        }
                    }
                }
            }
        });
    }
    async admitPatient(data) {
        const bed = await this.prisma.bed.findUnique({
            where: { id: data.bedId }
        });
        if (!bed)
            throw new common_1.NotFoundException('Bed not found');
        if (bed.occupied)
            throw new common_1.ConflictException('Bed is already occupied');
        return this.prisma.$transaction(async (tx) => {
            const admission = await tx.admission.create({
                data: {
                    patientId: data.patientId,
                    bedId: data.bedId,
                    notes: data.notes,
                }
            });
            await tx.bed.update({
                where: { id: data.bedId },
                data: { occupied: true }
            });
            return admission;
        });
    }
    async dischargePatient(admissionId) {
        const admission = await this.prisma.admission.findUnique({
            where: { id: admissionId }
        });
        if (!admission)
            throw new common_1.NotFoundException('Admission record not found');
        return this.prisma.$transaction(async (tx) => {
            const updatedAdmission = await tx.admission.update({
                where: { id: admissionId },
                data: { dischargedAt: new Date() }
            });
            await tx.bed.update({
                where: { id: admission.bedId },
                data: { occupied: false }
            });
            return updatedAdmission;
        });
    }
};
WardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], WardsService);
exports.WardsService = WardsService;
