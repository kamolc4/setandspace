import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getPrisma();
    const now = new Date();

    // Find all SCHEDULED articles whose publication time has passed
    const toPublish = await db.article.findMany({
      where: {
        status: "SCHEDULED",
        publishedAt: { lte: now },
      },
      select: { id: true, slug: true },
    });

    if (toPublish.length === 0) {
      return NextResponse.json({ published: 0, message: "Brak artykułów do publikacji" });
    }

    // Idempotent: updateMany on specific IDs
    await db.article.updateMany({
      where: { id: { in: toPublish.map((a) => a.id) } },
      data: { status: "PUBLISHED" },
    });

    // Revalidate public pages
    revalidatePath("/poradniki");
    revalidatePath("/sitemap.xml");
    for (const article of toPublish) {
      revalidatePath(`/poradniki/${article.slug}`);
    }

    return NextResponse.json({
      published: toPublish.length,
      articles: toPublish.map((a) => a.slug),
      timestamp: now.toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
