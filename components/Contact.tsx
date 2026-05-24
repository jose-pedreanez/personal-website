"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Github, Linkedin, Send, CheckCircle, Download } from "lucide-react";
import QRCode from "react-qr-code";

const VCARD = `BEGIN:VCARD
VERSION:3.0
N:Pedreanez;Jose;;;
FN:Jose Pedreanez
TEL;TYPE=CELL:+13417583728
EMAIL:j.pedreanez@gmail.com
URL:https://www.linkedin.com/in/jose-pedreanez/
END:VCARD`;

function downloadVCard() {
  const blob = new Blob([VCARD], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "jose-pedreanez.vcf";
  a.click();
  URL.revokeObjectURL(url);
}

export default function Contact() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  const links = [
    {
      icon: <Mail size={16} />,
      label: "Email",
      value: "j.pedreanez@gmail.com",
      href: "mailto:j.pedreanez@gmail.com",
    },
    {
      icon: <Github size={16} />,
      label: "GitHub",
      value: "github.com/videopro291",
      href: "https://github.com/videopro291",
    },
    {
      icon: <Linkedin size={16} />,
      label: "LinkedIn",
      value: "linkedin.com/in/jose-pedreanez",
      href: "https://www.linkedin.com/in/jose-pedreanez/",
    },
  ];

  return (
    <section id="contact" className="py-10 sm:py-14 px-6 bg-transparent">
      <div className="max-w-6xl mx-auto rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a]/40 backdrop-blur-sm p-8 sm:p-12">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-[#3b82f6] uppercase tracking-widest">
              06 — Contact
            </span>
            <div className="flex-1 h-px bg-[#1a1a1a]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#e8e8e8] mb-4 tracking-tight">
            Let&apos;s build something.
          </h2>
          <p className="text-[#666666] max-w-xl leading-relaxed">
            Open to engineering roles in robotics, industrial automation,
            infrastructure, and systems software. Especially interested in
            companies building things that operate in the physical world.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="space-y-4"
          >
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border border-[#1e1e1e] bg-[#0f0f0f] hover:border-[#2a2a2a] hover:bg-[#111111] transition-all group"
              >
                <div className="w-9 h-9 rounded-lg border border-[#2a2a2a] bg-[#151515] flex items-center justify-center text-[#555555] group-hover:text-[#3b82f6] group-hover:border-[#3b82f6]/30 transition-all">
                  {link.icon}
                </div>
                <div>
                  <div className="text-xs text-[#444444] font-mono mb-0.5">
                    {link.label}
                  </div>
                  <div className="text-sm text-[#888888] group-hover:text-[#e8e8e8] transition-colors">
                    {link.value}
                  </div>
                </div>
              </a>
            ))}

            {/* QR Contact Card */}
            <div className="mt-4 rounded-xl border border-[#1e1e1e] bg-[#0f0f0f] p-4">
              <div className="font-mono text-xs text-[#3b82f6] uppercase tracking-wider mb-4">
                Contact Card
              </div>
              <div className="flex items-center gap-4">
                {/* QR code on white background so it scans correctly */}
                <div className="flex-shrink-0 bg-white p-2.5 rounded-lg">
                  <QRCode value={VCARD} size={96} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#e8e8e8] mb-0.5">
                    Jose Pedreanez
                  </div>
                  <div className="text-xs text-[#555555] mb-1">+1-341-758-3728</div>
                  <div className="text-xs text-[#555555] mb-4">j.pedreanez@gmail.com</div>
                  <p className="text-xs text-[#444444] mb-3 leading-relaxed">
                    Scan to save contact
                  </p>
                  <button
                    onClick={downloadVCard}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-[#2a2a2a] text-[#888888] hover:text-[#e8e8e8] hover:border-[#3b82f6]/40 transition-all font-mono"
                  >
                    <Download size={11} />
                    Download .vcf
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[#1a1a1a]">
              <p className="text-sm text-[#444444] leading-relaxed">
                Based in the{" "}
                <span className="text-[#666666]">San Francisco Bay Area.</span>
                <br />
                Open to remote roles and on-site opportunities.
              </p>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center gap-4">
                <div className="w-12 h-12 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <CheckCircle size={22} />
                </div>
                <div>
                  <div className="text-[#e8e8e8] font-medium mb-1">
                    Message received.
                  </div>
                  <div className="text-sm text-[#555555]">
                    I&apos;ll get back to you shortly.
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-[#444444] uppercase tracking-wider mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      className="w-full px-4 py-2.5 rounded-lg bg-[#0f0f0f] border border-[#1e1e1e] text-[#e8e8e8] text-sm placeholder-[#333333] focus:outline-none focus:border-[#3b82f6]/40 focus:ring-1 focus:ring-[#3b82f6]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-[#444444] uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-2.5 rounded-lg bg-[#0f0f0f] border border-[#1e1e1e] text-[#e8e8e8] text-sm placeholder-[#333333] focus:outline-none focus:border-[#3b82f6]/40 focus:ring-1 focus:ring-[#3b82f6]/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#444444] uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="What's this about?"
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0f0f0f] border border-[#1e1e1e] text-[#e8e8e8] text-sm placeholder-[#333333] focus:outline-none focus:border-[#3b82f6]/40 focus:ring-1 focus:ring-[#3b82f6]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#444444] uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell me about your project, role, or question..."
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0f0f0f] border border-[#1e1e1e] text-[#e8e8e8] text-sm placeholder-[#333333] focus:outline-none focus:border-[#3b82f6]/40 focus:ring-1 focus:ring-[#3b82f6]/20 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#3b82f6] hover:bg-[#2563eb] disabled:bg-[#1e3a5f] disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={14} />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
