import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database');
  const password = await hash('changeme', 10);
  for (const account of config.defaultAccounts) {
    const role = (account.role as Role) || Role.USER;
    console.log(`  Creating user: ${account.email} with role: ${role}`);
    // eslint-disable-next-line no-await-in-loop
    await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        password,
        role,
      },
    });
  }

  for (const [index, data] of config.defaultData.entries()) {
    const id = String(index + 1);
    const condition = data.condition || 'good';
    const value = typeof data.value === 'number' ? data.value : 0;
    console.log(`  Adding stuff: ${JSON.stringify({ ...data, id, value })}`);
    // eslint-disable-next-line no-await-in-loop
    await prisma.stuff.upsert({
      where: { id },
      update: {
        name: data.name,
        quantity: data.quantity,
        owner: data.owner,
        condition,
        value,
      },
      create: {
        id,
        name: data.name,
        quantity: data.quantity,
        owner: data.owner,
        condition,
        value,
      },
    });
  }
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
