import 'dotenv/config';
import { PrismaClient } from "@prisma/client";

async function test() {
  const prisma = new PrismaClient();
  try {
    console.log("Testing native rust engine...");
    const res = await prisma.resume.findFirst();
    console.log("Success:", res?.id || "No resumes found");
  } catch (e) {
    console.error("DB Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
test();
