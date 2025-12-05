import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const { title, slug, excerpt, content, featuredImage, categoryId, published } = data;

        // Check for duplicate slug
        const existing = await prisma.blogPost.findUnique({
            where: { slug }
        });

        if (existing) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
        }

        const post = await prisma.blogPost.create({
            data: {
                title,
                slug,
                excerpt,
                content,
                featuredImage: featuredImage || null,
                categoryId,
                published,
                publishedAt: published ? new Date() : null,
                authorId: session.user.id,
            }
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error('Create blog post error:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
