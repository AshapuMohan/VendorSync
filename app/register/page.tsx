"use client"
import { Caveat } from "next/font/google"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import toast from "react-hot-toast" // Fix import from 'headless' if needed, or stick to what they had. They had 'react-hot-toast/headless', I will use 'react-hot-toast' for standard toast.
import { Toaster } from "react-hot-toast"

const caveat = Caveat({
    weight: ["700"],
    subsets: ["latin"]
})

export default function Register() {
    const router = useRouter()
    const [loading, setLoading] = React.useState(false);
    const [termsAccepted, setTermsAccepted] = React.useState(false);
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        role: "buyer",
        companyName: "",
        companyAddress: "",
        companyContact: ""
    })
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (user.username === "" || user.email === "" || user.password === "") {
            toast.error("Please fill in all required fields")
            return
        }
        if (user.password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        if (!termsAccepted) { // New check for terms
            toast.error("You must accept the Terms of Service and Privacy Policy")
            return
        }

        try {
            const response = await axios.post("/api/auth/register", user)
            console.log("Signup success", response.data)
            toast.success("Registration Successful")
            router.push("/login")
        } catch (error: any) {
            console.log("Signup failed", error.message)
            toast.error(error.response?.data?.error || "Registration failed")
        }
    }

    return (
        <div className="flex flex-col items-center justify-center bg-black text-white min-h-screen py-10">
            <Toaster />
            <h1 style={{ fontFamily: caveat.style.fontFamily }} className="text-[60px] mb-4">Register</h1>
            <div className="flex flex-col items-center justify-center bg-black text-white border border-gray-700 rounded-4xl p-8 w-full max-w-md">
                <form className="flex flex-col w-full space-y-4">

                    <div className="flex flex-col">
                        <label className="text-white mb-1">Role</label>
                        <select name="role" value={user.role} onChange={handleChange} className="px-2 py-1 border border-gray-800 rounded-2xl bg-black text-white">
                            <option value="buyer">Buyer</option>
                            <option value="vendor">Vendor</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-white mb-1">Username</label>
                        <input name="username" value={user.username} onChange={handleChange} className="px-2 py-1 border border-gray-800 rounded-2xl bg-black text-white" type="text" required />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-white mb-1">Email</label>
                        <input name="email" value={user.email} onChange={handleChange} className="px-2 py-1 border border-gray-800 rounded-2xl bg-black text-white" type="email" required />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-white mb-1">Password</label>
                        <input name="password" value={user.password} onChange={handleChange} className="px-2 py-1 border border-gray-800 rounded-2xl bg-black text-white" type="password" required />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-white mb-1">Confirm Password</label>
                        <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="px-2 py-1 border border-gray-800 rounded-2xl bg-black text-white" type="password" required />
                    </div>

                    <hr className="border-gray-800 my-4" />
                    <h2 className="text-lg font-semibold text-center">Company Details</h2>

                    <div className="flex flex-col">
                        <label className="text-white mb-1">Company Name</label>
                        <input name="companyName" value={user.companyName} onChange={handleChange} className="px-2 py-1 border border-gray-800 rounded-2xl bg-black text-white" type="text" />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-white mb-1">Address</label>
                        <input name="companyAddress" value={user.companyAddress} onChange={handleChange} className="px-2 py-1 border border-gray-800 rounded-2xl bg-black text-white" type="text" />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-white mb-1">Contact No</label>
                        <input name="companyContact" value={user.companyContact} onChange={handleChange} className="px-2 py-1 border border-gray-800 rounded-2xl bg-black text-white" type="text" />
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <input
                            type="checkbox"
                            required
                            id="terms"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600 ring-offset-gray-800"
                        />
                        <label htmlFor="terms" className="text-sm text-gray-300">I agree to the <a href="/terms" className="text-blue-400 hover:underline" target="_blank">Terms of Service</a> and <a href="/privacy-policy" className="text-blue-400 hover:underline" target="_blank">Privacy Policy</a></label>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={!termsAccepted || loading}
                        className={`w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition ${(!termsAccepted || loading) ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Processing..." : "Register"}
                    </button>

                    <div className="flex items-center my-2">
                        <div className="flex-grow h-px bg-gray-800" />
                        <span className="px-2 text-xs text-gray-400 uppercase">or</span>
                        <div className="flex-grow h-px bg-gray-800" />
                    </div>
                    <span className="text-white text-center">Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Login</Link></span>
                </form>
            </div>
        </div>
    )
}