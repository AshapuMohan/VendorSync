"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import VerificationSection from "@/app/components/VerificationSection";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function BuyerDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [tenders, setTenders] = useState<any[]>([]);
    const [stats, setStats] = useState({ active: 0, closed: 0, pending: 0 });

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await axios.get("/api/auth/me");
                setUser(userRes.data.data);

                const res = await axios.get(`/api/tenders?creatorId=${userRes.data.data._id}`);
                setTenders(res.data.data);
                // Calculate stats logic...
            } catch (error) {
                console.error("Failed to fetch data");
            }
        };
        fetchData();
    }, []);

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
            <VerificationSection user={user} refreshUser={() => {
                axios.get("/api/auth/me").then(res => setUser(res.data.data));
            }} />

            <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">Buyer Portal</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage your procurement and tenders</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/tenders/create" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-all">
                        <span>+ New Tender</span>
                    </Link>
                    <button onClick={logout} className="bg-red-500/10 border border-red-500/50 hover:bg-red-500 hover:text-white text-red-500 font-bold py-2 px-6 rounded-full transition-all">Logout</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
                    <div className="text-gray-400 text-sm font-bold uppercase tracking-wider">Active Tenders</div>
                    <div className="text-4xl font-bold text-white mt-2">{tenders.length}</div>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
                    <div className="text-gray-400 text-sm font-bold uppercase tracking-wider">Pending Actions</div>
                    <div className="text-4xl font-bold text-yellow-500 mt-2">0</div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-gray-900/30 border border-gray-800 p-8 rounded-2xl">
                    <h2 className="text-2xl font-bold mb-6 text-white">Your Tenders</h2>
                    {tenders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-gray-800 rounded-xl bg-gray-950">
                            <p className="text-gray-500 mb-4">You haven't posted any tenders yet.</p>
                            <Link href="/tenders/create" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">Create your first tender</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tenders.map((tender) => (
                                <Link href={`/tenders/${tender._id}`} key={tender._id} className="block group">
                                    <div className="h-full bg-black border border-gray-800 p-6 rounded-xl hover:border-blue-500/50 transition-all hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)] relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${tender.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{tender.status}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors pr-10">{tender.title}</h3>
                                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                                            <span>Start Price:</span>
                                            <span className="text-white font-mono">{tender.budget}</span>
                                        </div>
                                        <div className="w-full h-px bg-gray-800 my-4" />
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">View Details &rarr;</span>
                                        </div>
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
