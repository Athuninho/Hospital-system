import { PrismaClient, RoleName } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // create roles
  const roles = Object.values(RoleName);
  for (const r of roles) {
    await prisma.role.upsert({
      where: { name: r },
      update: {},
      create: { name: r, description: `${r} role` },
    });
  }

  // create a sample hospital
  const hosp = await prisma.hospital.upsert({
    where: { code: 'HOSP-001' },
    update: {},
    create: {
      name: 'Sample County Hospital',
      code: 'HOSP-001',
      address: 'Nairobi, Kenya',
      phone: '+254700000000',
      email: 'info@samplehospital.ke',
    },
  });

  // create super admin user
  const passwordHash = await bcrypt.hash('ChangeMe123!', 12);
  const superRole = await prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } });
  if (!superRole) throw new Error('SUPER_ADMIN role missing');

  await prisma.user.upsert({
    where: { email: 'superadmin@platform.local' },
    update: {},
    create: {
      email: 'superadmin@platform.local',
      passwordHash,
      roleId: superRole.id,
      isActive: true,
    },
  });

  // create a sample patient
  const patient = await prisma.patient.upsert({
    where: { medicalRecordNumber: 'MRN-0001' },
    update: {},
    create: {
      hospitalId: hosp.id,
      medicalRecordNumber: 'MRN-0001',
      firstName: 'John',
      lastName: 'Doe',
      dob: new Date('1988-05-15'),
      gender: 'MALE',
      phone: '+254722000000',
    },
  });

  console.log('Seed complete:', { hospitalId: hosp.id, patientId: patient.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
