"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Correct import for Next.js 13+ App Router
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link"; // Import Link

// Correctly typing params for App Router
export default function TenderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();


    // Unwrap params using React.use() or await in async component
    // Since this is a client component, we need to handle the promise or use simple unwrapping if Next.js guarantees it.
    // In Next.js 15, params is a promise.

    const [tenderId, setTenderId] = useState<string>("");

    const [tender, setTender] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [bids, setBids] = useState<any[]>([]);
    const [myBid, setMyBid] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Bid Form State
    const [bidAmount, setBidAmount] = useState("");
    const [bidProposal, setBidProposal] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Unwrap params
        params.then((p) => setTenderId(p.id));
    }, [params]);

    useEffect(() => {
        if (!tenderId) return;

        const fetchData = async () => {
            try {
                // 1. Get User
                const userRes = await axios.get("/api/auth/me");
                const userData = userRes.data.data;
                setUser(userData);

                // 2. Get Tender
                const tenderRes = await axios.get(`/api/tenders/${tenderId}`);
                setTender(tenderRes.data.data);

                // 3. Logic based on role
                if (userData.role === 'buyer' && tenderRes.data.data.createdBy._id === userData._id) {
                    // If Buyer & Owner -> Fetch Bids
                    const bidsRes = await axios.get(`/api/bids?tenderId=${tenderId}`);
                    setBids(bidsRes.data.data);
                } else if (userData.role === 'vendor') {
                    // If Vendor -> Check if already bid
                    const bidsRes = await axios.get(`/api/bids?tenderId=${tenderId}&vendorId=${userData._id}`);
                    // My API implementation filters by vendor if role is vendor, so this works
                    if (bidsRes.data.data.length > 0) {
                        setMyBid(bidsRes.data.data[0]);
                    }
                }

            } catch (error: any) {
                console.error("Error fetching data", error);
                toast.error("Failed to load tender details");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [tenderId]);

    const handleBidSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await axios.post("/api/bids", {
                tenderId,
                amount: bidAmount,
                proposal: bidProposal
            });
            toast.success("Bid submitted successfully");
            // Refresh logic (simple reload or state update)
            window.location.reload();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to submit bid");
        } finally {
            setSubmitting(false);
        }
    };

    const handleBidStatus = async (bidId: string, status: string) => {
        try {
            await axios.put(`/api/bids/${bidId}`, { status });
            toast.success(`Bid ${status}`);
            // Update local state
            setBids(bids.map(b => b._id === bidId ? { ...b, status } : b));
        } catch (error: any) {
            toast.error("Failed to update bid status");
        }
    }

    if (loading) return <div className="min-h-screen bg-black text-white p-10 text-center">Loading...</div>;
    if (!tender) return <div className="min-h-screen bg-black text-white p-10 text-center">Tender not found.</div>;

    const isOwner = user && tender.createdBy._id === user._id;
    const isVendor = user && user.role === 'vendor';

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <Toaster />
            <div className="max-w-4xl mx-auto">
                <Link href="/tenders" className="text-gray-400 mb-4 inline-block hover:text-white">&larr; Back to Tenders</Link>

                <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-8">
                    <div className="flex justify-between items-start">
                        <h1 className="text-3xl font-bold mb-4 text-blue-400">{tender.title}</h1>
                        <span className={`px-3 py-1 rounded-full text-sm uppercase font-bold ${tender.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>{tender.status}</span>
                    </div>

                    <p className="text-gray-300 mb-6 whitespace-pre-wrap">{tender.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-gray-800 pt-6">
                        <div>
                            <span className="block text-gray-500 text-sm">Budget</span>
                            <span className="text-lg font-bold">{tender.budget}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500 text-sm">Deadline</span>
                            <span className="text-lg font-bold">{new Date(tender.deadline).toLocaleDateString()}</span>
                        </div>
                        <div>
                            <span className="block text-gray-500 text-sm">Posted By</span>
                            <span className="text-lg font-bold">{tender.createdBy.username}</span>
                        </div>
                        {tender.createdBy.companyDetails && (
                            <div>
                                <span className="block text-gray-500 text-sm">Company</span>
                                <span className="text-lg font-bold">{tender.createdBy.companyDetails.name || "N/A"}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* VENDOR VIEW: Place Bid */}
                {isVendor && !myBid && tender.status === 'active' && (
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                        <h2 className="text-2xl font-bold mb-6">Submit Proposal</h2>
                        <form onSubmit={handleBidSubmit} className="flex flex-col space-y-4">
                            <div className="flex flex-col">
                                <label className="text-gray-300 mb-1">Bid Amount</label>
                                <input value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} className="p-3 bg-black border border-gray-700 rounded text-white" type="text" required placeholder="$" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-300 mb-1">Proposal Details</label>
                                <textarea value={bidProposal} onChange={(e) => setBidProposal(e.target.value)} className="p-3 bg-black border border-gray-700 rounded text-white h-32" required placeholder="Describe your offer..." />
                            </div>
                            <button disabled={submitting} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded disabled:bg-gray-600">
                                {submitting ? "Submitting..." : "Submit Bid"}
                            </button>
                        </form>
                    </div>
                )}

                {isVendor && myBid && (
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
                        <h2 className="text-2xl font-bold mb-2">Bid Submitted</h2>
                        <p className="text-gray-400">You have submitted a bid of <span className="text-white font-bold">{myBid.amount}</span></p>
                        <div className="mt-4">
                            Status: <span className={`font-bold uppercase ${myBid.status === 'accepted' ? 'text-green-500' : myBid.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'}`}>{myBid.status}</span>
                        </div>
                    </div>
                )}

                {/* BUYER VIEW: Manage Bids */}
                {isOwner && (
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                        <h2 className="text-2xl font-bold mb-6">Received Bids ({bids.length})</h2>
                        {bids.length === 0 ? (
                            <p className="text-gray-500">No bids received yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {bids.map((bid) => (
                                    <div key={bid._id} className="bg-black border border-gray-700 p-4 rounded flex flex-col md:flex-row justify-between items-start md:items-center">
                                        <div className="mb-4 md:mb-0">
                                            <div className="text-lg font-bold text-white">{bid.vendor.username} <span className="text-gray-500 text-sm">({bid.vendor.companyDetails?.name})</span></div>
                                            <div className="text-blue-400 font-mono font-bold text-xl">{bid.amount}</div>
                                            <p className="text-gray-400 text-sm mt-1">{bid.proposal}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`text-sm font-bold uppercase mb-2 ${bid.status === 'accepted' ? 'text-green-500' : bid.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'}`}>{bid.status}</span>
                                            {bid.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleBidStatus(bid._id, 'accepted')} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">Accept</button>
                                                    <button onClick={() => handleBidStatus(bid._id, 'rejected')} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">Reject</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
