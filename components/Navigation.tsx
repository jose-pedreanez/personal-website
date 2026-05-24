"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ResumeButton from "./ResumeButton";

const links = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Writing", href: "#writing" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1e1e1e]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 group"
          >
            <div className="w-7 h-7 rounded border border-[#3b82f6]/40 flex items-center justify-center bg-[#3b82f6]/5 group-hover:border-[#3b82f6]/70 transition-colors">
              <span className="font-mono text-xs text-[#3b82f6] font-bold">JP</span>
            </div>
            <span className="text-sm font-medium text-[#e8e8e8] tracking-tight hidden sm:block">
              Jose Pedreanez
            </span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => handleNav(l.href)}
                className="text-sm text-[#888888] hover:text-[#e8e8e8] transition-colors"
              >
                {l.label}
              </button>
            ))}
            <ResumeButton className="text-sm px-3 py-1.5 rounded border border-[#2a2a2a] text-[#e8e8e8] hover:border-[#3b82f6]/50 hover:bg-[#3b82f6]/5 transition-all">
              Resume
            </ResumeButton>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-[#888888] hover:text-[#e8e8e8] transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#0f0f0f] border-b border-[#1e1e1e] px-6 py-4 flex flex-col gap-4 md:hidden"
          >
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => handleNav(l.href)}
                className="text-left text-base text-[#888888] hover:text-[#e8e8e8] transition-colors py-1"
              >
                {l.label}
              </button>
            ))}
            <ResumeButton className="text-sm px-4 py-2 rounded border border-[#2a2a2a] text-[#e8e8e8] text-center hover:border-[#3b82f6]/50 transition-all w-full">
              Resume
            </ResumeButton>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
