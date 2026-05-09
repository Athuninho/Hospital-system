import { PrismaClient, RoleName, OrderStatus } from '@prisma/client';
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
    where: { code: 'MCH' },
    update: {},
    create: {
      name: 'Mombasa County Hospital',
      code: 'MCH',
      address: 'Mombasa, Kenya',
      phone: '+254104543575',
      email: 'info@mombasahospital.ke',
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
      firstName: 'Elias',
      lastName: 'Mugambi',
      dob: new Date('1997-02-03'),
      gender: 'MALE',
      phone: '+254721747787',
    },
  });

  // create a doctor user + staff record
  const doctorRole = await prisma.role.findUnique({ where: { name: 'DOCTOR' } });
  if (!doctorRole) throw new Error('DOCTOR role missing');

  const doctorPassword = await bcrypt.hash('DocPass123!', 12);
  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor1@mch.local' },
    update: {},
    create: {
      email: 'doctor1@mch.local',
      passwordHash: doctorPassword,
      roleId: doctorRole.id,
      isActive: true,
    },
  });

  const doctor = await prisma.staff.upsert({
    where: { staffNumber: 'DOC-0001' },
    update: {},
    create: {
      userId: doctorUser.id,
      hospitalId: hosp.id,
      firstName: 'Grace',
      lastName: 'Ndungu',
      staffNumber: 'DOC-0001',
      position: 'Physician',
      specialty: 'General Medicine',
      phone: '+254700111222',
      email: 'g.ndungu@mch.local',
    },
  });

  // create an encounter for the patient with the doctor
  const encounter = await prisma.encounter.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      notes: 'Patient reports cough, sore throat, mild fever.',
      diagnosis: 'Acute upper respiratory tract infection',
    },
  });

  // create a sample order (labs + xray) with items and computed total
  const orderItems = [
    { code: 'LAB-CBC', name: 'Complete Blood Count', quantity: 1, unitPrice: 8.5 },
    { code: 'XR-CH', name: 'Chest X-Ray', quantity: 1, unitPrice: 20.0 },
  ];
  const totalAmount = orderItems.reduce((s, it) => s + it.quantity * it.unitPrice, 0);

  const order = await prisma.order.create({
    data: {
      hospitalId: hosp.id,
      patientId: patient.id,
      createdBy: doctor.id,
      status: OrderStatus.PENDING,
      totalAmount,
      items: {
        create: orderItems.map((it) => ({ code: it.code, name: it.name, quantity: it.quantity, unitPrice: it.unitPrice })),
      },
    },
    include: { items: true },
  });

  console.log('Created doctor, encounter and order:', { doctorId: doctor.id, encounterId: encounter.id, orderId: order.id });

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
