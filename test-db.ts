import 'dotenv/config';
import { prisma } from './src/lib/prisma';

async function test() {
  try {
    console.log("DATABASE_URL:", process.env.DATABASE_URL);
    const res = await prisma.resume.findFirst();
    console.log("Success:", res?.id || "No resumes found");
  } catch (e) {
    console.error("DB Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
test();
