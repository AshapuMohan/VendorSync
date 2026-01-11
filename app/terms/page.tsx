"use client";
import React from 'react';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-16 font-sans">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-green-500">Terms of Service</h1>
                <p className="mb-4 text-gray-300">Last updated: {new Date().toLocaleDateString()}</p>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-white">1. Acceptance of Terms</h2>
                    <p className="text-gray-400 leading-relaxed">
                        By accessing or using VendorSync, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-white">2. Vendor Verification</h2>
                    <p className="text-gray-400 leading-relaxed">
                        All vendors must complete the verification process before they can participate in bidding processes. VendorSync reserves the right to reject any vendor application at its sole discretion without providing a specific reason.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-white">3. Prohibited Activities</h2>
                    <p className="text-gray-400 leading-relaxed">
                        You may not access or use the site for any purpose other than that for which we make the site available. Collusion, bid rigging, and providing false information are strictly prohibited and will result in immediate account termination.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-white">4. Limitation of Liability</h2>
                    <p className="text-gray-400 leading-relaxed">
                        VendorSync shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                    </p>
                </section>
            </div>
        </div>
    );
}
