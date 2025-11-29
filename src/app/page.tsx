"use client";

import Link from "next/link";
import { ArrowRight, Mic, CheckCircle2, BarChart3, PlayCircle, GraduationCap, Globe, Briefcase } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      {/* Navbar */}
      <nav className="border-b border-gray-200/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-200 group-hover:shadow-emerald-300 transition-all group-hover:scale-110">
              EQ
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">IELTS EQ</span>
          </div>
          <div className="flex items-center gap-3">
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

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-20 pb-24">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200/50 text-purple-700 text-sm font-medium mb-8 shadow-sm hover:shadow-md transition-all group">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="group-hover:text-purple-800 transition-colors">New: AI-Powered Pronunciation Coach</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            <span className="inline-block hover:scale-105 transition-transform">Train Smarter.</span><br />
            <span className="inline-block hover:scale-105 transition-transform">Speak Better.</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-500 to-emerald-400 animate-gradient-x inline-block hover:scale-105 transition-transform">
              Master IELTS.
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Get instant, <span className="text-primary font-semibold">AI-driven feedback</span> on your speaking performance.
            Improve your grammar, fluency, and vocabulary with real-time analysis.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/api/auth/signin?callbackUrl=/dashboard"
              className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-emerald-600 hover:from-emerald-600 hover:to-primary text-white rounded-full font-semibold text-lg transition-all shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 flex items-center justify-center gap-2 hover:scale-105"
            >
              Start Free Practice
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-700 hover:border-primary/50 hover:bg-gray-50 rounded-full font-semibold text-lg transition-all flex items-center justify-center gap-2 hover:scale-105 shadow-sm"
            >
              <PlayCircle className="w-5 h-5" /> Watch Demo
            </Link>
          </div>
        </div>

        {/* Who's This For Section */}
        <div className="mt-32 mb-24 max-w-5xl mx-auto animate-fade-in-up-delayed">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Who's This For?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you're pursuing immigration, university admission, or career advancement,
              IELTS EQ helps you achieve the speaking score you need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Immigration */}
            <div className="group bg-gradient-to-br from-blue-50 via-white to-blue-50/30 p-8 rounded-3xl border border-blue-100 hover:border-blue-300 transition-all hover:shadow-2xl hover:shadow-blue-200/50 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 group-hover:shadow-blue-300 group-hover:scale-110 transition-all">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <div className="mb-4 rounded-2xl overflow-hidden border border-blue-100">
                  <Image
                    src="/immigration-ai.png"
                    alt="AI-powered IELTS testing for immigration"
                    width={400}
                    height={250}
                    className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Immigration Applicants</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Secure your visa with confidence. Practice authentic IELTS speaking scenarios
                  and get the band score required for permanent residency in Canada, Australia, UK, or New Zealand.
                </p>
                <div className="text-sm text-blue-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Achieve Band 7+ for most immigration programs
                </div>
              </div>
            </div>

            {/* University Students */}
            <div className="group bg-gradient-to-br from-purple-50 via-white to-purple-50/30 p-8 rounded-3xl border border-purple-100 hover:border-purple-300 transition-all hover:shadow-2xl hover:shadow-purple-200/50 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-200 group-hover:shadow-purple-300 group-hover:scale-110 transition-all">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div className="mb-4 rounded-2xl overflow-hidden border border-purple-100">
                  <Image
                    src="/university-ai.png"
                    alt="AI-powered IELTS learning for university students"
                    width={400}
                    height={250}
                    className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">University Students</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Get accepted to your dream university. Master the speaking test with AI-powered feedback
                  and meet entry requirements for top universities worldwide.
                </p>
                <div className="text-sm text-purple-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Meet requirements for Oxford, Harvard, MIT & more
                </div>
              </div>
            </div>

            {/* Career Professionals */}
            <div className="group bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 p-8 rounded-3xl border border-emerald-100 hover:border-emerald-300 transition-all hover:shadow-2xl hover:shadow-emerald-200/50 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-200 group-hover:shadow-emerald-300 group-hover:scale-110 transition-all">
                  <Briefcase className="w-7 h-7 text-white" />
                </div>
                <div className="mb-4 rounded-2xl overflow-hidden border border-emerald-100">
                  <Image
                    src="/career-ai.png"
                    alt="AI-powered IELTS assessment for career professionals"
                    width={400}
                    height={250}
                    className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Career Professionals</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Validate your English proficiency for global opportunities. Demonstrate your communication
                  skills and unlock international career advancement.
                </p>
                <div className="text-sm text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Prove professional-level English proficiency
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Feature Grid */}
        <div id="features" className="grid md:grid-cols-3 gap-6 mt-24 max-w-6xl mx-auto">
          <div className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-emerald-100 hover:border-emerald-200 transition-all hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-200 group-hover:shadow-emerald-300 group-hover:rotate-6 transition-all">
              <Mic className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors">Real Exam Simulation</h3>
            <p className="text-gray-600 leading-relaxed">
              Practice with realistic IELTS questions under exam conditions.
              Experience the pressure before the real day.
            </p>
          </div>
          <div className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-purple-100 hover:border-purple-200 transition-all hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-200 group-hover:shadow-purple-300 group-hover:rotate-6 transition-all">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-purple-600 transition-colors">Instant Feedback</h3>
            <p className="text-gray-600 leading-relaxed">
              Our AI analyzes your speech instantly, highlighting grammar errors
              and suggesting better vocabulary.
            </p>
          </div>
          <div className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-100 hover:border-blue-200 transition-all hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 group-hover:shadow-blue-300 group-hover:rotate-6 transition-all">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">Track Progress</h3>
            <p className="text-gray-600 leading-relaxed">
              Visualize your improvement over time with detailed analytics
              on fluency, coherence, and lexical resource.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 bg-gradient-to-b from-gray-50 to-white mt-24">
        <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} IELTS EQ. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(20px) translateX(-10px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(15px); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up-delayed {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        .animate-fade-in-up-delayed {
          animation: fade-in-up-delayed 1s ease-out 0.3s both;
        }
      `}</style>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 bg-white/80 backdrop-blur-xl mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                EQ
              </div>
              <span className="text-sm text-gray-600">© 2025 IELTS EQ. All rights reserved.</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/legal/terms" className="text-gray-600 hover:text-emerald-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="/legal/privacy" className="text-gray-600 hover:text-emerald-600 transition-colors">
                Privacy Policy
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

