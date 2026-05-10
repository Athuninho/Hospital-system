import { Injectable } from '@nestjs/common';
import { PrismaService } from '@hospital/prisma';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

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

  async findOne(id: string) {
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

  async create(payload: any) {
    // Generate a medical record number if not provided
    const mrn = payload.medicalRecordNumber || `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
    
    return this.prisma.patient.create({
      data: {
        ...payload,
        medicalRecordNumber: mrn,
      }
    });
  }
}

