export default function Privacy() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

            <div className="space-y-6 text-gray-600">
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
                    <p>We collect information you provide directly to us, such as when you create an account, upload data, or communicate with us. This may include:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Name and email address</li>
                        <li>Account credentials</li>
                        <li>Data files you upload for analysis</li>
                        <li>Dashboard configurations and preferences</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Provide, maintain, and improve our services</li>
                        <li>Process and complete transactions</li>
                        <li>Send technical notices and support messages</li>
                        <li>Respond to your comments and questions</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Data Security</h2>
                    <p>We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access. All data is encrypted in transit and at rest.</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us at privacy@analyticsdashboard.com.</p>
                </section>

                <p className="text-sm text-gray-500 mt-8">Last updated: January 1, 2024</p>
            </div>
        </div>
    );
}