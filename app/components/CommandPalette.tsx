"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

// Simulated Search Hook for a Senior Dev approach
export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()

  // Data to search through
  const items = useMemo(() => [
    { id: "1", name: "Apex Logistics", category: "Freight", path: "/suppliers?id=VEN-001" },
    { id: "2", name: "Nexus Chipsets", category: "Hardware", path: "/suppliers?id=VEN-002" },
    { id: "3", name: "Security Audit", category: "Compliance", path: "/security" },
    { id: "4", name: "Billing & Plans", category: "Settings", path: "/pricing" },
  ], [])

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase())
  )

  // Keyboard listener for Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={() => setIsOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[101] px-4"
          >
            <div className="bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center gap-3">
                <span className="text-slate-500">🔍</span>
                <input 
                  autoFocus
                  placeholder="Search suppliers, pages, or docs..." 
                  className="w-full bg-transparent text-white outline-none text-sm"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={() => setIsOpen(false)} className="text-[10px] text-slate-500 border border-white/10 px-1.5 py-0.5 rounded uppercase">Esc</button>
              </div>
              
              <div className="p-2 max-h-[350px] overflow-y-auto custom-scrollbar">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => { router.push(item.path); setIsOpen(false); }}
                      className="p-3 hover:bg-blue-600/10 rounded-xl cursor-pointer flex justify-between items-center group transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-200">{item.name}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">{item.category}</span>
                      </div>
                      <span className="text-[10px] font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">Go to Page ↵</span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500 text-sm">No results found.</div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}