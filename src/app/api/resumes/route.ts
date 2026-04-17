import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resume = await prisma.resume.findFirst({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(resume);
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { content } = await req.json();

  // Create or Update
  const resume = await prisma.resume.findFirst({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  let response;
  if (resume) {
    response = await prisma.resume.update({
      where: { id: resume.id },
      data: {
        content: content ?? resume.content,
        updatedAt: new Date(),
      },
    });
  } else {
    response = await prisma.resume.create({
      data: {
        userId: user.id,
        content: content ?? {},
      },
    });
  }

  return NextResponse.json(response);
}
