"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import ImageModal from "./ImageModal";
import { ChevronDown } from "lucide-react";

interface Role {
  title: string;
  company: string;
  companyUrl: string;
  logo?: string;
  period: string;
  type: string;
  location: string;
  description: string;
  highlights: string[];
  tech: string[];
  current?: boolean;
  photos?: { src: string; alt: string }[];
}

const roles: Role[] = [
  {
    title: "Test & Deployment Engineer",
    company: "BoxBot Inc",
    companyUrl: "https://www.boxbot.io",
    logo: "/images/experiences_logos/boxbot.webp",
    period: "Oct 2025 — Present",
    type: "Full-time",
    location: "Alameda, California 🇺🇸",
    current: true,
    description:
      "First engineering hire responsible for commissioning and deploying BoxBot's inaugural ASRS system to a live customer site, serving as primary test, deployment and field support engineer across the full stack from hardware to UI.",
    highlights: [
      "Led field commissioning of the company's first ASRS deployment, acting as a primary technical point-of-contact across hardware, software, and mechanical systems",
      "Established engineering standards for a team of 7 — defining GitHub branching strategy, merge-to-main rules, and a mandatory test-approval gate where PRs required my sign-off before merging, ensuring all changes were validated in hardware before reaching production.",
      "Redesigned HMI deployment from decentralized per-client git installs to a Dockerized Next.js instance hosted on the backend server, giving all HMI clients a single source of truth and making CI/CD viable for the first time.",
      "Implemented a git-hash broadcast service in the Docker container; all HMI clients auto-refresh on new deploys enabling fully remote updates to a live customer site with no on-site personnel required.",
      "Operated across the full hardware-to-UI stack on-site: modified TwinCAT PLC logic for customer-specific motion profiles and hardware changes, then propagated those changes through the Next.js HMI and deployed — no handoff required.",
    ],
    tech: [
      "Next.js",
      "Python",
      "TwinCAT",
      "Git",
      "SolidWorks",
      "Ubuntu Linux",
      "Hardware commissioning",
    ],
  },
  {
    title: "Field Service Engineer-in-Training",
    company: "Pan Pacific Pet",
    companyUrl: "https://www.panpacificpet.com",
    logo: "/images/experiences_logos/pan_pacific_pet.png",
    period: "Jul 2025 — Oct 2025",
    type: "Full-Time",
    location: "Calgary, Alberta 🇨🇦",
    description:
      "Led the operational handoff to decouple Pan Pacific Pet's live ASRS system from Attabotics ownership — keeping everything running with zero downtime while transferring full operational control.",
    highlights: [
      "Decoupled live ASRS system from Attabotics ownership with zero downtime during full operational transfer",
      "Built automated monitoring via MQTT subscription service through Azure Service App and Application Insights — eliminated manual monitoring and freed 50% of team manpower",
      "Migrated system GUI from external domain dependency to local authentication, removing external dependency risks",
      "Set up secure external operator access through network architecture changes and .NET application configuration",
    ],
    tech: [
      "Azure Service App",
      "Azure Application Insights",
      "Next.js",
      "Nutanix",
      "Hyper-V",
      "Network architecture",
      "Local auth migration",
      "ASRS operations",
    ],
  },
  {
    title: "Field Service Engineer-in-Training",
    company: "Attabotics",
    companyUrl: "https://www.attabotics.com",
    logo: "/images/experiences_logos/attabotics.jpg",
    period: "Apr 2023 — Jul 2025",
    type: "Full-time",
    location: "Calgary, Alberta 🇨🇦",
    description:
      "Hardware and software testing on an AS/RS robot fleet",
    highlights: [
      "Conducted hardware and software testing on a fleet of AS/RS robots; documented 30+ bugs and design improvements for engineering teams",
      "Led the Pickstation demo from initial CAD designs to live deployment at ProMat 2025 and achieved 99% uptime with strong stakeholder reception",
      "Authored Python script using pyserial and RS-232 to optimize robot charging sequences, reducing charging time by 40%",
      "Developed analytics reports to investigate 87% system uptime; identified bottlenecks and implemented solutions to reach 96% uptime",
    ],
    tech: [
      "Python",
      "Next.js",
      "RS-232",
      "SQL",
      "Siemens NX",
      "Kusto Query Language",
      "Azure Cloud Services",
      "DAX",
    ],
    photos: [
      { src: "/images/attabotics/promat_2025/A7404778.jpg", alt: "Jose Pedreanez at ProMat 2025" },
      { src: "/images/attabotics/promat_2025/A7404773.jpg", alt: "On-site at ProMat 2025" },
    ],
  },
  {
    title: "Data Analyst",
    company: "Intact Insurance",
    companyUrl: "https://www.intact.ca",
    logo: "/images/experiences_logos/intact.png",
    period: "May 2020 — Mar 2023",
    type: "Full-time",
    location: "Calgary, Alberta 🇨🇦",
    description:
      "Built business intelligence tooling for national sales operations, including a cross-regional Power BI dashboard and automated ETL pipelines.",
    highlights: [
      "Designed and deployed a Power BI dashboard integrating SQL Server, Excel, and CSV sources to unify sales data across Canada — with drill-down to regional and electoral district level",
      "Automated ETL processes for national and international BI reports using Visual Basic, reducing manual effort across the analytics team",
    ],
    tech: ["Power BI", "SQL Server", "Visual Basic", "Excel", "DAX", "ETL"],
  },
  {
    title: "Engineering Student",
    company: "CNOOC Petroleum",
    companyUrl: "https://www.cnoocpetroleum.ca",
    logo: "/images/experiences_logos/cnooc.png",
    period: "Jan 2021 — Feb 2022",
    type: "Co-op",
    location: "Fort McMurray, Alberta 🇨🇦",
    description:
      "Engineering co-op supporting equipment certification and compliance documentation on a SAGD oil sands site.",
    highlights: [
      "Supported equipment certification for a SAGD production site",
      "Authored regulatory compliance documentation and delivered technical reports for system modifications",
      "Conducted pump maintenance and on-site mechanical support",
    ],
    tech: [
      "Mechanical engineering",
      "Compliance documentation",
      "SAGD operations",
    ],
  },
];


