// Script one-shot : lister les utilisateurs Supabase via Prisma
const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

async function main() {
  const users = await p.users.findMany({
    take: 10,
    select: { id: true, email: true },
  });
  console.log(JSON.stringify(users, null, 2));
}

main()
  .catch(console.error)
  .finally(() => p.$disconnect());
