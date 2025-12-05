import { prisma } from "@/lib/prisma";
import BlogPostForm from "@/components/admin/BlogPostForm";

export default async function NewBlogPostPage() {
    const categories = await prisma.blogCategory.findMany({
        orderBy: { name: 'asc' }
    });

    return <BlogPostForm categories={categories} />;
}
