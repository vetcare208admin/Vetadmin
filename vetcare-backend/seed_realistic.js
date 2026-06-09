const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('--- Starting Realistic Seeding ---');

    // 1. Find or create the branch
    let branch = await prisma.branch.findFirst({ where: { name: 'Main Vet Clinic' } });
    if (!branch) {
        branch = await prisma.branch.create({
            data: {
                name: 'Main Vet Clinic',
                address: '123 Vet Street, Cairo',
                phone: '+20123456789',
                timezone: 'Africa/Cairo',
            },
        });
    }
    const branchId = branch.id;

    // 2. Fetch users for attribution
    const admin = await prisma.user.findUnique({ where: { email: 'admin@vetcare.com' } });
    const doctor = await prisma.user.findUnique({ where: { email: 'doctor@vetcare.com' } });
    const customerUser = await prisma.user.findUnique({ where: { email: 'customer@vetcare.com' } });
    const customer = await prisma.customer.findUnique({ where: { userId: customerUser.id } });

    // 3. SEED INVENTORY (Lab & Clinical)
    console.log('Seeding Inventory...');
    const inventoryItems = [
        { itemName: 'Rabies Vaccine (Vial)', category: 'vaccine', quantity: 45, unit: 'vial', reorderLevel: 10, supplier: 'Zoetis' },
        { itemName: 'Apoquel 16mg', category: 'medication', quantity: 120, unit: 'tablet', reorderLevel: 30, supplier: 'Zoetis' },
        { itemName: 'Simparica Trio (Medium)', category: 'preventative', quantity: 80, unit: 'dose', reorderLevel: 15, supplier: 'Zoetis' },
        { itemName: 'CBC Diagnostic Kit', category: 'reagent', quantity: 25, unit: 'kit', reorderLevel: 5, supplier: 'IDEXX' },
        { itemName: 'Chemistry 17 Clip', category: 'reagent', quantity: 30, unit: 'clip', reorderLevel: 10, supplier: 'IDEXX' },
        { itemName: 'Surgical Gowns (L)', category: 'consumable', quantity: 100, unit: 'piece', reorderLevel: 25, supplier: 'Covetrus' },
        { itemName: 'Isothesia (Isoflurane)', category: 'anesthetic', quantity: 12, unit: 'bottle', reorderLevel: 3, supplier: 'Piramel' },
    ];

    for (const item of inventoryItems) {
        await prisma.labInventory.upsert({
            where: { id: `seed-${item.itemName.replace(/\s+/g, '-').toLowerCase()}` },
            update: item,
            create: { id: `seed-${item.itemName.replace(/\s+/g, '-').toLowerCase()}`, branchId, ...item }
        });
    }

    // 4. SEED EXPENSES (Clinical & Operational)
    console.log('Seeding Expenses...');
    const expenses = [
        { category: 'Utilities', amount: 480.00, vendor: 'City Electric', description: 'Monthly electricity bill', date: new Date('2026-05-01'), recordedBy: admin.id },
        { category: 'Utilities', amount: 120.00, vendor: 'City Water', description: 'Monthly water bill', date: new Date('2026-05-02'), recordedBy: admin.id },
        { category: 'Rent', amount: 3500.00, vendor: 'Westside Properties', description: 'Clinic rent May 2026', date: new Date('2026-05-01'), recordedBy: admin.id },
        { category: 'Supplies', amount: 1250.40, vendor: 'Zoetis', description: 'Vaccine and medication restock', date: new Date('2026-05-15'), recordedBy: admin.id },
        { category: 'Marketing', amount: 600.00, vendor: 'Google Ads', description: 'Local search advertising', date: new Date('2026-05-10'), recordedBy: admin.id },
    ];

    for (const exp of expenses) {
        await prisma.expense.create({ data: { branchId, ...exp } });
    }

    // 5. SEED INVOICES (Revenue)
    console.log('Seeding Invoices...');
    const invoices = [
        {
            customerId: customer.id,
            branchId,
            status: 'paid',
            total: 285.00,
            dueDate: new Date('2026-05-20'),
            paidAt: new Date('2026-05-20'),
            items: {
                create: [
                    { description: 'Comprehensive Consultation', quantity: 1, unitPrice: 75.00, total: 75.00 },
                    { description: 'Rabies 3-Year Vaccine', quantity: 1, unitPrice: 45.00, total: 45.00 },
                    { description: 'Blood Panel (Senior)', quantity: 1, unitPrice: 165.00, total: 165.00 },
                ]
            }
        },
        {
            customerId: customer.id,
            branchId,
            status: 'pending',
            total: 150.00,
            dueDate: new Date('2026-06-10'),
            items: {
                create: [
                    { description: 'Dental Prophylaxis', quantity: 1, unitPrice: 150.00, total: 150.00 },
                ]
            }
        }
    ];

    for (const inv of invoices) {
        await prisma.invoice.create({ data: inv });
    }

    // 6. SEED PRICE CATALOG
    console.log('Seeding Price Catalog...');
    const catalog = [
        { serviceName: 'General Consultation', category: 'consultation', basePrice: 65.00, isActive: true },
        { serviceName: 'Emergency Consultation', category: 'consultation', basePrice: 120.00, isActive: true },
        { serviceName: 'Feline Triple Test', category: 'lab', basePrice: 55.00, isActive: true },
        { serviceName: 'Canine Spay (<20lb)', category: 'surgery', basePrice: 350.00, isActive: true },
    ];

    for (const cat of catalog) {
        await prisma.priceCatalog.create({ data: { branchId, ...cat } });
    }

    console.log('--- Realistic Seeding Complete ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
