import { prisma } from "@/lib/prisma";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { notFound } from "next/navigation";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [post, categories] = await Promise.all([
        prisma.blogPost.findUnique({
            where: { id }
        }),
        prisma.blogCategory.findMany({
            orderBy: { name: 'asc' }
        })
    ]);

    if (!post) {
        notFound();
    }

    return (
        <BlogPostForm
            initialData={{
                id: post.id,
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt,
                content: post.content,
                featuredImage: post.featuredImage || "",
                categoryId: post.categoryId,
                published: post.published,
            }}
            categories={categories}
        />
    );
}
