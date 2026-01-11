"use client"

import Navbar from "@/app/components/Navbar"
import { useRouter } from "next/navigation"
import Link from "next/link"

const TIERS = [
    {
        name: "Free",
        price: "Free",
        desc: "Explore the platform with limited usage.",
        features: [
            "1 Active Tender",
            "Basic Vetting",
            "Email Support",
            "Basic Analytics"
        ],
        cta: "Get Started Free",
        highlight: false
    },
    {
        name: "Launch",
        price: "$99",
        desc: "For teams ready to run real procurement.",
        features: [
            "5 Active Tenders",
            "Basic Vetting",
            "Email Support",
            "Basic Analytics"
        ],
        cta: "Start 14-day Trial",
        highlight: true
    },
    {
        name: "Scale",
        price: "$499",
        desc: "For fast-growing procurement teams.",
        features: [
            "10 Active Tenders",
            "Standard Vetting",
            "Priority Email Support",
            "Advanced Analytics"
        ],
        cta: "Start 14-day Trial",
        highlight: false
    },
    {
        name: "Enterprise",
        price: "Custom",
        desc: "Global procurement with full control.",
        features: [
            "Unlimited Tenders",
            "Custom Vetting Logic",
            "24/7 Priority Support",
            "Full API Access",
            "SSO & SAML Authentication"
        ],
        cta: "Contact Sales",
        highlight: false
    }
];

export default function PricingPage() {
    const router = useRouter()
    const handleRegister = (tier: any) => {
        if (tier.name === "Enterprise") {
            router.push("/contact-sales")
            return
        }

        router.push(`/login?plan=${tier.name.toLowerCase()}`)
    }
    return (
        <div className="min-h-screen bg-[#030712] pt-30 pb-20 overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full" />

            <div className="max-w-350 mx-auto relative">
                <div className="text-center mb-20">
                    <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.4em] mb-4">Pricing</h2>
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">Simple, scalable value.</h1>
                </div>

                <div className="grid md:grid-cols-4 gap-5">
                    {TIERS.map((tier) => (
                        <div
                            key={tier.name}
                            className={`relative p-1 rounded-[2.5rem] transition-transform duration-500 ${tier.highlight
                                ? "bg-linear-to-br from-cyan-500/50 to-gray-300 scale-[1.06]"
                                : "bg-white/10 hover:scale-[1.02]"
                                }`}

                        >   {tier.highlight && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                <span className="px-4 py-1.5 rounded-full text-xs font-bold 
                                 bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                                    Most Popular
                                </span>
                            </div>
                        )}

                            <div className="bg-[#0b0f1a] rounded-[2.4rem] p-8 h-full flex flex-col">
                                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                                <p className="text-slate-400 text-sm mb-8">{tier.desc}</p>
                                <div className="mb-8">
                                    <span className="text-5xl font-bold text-white">{tier.price}</span>
                                    {tier.price !== "Custom" && <span className="text-slate-500 ml-2">/mo</span>}
                                </div>

                                <div className="space-y-4 mb-12 flex-1">
                                    {tier.features.map((f) => (
                                        <div key={f} className="flex items-center gap-3 text-sm text-slate-300">
                                            <span className="text-blue-500">✓</span> {f}
                                        </div>
                                    ))}
                                </div>

                                <button key={tier.name} onClick={() => handleRegister(tier)} className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 cursor-pointer ${tier.highlight
                                    ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-500"
                                    : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                                    }`}>
                                    {tier.cta}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ/Trust Footer */}
                <p className="text-center mt-16 text-slate-500 text-sm italic">
                    Need a custom agreement for your region? <Link href="/contact-sales" className="text-blue-500 cursor-pointer underline">Talk to our architecture team.</Link>
                </p>
            </div>
        </div>
    )
}