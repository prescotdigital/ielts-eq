import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Home } from "lucide-react";
import ReactMarkdown from "react-markdown";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
        where: { slug, published: true }
    });

    if (!post) return {};

    return {
        title: `${post.title} - Beyond the Band Blog`,
        description: post.excerpt,
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
        where: { slug, published: true },
        include: {
            author: { select: { name: true } },
            category: true,
        }
    });

    if (!post) {
        notFound();
    }

    // Increment view count
    await prisma.blogPost.update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } }
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#52B0C9] to-emerald-600 text-white py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors">
                            <Home className="w-4 h-4" />
                            Home
                        </Link>
                        <span className="text-white/50">|</span>
                        <Link href="/blog" className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Blog
                        </Link>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">{post.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-white/90">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {post.author.name || 'IELTS EQ Team'}
                        </div>
                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                            {post.category.name}
                        </span>
                    </div>
                </div>
            </div>

            {/* Featured Image */}
            {post.featuredImage && (
                <div className="max-w-4xl mx-auto px-4 -mt-8">
                    <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
                        <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            )}

            {/* Content */}
            <article className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
                    <div className="prose prose-lg max-w-none">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>
                </div>

                {/* Related Posts CTA */}
                <div className="mt-12 text-center">
                    <Link
                        href={`/blog?category=${post.category.slug}`}
                        className="inline-flex items-center gap-2 bg-[#52B0C9] hover:bg-[#52B0C9]/90 text-white font-medium py-3 px-6 rounded-lg transition-all"
                    >
                        More {post.category.name} Posts
                    </Link>
                </div>
            </article>
        </div>
    );
}
