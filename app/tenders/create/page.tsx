"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function CreateTenderPage() {
    const router = useRouter();
    const [tender, setTender] = useState({
        title: "",
        description: "",
        budget: "",
        deadline: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTender({ ...tender, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.post("/api/tenders", tender);
            toast.success("Tender created successfully");
            router.push("/dashboard/buyer");
        } catch (error: any) {
            console.log(error.message);
            toast.error(error.response?.data?.error || "Failed to create tender");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
            <Toaster />
            <h1 className="text-4xl font-bold mb-8">Create New Tender</h1>
            <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-lg p-8">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <div className="flex flex-col">
                        <label className="text-gray-300 mb-1">Tender Title</label>
                        <input name="title" value={tender.title} onChange={handleChange} className="p-3 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-white" type="text" required placeholder="e.g. Supply of Office Equipment" />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-300 mb-1">Description</label>
                        <textarea name="description" value={tender.description} onChange={handleChange} className="p-3 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-white h-32" required placeholder="Detailed requirements..." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-gray-300 mb-1">Budget Range</label>
                            <input name="budget" value={tender.budget} onChange={handleChange} className="p-3 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-white" type="text" required placeholder="e.g. $5000 - $10000" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-gray-300 mb-1">Deadline</label>
                            <input name="deadline" value={tender.deadline} onChange={handleChange} className="p-3 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-white" type="date" required />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="mt-4 bg-white text-black font-bold py-3 rounded hover:bg-gray-200 transition disabled:bg-gray-500">
                        {loading ? "Creating..." : "Publish Tender"}
                    </button>
                    <button type="button" onClick={() => router.back()} className="text-gray-500 hover:text-white transition text-center">Cancel</button>
                </form>
            </div>
        </div>
    );
}
