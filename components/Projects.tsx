"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import {
  ChevronDown,
  ExternalLink,
  Plane,
  Server,
  Terminal,
  Activity,
  Shield,
} from "lucide-react";
import ImageModal from "./ImageModal";

interface Project {
  id: string;
  icon: React.ReactNode;
  category: string;
  company: string;
  title: string;
  tagline: string;
  tags: string[];
  problem: string;
  constraints: string[];
  architecture: string;
  tech: string[];
  decisions: string;
  challenges: string;
  outcome: string;
  role: string;
  githubUrl?: string;
  images?: { src: string; alt: string; caption?: string }[];
}

const projects: Project[] = [
  {
    id: "aerodesign",
    icon: <Plane size={18} />,
    category: "Engineering Project · University of Calgary",
    company: "Schulich AeroDesign",
    title: "25 kg Remote-Controlled Airplane — SAE Aero Design West",
    tagline:
      "Designed, built, and flew a 25 kg RC aircraft with a 3-meter wingspan for SAE Aero Design West Competition, validated through wind tunnel testing and FEA.",
    tags: ["SolidWorks", "ANSYS FEA", "Aerodynamics", "Wind tunnel", "Manufacturing"],
    problem:
      "The Schulich AeroDesign team needed to design and manufacture a competition-spec RC aircraft capable of carrying maximum payload while meeting strict weight, structural, and flight performance requirements for the SAE Aero Design West Competition.",
    constraints: [
      "Competition rules defined strict weight, wingspan, and structural requirements",
      "Aircraft had to be manufacturable by the student team with available equipment",
      "Propeller selection had to be validated against motor specs and expected flight speed",
      "Structural integrity had to be proven analytically before physical testing",
    ],
    architecture:
      "Full design cycle from conceptual layout through detailed CAD, analysis, manufacturing, and flight testing. Custom NACA0009 airfoil profile selected and modeled in SolidWorks. Structural analysis performed in ANSYS finite element analysis to validate load-bearing components under flight loads. Propeller candidates evaluated analytically against Rimfire 1.20 motor specs, then validated in a wind tunnel for real-world lift/drag confirmation.",
    tech: [
      "SolidWorks",
      "ANSYS FEA",
      "NACA0009 airfoil",
      "Wind tunnel testing",
      "3D printing (prototyping)",
      "Manufacturing / assembly",
      "Empirical aerodynamics",
    ],
    decisions:
      "Selected the 18\"×6 propeller after wind tunnel testing confirmed it produced optimal thrust at 40 ft/s flight speed — analytical selection alone wasn't sufficient, physical validation was needed to account for real-world flow effects. FEA was used to identify stress concentrations early and drive material removal in non-critical areas to hit weight targets.",
    challenges:
      "Balancing structural requirements with weight targets required iterative design cycles. Wind tunnel testing revealed that initial propeller candidates underperformed their analytical predictions — required running multiple candidates through the tunnel to find the right match for this aircraft configuration.",
    outcome:
      "Designed, built, and successfully flew the aircraft in SAE Aero Design West competition. The team handled propeller design in 2018 and full manufacturing/assembly lead in 2022.",
    role:
      "Propeller design and selection in 2018; led full manufacturing and assembly in 2022.",
    images: [
      {
        src: "/images/aero_design/1648013431250.jpg",
        alt: "Jose Pedreanez with the RC aircraft at SAE Aero Design West",
        caption: "SAE Aero Design West competition",
      },
      {
        src: "/images/aero_design/1648010656082.jpg",
        alt: "ANSYS FEA total deformation analysis of the wing",
        caption: "ANSYS static structural — wing deformation analysis",
      },
    ],
  },
  {
    id: "homelab-infra",
    icon: <Server size={18} />,
    category: "Personal Project · Self-Hosted",
    company: "Personal Project",
    title: "Home Lab — Proxmox Virtualization Platform",
    tagline:
      "Self-hosted hypervisor environment running Ubuntu VMs and LXC containers for personal service hosting, infrastructure experimentation, and development workflows.",
    tags: ["Proxmox", "Ubuntu", "LXC", "Virtualization", "Linux"],
    problem:
      "Needed a flexible local platform to host personal services, experiment with deployment patterns, and run workloads without paying for cloud compute or being constrained by managed hosting limitations.",
    constraints: [
      "Consumer hardware — power draw and thermal limits mattered",
      "Single operator — had to stay manageable without a team",
      "Workloads needed isolation so one failing service couldn't take down others",
    ],
    architecture:
      "Proxmox VE runs as the bare-metal hypervisor. Compute workloads run inside Ubuntu Server VMs for full OS isolation; lightweight utility services (DNS, small APIs) run in LXC containers to minimize overhead. Snapshots before any major change mean rollbacks are fast. VMs are provisioned with cloud-init templates to avoid manual setup repetition.",
    tech: ["Proxmox VE", "Ubuntu Server", "LXC containers", "Cloud-init", "KVM", "PowerShell"],
    decisions:
      "Proxmox over plain Docker on bare metal because VM-level isolation means a broken experiment can't corrupt the host. LXC containers reserved for stateless or low-risk services where the overhead of a full VM isn't justified. Snapshots are taken before any invasive change — learned this after a misconfigured network stack took down a VM and recovery from scratch was slow.",
    challenges:
      "Resource contention between VMs required tuning CPU pinning and memory ballooning. Initial network bridge configuration on Proxmox had a subtle MTU mismatch that caused intermittent packet loss — diagnosed with ping flood tests and fixed in the bridge config.",
    outcome:
      "Stable platform that has been running continuously for personal service hosting and development. Acts as a production-style sandbox where deployment patterns, networking configs, and service architectures can be tested before applying them at work.",
    role: "Sole architect, builder, and operator.",
  },
  {
    id: "homelab-rs232",
    icon: <Terminal size={18} />,
    category: "Personal Project · Hardware Integration",
    company: "Personal Project",
    title: "Browser-Based RS-232 Hardware Control Interface",
    tagline:
      "Python web app that translates browser button clicks into RS-232 serial commands via TCP — controlling physical hardware from any device on the LAN.",
    tags: ["Python", "TCP/IP", "RS-232", "Web UI", "IP-to-Serial"],
    problem:
      "Had physical hardware (audio/AV devices) that only accepted RS-232 serial commands. Wanted to control them from a browser on any LAN device rather than needing a laptop physically connected via serial cable.",
    constraints: [
      "Target hardware only spoke RS-232 — no USB, no network interface",
      "Control needed to work from any device on the LAN, not just one machine",
      "Needed to understand the device's serial command protocol with limited documentation",
    ],
    architecture:
      "Python backend hosted on Ubuntu (inside Proxmox) exposes a simple web UI with control buttons. On button press, the server sends a TCP packet to an IP-to-serial converter on the LAN. The converter translates TCP payload to RS-232 and forwards it to the target hardware. Full chain: Browser → Python web app → TCP → IP-to-serial adapter → RS-232 device. Also built a companion telnet relay service for devices that accept telnet strings directly.",
    tech: ["Python", "TCP sockets", "RS-232", "IP-to-serial adapter", "Telnet", "Ubuntu"],
    decisions:
      "Web UI over a CLI tool so control works from phones and tablets without any client install. TCP to the IP-to-serial adapter rather than direct serial from the server so the server and hardware don't need to be physically co-located. Built the telnet relay as a separate lightweight service so it could be reused for other network-controlled equipment.",
    challenges:
      "The serial command protocol had gaps in documentation — had to observe responses with a serial monitor to reverse-engineer the correct framing and timing. The IP-to-serial adapter had its own quirks around TCP session handling; sending commands too fast caused dropped bytes that silently failed. Added per-command delays and response validation to make it reliable.",
    outcome:
      "Working browser-based control interface for RS-232 hardware accessible from any device on the home network. Reusable pattern for network-bridging any RS-232 or telnet-controlled equipment.",
    role: "Sole author — protocol research, backend, UI, and hardware integration.",
  },
  {
    id: "homelab-dashboard",
    icon: <Activity size={18} />,
    category: "Personal Project · Data",
    company: "Personal Project",
    title: "Self-Hosted Real-Time Data Dashboard",
    tagline:
      "Locally hosted dashboard backed by SQL Server, pulling live stock data and serving near real-time visualizations with no external cloud dependency.",
    tags: ["SQL Server", "React", "Next.js", "Supabase", "Azure Logic Apps"],
    problem:
      "Wanted a live data dashboard that updated in near real-time from a local database — without paying for cloud BI tools or being limited by their refresh rate constraints.",
    constraints: [
      "All data storage and serving had to be self-hosted on the home lab",
      "Dashboard had to update near real-time, not on a slow scheduled refresh",
      "Data ingestion pipeline had to run automatically without manual triggering",
    ],
    architecture:
      "A dedicated Proxmox VM runs Microsoft SQL Server as the data store. An ingestion pipeline collects stock data and writes it into SQL Server on a schedule — automated via Azure Logic Apps and Power Automate for orchestration. A second VM/container serves a React/Next.js frontend that queries the database and renders live-updating charts. Supabase explored as an alternative backend layer for realtime subscriptions.",
    tech: ["Microsoft SQL Server", "React", "Next.js", "Azure Logic Apps", "Power Automate", "Supabase", "DAX"],
    decisions:
      "SQL Server chosen because I already had experience with it from Intact and wanted a local instance to experiment with without cost. Azure Logic Apps for ingestion orchestration because it handles scheduling and retry logic without me managing a cron job. Evaluated Supabase as a lighter alternative — useful for its realtime WebSocket subscriptions but adds an external dependency.",
    challenges:
      "Getting sub-minute refresh rates without hammering the database required thinking carefully about polling vs. push-based updates. SQL Server on a VM needed tuned memory limits so it didn't starve other VMs on the host.",
    outcome:
      "Self-hosted dashboard running on the home lab with near real-time data updates from a locally managed SQL Server instance. Full control over data, refresh rate, and visualization — no SaaS subscription required.",
    role: "Sole author — data pipeline, database setup, and frontend.",
  },
  {
    id: "homelab-pihole",
    icon: <Shield size={18} />,
    category: "Personal Project · Networking",
    company: "Personal Project",
    title: "Pi-hole LAN DNS & Network Visibility",
    tagline:
      "Network-wide DNS filtering and ad blocking via Pi-hole running in an LXC container, giving full visibility and control over LAN traffic across all devices.",
    tags: ["Pi-hole", "DNS", "Networking", "LXC", "LAN"],
    problem:
      "Home network had no visibility into DNS traffic, no ad/tracker blocking at the network level, and every device managed its own DNS independently — no central control point.",
    constraints: [
      "Had to handle DNS for all LAN devices without requiring per-device config changes",
      "Needed to stay online reliably — DNS downtime breaks every device on the network",
      "Low resource footprint so it didn't consume meaningful VM resources",
    ],
    architecture:
      "Pi-hole runs in a lightweight LXC container on Proxmox. Router DHCP is configured to hand out the Pi-hole container's IP as the primary DNS server for the entire LAN — no per-device changes needed. Pi-hole intercepts DNS queries, blocks known ad/tracker domains at the DNS level, and forwards clean queries upstream. Query logs give per-device visibility into all DNS traffic on the network.",
    tech: ["Pi-hole", "LXC", "DNS", "DHCP", "Proxmox networking", "LAN administration"],
    decisions:
      "LXC container over a full VM because Pi-hole's resource needs are minimal and I wanted it always running even when heavier VMs are paused. Router-level DHCP DNS override means all devices get filtering automatically — no client config required. Set a secondary upstream DNS fallback so if the Pi-hole container ever goes down, devices degrade gracefully rather than losing DNS entirely.",
    challenges:
      "Some smart home devices hard-coded their own DNS servers (common with IoT) and bypassed Pi-hole entirely — required firewall rules to intercept and redirect DNS queries from those devices. Initial blocklist tuning blocked a few legitimate services that had to be whitelisted.",
    outcome:
      "Network-wide ad and tracker blocking across all LAN devices with zero per-device configuration. Full DNS query logging provides visibility into what every device on the network is connecting to.",
    role: "Sole setup and operator.",
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [modalImg, setModalImg] = useState<{ src: string; alt: string } | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <>
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
      className="border border-[#1e1e1e] rounded-xl overflow-hidden bg-[#0f0f0f] hover:border-[#2a2a2a] transition-colors"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-4 sm:p-6 flex items-start justify-between gap-3 sm:gap-4 group"
      >
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="flex-shrink-0 w-9 h-9 rounded-lg border border-[#2a2a2a] bg-[#111111] flex items-center justify-center text-[#3b82f6]">
            {project.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-[#555555] uppercase tracking-wider">
                {project.category}
              </span>
            </div>
            <h3 className="text-base font-semibold text-[#e8e8e8] mb-2 group-hover:text-white transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-[#666666] leading-relaxed">
              {project.tagline}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs px-2 py-0.5 rounded border border-[#1e1e1e] text-[#555555] bg-[#111111]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 mt-1">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded border border-[#2a2a2a] text-[#555555] hover:text-[#e8e8e8] hover:border-[#3b82f6]/40 transition-all"
              title="View on GitHub"
            >
              <ExternalLink size={13} />
            </a>
          )}
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-[#444444] group-hover:text-[#666666] transition-colors"
          >
            <ChevronDown size={18} />
          </motion.div>
        </div>
      </button>

      {/* Expanded case study */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div>
                  <h4 className="font-mono text-xs text-[#3b82f6] uppercase tracking-wider mb-3">
                    Problem
                  </h4>
                  <p className="text-sm text-[#888888] leading-relaxed">
                    {project.problem}
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-xs text-[#3b82f6] uppercase tracking-wider mb-3">
                    Constraints
                  </h4>
                  <ul className="space-y-1.5">
                    {project.constraints.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-sm text-[#888888]">
                        <span className="text-[#3b82f6] mt-0.5 flex-shrink-0">—</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:col-span-2">
                  <h4 className="font-mono text-xs text-[#3b82f6] uppercase tracking-wider mb-3">
                    Architecture / Approach
                  </h4>
                  <p className="text-sm text-[#888888] leading-relaxed">
                    {project.architecture}
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-xs text-[#3b82f6] uppercase tracking-wider mb-3">
                    Engineering Decisions
                  </h4>
                  <p className="text-sm text-[#888888] leading-relaxed">
                    {project.decisions}
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-xs text-[#3b82f6] uppercase tracking-wider mb-3">
                    Challenges
                  </h4>
                  <p className="text-sm text-[#888888] leading-relaxed">
                    {project.challenges}
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-xs text-[#3b82f6] uppercase tracking-wider mb-3">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-xs px-2 py-1 rounded bg-[#1a1a1a] border border-[#242424] text-[#666666]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-mono text-xs text-[#3b82f6] uppercase tracking-wider mb-3">
                    Outcome
                  </h4>
                  <p className="text-sm text-[#888888] leading-relaxed">
                    {project.outcome}
                  </p>
                </div>

                <div className="md:col-span-2 pt-4 border-t border-[#1a1a1a]">
                  <h4 className="font-mono text-xs text-[#555555] uppercase tracking-wider mb-2">
                    My Role
                  </h4>
                  <p className="text-sm text-[#666666]">{project.role}</p>
                </div>

                {project.images && project.images.length > 0 && (
                  <div className="md:col-span-2 pt-4 border-t border-[#1a1a1a]">
                    <h4 className="font-mono text-xs text-[#3b82f6] uppercase tracking-wider mb-3">
                      Photos
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {project.images.map((img) => (
                        <div
                          key={img.src}
                          onClick={() => setModalImg({ src: img.src, alt: img.alt })}
                          className="relative rounded-lg overflow-hidden border border-[#1e1e1e] bg-[#111111] cursor-pointer"
                        >
                          <div className="relative h-40 sm:h-52">
                            <Image
                              src={img.src}
                              alt={img.alt}
                              fill
                              className="object-cover brightness-90 hover:brightness-100 transition-all duration-300"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                          {img.caption && (
                            <div className="px-3 py-2 border-t border-[#1e1e1e]">
                              <span className="font-mono text-xs text-[#555555]">{img.caption}</span>
                            </div>
                          )}
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

export default function Projects() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });

  return (
    <section id="projects" className="py-8 sm:py-12 px-3 sm:px-6 bg-transparent">
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
              02 — Projects
            </span>
            <div className="flex-1 h-px bg-[#1a1a1a]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#e8e8e8] mb-4 tracking-tight">
            Systems built for the real world.
          </h2>
          <p className="text-[#666666] max-w-xl leading-relaxed">
            Real projects from real deployments. Click any card to expand the
            full context — problem, approach, engineering decisions, and outcome.
          </p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <a
            href="https://github.com/videopro291"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#555555] hover:text-[#e8e8e8] transition-colors"
          >
            More on GitHub
            <ExternalLink size={13} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
