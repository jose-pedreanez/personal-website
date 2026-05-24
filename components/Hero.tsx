"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";
import ImageModal from "./ImageModal";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay },
  }),
};

export default function Hero() {
  const [modalImg, setModalImg] = useState<{ src: string; alt: string } | null>(null);
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
    <section className="relative min-h-screen flex flex-col justify-center overflow-x-hidden bg-transparent">

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-center">
          <div className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a]/40 backdrop-blur-sm px-6 py-6 lg:max-w-2xl lg:-mx-6">
            {/* Badge */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.05}
              className="inline-flex items-center gap-2 mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#3b82f6] animate-pulse" />
              <span className="font-mono text-xs text-[#3b82f6] tracking-widest uppercase">
                Robotics &amp; Systems Engineer · Bay Area
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.15}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-[#e8e8e8] mb-6"
            >
              Jose Pedreanez
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.35}
              className="text-lg text-[#888888] leading-relaxed mb-10 max-w-xl"
            >
              I work on robotics and industrial automation. My work tends to span the full stack: hardware
              integration, control software, the tooling that monitors it, and the
              interface watching it run.
            </motion.p>

            {/* CTA */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.45}
              className="flex flex-wrap gap-3"
            >
              <button
                onClick={() => scrollTo("projects")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3b82f6] text-white rounded text-sm font-medium hover:bg-[#2563eb] transition-colors"
              >
                View Projects
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => scrollTo("experience")}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#2a2a2a] text-[#e8e8e8] rounded text-sm font-medium hover:border-[#3b82f6]/40 hover:bg-[#3b82f6]/5 transition-all"
              >
                Experience
              </button>
              <button
                onClick={() => scrollTo("contact")}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#2a2a2a] text-[#888888] rounded text-sm font-medium hover:border-[#2a2a2a] hover:text-[#e8e8e8] transition-all"
              >
                Contact
              </button>
            </motion.div>

            {/* Social links */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.55}
              className="flex items-center gap-5 mt-10 pt-8 border-t border-[#1a1a1a]"
            >
              <a
                href="https://github.com/videopro291"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#555555] hover:text-[#e8e8e8] transition-colors text-sm"
              >
                <Github size={16} />
                <span className="hidden sm:block">GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/jose-pedreanez/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#555555] hover:text-[#e8e8e8] transition-colors text-sm"
              >
                <Linkedin size={16} />
                <span className="hidden sm:block">LinkedIn</span>
              </a>
              <a
                href="mailto:j.pedreanez@gmail.com"
                className="flex items-center gap-2 text-[#555555] hover:text-[#e8e8e8] transition-colors text-sm"
              >
                <Mail size={16} />
                <span className="hidden sm:block">Email</span>
              </a>
            </motion.div>

            {/* Photo — mobile only, below all text */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.65}
              className="lg:hidden mt-8"
            >
              <div
                className="relative w-full h-72 cursor-pointer"
                onClick={() => setModalImg({ src: "/images/personal/Image (12).png", alt: "Jose Pedreanez" })}
              >
                <div className="absolute inset-0 rounded-2xl border border-[#1e1e1e] overflow-hidden">
                  <Image
                    src="/images/personal/Image (12).png"
                    alt="Jose Pedreanez"
                    fill
                    className="object-cover brightness-95"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-[#3b82f6]/50 rounded-tr-lg" />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-[#3b82f6]/50 rounded-bl-lg" />
              </div>
            </motion.div>
          </div>

          {/* Profile image — desktop only */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="hidden lg:block"
          >
            <div
              className="relative w-80 h-[26rem] cursor-pointer"
              onClick={() => setModalImg({ src: "/images/personal/Image (12).png", alt: "Jose Pedreanez" })}
            >
              <div className="absolute inset-0 rounded-2xl border border-[#1e1e1e] overflow-hidden">
                <Image
                  src="/images/personal/Image (12).png"
                  alt="Jose Pedreanez"
                  fill
                  className="object-cover brightness-95"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-[#3b82f6]/50 rounded-tr-lg" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-[#3b82f6]/50 rounded-bl-lg" />
            </div>
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.65}
          className="mt-20 -mx-6 grid grid-cols-2 sm:grid-cols-4 gap-8 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a]/40 backdrop-blur-sm p-6"
        >
          {[
            { label: "Years in Industry", value: "5+" },
            { label: "ASRS Systems", value: "9" },
            { label: "System Uptime", value: "99%" },
            { label: "Charging Time Cut", value: "40%" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-semibold text-[#e8e8e8] mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-[#555555] uppercase tracking-wider font-mono">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-xs text-[#333333] tracking-widest uppercase">
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-[#333333] to-transparent"
        />
      </motion.div>
    </section>
    {modalImg && (
      <ImageModal src={modalImg.src} alt={modalImg.alt} onClose={() => setModalImg(null)} />
    )}
    </>
  );
}
