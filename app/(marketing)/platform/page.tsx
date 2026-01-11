"use client"
import Navbar from "@/app/components/Navbar"
import { motion } from "framer-motion"

const workflows = [
  { step: "Intake", status: "Validated", desc: "Smart forms capture custom requisition data." },
  { step: "Matching", status: "AI Active", desc: "Proprietary algorithms pair you with ideal vendors." },
  { step: "Contracting", status: "Encrypted", desc: "Automated legal templates with e-signature." }
]

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-[#030712] pt-32 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-6xl font-bold tracking-tighter mb-8 text-slate-400">The Operating System for Procurement.</h1>
          <div className="space-y-6">
            {workflows.map((w, i) => (
              <div key={i} className="group p-6 bg-white/2 border-l-2 border-blue-600/30 hover:border-blue-500 transition-all">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-mono text-blue-400">{w.step}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 uppercase">{w.status}</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mock Interface Visual */}
        <div className="relative aspect-square bg-slate-900 rounded-[3rem] border border-white/10 p-4 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-transparent" />
          <div className="relative bg-[#0d1117] h-full rounded-4xl border border-white/5 p-8 font-mono text-[10px] text-blue-300">
            <div className="flex gap-2 mb-4"><div className="w-2 h-2 rounded-full bg-red-500" /><div className="w-2 h-2 rounded-full bg-yellow-500" /><div className="w-2 h-2 rounded-full bg-green-500" /></div>
            <p className="opacity-50">{"// Initializing Procurement Sync..."}</p>
            <p className="mt-2">{"POST /api/v1/requisition { "}</p>
            <p className="ml-4">{"  id: 'REQ-9902',"}</p>
            <p className="ml-4 text-emerald-400">{"  compliance_check: true,"}</p>
            <p className="ml-4">{"  vendor_matching: 'AI_OPTIMIZED'"}</p>
            <p>{"}"}</p>
            <div className="mt-12 p-4 bg-white/5 rounded-xl border border-white/10 animate-pulse">
              <p className="text-white text-xs mb-2 italic">Scanning Global Network...</p>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[65%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}