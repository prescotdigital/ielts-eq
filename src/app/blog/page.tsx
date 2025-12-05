import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, User, Tag, ArrowRight, Home } from "lucide-react";

export

    const metadata = {
        title: "Beyond the Band Blog - IELTS EQ",
        description: "Learn the Language. Live the Life. Tips, strategies, and insights for IELTS success.",
    };

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
    const { category } = await searchParams;

    const where: any = { published: true };
    if (category) {
        const cat = await prisma.blogCategory.findUnique({
            where: { slug: category }
        });
        if (cat) where.categoryId = cat.id;
    }

    const [posts, categories] = await Promise.all([
        prisma.blogPost.findMany({
            where,
            include: {
                author: { select: { name: true } },
                category: true,
            },
            orderBy: { publishedAt: 'desc' },
            take: 20,
        }),
        prisma.blogCategory.findMany({
            orderBy: { name: 'asc' }
        })
    ]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#52B0C9] to-emerald-600 text-white py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors">
                        <Home className="w-4 h-4" />
                        Return to Home
                    </Link>
                    <h1 className="text-5xl font-bold mb-3">Beyond the Band Blog</h1>
                    <p className="text-xl text-white/90">Learn the Language. Live the Life.</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Categories */}
                <div className="mb-8 flex flex-wrap gap-2">
                    <Link
                        href="/blog"
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!category ? 'bg-[#52B0C9] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        All Posts
                    </Link>
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/blog?category=${cat.slug}`}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat.slug ? 'bg-[#52B0C9] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>

                {/* Posts Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
                        >
                            {post.featuredImage && (
                                <div className="aspect-video overflow-hidden">
                                    <img
                                        src={post.featuredImage}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2.5 py-0.5 bg-[#52B0C9]/10 text-[#52B0C9] rounded-full text-xs font-medium">
                                        {post.category.name}
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-[#222222] mb-2 group-hover:text-[#52B0C9] transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {post.publishedAt && new Date(post.publishedAt).toLocaleDateString()}
                                    </div>
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="text-[#52B0C9] font-medium flex items-center gap-1 hover:gap-2 transition-all"
                                    >
                                        Read More
                                        <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No posts found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
