import Link from "next/link";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 md:p-12">
                <Link href="/" className="text-sm text-emerald-600 hover:text-emerald-700 mb-6 inline-block">
                    ← Back to Home
                </Link>

                <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                <p className="text-gray-500 mb-8">Last updated: November 28, 2025</p>

                <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Agreement to Terms</h2>
                        <p>
                            By accessing or using IELTS EQ ("Service"), you agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
                        <p>
                            IELTS EQ provides AI-powered IELTS Speaking test practice, vocabulary building tools, and pronunciation
                            training. The Service uses artificial intelligence to analyze your responses and provide feedback.
                        </p>
                        <p className="mt-4">
                            <strong>Important:</strong> IELTS EQ is a practice platform and is not affiliated with or endorsed by
                            the official IELTS testing bodies (British Council, IDP, Cambridge Assessment English).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Accounts</h2>
                        <p>You are responsible for:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>Maintaining the confidentiality of your account</li>
                            <li>All activities that occur under your account</li>
                            <li>Notifying us immediately of any unauthorized use</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Acceptable Use</h2>
                        <p>You agree NOT to:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>Use the Service for any illegal purpose</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Share or resell your account access</li>
                            <li>Upload malicious code or attempt to disrupt the Service</li>
                            <li>Use automated tools to abuse API limits</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Intellectual Property</h2>
                        <p>
                            All content, features, and functionality of the Service are owned by IELTS EQ and are protected
                            by international copyright, trademark, and other intellectual property laws.
                        </p>
                        <p className="mt-4">
                            Your audio recordings and responses remain your property. By using the Service, you grant us
                            a limited license to process your recordings for the purpose of providing feedback.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. AI-Generated Feedback</h2>
                        <p>
                            Our Service uses AI (OpenAI GPT) to analyze your speaking performance. While we strive for accuracy:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>AI feedback is for practice purposes only</li>
                            <li>Band scores are estimates and may not reflect official IELTS scoring</li>
                            <li>We do not guarantee specific test results</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Payment and Subscriptions</h2>
                        <p>
                            If you purchase a subscription:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                            <li>Subscriptions auto-renew unless cancelled</li>
                            <li>Refunds are handled on a case-by-case basis</li>
                            <li>We reserve the right to change pricing with notice</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Termination</h2>
                        <p>
                            We reserve the right to suspend or terminate your account if you violate these Terms.
                            You may cancel your account at any time through your account settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Disclaimer of Warranties</h2>
                        <p>
                            THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE
                            UNINTERRUPTED OR ERROR-FREE SERVICE.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Limitation of Liability</h2>
                        <p>
                            IELTS EQ SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES
                            ARISING FROM YOUR USE OF THE SERVICE.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Changes to Terms</h2>
                        <p>
                            We may update these Terms from time to time. Continued use of the Service after changes
                            constitutes acceptance of the new Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Contact Us</h2>
                        <p>
                            For questions about these Terms, please contact us through the support section in your dashboard.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
