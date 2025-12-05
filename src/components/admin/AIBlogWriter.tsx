"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Wand2, Loader2, Check, ChevronRight, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface BlogCategory {
    id: string;
    name: string;
}

export default function AIBlogWriter({ categories }: { categories: BlogCategory[] }) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Step 1: Idea
    const [idea, setIdea] = useState("");
    const [keyword, setKeyword] = useState("");
    const [categoryId, setCategoryId] = useState(categories[0]?.id || "");

    //Step 2: Titles
    const [titleOptions, setTitleOptions] = useState<string[]>([]);
    const [selectedTitle, setSelectedTitle] = useState("");

    // Step 3: Slug & Excerpt
    const [slug, setSlug] = useState("");
    const [excerptOptions, setExcerptOptions] = useState<string[]>([]);
    const [selectedExcerpt, setSelectedExcerpt] = useState("");

    // Step 4: Content
    const [contentStyle, setContentStyle] = useState("publication");
    const [contentLength, setContentLength] = useState("medium");
    const [content, setContent] = useState("");

    // Step 5: Image
    const [featuredImage, setFeaturedImage] = useState("");

    // Generate slug from title
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    // Step 2: Generate Titles
    const handleGenerateTitles = async () => {
        if (!idea.trim()) {
            setError("Please enter your blog idea");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/ai/generate-titles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic: idea, keyword, category: categories.find(c => c.id === categoryId)?.name }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setTitleOptions(data.titles);
            setStep(2);
        } catch (err: any) {
            setError(err.message || "Failed to generate titles");
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: Generate Excerpts
    const handleGenerateExcerpts = async () => {
        if (!selectedTitle) {
            setError("Please select a title");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/ai/generate-excerpt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: selectedTitle, keyword }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setExcerptOptions(data.excerpts);
            setSlug(generateSlug(selectedTitle));
            setStep(3);
        } catch (err: any) {
            setError(err.message || "Failed to generate excerpts");
        } finally {
            setIsLoading(false);
        }
    };

    // Step 4: Generate Content
    const handleGenerateContent = async () => {
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/ai/generate-content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: selectedTitle,
                    style: contentStyle,
                    length: contentLength,
                    keyword,
                    topic: idea,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setContent(data.content);
            setStep(4);
        } catch (err: any) {
            setError(err.message || "Failed to generate content");
        } finally {
            setIsLoading(false);
        }
    };

    // Final: Create Blog Post
    const handleCreatePost = async () => {
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/blog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: selectedTitle,
                    slug,
                    excerpt: selectedExcerpt,
                    content,
                    featuredImage: featuredImage || null,
                    categoryId,
                    published: false, // Save as draft
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error);
            }

            router.push("/admin/blog");
        } catch (err: any) {
            setError(err.message || "Failed to create post");
        } finally {
            setIsLoading(false);
        }
    };

    const steps = [
        { number: 1, name: "Idea", completed: step > 1 },
        { number: 2, name: "Title", completed: step > 2 },
        { number: 3, name: "Details", completed: step > 3 },
        { number: 4, name: "Content", completed: step > 4 },
        { number: 5, name: "Image", completed: step > 5 },
        { number: 6, name: "Review", completed: step > 6 },
    ];

    return (
        <div className="space-y-6">
            <Link href="/admin/blog" className="inline-flex items-center text-gray-500 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Posts
            </Link>

            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">AI Blog Writer</h1>
                    <p className="text-gray-500">Generate SEO-optimized content in minutes</p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    {steps.map((s, idx) => (
                        <div key={s.number} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${s.completed
                                            ? "bg-emerald-500 text-white"
                                            : step === s.number
                                                ? "bg-purple-500 text-white"
                                                : "bg-gray-200 text-gray-600"
                                        }`}
                                >
                                    {s.completed ? <Check className="w-5 h-5" /> : s.number}
                                </div>
                                <span className="text-xs mt-1 text-gray-600">{s.name}</span>
                            </div>
                            {idx < steps.length - 1 && (
                                <div className={`w-16 h-1 mx-2 ${s.completed ? "bg-emerald-500" : "bg-gray-200"}`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                </div>
            )}

            {/* Step Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                {/* Step 1: Idea Input */}
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-900">What would you like to write about?</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Blog Idea / Topic</label>
                            <textarea
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., Tips for improving IELTS Speaking Part 2 performance..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Keyword (SEO)</label>
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., IELTS Speaking tips"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleGenerateTitles}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-4 px-6 rounded-lg transition-all flex items-center justify center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating Titles...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-5 h-5" />
                                    Generate Titles
                                    <ArrowRight className="w-5 h-5 ml-auto" />
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Step 2: Title Selection */}
                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-900">Choose your title</h2>
                        <p className="text-gray-600">Select one or edit to your preference</p>

                        <div className="space-y-3">
                            {titleOptions.map((title, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedTitle(title)}
                                    className={`w-full text-left p-4 border-2 rounded-lg transition-all ${selectedTitle === title
                                            ? "border-purple-500 bg-purple-50"
                                            : "border-gray-200 hover:border-purple-300"
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${selectedTitle === title ? "border-purple-500 bg-purple-500" : "border-gray-300"
                                            }`}>
                                            {selectedTitle === title && <Check className="w-4 h-4 text-white" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{title}</p>
                                            <p className="text-xs text-gray-500 mt-1">{title.length} characters</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {selectedTitle && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Edit if needed</label>
                                <input
                                    type="text"
                                    value={selectedTitle}
                                    onChange={(e) => setSelectedTitle(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleGenerateExcerpts}
                                disabled={!selectedTitle || isLoading}
                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        Continue
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Slug & Excerpt */}
                {step === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-900">Slug & Meta Description</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">ieltseq.com/blog/{slug}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Choose Excerpt</label>
                            <div className="space-y-3">
                                {excerptOptions.map((excerpt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedExcerpt(excerpt)}
                                        className={`w-full text-left p-4 border-2 rounded-lg transition-all ${selectedExcerpt === excerpt
                                                ? "border-purple-500 bg-purple-50"
                                                : "border-gray-200 hover:border-purple-300"
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${selectedExcerpt === excerpt ? "border-purple-500 bg-purple-500" : "border-gray-300"
                                                }`}>
                                                {selectedExcerpt === excerpt && <Check className="w-4 h-4 text-white" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-gray-900">{excerpt}</p>
                                                <p className="text-xs text-gray-500 mt-1">{excerpt.length} characters</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedExcerpt && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Edit if needed</label>
                                <textarea
                                    value={selectedExcerpt}
                                    onChange={(e) => setSelectedExcerpt(e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(2)}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setStep(4)}
                                disabled={!selectedExcerpt}
                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                Continue to Content
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Content Generation */}
                {step === 4 && !content && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-900">Generate Content</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Writing Style</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { value: "notice", label: "Notice", desc: "Direct & professional" },
                                    { value: "publication", label: "Publication", desc: "Formal & comprehensive" },
                                    { value: "editorial", label: "Editorial", desc: "Opinion & engaging" },
                                    { value: "tutorial", label: "Tutorial", desc: "Step-by-step guide" },
                                ].map((style) => (
                                    <button
                                        key={style.value}
                                        onClick={() => setContentStyle(style.value)}
                                        className={`p-4 border-2 rounded-lg text-left transition-all ${contentStyle === style.value
                                                ? "border-purple-500 bg-purple-50"
                                                : "border-gray-200 hover:border-purple-300"
                                            }`}
                                    >
                                        <p className="font-medium text-gray-900">{style.label}</p>
                                        <p className="text-xs text-gray-500">{style.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Content Length</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { value: "short", label: "Short", desc: "600-800 words" },
                                    { value: "medium", label: "Medium", desc: "1000-1500 words" },
                                    { value: "long", label: "Long", desc: "2000-3000 words" },
                                ].map((len) => (
                                    <button
                                        key={len.value}
                                        onClick={() => setContentLength(len.value)}
                                        className={`p-4 border-2 rounded-lg text-center transition-all ${contentLength === len.value
                                                ? "border-purple-500 bg-purple-50"
                                                : "border-gray-200 hover:border-purple-300"
                                            }`}
                                    >
                                        <p className="font-medium text-gray-900">{len.label}</p>
                                        <p className="text-xs text-gray-500">{len.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(3)}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleGenerateContent}
                                disabled={isLoading}
                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-4 px-6 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Generating Content... (this may take 30-60 seconds)
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-5 h-5" />
                                        Generate Content
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Content Editor */}
                {step === 4 && content && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-900">Edit Your Content</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Content (Markdown)</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={20}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setContent("")}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Regenerate
                            </button>
                            <button
                                onClick={() => setStep(5)}
                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2"
                            >
                                Continue to Image
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 5: Featured Image */}
                {step === 5 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-900">Featured Image</h2>
                        <p className="text-gray-600">Paste a URL to a royalty-free image (e.g., from Unsplash, Pexels)</p>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                            <input
                                type="url"
                                value={featuredImage}
                                onChange={(e) => setFeaturedImage(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                placeholder="https://images.unsplash.com/..."
                            />
                        </div>

                        {featuredImage && (
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
                                <img src={featuredImage} alt="Preview" className="w-full max-w-2xl h-64 object-cover rounded-lg" />
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(4)}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setStep(6)}
                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2"
                            >
                                Review & Publish
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 6: Review */}
                {step === 6 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-900">Review Your Post</h2>

                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">Title</p>
                                <p className="font-medium text-gray-900">{selectedTitle}</p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">Excerpt</p>
                                <p className="text-gray-900">{selectedExcerpt}</p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">URL</p>
                                <p className="text-gray-900 font-mono text-sm">ieltseq.com/blog/{slug}</p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600 mb-2">Content Preview</p>
                                <div className="prose max-w-none text-sm">
                                    <ReactMarkdown>{content.slice(0, 500)}...</ReactMarkdown>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(5)}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleCreatePost}
                                disabled={isLoading}
                                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium py-4 px-6 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creating Post...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Create Draft Post
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
