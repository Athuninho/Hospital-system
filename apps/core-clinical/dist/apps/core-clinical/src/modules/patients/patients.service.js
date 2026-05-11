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
exports.PatientsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("@hospital/prisma");
let PatientsService = class PatientsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.patient.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
            include: {
                visits: {
                    take: 1,
                    orderBy: { visitAt: 'desc' }
                }
            }
        });
    }
    async findOne(id) {
        return this.prisma.patient.findUnique({
            where: { id },
            include: {
                contacts: true,
                medicalHistories: true,
                allergies: true,
                visits: true,
                prescriptions: true,
            }
        });
    }
    async create(payload) {
        const mrn = payload.medicalRecordNumber || `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
        return this.prisma.patient.create({
            data: {
                ...payload,
                medicalRecordNumber: mrn,
            }
        });
    }
};
PatientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], PatientsService);
exports.PatientsService = PatientsService;
