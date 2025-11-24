import Link from "next/link";
import { ArrowRight, Mic, CheckCircle2, BarChart3, PlayCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-sky-500/30">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
          IELTS EQ
        </div>
        <div className="space-x-4">
          <Link href="/api/auth/signin" className="text-sm font-medium hover:text-sky-400 transition-colors">
            Login
          </Link>
          <Link
            href="/api/auth/signin"
            className="bg-white text-slate-950 px-4 py-2 rounded-full text-sm font-medium hover:bg-sky-50 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          New: AI-Powered Pronunciation Coach
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          <span className="text-gray-900">Train Smarter.</span><br />
          <span className="text-gray-900">Speak Better.</span><br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
            Master IELTS.
          </span>
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Get instant, AI-driven feedback on your speaking performance.
          Improve your grammar, fluency, and vocabulary with real-time analysis.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/api/auth/signin?callbackUrl=/test"
            className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-emerald-600 text-white rounded-full font-semibold text-lg transition-all shadow-xl shadow-emerald-200 flex items-center justify-center gap-2"
          >
            Start Free Practice <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="#"
            className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-full font-semibold text-lg transition-all flex items-center justify-center gap-2"
          >
            <PlayCircle className="w-5 h-5" /> Watch Demo
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 text-left">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-primary rounded-xl flex items-center justify-center mb-6">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Real Exam Simulation</h3>
            <p className="text-gray-600 leading-relaxed">
              Practice with realistic IELTS questions under exam conditions.
              Experience the pressure before the real day.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Instant Feedback</h3>
            <p className="text-gray-600 leading-relaxed">
              Our AI analyzes your speech instantly, highlighting grammar errors
              and suggesting better vocabulary.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Track Progress</h3>
            <p className="text-gray-600 leading-relaxed">
              Visualize your improvement over time with detailed analytics
              on fluency, coherence, and lexical resource.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} IELTS EQ. All rights reserved.</p>
      </footer>
    </div>
  );
}
