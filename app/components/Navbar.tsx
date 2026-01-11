"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Kaushan_Script } from "next/font/google"

const kaushan = Kaushan_Script({ subsets: ["latin"], weight: ["400"] })

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    // Check if user is logged in by calling me API or checking for cookie existence (if not httpOnly)
    // Since token is httpOnly, we must fetch. But for navbar performance, maybe we assume logged out until confirmed?
    // Or we can rely on a lighter check?
    // Let's try fetching me silently.
    const checkAuth = async () => {
      try {
        // This might generate traffic on every page load. Ideally usage of Context or Middleware passing headers.
        // For MVP:
        await fetch("/api/auth/me").then(res => {
          if (res.ok) setIsLoggedIn(true);
        });
      } catch (e) { }
    }
    checkAuth();

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Platform", href: "/platform" },
    { name: "Suppliers", href: "/suppliers" },
    { name: "Pricing", href: "/pricing" },
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled
        ? "py-3 bg-[#030712]/80 backdrop-blur-md border-white/10 rounded-b-4xl"
        : "py-6 bg-transparent border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold group-hover:rotate-12 transition-transform">
            V
          </div>
          <span className={`${kaushan.className} text-2xl text-white tracking-wide`}>
            VendorSync
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 transition-all group-hover:w-full" />
            </Link>
          ))}
          {isLoggedIn && (
            <Link
              href="/dashboard"
              className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors relative group"
            >
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 transition-all group-hover:w-full" />
            </Link>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="hidden sm:block text-sm font-semibold text-white hover:text-blue-400 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-full transition-all shadow-lg shadow-blue-600/20 active:scale-95"
              >
                Join Free
              </Link>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm font-bold rounded-full transition-all"
            >
              My Account
            </Link>
          )}

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`h-0.5 w-full bg-current transform transition ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`h-0.5 w-full bg-current transition ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 w-full bg-current transform transition ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#030712] border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-slate-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-white/5 my-2" />
              <Link href="/login" className="text-lg font-medium text-blue-400">Log in</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}