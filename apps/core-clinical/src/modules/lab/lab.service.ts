import { Injectable } from '@nestjs/common';
import { PrismaService } from '@hospital/prisma';

@Injectable()
export class LabService {
  constructor(private prisma: PrismaService) {}

  async getPendingRequests(hospitalId: string) {
    return this.prisma.labRequest.findMany({
      where: {
        patient: { hospitalId },
        status: 'PENDING'
      },
      include: {
        patient: true,
        staff: true, // requestedBy
        encounter: true
      },
      orderBy: { requestedAt: 'desc' }
    });
  }

  async reportResult(requestId: string, data: {
    resultData: any;
    reportedBy?: string;
  }) {
    // 1. Create the result record
    const result = await this.prisma.labResult.create({
      data: {
        labRequestId: requestId,
        resultData: data.resultData,
        reportedBy: data.reportedBy,
        reportedAt: new Date(),
      }
    });

    // 2. Update request status
    await this.prisma.labRequest.update({
      where: { id: requestId },
      data: { status: 'COMPLETED' }
    });

    return result;
  }

  async getResults(patientId: string) {
    return this.prisma.labResult.findMany({
      where: {
        labRequest: { patientId }
      },
      include: {
        labRequest: true,
        files: true
      },
      orderBy: { reportedAt: 'desc' }
    });
  }
}