function RoleCard({ role, index }: { role: Role; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [modalImg, setModalImg] = useState<{ src: string; alt: string } | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <>
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
      className="border border-[#1e1e1e] rounded-xl overflow-hidden bg-[#0f0f0f] hover:border-[#2a2a2a] transition-colors"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-4 sm:p-6 flex items-start gap-3 sm:gap-4 group"
      >
        {/* Logo */}
        <div className="flex-shrink-0 w-14 h-14 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
          <Image
            src={role.logo ?? "/favicon.svg"}
            alt={`${role.company} logo`}
            width={48}
            height={48}
            className="object-contain"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-[#555555] uppercase tracking-wider">
              {role.type} · {role.location}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-base font-semibold text-[#e8e8e8] group-hover:text-white transition-colors">
              {role.title}
            </h3>
            {role.current && (
              <div className="relative w-2 h-2 flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                <motion.div
                  animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="absolute inset-0 rounded-full bg-[#3b82f6]/50"
                />
              </div>
            )}
          </div>
          <a
            href={role.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-sm text-[#3b82f6] hover:text-[#60a5fa] hover:underline transition-colors"
          >
            {role.company}
          </a>
          <p className="text-sm text-[#666666] leading-relaxed mt-2">
            {role.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {role.tech.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs px-2 py-0.5 rounded border border-[#1e1e1e] text-[#555555] bg-[#111111]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Period + chevron */}
        <div className="flex-shrink-0 flex flex-col items-end gap-2 ml-1">
          <span
            className={`font-mono text-xs px-2 py-1 rounded border hidden sm:inline-block ${
              role.current
                ? "border-[#1e3a5f] bg-[#0d1f33] text-[#3b82f6]"
                : "border-[#1e1e1e] bg-[#111111] text-[#444444]"
            }`}
          >
            {role.period}
          </span>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-[#444444] group-hover:text-[#666666] transition-colors"
          >
            <ChevronDown size={18} />
          </motion.div>
        </div>
      </button>

      {/* Expanded highlights + photos */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-6 pb-6 sm:pb-8 pt-2 border-t border-[#1a1a1a]">
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-mono text-xs text-[#3b82f6] uppercase tracking-wider mb-3">
                    Highlights
                  </h4>
                  <ul className="space-y-2">
                    {role.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-[#888888]">
                        <span className="text-[#3b82f6] mt-0.5 flex-shrink-0">—</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                {role.photos && role.photos.length > 0 && (
                  <div className="pt-4 border-t border-[#1a1a1a]">
                    <h4 className="font-mono text-xs text-[#3b82f6] uppercase tracking-wider mb-3">
                      Photos
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {role.photos.map((photo) => (
                        <div
                          key={photo.src}
                          onClick={() => setModalImg({ src: photo.src, alt: photo.alt })}
                          className="relative h-40 sm:h-52 rounded-lg overflow-hidden border border-[#1e1e1e] cursor-pointer"
                        >
                          <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            className="object-cover brightness-90 hover:brightness-100 transition-all duration-300"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    {modalImg && (
      <ImageModal src={modalImg.src} alt={modalImg.alt} onClose={() => setModalImg(null)} />
    )}
    </>
  );
}

export default function Experience() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });

  return (
    <section id="experience" className="py-8 sm:py-12 px-3 sm:px-6 bg-transparent">
      <div className="max-w-6xl mx-auto rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a]/40 backdrop-blur-sm p-4 sm:p-8 lg:p-12">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-[#3b82f6] uppercase tracking-widest">
              03 — Experience
            </span>
            <div className="flex-1 h-px bg-[#1a1a1a]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#e8e8e8] mb-4 tracking-tight">
            From field to codebase.
          </h2>
          <p className="text-[#666666] max-w-xl leading-relaxed">
            A mechanical engineering foundation applied across ASRS systems,
            industrial robotics, data analytics, and field deployment — from
            Calgary to California.
          </p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {roles.map((role, i) => (
            <RoleCard key={`${role.company}-${role.title}`} role={role} index={i} />
          ))}

        </div>
      </div>
    </section>
  );
}
