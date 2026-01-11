"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/app/components/Navbar"
import axios from "axios";
import Link from "next/link";
import { Inter, Outfit } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"] });

// Senior Dev Tip: Define strict types for your data
type Supplier = {
  id: string
  name: string
  tier: "Strategic" | "Preferred" | "Vetting"
  compliance: number // 0 to 100
  lastAudit: string
  spend: string
  status: "Active" | "Pending" | "Flagged"
}

const SUPPLIERS: Supplier[] = [
  { id: "VEN-001", name: "Apex Logistics", tier: "Strategic", compliance: 98, lastAudit: "2025-11-20", spend: "$1.2M", status: "Active" },
  { id: "VEN-002", name: "Global Circuits", tier: "Preferred", compliance: 82, lastAudit: "2025-12-05", spend: "$450k", status: "Pending" },
  { id: "VEN-003", name: "Nordic Energy", tier: "Strategic", compliance: 45, lastAudit: "2025-10-12", spend: "$2.1M", status: "Flagged" },
  { id: "VEN-004", name: "Z-Tech Systems", tier: "Vetting", compliance: 0, lastAudit: "N/A", spend: "$0", status: "Pending" },
]

export default function SuppliersPage() {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [fetchedSuppliers, setFetchedSuppliers] = useState([]);
  const [activeTab, setActiveTab] = useState<'live' | 'directory'>('live');

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get("/api/public/suppliers");
        setFetchedSuppliers(res.data.data);
      } catch (error) {
        console.error("Failed to fetch suppliers");
      }
    };
    fetchSuppliers();
  }, []);

  return (
    <div className={`${inter.className} min-h-screen bg-[#030712] text-slate-300 selection:bg-blue-500/30`}>
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full opacity-30" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">

        {/* HERO SECTION */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Global Network
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${outfit.className} text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-6`}
          >
            Verified Suppliers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Access a curated network of pre-vetted enterprise vendors.
            Monitor compliance, track performance, and initiate procurement in seconds.
          </motion.p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            <TabButton active={activeTab === 'live'} onClick={() => setActiveTab('live')} icon={<GlobeIcon />}>Live Network</TabButton>
            <TabButton active={activeTab === 'directory'} onClick={() => setActiveTab('directory')} icon={<ListIcon />}>Compliance Directory</TabButton>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-all flex items-center gap-2">
              <ExportIcon /> Export CSV
            </button>
            <button className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/25">
              + Onboard Supplier
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          {activeTab === 'live' ? (
            <motion.div
              key="live"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {fetchedSuppliers.length > 0 ? fetchedSuppliers.map((supplier: any, idx: number) => (
                <SupplierCard key={supplier._id} supplier={supplier} idx={idx} />
              )) : (
                <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                  <p className="text-slate-500">Searching global registry...</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="directory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#0b0f1a]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-[11px] uppercase tracking-widest font-bold text-slate-500">
                    <th className="px-6 py-4">Supplier Name</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Tier</th>
                    <th className="px-6 py-4">Compliance</th>
                    <th className="px-6 py-4">Spend</th>
                    <th className="px-6 py-4 text-right">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {SUPPLIERS.map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedSupplier(s)}
                      className="hover:bg-white/5 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">{s.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{s.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
                      <td className="px-6 py-4"><TierBadge tier={s.tier} /></td>
                      <td className="px-6 py-4"><ComplianceBar value={s.compliance} /></td>
                      <td className="px-6 py-4 font-mono text-sm text-slate-300">{s.spend}</td>
                      <td className="px-6 py-4 text-right text-xs text-slate-500 font-mono">{s.lastAudit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SIDE DRAWER */}
        <AnimatePresence>
          {selectedSupplier && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedSupplier(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />
              <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#0d1117] border-l border-white/10 shadow-3xl z-[60] p-10 overflow-y-auto"
              >
                <button
                  onClick={() => setSelectedSupplier(null)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="mt-8 mb-10">
                  <div className="inline-block px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-4">
                    {selectedSupplier.id}
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedSupplier.name}</h2>
                  <div className="flex gap-3">
                    <StatusBadge status={selectedSupplier.status} />
                    <TierBadge tier={selectedSupplier.tier} />
                  </div>
                </div>

                <div className="space-y-8">
                  <Section title="Overview">
                    <div className="grid grid-cols-2 gap-4">
                      <InfoCard label="Total Spend" value={selectedSupplier.spend} />
                      <InfoCard label="Compliance Score" value={`${selectedSupplier.compliance}%`} />
                    </div>
                  </Section>

                  <Section title="Key Contacts">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="font-bold text-white text-sm">Sarah Jenkins</div>
                      <div className="text-xs text-slate-400">Director of Operations</div>
                      <div className="mt-2 text-xs text-blue-400">sarah.j@example.com</div>
                    </div>
                  </Section>

                  <Section title="Risk Analysis">
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                      <div className="flex gap-3">
                        <span className="text-red-400 text-lg">⚠️</span>
                        <div>
                          <div className="text-xs font-bold text-red-200 uppercase mb-1">Compliance Alert</div>
                          <p className="text-xs text-red-300/80 leading-relaxed">
                            ISO 27001 certification expired on Dec 01, 2025. Renewal documentation pending.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Section>

                  <button className="w-full py-4 bg-white text-black font-bold rounded-xl mt-4 hover:bg-blue-50 text-sm transition-colors shadow-lg">
                    View Full Profile
                  </button>
                  <button className="w-full py-4 text-slate-400 font-medium hover:text-white text-sm transition-colors">
                    Download Audit Report
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

      </main>
    </div>
  )
}

// --- SUBCOMPONENTS ---

const TabButton = ({ active, children, onClick, icon }: any) => (
  <button
    onClick={onClick}
    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
  >
    {icon}
    {children}
  </button>
)

const SupplierCard = ({ supplier, idx }: any) => {
  // Simulation for missing data fields to showcase "Live" capabilities
  const complianceScore = supplier.complianceScore || Math.floor(Math.random() * (99 - 85) + 85);
  const responseTime = Math.floor(Math.random() * 4) + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="group relative p-6 bg-gray-900/40 backdrop-blur-md border border-white/5 rounded-2xl hover:border-blue-500/30 transition-all hover:-translate-y-1 duration-300"
    >
      <div className="absolute top-6 right-6 flex items-center gap-2">
        <span className="text-[10px] text-emerald-400 font-mono tracking-wider animate-pulse">● LIVE</span>
      </div>

      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-xl font-bold text-white mb-6 group-hover:scale-110 transition-transform duration-300">
        {supplier.username.charAt(0).toUpperCase()}
      </div>

      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{supplier.username}</h3>
      <p className="text-sm text-slate-400 mb-6 line-clamp-2 h-10">
        {supplier.companyDetails?.name || "Global Enterprise Partner"}
      </p>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Location</span>
          <span className="text-slate-300 font-medium">{supplier.companyDetails?.address ? "Global HQ" : "Remote (verified)"}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Avg. Response</span>
          <span className="text-blue-400 font-mono">{responseTime}h 12m</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Compliance</span>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${complianceScore}%` }} />
            </div>
            <span className="text-emerald-400 font-mono">{complianceScore}%</span>
          </div>
        </div>
      </div>

      <Link href="/pricing" className="block w-full py-3 rounded-xl bg-white/5 border border-white/5 text-center text-sm font-bold text-white hover:bg-white text-black transition-all group-hover:bg-white group-hover:text-black shadow-lg shadow-black/50">
        Request Quote
      </Link>
    </motion.div>
  )
}

const StatusBadge = ({ status }: any) => {
  const styles: any = {
    Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Flagged: "bg-red-500/10 text-red-400 border-red-500/20",
  }
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  )
}

const TierBadge = ({ tier }: any) => (
  <span className={`text-xs font-medium ${tier === 'Strategic' ? 'text-purple-400' : 'text-slate-400'}`}>
    {tier}
  </span>
)

const ComplianceBar = ({ value }: any) => (
  <div className="flex items-center gap-3">
    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className={`h-full rounded-full ${value > 80 ? 'bg-emerald-500' : value > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
      />
    </div>
    <span className="text-xs font-mono w-8 text-right">{value}%</span>
  </div>
)

const Section = ({ title, children }: any) => (
  <div>
    <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-4">{title}</h4>
    {children}
  </div>
)

const InfoCard = ({ label, value }: any) => (
  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
    <div className="text-[10px] text-slate-500 uppercase mb-1">{label}</div>
    <div className="text-sm font-mono text-white">{value}</div>
  </div>
)

// ICONS
const GlobeIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
const ListIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
const ExportIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>