"use client";
import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-16 font-sans">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-blue-500">Privacy Policy</h1>
                <p className="mb-4 text-gray-300">Last updated: {new Date().toLocaleDateString()}</p>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-white">1. Information We Collect</h2>
                    <p className="text-gray-400 leading-relaxed">
                        We collect information you provide directly to us when you register for an account, such as your name, email address, company details, and verification documents. We also automatically collect certain technical data when you use our platform.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-white">2. How We Use Your Information</h2>
                    <p className="text-gray-400 leading-relaxed">
                        We use your information to operate and maintain the VendorSync platform, verify your identity as a legitimate business entity, process transactions, and communicate with you about your account and platform updates.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-white">3. Data Security</h2>
                    <p className="text-gray-400 leading-relaxed">
                        We implement industry-standard security measures to protect your personal and business data. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-white">4. Contact Us</h2>
                    <p className="text-gray-400 leading-relaxed">
                        If you have any questions about this Privacy Policy, please contact us at legal@vendorsync.com.
                    </p>
                </section>
            </div>
        </div>
    );
}
