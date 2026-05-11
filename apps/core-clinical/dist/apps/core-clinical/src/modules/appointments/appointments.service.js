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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("@hospital/prisma");
let AppointmentsService = class AppointmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        return this.prisma.appointment.findMany({
            where: {
                hospitalId: query.hospitalId,
                doctorId: query.doctorId,
                status: query.status,
            },
            include: {
                patient: true,
                doctor: true,
            },
            orderBy: { scheduledAt: 'asc' },
        });
    }
    async findOne(id) {
        return this.prisma.appointment.findUnique({
            where: { id },
            include: {
                patient: true,
                doctor: true,
            },
        });
    }
    async create(data) {
        const startOfDay = new Date(data.scheduledAt);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(data.scheduledAt);
        endOfDay.setHours(23, 59, 59, 999);
        const count = await this.prisma.appointment.count({
            where: {
                hospitalId: data.hospitalId,
                scheduledAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        });
        return this.prisma.appointment.create({
            data: {
                ...data,
                queueNumber: count + 1,
                status: 'PENDING',
            },
        });
    }
    async updateStatus(id, status) {
        return this.prisma.appointment.update({
            where: { id },
            data: { status: status },
        });
    }
    async getAvailability(doctorId, date) {
        const schedules = await this.prisma.schedule.findMany({
            where: { staffId: doctorId },
        });
        const appointments = await this.prisma.appointment.findMany({
            where: {
                doctorId,
                scheduledAt: {
                    gte: new Date(date.setHours(0, 0, 0, 0)),
                    lte: new Date(date.setHours(23, 59, 59, 999)),
                },
                status: { not: 'CANCELLED' }
            }
        });
        return { schedules, appointments };
    }
};
AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_1.PrismaService])
], AppointmentsService);
exports.AppointmentsService = AppointmentsService;
