"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import VerificationSection from "@/app/components/VerificationSection";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function VendorDashboard() {
    const router = useRouter();
    const [myBids, setMyBids] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [verificationLoading, setVerificationLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await axios.get("/api/auth/me");
                setUser(userRes.data.data);

                // Fetch bids by this vendor
                const bidsRes = await axios.get(`/api/bids?vendorId=${userRes.data.data._id}`);
                setMyBids(bidsRes.data.data);
            } catch (error) {
                console.error("Failed to fetch vendor data");
            }
        };
        fetchData();
    }, []);

    const submitVerification = async () => {
        try {
            setVerificationLoading(true);
            await axios.put("/api/verification", { action: "submit_verification" });
            toast.success("Verification request submitted!");
            // Refresh user data
            const userRes = await axios.get("/api/auth/me");
            setUser(userRes.data.data);
        } catch (error: any) {
            toast.error("Submission failed");
        } finally {
            setVerificationLoading(false);
        }
    }

    const logout = async () => {
        try {
            await axios.get("/api/auth/logout");
            toast.success("Logout successful");
            toast.success("Logout successful");
            window.location.href = "/login";
        } catch (error: any) {
            console.log(error.message);
            toast.error("Logout failed");
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-black text-white pt-28 px-8 pb-8">
            <Toaster />
            {/* Verification Banner */}
            <VerificationSection user={user} refreshUser={() => {
                axios.get("/api/auth/me").then(res => setUser(res.data.data));
            }} />

            <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-600">Vendor Portal</h1>
                    <p className="text-gray-400 text-sm mt-1">Track your bids and opportunities</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/tenders" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-full transition-all">
                        <span>Browse Market</span>
                    </Link>
                    <button onClick={logout} className="bg-red-500/10 border border-red-500/50 hover:bg-red-500 hover:text-white text-red-500 font-bold py-2 px-6 rounded-full transition-all">Logout</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
                    <div className="text-gray-400 text-sm font-bold uppercase tracking-wider">Submitted Bids</div>
                    <div className="text-4xl font-bold text-white mt-2">{myBids.length}</div>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
                    <div className="text-gray-400 text-sm font-bold uppercase tracking-wider">Wins</div>
                    <div className="text-4xl font-bold text-green-500 mt-2">{myBids.filter(b => b.status === 'accepted').length}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-gray-900/30 border border-gray-800 p-8 rounded-2xl">
                    <h2 className="text-2xl font-bold mb-6 text-white">Bid History</h2>
                    {myBids.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-gray-800 rounded-xl bg-gray-950">
                            <p className="text-gray-500 mb-4">You haven't placed any bids yet.</p>
                            <Link href="/tenders" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4">Explore open tenders</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {myBids.map((bid) => (
                                <Link key={bid._id} href={`/tenders/${bid.tender?._id}`} className="block group">
                                    <div className="bg-black border border-gray-800 p-5 rounded-xl flex flex-col md:flex-row justify-between items-center hover:border-emerald-500/50 transition-all hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.15)]">
                                        <div className="mb-4 md:mb-0">
                                            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">{bid.tender?.title || "Unknown Tender"}</h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                <span>Bid Amount: <span className="text-white font-mono">{bid.amount}</span></span>
                                                <span className="hidden md:inline">&bull;</span>
                                                <span className="truncate max-w-md">{bid.proposal}</span>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${bid.status === 'accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' : bid.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>{bid.status}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
