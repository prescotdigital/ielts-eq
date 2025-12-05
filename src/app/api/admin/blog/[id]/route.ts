import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const data = await req.json();
        const { title, slug, excerpt, content, featuredImage, categoryId, published } = data;

        // Check for duplicate slug (excluding current post)
        const existing = await prisma.blogPost.findFirst({
            where: {
                slug,
                id: { not: id }
            }
        });

        if (existing) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
        }

        const currentPost = await prisma.blogPost.findUnique({
            where: { id }
        });

        const post = await prisma.blogPost.update({
            where: { id },
            data: {
                title,
                slug,
                excerpt,
                content,
                featuredImage: featuredImage || null,
                categoryId,
                published,
                // Set publishedAt only if transitioning from draft to published
                publishedAt: published && !currentPost?.published ? new Date() : currentPost?.publishedAt,
            }
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error('Update blog post error:', error);
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}
