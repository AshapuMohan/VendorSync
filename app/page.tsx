"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Kaushan_Script, Inter } from "next/font/google"
import Link from "next/link"
import Navbar from "./components/Navbar";
import TrustedUsers from "./components/TrustedUsers"


const kaushan = Kaushan_Script({ subsets: ["latin"], weight: ["400"] })
const inter = Inter({ subsets: ["latin"] })

const IntroLoader = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2800)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-100 bg-[#030712] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "circOut" } }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -40, opacity: 0 }}
        className="text-center"
      >
        <h1 className={`${kaushan.className} text-5xl md:text-7xl text-white mb-2`}>
          VendorSync
        </h1>
        <motion.div
          className="h-px bg-blue-500 mx-auto"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.5, duration: 1.5 }}
        />
        <p className="mt-4 text-blue-400 tracking-[0.3em] uppercase text-[10px] font-bold">
          Digital Procurement Excellence
        </p>
      </motion.div>
    </motion.div>
  )
}

export default function Home() {
  const [loading, setLoading] = useState(true)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])


  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "unset"
  }, [loading])

  return (
    <div className={`${inter.className} bg-[#030712] text-slate-200 selection:bg-blue-500/30 min-h-screen antialiased`}>
      <AnimatePresence>
        {loading && <IntroLoader onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-250 h-150 bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-purple-600/5 blur-[100px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.section
          style={{ opacity }}
          className="flex min-h-screen flex-col items-center justify-center text-center pt-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Enterprise Engine v1.0.1
          </motion.div>

          <h1 className="text-7xl md:text-9xl font-bold tracking-tight bg-linear-to-b from-white via-white to-slate-500 bg-clip-text text-transparent mb-6">
            VendorSync
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-slate-400 leading-relaxed font-light mb-8">
            The intelligent procurement layer for modern enterprises.
            <span className="text-white font-medium italic"> Automate compliance</span>,
            leverage global bidding, and secure your supply chain in one unified dashboard.
          </p>
          <TrustedUsers />
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link href="/login" className="group relative px-12 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95">
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            <Link href="/register" className="px-12 py-4 border border-white/10 hover:bg-white/5 hover:border-white/20 text-white font-medium rounded-full transition-all">
              Join the Network
            </Link>
          </div>
        </motion.section>

        <section className="py-32">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.3em] mb-2">Process</h2>
              <h3 className="text-4xl font-bold text-white">The Procurement Lifecycle</h3>
            </div>
            <p className="max-w-md text-slate-400 text-sm italic">
              A standardized, audit-ready workflow designed to eliminate manual bottlenecks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: "01", title: "Requisition", desc: "AI-assisted technical specification builder for precise requirement definition." },
              { step: "02", title: "Tendering", desc: "Automated RFQ distribution to our network of 5,000+ verified global suppliers." },
              { step: "03", title: "Evaluation", desc: "Proprietary scoring algorithms rank bids based on price, ESG, and past performance." },
              { step: "04", title: "Award", desc: "Instant contract generation with secure digital signatures and ERP integration." }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative p-8 bg-white/2 border border-white/5 rounded-3xl hover:bg-white/5 transition-colors"
              >
                <span className="text-5xl font-black text-white/3 group-hover:text-blue-500/10 transition-colors absolute top-4 right-6 uppercase italic">
                  {item.step}
                </span>
                <h4 className="text-lg font-bold text-white mb-3">{item.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-32 border-t border-white/5">
          <div className="grid lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Real-time Analytics"
              desc="Visualize vendor performance trends and market volatility with live-streaming data feeds."
              icon={<ChartIcon />}
              color="blue"
            />
            <FeatureCard
              title="Encrypted Bidding"
              desc="Zero-knowledge proof architecture ensures bid integrity and prevents insider collusion."
              icon={<LockIcon />}
              color="emerald"
            />
            <FeatureCard
              title="Audit Ledger"
              desc="Immutable logs for every procurement decision, fulfilling SOX and ISO compliance needs."
              icon={<ClockIcon />}
              color="purple"
            />
          </div>
        </section>

        <footer className="py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
          <p>&copy; {new Date().getFullYear()} VendorSync Systems // Global Procurement Engine</p>
          <div className="flex gap-8">
            <Link href="/privacy-policy" className="hover:text-blue-500 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-500 transition-colors">Terms of Service</Link>
          </div>
        </footer>
      </main>
    </div>
  )
}
const FeatureCard = ({ title, desc, icon, color }: any) => (
  <div className="group p-10 rounded-4xl border border-white/5 bg-linear-to-br from-white/3 to-transparent hover:border-blue-500/30 transition-all">
    <div className={`h-14 w-14 rounded-2xl bg-${color}-500/10 flex items-center justify-center mb-8 text-${color}-400 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
    <p className="text-slate-400 leading-relaxed font-light">{desc}</p>
  </div>
)

const ChartIcon = () => <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
const LockIcon = () => <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
const ClockIcon = () => <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>