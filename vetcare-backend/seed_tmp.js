const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    // Create a branch
    const branch = await prisma.branch.create({
        data: {
            name: 'Main Vet Clinic',
            address: '123 Vet Street, Cairo',
            phone: '+20123456789',
            timezone: 'Africa/Cairo',
        },
    });

    console.log('Created branch:', branch.id);

    // Create a super admin
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@vetcare.com',
            passwordHash: hashedPassword,
            role: 'SUPER_ADMIN',
            branchId: branch.id,
        },
    });

    console.log('Created admin:', admin.email);

    // Create a doctor
    const doctorPassword = await bcrypt.hash('doctor123', 12);
    const doctor = await prisma.user.create({
        data: {
            email: 'doctor@vetcare.com',
            passwordHash: doctorPassword,
            role: 'VET_DOCTOR',
            branchId: branch.id,
        },
    });

    // Create a customer
    const customerPassword = await bcrypt.hash('customer123', 12);
    const customerUser = await prisma.user.create({
        data: {
            email: 'customer@vetcare.com',
            passwordHash: customerPassword,
            role: 'CUSTOMER',
            branchId: branch.id,
        },
    });

    await prisma.customer.create({
        data: {
            userId: customerUser.id,
            fullName: 'John Doe',
            phone: '+20100000000',
        },
    });

    console.log('Created customer:', customerUser.email);

    // Create a lab technician
    const labTechPassword = await bcrypt.hash('lab123', 12);
    const labTechUser = await prisma.user.create({
        data: {
            email: 'lab@vetcare.com',
            passwordHash: labTechPassword,
            role: 'LAB_TECH',
            branchId: branch.id,
        },
    });
    console.log('Created lab tech:', labTechUser.email);

    // Create an accountant
    const accountantPassword = await bcrypt.hash('finance123', 12);
    const accountantUser = await prisma.user.create({
        data: {
            email: 'finance@vetcare.com',
            passwordHash: accountantPassword,
            role: 'ACCOUNTANT',
            branchId: branch.id,
        },
    });
    console.log('Created accountant:', accountantUser.email);

    // Create an hr manager
    const hrPassword = await bcrypt.hash('hr123', 12);
    const hrUser = await prisma.user.create({
        data: {
            email: 'hr@vetcare.com',
            passwordHash: hrPassword,
            role: 'HR_MANAGER',
            branchId: branch.id,
        },
    });
    console.log('Created hr manager:', hrUser.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
