import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, FileText, BarChart3, Settings, LogOut, Shield, BookOpen } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    console.log("Admin Layout Session Check:", {
        email: session?.user?.email,
        role: session?.user?.role,
        id: session?.user?.id
    });

    if (!session || session.user.role !== 'ADMIN') {
        console.log("Redirecting to dashboard - Access Denied");
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-slate-900 text-white fixed h-full z-10">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                            AD
                        </div>
                        <span className="text-xl font-bold">Admin Portal</span>
                    </div>
                </div>

                <nav className="p-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <Users className="w-5 h-5" />
                        Users
                    </Link>
                    <Link href="/admin/tests" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <FileText className="w-5 h-5" />
                        Test Logs
                    </Link>
                    <Link href="/admin/login-attempts" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <Shield className="w-5 h-5" />
                        Login Attempts
                    </Link>
                    <Link href="/admin/blog" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <BookOpen className="w-5 h-5" />
                        Blog
                    </Link>
                    <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <BarChart3 className="w-5 h-5" />
                        Analytics
                    </Link>
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-4 py-3 text-slate-400">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                            {session.user.name?.[0] || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
                            <p className="text-xs truncate">Admin</p>
                        </div>
                        <Link href="/api/auth/signout" className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
