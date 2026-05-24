"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

interface Degree {
  institution: string;
  institutionUrl: string;
  logo: string;
  degree: string;
  field: string;
  school: string;
  location: string;
  period: string;
  highlights: string[];
}

const degrees: Degree[] = [
  {
    institution: "University of Calgary",
    institutionUrl: "https://www.ucalgary.ca",
    logo: "/images/experiences_logos/u_of_c.png",
    degree: "B.Sc.",
    field: "Mechanical Engineering",
    school: "Schulich School of Engineering",
    location: "Calgary, Alberta 🇨🇦",
    period: "2016 — 2022",
    highlights: [
      "Minor in Petroleum Engineering",
      "Minor in Geophysics",
      "Coursework in machine component design, finite element analysis, fluid mechanics, control systems, and manufacturing processes",
    ],
  },
];

function DegreeCard({ degree, index }: { degree: Degree; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
      className="border border-[#1e1e1e] rounded-xl bg-[#0f0f0f] p-4 sm:p-6"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Logo */}
        <div className="flex-shrink-0 w-14 h-14 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
          <Image
            src={degree.logo}
            alt={`${degree.institution} logo`}
            width={48}
            height={48}
            className="object-contain"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-[#555555] uppercase tracking-wider">
                  {degree.degree} · {degree.school} · {degree.location}
                </span>
              </div>
              <h3 className="text-base font-semibold text-[#e8e8e8] mb-0.5">
                {degree.field}
              </h3>
              <a
                href={degree.institutionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#3b82f6] hover:text-[#60a5fa] hover:underline transition-colors"
              >
                {degree.institution}
              </a>
            </div>
            <span className="font-mono text-xs px-2 py-1 rounded border border-[#1e1e1e] bg-[#111111] text-[#444444] flex-shrink-0 hidden sm:inline-block">
              {degree.period}
            </span>
          </div>

          {degree.highlights.length > 0 && (
            <ul className="mt-4 space-y-2">
              {degree.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-[#888888]">
                  <span className="text-[#3b82f6] mt-0.5 flex-shrink-0">—</span>
                  {h}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Education() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });

  return (
    <section id="education" className="py-8 sm:py-12 px-3 sm:px-6 bg-transparent">
      <div className="max-w-6xl mx-auto rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a]/40 backdrop-blur-sm p-4 sm:p-8 lg:p-12">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-[#3b82f6] uppercase tracking-widest">
              04 — Education
            </span>
            <div className="flex-1 h-px bg-[#1a1a1a]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#e8e8e8] mb-4 tracking-tight">
            Where it started.
          </h2>
          <p className="text-[#666666] max-w-xl leading-relaxed">
            A mechanical engineering degree that laid the foundation — from
            thermofluids and FEA to hands-on manufacturing and competition aircraft.
          </p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {degrees.map((degree, i) => (
            <DegreeCard key={degree.institution} degree={degree} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
