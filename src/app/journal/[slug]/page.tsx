import { redirect } from "next/navigation";
import { articles } from "@/data/journal";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function JournalArticlePage({ params }: Props) {
  const { slug } = await params;
  redirect(`/poradniki/${slug}`);
}
