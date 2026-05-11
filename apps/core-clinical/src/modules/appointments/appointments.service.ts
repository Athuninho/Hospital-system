import { Injectable } from '@nestjs/common';
import { PrismaService } from '@hospital/prisma';
// Avoid importing Prisma namespace here to keep types stable across workspace

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { hospitalId?: string; doctorId?: string; status?: string }) {
    return this.prisma.appointment.findMany({
      where: {
        hospitalId: query.hospitalId,
        doctorId: query.doctorId,
        status: query.status as any,
      },
      include: {
        patient: true,
        doctor: true,
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
      },
    });
  }

  async create(data: { 
    patientId: string; 
    doctorId?: string; 
    hospitalId: string; 
    scheduledAt: Date; 
  }) {
    // Generate queue number for the day
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

  async updateStatus(id: string, status: string) {
    return this.prisma.appointment.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async getAvailability(doctorId: string, date: Date) {
    // Basic implementation: return schedules and existing appointments
    const schedules = await this.prisma.schedule.findMany({
      where: { staffId: doctorId },
    });

    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        scheduledAt: {
          gte: new Date(date.setHours(0,0,0,0)),
          lte: new Date(date.setHours(23,59,59,999)),
        },
        status: { not: 'CANCELLED' }
      }
    });

    return { schedules, appointments };
  }
}
