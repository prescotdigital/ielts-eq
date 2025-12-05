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
                    <div className="
                        prose prose-lg max-w-none
                        [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mt-12 [&_h1]:mb-6
                        [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-12 [&_h2]:mb-5 [&_h2]:leading-tight
                        [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:leading-snug
                        [&_h4]:text-xl [&_h4]:font-bold [&_h4]:text-gray-900 [&_h4]:mt-8 [&_h4]:mb-3
                        [&_p]:text-gray-700 [&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-5 [&_p]:mt-0
                        [&_ul]:my-6 [&_ul]:pl-6 [&_ul]:space-y-2
                        [&_ol]:my-6 [&_ol]:pl-6 [&_ol]:space-y-3
                        [&_li]:text-gray-700 [&_li]:leading-relaxed [&_li]:mb-2
                        [&_li_p]:mb-3
                        [&_strong]:font-semibold [&_strong]:text-gray-900
                        [&_em]:italic
                        [&_a]:text-[#52B0C9] [&_a]:underline hover:[&_a]:text-[#52B0C9]/80
                        [&_blockquote]:border-l-4 [&_blockquote]:border-[#52B0C9] [&_blockquote]:pl-4 [&_blockquote]:my-6 [&_blockquote]:italic
                        [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                        [&_pre]:bg-gray-50 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:my-6 [&_pre]:overflow-x-auto
                        [&>*:first-child]:mt-0
                    ">
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
