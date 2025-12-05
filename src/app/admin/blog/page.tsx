import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Eye, EyeOff, Trash, Sparkles } from "lucide-react";

export default async function AdminBlogPage() {
    const posts = await prisma.blogPost.findMany({
        include: {
            author: {
                select: { name: true, email: true }
            },
            category: true,
            _count: {
                select: { tags: true }
            }
        },
        orderBy: { updatedAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
                    <p className="text-gray-500 mt-1">Manage Beyond the Band Blog content</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/blog/ai-writer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-all shadow-lg"
                    >
                        <Sparkles className="w-4 h-4" />
                        AI Writer
                    </Link>
                    <Link
                        href="/admin/blog/new"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        New Post
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium text-gray-900">{post.title}</p>
                                        <p className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {post.category.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {post.author.name || post.author.email}
                                </td>
                                <td className="px-6 py-4">
                                    {post.published ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                            <Eye className="w-3 h-3" />
                                            Published
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            <EyeOff className="w-3 h-3" />
                                            Draft
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(post.updatedAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/blog/${post.id}/edit`}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        {post.published && (
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="text-emerald-600 hover:text-emerald-800"
                                                target="_blank"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No blog posts yet. Create your first post!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
