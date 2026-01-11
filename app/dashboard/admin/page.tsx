"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ users: 0, tenders: 0, activeTenders: 0, pendingTenders: 0 });
    const [usersList, setUsersList] = useState([]);
    const [tendersList, setTendersList] = useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, tendersRes] = await Promise.all([
                    axios.get("/api/users"),
                    axios.get("/api/tenders")
                ]);

                setUsersList(usersRes.data.data);
                setTendersList(tendersRes.data.data);
                setStats({
                    users: usersRes.data.data.length,
                    tenders: tendersRes.data.data.length,
                    activeTenders: tendersRes.data.data.filter((t: any) => t.status === 'active').length,
                    pendingTenders: tendersRes.data.data.filter((t: any) => t.status === 'pending').length
                });
            } catch (error: any) {
                console.error("Error fetching admin data:", error.response?.data || error.message);
                if (error.response?.status === 401) {
                    router.push("/login");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const updateStatus = async (userId: string, action: 'approve' | 'reject') => {
        try {
            await axios.put("/api/verification", {
                action,
                targetUserId: userId
            });
            toast.success(`User ${action}d successfully`);

            // Refresh data with cache busting
            const usersRes = await axios.get(`/api/users?t=${Date.now()}`);
            setUsersList(usersRes.data.data);
            // Updating stats based on new list would be ideal, but for now just list refresh
        } catch (error: any) {
            toast.error("Action failed");
        }
    }

    const updateTenderStatus = async (tenderId: string, status: 'active' | 'rejected') => {
        try {
            await axios.put(`/api/tenders/${tenderId}`, { status });
            toast.success(`Tender ${status === 'active' ? 'approved' : 'rejected'}`);

            const tendersRes = await axios.get("/api/tenders");
            setTendersList(tendersRes.data.data);
            setStats(prev => ({
                ...prev,
                pendingTenders: tendersRes.data.data.filter((t: any) => t.status === 'pending').length,
                activeTenders: tendersRes.data.data.filter((t: any) => t.status === 'active').length
            }));
        } catch (error: any) {
            toast.error("Failed to update tender");
        }
    }

    const logout = async () => {
        try {
            await axios.get("/api/auth/logout");
            toast.success("Logout successful");
            window.location.href = "/login"; // Force reload to update Navbar
        } catch (error: any) {
            console.log(error.message);
            toast.error("Logout failed");
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-black text-white pt-28 px-8 pb-8">
            <Toaster />
            <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Logout</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <h2 className="text-xl font-bold mb-4">Users</h2>
                    <p className="text-gray-400">Manage Buyers and Vendors</p>
                    <div className="mt-4 text-4xl font-bold text-blue-500">{stats.users}</div>
                </div>

                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <h2 className="text-xl font-bold mb-4">Tenders</h2>
                    <p className="text-gray-400">Total Active Tenders</p>
                    <div className="mt-4 text-4xl font-bold text-green-500">{stats.activeTenders}</div>
                </div>

                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <h2 className="text-xl font-bold mb-4">Approvals</h2>
                    <p className="text-gray-400">Pending Verification</p>
                    <div className="mt-4 text-4xl font-bold text-yellow-500">
                        {usersList.filter((u: any) => u.verificationStatus === 'pending_approval').length}
                    </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <h2 className="text-xl font-bold mb-4">Pending Tenders</h2>
                    <p className="text-gray-400">Review new requests</p>
                    <div className="mt-4 text-4xl font-bold text-orange-500">
                        {stats.pendingTenders}
                    </div>
                </div>
            </div>

            {/* TENDERS APPROVAL SECTION */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
                <h2 className="text-2xl font-bold mb-6">Pending Tenders</h2>
                {stats.pendingTenders === 0 ? (
                    <p className="text-gray-500">No tenders pending approval.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-300">
                            <thead className="text-xs uppercase bg-gray-800 text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">Title</th>
                                    <th className="px-6 py-3">Budget</th>
                                    <th className="px-6 py-3">Created By</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tendersList.filter((t: any) => t.status === 'pending').map((tender: any) => (
                                    <tr key={tender._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="px-6 py-4 font-medium text-white">{tender.title}</td>
                                        <td className="px-6 py-4">{tender.budget}</td>
                                        <td className="px-6 py-4 text-xs">
                                            {tender.createdBy?.username || "Unknown"}
                                            <span className="block text-gray-500">{tender.createdBy?.email}</span>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <button onClick={() => updateTenderStatus(tender._id, 'active')} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded font-bold">Approve</button>
                                            <button onClick={() => updateTenderStatus(tender._id, 'rejected')} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded font-bold">Reject</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h2 className="text-2xl font-bold mb-6">User Database</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-300">
                        <thead className="text-xs uppercase bg-gray-800 text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Username</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersList.map((user: any) => (
                                <tr key={user._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-medium text-white">
                                        <div>{user.username}</div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                        {user.documents && user.documents.length > 0 && (
                                            <div className="flex gap-1 mt-1">
                                                {user.documents.map((doc: string, idx: number) => (
                                                    <a key={idx} href={doc} target="_blank" className="text-[10px] bg-blue-900 text-blue-300 px-1 rounded hover:underline">Doc {idx + 1}</a>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 uppercase text-xs font-bold">
                                        <span className={`px-2 py-1 rounded ${user.role === 'admin' ? 'bg-purple-900 text-purple-300' : user.role === 'buyer' ? 'bg-blue-900 text-blue-300' : 'bg-orange-900 text-orange-300'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2 py-1 rounded border ${user.verificationStatus === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            user.verificationStatus === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                user.verificationStatus === 'pending_approval' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                    'text-gray-500 border-gray-800'
                                            }`}>
                                            {user.verificationStatus?.replace('_', ' ').toUpperCase() || 'PENDING SUBMISSION'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.verificationStatus !== 'approved' && user.role !== 'admin' && (
                                            <div className="flex gap-2">
                                                <button onClick={() => updateStatus(user._id, 'approve')} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded font-bold">Approve</button>
                                                <button onClick={() => updateStatus(user._id, 'reject')} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded font-bold">Reject</button>
                                            </div>
                                        )}
                                        {user.verificationStatus === 'approved' && (
                                            <button onClick={() => updateStatus(user._id, 'reject')} className="px-3 py-1 bg-red-900/50 hover:bg-red-900 text-red-200 text-xs rounded font-bold border border-red-800">Revoke</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
