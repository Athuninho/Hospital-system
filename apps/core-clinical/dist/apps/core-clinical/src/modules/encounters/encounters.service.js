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
exports.EncountersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("@hospital/prisma");
let EncountersService = class EncountersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(patientId) {
        return this.prisma.encounter.findMany({
            where: patientId ? { patientId } : {},
            include: {
                doctor: true,
                patient: true,
                prescriptions: {
                    include: { items: true }
                },
                labRequests: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findOne(id) {
        const encounter = await this.prisma.encounter.findUnique({
            where: { id },
            include: {
                doctor: true,
                patient: true,
                prescriptions: {
                    include: { items: true }
                },
                labRequests: {
                    include: { results: true }
                },
                files: true
            }
        });
        if (!encounter) {
            throw new common_1.NotFoundException(`Encounter with ID ${id} not found`);
        }
        return encounter;
    }
    async create(data) {
        return this.prisma.encounter.create({
            data,
            include: {
                patient: true,
                doctor: true
            }
        });
    }
    async update(id, data) {
        const { vitals, ...rest } = data;
        // If vitals are provided, we either create or update them
        if (vitals) {
            const encounter = await this.prisma.encounter.findUnique({
                where: { id },
                select: { patientId: true }
            });
            if (encounter) {
                await this.prisma.vitals.upsert({
                    where: { encounterId: id },
                    create: {
                        ...vitals,
                        encounterId: id,
                        patientId: encounter.patientId
                    },
                    update: vitals
                });
            }
        }
        return this.prisma.encounter.update({
            where: { id },
            data: rest,
            include: {
                vitals: true
            }
        });
    }
    async addPrescription(encounterId, data) {
        return this.prisma.prescription.create({
            data: {
                encounterId,
                patientId: data.patientId,
                prescribedBy: data.prescribedBy,
                notes: data.notes,
                items: {
                    create: data.items
                }
            },
            include: {
                items: true
            }
        });
    }
    async addLabRequest(encounterId, data) {
        return this.prisma.labRequest.create({
            data: {
                encounterId,
                patientId: data.patientId,
                requestedBy: data.requestedBy,
                testType: data.testType,
            }
        });
    }
    async addFileAttachment(encounterId, data) {
        return this.prisma.fileAttachment.create({
            data: {
                encounterId,
                patientId: data.patientId,
                fileName: data.fileName,
                fileUrl: data.fileUrl,
                fileType: data.fileType,
                labResultId: data.labResultId
            }
        });
    }
};
exports.EncountersService = EncountersService;
exports.EncountersService = EncountersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], EncountersService);
//# sourceMappingURL=encounters.service.js.map