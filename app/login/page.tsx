"use client"
import { Caveat } from "next/font/google"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { BsKey } from "react-icons/bs"
import toast, { Toaster } from "react-hot-toast"

const caveat = Caveat({
    weight: ["700"],
    subsets: ["latin"]
})

export default function Login() {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [passkey, setPasskey] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (username === "" || password === "") {
            toast.error("Please fill in all fields")
            return
        }

        try {
            setLoading(true)
            const response = await axios.post("/api/auth/login", {
                username,
                password
            })
            console.log("Login success", response.data)
            toast.success("Login Successful")
            // Force full reload to update Navbar state
            window.location.href = "/";

        } catch (error: any) {
            console.log("Login failed", error.message)
            toast.error(error.response?.data?.error || "Login failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center bg-black text-white min-h-screen">
            <Toaster />
            <h1 style={{ fontFamily: caveat.style.fontFamily }} className="text-[60px]">Login</h1>
            <div className="flex flex-col items-center justify-center bg-black text-white border border-gray-700 rounded-4xl p-5">
                <form className="flex flex-col w-100 mx-auto space-y-3">
                    <label className="text-white">Username</label>
                    <input value={username} onChange={(e) => { setUsername(e.target.value) }} className="px-2 py-1 border border-gray-800 rounded-2xl bg-black text-white" type="text" required />
                    <label className="text-white">Password</label>
                    <input value={password} onChange={(e) => { setPassword(e.target.value) }} className="px-2 py-1 border border-gray-800 rounded-2xl bg-black text-white" type="password" required />
                    <button onClick={handleSubmit} disabled={loading} className="px-2 py-1 bg-white text-black rounded-2xl cursor-pointer disabled:bg-gray-500">{loading ? "Logging in..." : "Login"}</button>
                    <div className="flex items-center my-2 mx-3">
                        <div className="flex-grow h-px bg-gray-800" />
                        <span className="px-2 text-xs text-gray-400 uppercase">or</span>
                        <div className="flex-grow h-px bg-gray-800" />
                    </div>
                    <h1 className="text-white text-center mt-1">Login with Passkey</h1>
                    <label className="text-white">Passkey</label>
                    <input value={passkey} onChange={(e) => { setPasskey(e.target.value) }} className="px-2 py-1 border border-gray-800 rounded-2xl bg-black text-white" type="text" />
                    <button onClick={(e) => { e.preventDefault(); toast("Passkey not implemented yet"); }} className="px-2 py-1 bg-white text-black rounded-2xl cursor-pointer flex items-center justify-center"><BsKey size={25} className="pr-1" /> Passkey</button>
                    <span className="text-white text-center">Don&apos;t have an account? <Link href="/register" className="text-blue-500">Register</Link></span>
                </form>
            </div>
        </div>
    )
}