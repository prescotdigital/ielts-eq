import { prisma } from "@/lib/prisma";
import AIBlogWriter from "@/components/admin/AIBlogWriter";

export default async function AIBlogWriterPage() {
    const categories = await prisma.blogCategory.findMany({
        orderBy: { name: 'asc' }
    });

    return <AIBlogWriter categories={categories} />;
}
