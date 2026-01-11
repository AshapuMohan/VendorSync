"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const res = await axios.get("/api/auth/me");
                const userData = res.data.data;
                setUser(userData);

                // Redirect based on role
                if (userData.role === 'admin') {
                    router.push('/dashboard/admin');
                } else if (userData.role === 'buyer') {
                    router.push('/dashboard/buyer');
                } else if (userData.role === 'vendor') {
                    router.push('/dashboard/vendor');
                }

            } catch (error: any) {
                console.log("Failed to load user", error.message);
                toast.error("Failed to load user details");
                router.push("/login"); // Force login if auth fails
            } finally {
                setLoading(false);
            }
        };
        getUserDetails();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <p>Loading Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white py-2">
            <Toaster />
            <h1>Redirecting to your dashboard...</h1>
        </div>
    );
}
