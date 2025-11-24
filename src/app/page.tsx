import Link from "next/link";
import { ArrowRight, Mic, CheckCircle2, BarChart3, PlayCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
              EQ
            </div>
            <span className="text-xl font-bold text-gray-900">IELTS EQ</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/api/auth/signin"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2"
            >
              Login
            </Link>
            <Link
              href="/api/auth/signin"
              className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-20 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            New: AI-Powered Pronunciation Coach
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Train Smarter.<br />
            Speak Better.<br />
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
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-emerald-600 text-white rounded-full font-semibold text-lg transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
            >
              Start Free Practice <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 rounded-full font-semibold text-lg transition-all flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-5 h-5" /> Watch Demo
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div id="features" className="grid md:grid-cols-3 gap-6 mt-24 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-emerald-200 transition-all">
            <div className="w-14 h-14 bg-emerald-100 text-primary rounded-2xl flex items-center justify-center mb-6">
              <Mic className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Real Exam Simulation</h3>
            <p className="text-gray-600 leading-relaxed">
              Practice with realistic IELTS questions under exam conditions.
              Experience the pressure before the real day.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Instant Feedback</h3>
            <p className="text-gray-600 leading-relaxed">
              Our AI analyzes your speech instantly, highlighting grammar errors
              and suggesting better vocabulary.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Track Progress</h3>
            <p className="text-gray-600 leading-relaxed">
              Visualize your improvement over time with detailed analytics
              on fluency, coherence, and lexical resource.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 bg-gray-50">
        <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} IELTS EQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
