import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@hospital/prisma';

@Injectable()
export class WardsService {
  constructor(private prisma: PrismaService) {}

  async getWards(hospitalId: string) {
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

  async admitPatient(data: {
    patientId: string;
    bedId: string;
    notes?: string;
  }) {
    // 1. Check if bed is already occupied
    const bed = await this.prisma.bed.findUnique({
      where: { id: data.bedId }
    });

    if (!bed) throw new NotFoundException('Bed not found');
    if (bed.occupied) throw new ConflictException('Bed is already occupied');

    return this.prisma.$transaction(async (tx) => {
      // 2. Create Admission
      const admission = await tx.admission.create({
        data: {
          patientId: data.patientId,
          bedId: data.bedId,
          notes: data.notes,
        }
      });

      // 3. Mark Bed as occupied
      await tx.bed.update({
        where: { id: data.bedId },
        data: { occupied: true }
      });

      return admission;
    });
  }

  async dischargePatient(admissionId: string) {
    const admission = await this.prisma.admission.findUnique({
      where: { id: admissionId }
    });

    if (!admission) throw new NotFoundException('Admission record not found');

    return this.prisma.$transaction(async (tx) => {
      // 1. End Admission
      const updatedAdmission = await tx.admission.update({
        where: { id: admissionId },
        data: { dischargedAt: new Date() }
      });

      // 2. Mark Bed as free
      await tx.bed.update({
        where: { id: admission.bedId },
        data: { occupied: false }
      });

      return updatedAdmission;
    });
  }
}
