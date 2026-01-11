"use client";
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface VerificationProps {
    user: any;
    refreshUser: () => void;
}

export default function VerificationSection({ user, refreshUser }: VerificationProps) {
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploading(true);
            const res = await axios.post("/api/upload", formData);
            if (res.data.success) {
                toast.success("Document uploaded");
                refreshUser();
            }
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const submitVerification = async () => {
        try {
            if (user.documents.length === 0) {
                return toast.error("Please upload at least one document before submitting.");
            }
            setSubmitting(true);
            await axios.put("/api/verification", { action: "submit_verification" });
            toast.success("Verification request submitted!");
            refreshUser();
        } catch (error: any) {
            toast.error("Submission failed");
        } finally {
            setSubmitting(false);
        }
    }

    if (!user || user.isApproved) return null;

    return (
        <div className={`p-6 rounded-xl border mb-8 ${user.verificationStatus === 'pending_submission' ? 'bg-blue-900/20 border-blue-500/30' : user.verificationStatus === 'rejected' ? 'bg-red-900/20 border-red-500/30' : 'bg-yellow-900/20 border-yellow-500/30'}`}>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">
                            {user.verificationStatus === 'pending_submission' ? 'Accout Verification Required' : user.verificationStatus === 'pending_approval' ? 'Verification Pending' : 'Verification Rejected'}
                        </h2>
                        <p className="text-gray-400">
                            {user.verificationStatus === 'pending_submission'
                                ? "Please upload proof of business/identity to unlock full access."
                                : user.verificationStatus === 'pending_approval'
                                    ? "Your documents are under review."
                                    : "Your verification was rejected. Please contact support."}
                        </p>
                    </div>
                    {user.verificationStatus === 'pending_approval' && (
                        <span className="bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-full border border-yellow-500/20 font-mono text-sm">IN REVIEW</span>
                    )}
                </div>

                {/* Document List */}
                <div className="mt-4">
                    <h3 className="text-sm font-bold text-gray-300 mb-2">Uploaded Documents:</h3>
                    {user.documents && user.documents.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {user.documents.map((doc: string, idx: number) => (
                                <a key={idx} href={doc} target="_blank" className="text-blue-400 text-sm hover:underline bg-blue-900/30 px-3 py-1 rounded">
                                    View Document {idx + 1}
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">No documents uploaded yet.</p>
                    )}
                </div>

                {/* Actions */}
                {user.verificationStatus === 'pending_submission' && (
                    <div className="flex gap-4 items-center mt-4">
                        <label className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded cursor-pointer transition">
                            {uploading ? "Uploading..." : "Upload Document"}
                            <input type="file" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                        </label>

                        <button
                            onClick={submitVerification}
                            disabled={submitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-all disabled:opacity-50"
                        >
                            {submitting ? "Submitting..." : "Submit for Verification"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
