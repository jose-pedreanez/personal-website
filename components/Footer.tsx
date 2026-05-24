"use client";

import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-transparent px-6 py-10">
      <div className="max-w-6xl mx-auto rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a]/40 backdrop-blur-sm px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded border border-[#3b82f6]/30 flex items-center justify-center bg-[#3b82f6]/5">
            <span className="font-mono text-[10px] text-[#3b82f6] font-bold">JP</span>
          </div>
          <span className="font-mono text-xs text-[#333333]">
            Jose Pedreanez — Robotics &amp; Systems Engineer
          </span>
        </div>

        <div className="flex items-center gap-5">
          <a
            href="https://github.com/videopro291"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#333333] hover:text-[#888888] transition-colors"
          >
            <Github size={16} />
          </a>
          <a
            href="https://www.linkedin.com/in/jose-pedreanez/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#333333] hover:text-[#888888] transition-colors"
          >
            <Linkedin size={16} />
          </a>
          <a
            href="mailto:j.pedreanez@gmail.com"
            className="text-[#333333] hover:text-[#888888] transition-colors"
          >
            <Mail size={16} />
          </a>
        </div>

        <span className="font-mono text-xs text-[#2a2a2a]">
          © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
