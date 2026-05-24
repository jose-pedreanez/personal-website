"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const meta = [
  { label: "Based in", value: "San Francisco, CA" },
  { label: "Degree", value: "B.Sc. Mech. Eng." },
  { label: "Domain", value: "Robotics" },
  { label: "Status", value: "Available" },
];

const skills: Record<string, string[]> = {
  "CAD & Design": ["SolidWorks", "Siemens NX", "GD&T"],
  Languages: ["Python", "SQL", "Next.js", "Bash", "PowerShell", "MATLAB"],
  "IT & DevOps": ["Ubuntu Linux", "Proxmox", "Git", "Docker"],
  "Communication Protocols": ["gRPC", "RS-232", "TCP/UDP", "SSH", "Telnet"],
  "Hands-On": ["3D printing", "Soldering", "Lathe & mill", "Mechanical assembly"],
};

const photos = [
  { src: "/images/personal/Image (12).png", alt: "Jose Pedreanez" },
  { src: "/images/personal/profile2.jpg",   alt: "Jose Pedreanez" },
];

export default function PhotoStrip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="py-10 sm:py-14 px-6 bg-transparent">
      <div className="max-w-6xl mx-auto" ref={ref}>

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-10"
        >
          <span className="font-mono text-xs text-[#3b82f6] uppercase tracking-widest">
            01 — About
          </span>
          <div className="flex-1 h-px bg-[#1a1a1a]" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8">

          {/* ── Left: headline → skills → metadata ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#e8e8e8] tracking-tight leading-snug">
              Own the entire stack — from hardware to software, from ideation to deployment.
            </h2>

            {/* Skills */}
            <div className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a]/40 backdrop-blur-sm p-6 space-y-5">
              {Object.entries(skills).map(([category, items]) => (
                <div key={category}>
                  <h4 className="font-mono text-xs text-[#3b82f6] uppercase tracking-wider mb-2.5">
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="text-xs px-2 py-1 rounded border border-[#1e1e1e] bg-[#0f0f0f] text-[#666666]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-3">
              {meta.map((item) => (
                <div
                  key={item.label}
                  className="border border-[#1a1a1a] rounded-lg p-3 bg-[#0a0a0a]/60"
                >
                  <div className="font-mono text-xs text-[#444444] uppercase tracking-wider mb-1">
                    {item.label}
                  </div>
                  <div className="text-sm text-[#888888]">{item.value}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: 2×3 photo grid ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 grid-rows-3 gap-3 lg:h-full"
          >
            {[...photos, ...photos, ...photos].map((photo, i) => (
              <div
                key={i}
                className="relative h-40 lg:h-full rounded-xl overflow-hidden border border-[#1a1a1a]"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover brightness-90"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
