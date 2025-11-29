import Link from "next/link";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 md:p-12">
                <Link href="/" className="text-sm text-emerald-600 hover:text-emerald-700 mb-6 inline-block">
                    ← Back to Home
                </Link>

                <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                <p className="text-gray-500 mb-8">Last updated: November 28, 2025</p>

                <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
                        <p>
                            IELTS EQ ("we," "our," or "us") respects your privacy. This Privacy Policy explains how we collect,
                            use, and protect your personal information when you use our Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>

                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.1 Information You Provide</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Account Information:</strong> Name, email address (via Google OAuth)</li>
                            <li><strong>Audio Recordings:</strong> Your voice recordings for speaking practice</li>
                            <li><strong>Test Responses:</strong> Written transcripts and AI analysis of your performance</li>
                            <li><strong>Support Tickets:</strong> Information you provide when contacting support</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.2 Automatically Collected Information</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Usage Data:</strong> Test history, vocabulary progress, pronunciation scores</li>
                            <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
                            <li><strong>Session Data:</strong> Authentication tokens (managed by NextAuth)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
                        <p>We use your information to:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>Provide and improve the Service</li>
                            <li>Analyze your speaking performance using AI (OpenAI)</li>
                            <li>Track your learning progress</li>
                            <li>Communicate with you about your account</li>
                            <li>Provide customer support</li>
                            <li>Ensure security and prevent fraud</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Data Storage and Security</h2>
                        <p>
                            <strong>Audio Storage:</strong> Your audio recordings are stored securely on AWS S3 with encryption.
                        </p>
                        <p className="mt-4">
                            <strong>Database:</strong> Your account data and test history are stored in a PostgreSQL database
                            (Neon) with SSL encryption in transit.
                        </p>
                        <p className="mt-4">
                            <strong>Security Measures:</strong> We implement industry-standard security practices including:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>Encrypted connections (HTTPS/SSL)</li>
                            <li>Secure authentication (Google OAuth)</li>
                            <li>Access controls and role-based permissions</li>
                            <li>Regular security audits</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Third-Party Services</h2>
                        <p>We use the following third-party services:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li><strong>Google OAuth:</strong> For authentication (Google Privacy Policy applies)</li>
                            <li><strong>OpenAI:</strong> For AI-powered feedback (OpenAI Privacy Policy applies)</li>
                            <li><strong>AWS S3:</strong> For secure audio file storage</li>
                            <li><strong>Resend:</strong> For transactional emails</li>
                            <li><strong>Vercel:</strong> For hosting and analytics</li>
                        </ul>
                        <p className="mt-4">
                            Each service has its own privacy policy. We recommend reviewing them.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Data Sharing</h2>
                        <p>We do NOT sell your personal data. We may share data only:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>With service providers necessary to operate the Service (AWS, OpenAI, etc.)</li>
                            <li>If required by law or legal process</li>
                            <li>To protect our rights or the safety of users</li>
                            <li>With your explicit consent</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li><strong>Access:</strong> Request a copy of your personal data</li>
                            <li><strong>Correction:</strong> Update or correct your information</li>
                            <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                            <li><strong>Export:</strong> Download your test history and recordings</li>
                        </ul>
                        <p className="mt-4">
                            To exercise these rights, contact us through the support section in your dashboard.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Data Retention</h2>
                        <p>
                            We retain your data while your account is active. If you delete your account:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>Personal information is deleted within 30 days</li>
                            <li>Audio recordings are permanently removed from AWS S3</li>
                            <li>Anonymized usage statistics may be retained for analytics</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Cookies and Tracking</h2>
                        <p>We use essential cookies for:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>Authentication (NextAuth session cookies)</li>
                            <li>Security and fraud prevention</li>
                        </ul>
                        <p className="mt-4">
                            We do not use third-party advertising cookies. Essential cookies do not require consent under GDPR.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Children's Privacy</h2>
                        <p>
                            The Service is not intended for users under 13 years old. We do not knowingly collect information
                            from children under 13. If we learn we have collected such data, we will delete it promptly.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. International Data Transfers</h2>
                        <p>
                            Your data may be processed in countries outside your residence (e.g., US for AWS, OpenAI).
                            We ensure appropriate safeguards are in place for such transfers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy. We will notify you of significant changes via email or
                            a notice on the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Contact Us</h2>
                        <p>
                            For privacy-related questions or to exercise your rights, contact us through the support
                            section in your dashboard.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
