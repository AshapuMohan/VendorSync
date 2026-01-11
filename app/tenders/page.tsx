"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TenderListPage() {
    const [tenders, setTenders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTenders = async () => {
            try {
                const res = await axios.get("/api/tenders");
                setTenders(res.data.data);
            } catch (error) {
                console.error("Failed to fetch tenders", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTenders();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-bold">Active Tenders</h1>
                    <Link href="/dashboard" className="text-gray-400 hover:text-white">Back to Dashboard</Link>
                </div>

                {loading ? (
                    <div className="text-center text-gray-500">Loading tenders...</div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {tenders.length === 0 ? (
                            <div className="text-center text-gray-500 p-10 border border-gray-800 rounded">No active tenders found.</div>
                        ) : (
                            tenders.map((tender) => (
                                <Link href={`/tenders/${tender._id}`} key={tender._id} className="block group">
                                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg hover:border-white transition">
                                        <div className="flex justify-between items-start mb-2">
                                            <h2 className="text-2xl font-bold group-hover:text-blue-400 transition">{tender.title}</h2>
                                            <span className="bg-green-900 text-green-300 text-xs px-2 py-1 rounded-full uppercase">{tender.status}</span>
                                        </div>
                                        <p className="text-gray-400 mb-4 line-clamp-2">{tender.description}</p>
                                        <div className="flex gap-6 text-sm text-gray-400">
                                            <span>Budget: <span className="text-white">{tender.budget}</span></span>
                                            <span>Deadline: <span className="text-white">{new Date(tender.deadline).toLocaleDateString()}</span></span>
                                            <span>By: <span className="text-white">{tender.createdBy?.username || "Unknown"}</span></span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
