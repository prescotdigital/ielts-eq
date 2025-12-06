"use client";

import Link from "next/link";
import { ArrowRight, Mic, Brain, BookOpen, Headphones, BookMarked, CheckCircle2, Star, TrendingUp, Sparkles, PlayCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30">
      {/* Wave Animation CSS */}
      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .wave-letter {
          display: inline-block;
          transition: transform 0.2s ease;
        }
        .blog-wave-button:hover .wave-letter {
          animation: wave 0.6s ease-in-out;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
          50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6); }
        }
      `}</style>

      {/* Navbar */}
      <nav className="border-b border-gray-200/50 bg-white/90 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-200 group-hover:shadow-emerald-300 transition-all group-hover:scale-110">
              EQ
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">IELTS EQ</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Animated Blog Button */}
            <Link
              href="/blog"
              className="blog-wave-button relative px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <span className="relative inline-flex">
                <span className="wave-letter" style={{ animationDelay: '0ms' }}>B</span>
                <span className="wave-letter" style={{ animationDelay: '100ms' }}>l</span>
                <span className="wave-letter" style={{ animationDelay: '200ms' }}>o</span>
                <span className="wave-letter" style={{ animationDelay: '300ms' }}>g</span>
              </span>
            </Link>
            <Link
              href="/api/auth/signin?callbackUrl=/dashboard"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2"
            >
              Login
            </Link>
            <Link
              href="/api/auth/signin?callbackUrl=/dashboard"
              className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-5 py-2 rounded-full text-sm font-medium hover:shadow-lg hover:scale-105 transition-all shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Redesigned */}
      <main className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto pt-16 pb-12">
          {/* AI Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 text-emerald-700 text-sm font-semibold shadow-sm">
              <Sparkles className="w-4 h-4" />
              Powered by Advanced AI Architecture
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-center mb-6 leading-tight">
            Your AI IELTS Speaking Coach
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-600">
              Get Band 7+ with Personalized Feedback
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-center text-gray-600 max-w-3xl mx-auto mb-8">
            Real exam simulations • Instant AI feedback • Pronunciation training
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/api/auth/signin?callbackUrl=/dashboard"
              className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 hover:scale-105"
            >
              Start Free Practice
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#how-it-works"
              className="group w-full sm:w-auto px-8 py-4 bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 rounded-full font-semibold text-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              See How It Works
            </Link>
          </div>

          {/* Social Proof */}
          <p className="text-center text-gray-500 text-sm">
            Trusted by <span className="font-semibold text-emerald-600">10,000+</span> test-takers worldwide 🌍
          </p>
        </div>

        {/* 5-Feature Card Grid */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Master IELTS Speaking
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Five integrated tools designed to elevate your speaking skills to Band 7 and beyond
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1: AI Speaking Simulations */}
            <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-emerald-200 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <Mic className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Speaking Simulations</h3>
                <p className="text-gray-600 leading-relaxed">
                  Practice with authentic IELTS Part 1, 2, and 3 questions. Real exam format, real timing, real results.
                </p>
              </div>
            </div>

            {/* Feature 2: Smart Feedback */}
            <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-emerald-200 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Feedback Engine</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get personalized analysis of YOUR specific responses. Grammar, fluency, vocabulary—all tailored to you.
                </p>
              </div>
            </div>

            {/* Feature 3: Vocabulary Builder */}
            <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-emerald-200 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Vocabulary Builder</h3>
                <p className="text-gray-600 leading-relaxed">
                  Master 1,000+ academic words through interactive games. Make learning vocabulary actually enjoyable.
                </p>
              </div>
            </div>

            {/* Feature 4: Pronunciation Lab */}
            <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-emerald-200 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <Headphones className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Pronunciation Lab</h3>
                <p className="text-gray-600 leading-relaxed">
                  Drill tricky English sounds and sentences. Perfect your accent with AI-powered pronunciation analysis.
                </p>
              </div>
            </div>

            {/* Feature 5: Free Learning Blog */}
            <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-emerald-200 hover:-translate-y-2 md:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <BookMarked className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Free Learning Blog</h3>
                <p className="text-gray-600 leading-relaxed">
                  Expert tips, strategies, and daily English practice. Learn beyond the test for real-world fluency.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Stats */}
        <section className="py-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl shadow-2xl mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Students Using IELTS EQ Achieve Results
            </h2>
            <p className="text-emerald-100 text-lg">Join thousands of successful test-takers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto px-6">
            {/* Stat 1 */}
            <div className="text-center">
              <div className="text-5xl font-extrabold text-white mb-2">10,000+</div>
              <div className="text-emerald-100 text-lg font-medium">Students Worldwide</div>
            </div>

            {/* Stat 2 */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-5xl font-extrabold text-white">4.8</span>
                <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
              </div>
              <div className="text-emerald-100 text-lg font-medium">Average Rating</div>
            </div>

            {/* Stat 3 */}
            <div className="text-center">
              <div className="text-5xl font-extrabold text-white mb-2">Band 7+</div>
              <div className="text-emerald-100 text-lg font-medium">Success Rate</div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Path to IELTS Success
            </h2>
            <p className="text-xl text-gray-600">Simple, effective, proven</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Practice</h3>
              <p className="text-gray-600 leading-relaxed">
                Answer real IELTS questions in our simulated test environment
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Get Feedback</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive instant, personalized AI analysis of your performance
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Improve</h3>
              <p className="text-gray-600 leading-relaxed">
                Watch your scores climb to Band 7+ with targeted practice
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 mb-12">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Ace Your IELTS Speaking?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join 10,000+ students improving their scores with AI-powered feedback
            </p>
            <Link
              href="/api/auth/signin?callbackUrl=/dashboard"
              className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full font-bold text-xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Start Practicing Free
              <ArrowRight className="w-6 h-6" />
            </Link>
            <p className="text-gray-400 text-sm mt-4">No credit card required</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                EQ
              </div>
              <span className="text-sm text-gray-600">© 2025 IELTS EQ. All rights reserved.</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/practice/vocabulary" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
                Practice
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
                Blog
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
                Dashboard
              </Link>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">
            Not affiliated with or endorsed by official IELTS testing bodies.
          </p>
        </div>
      </footer>
    </div>
  );
}
