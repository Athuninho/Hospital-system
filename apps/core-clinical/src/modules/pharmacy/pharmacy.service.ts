import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@hospital/prisma';

@Injectable()
export class PharmacyService {
  constructor(private prisma: PrismaService) {}

  async searchInventory(query: string, hospitalId: string) {
    return this.prisma.drugInventory.findMany({
      where: {
        hospitalId,
        name: { contains: query, mode: 'insensitive' },
      },
      take: 10,
    });
  }

  async getPendingPrescriptions(hospitalId: string) {
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

  async addInventory(data: {
    hospitalId: string;
    name: string;
    brand?: string;
    batchNumber?: string;
    quantity: number;
    expiryDate?: Date;
  }) {
    return this.prisma.drugInventory.create({
      data
    });
  }

  async fulfillPrescription(prescriptionId: string) {
    // In a real app, this would deduct from inventory
    // For now, we'll mark the prescription as processed (if we had a status)
    // Let's assume we update the notes or similar for now
    return this.prisma.prescription.update({
      where: { id: prescriptionId },
      data: { notes: 'FULFILLED' }
    });
  }
}
