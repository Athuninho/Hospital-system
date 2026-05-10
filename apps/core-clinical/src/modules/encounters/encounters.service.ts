import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@hospital/prisma';

@Injectable()
export class EncountersService {
  constructor(private prisma: PrismaService) {}

  async findAll(patientId?: string) {
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

  async findOne(id: string) {
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
      throw new NotFoundException(`Encounter with ID ${id} not found`);
    }

    return encounter;
  }

  async create(data: {
    patientId: string;
    doctorId: string;
    appointmentId?: string;
    visitId?: string;
    notes?: string;
    diagnosis?: string;
  }) {
    return this.prisma.encounter.create({
      data,
      include: {
        patient: true,
        doctor: true
      }
    });
  }

  async update(id: string, data: { notes?: string; diagnosis?: string; vitals?: any }) {
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


  async addPrescription(encounterId: string, data: {
    patientId: string;
    prescribedBy: string;
    notes?: string;
    items: { drugId: string; drugName: string; dosage: string; frequency: string; duration: string; instructions?: string }[];
  }) {
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

  async addLabRequest(encounterId: string, data: {
    patientId: string;
    requestedBy: string;
    testType: string;
    notes?: string;
  }) {
    return this.prisma.labRequest.create({
      data: {
        encounterId,
        patientId: data.patientId,
        requestedBy: data.requestedBy,
        testType: data.testType,
      }
    });
  }

  async addFileAttachment(encounterId: string, data: {
    patientId: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    labResultId?: string;
  }) {
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
}


