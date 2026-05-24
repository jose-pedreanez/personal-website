"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";

interface Article {
  title: string;
  excerpt: string;
  topic: string;
  readTime: string;
  date: string;
  slug: string;
  featured?: boolean;
}

const articles: Article[] = [
  {
    title: "When Software Meets the Shop Floor",
    excerpt:
      "Industrial environments don't forgive abstraction leaks. A web service can retry. A robot arm waiting for a command cannot. Here's what I've learned building software for systems that operate in the physical world.",
    topic: "Industrial Systems",
    readTime: "8 min",
    date: "Mar 2025",
    slug: "software-meets-shop-floor",
    featured: true,
  },
  {
    title: "Debugging Serial Communication: When the Bytes Lie",
    excerpt:
      "RS232 is a 50-year-old protocol. It still runs a surprising amount of production infrastructure. Notes on reverse-engineering undocumented hardware behavior, ground loops, and why you need a logic analyzer before you need a second cup of coffee.",
    topic: "Hardware Integration",
    readTime: "10 min",
    date: "Jan 2025",
    slug: "debugging-serial-communication",
  },
  {
    title: "Self-Hosting as Engineering Practice",
    excerpt:
      "Running your own Proxmox cluster, Pi-hole, VPN, and dashboards teaches you things cloud services abstract away. It's not about saving money — it's about understanding what you're depending on.",
    topic: "Infrastructure",
    readTime: "6 min",
    date: "Nov 2024",
    slug: "self-hosting-engineering-practice",
  },
  {
    title: "The Operational Gap in Robotics Startups",
    excerpt:
      "Most robotics startups focus on hardware capabilities. But the operational layer — monitoring, alerting, incident response, fleet management — is what determines whether the system actually runs reliably in production.",
    topic: "Robotics Operations",
    readTime: "7 min",
    date: "Sep 2024",
    slug: "operational-gap-robotics-startups",
  },
];

function ArticleCard({ article, index }: { article: Article; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group cursor-pointer border border-[#1e1e1e] rounded-xl p-6 bg-[#0f0f0f] hover:border-[#2a2a2a] transition-all hover:bg-[#111111] ${
        article.featured ? "md:col-span-2" : ""
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-xs px-2 py-0.5 rounded border border-[#1e1e1e] text-[#3b82f6] bg-[#0d1f33]/50">
          {article.topic}
        </span>
        <div className="flex items-center gap-1 text-[#444444]">
          <Clock size={11} />
          <span className="font-mono text-xs">{article.readTime}</span>
        </div>
        <span className="font-mono text-xs text-[#333333]">{article.date}</span>
      </div>

      <h3
        className={`font-semibold text-[#e8e8e8] mb-3 group-hover:text-white transition-colors ${
          article.featured ? "text-xl" : "text-base"
        }`}
      >
        {article.title}
      </h3>

      <p
        className={`text-[#666666] leading-relaxed ${
          article.featured ? "text-sm max-w-2xl" : "text-sm"
        }`}
      >
        {article.excerpt}
      </p>

      <div className="flex items-center gap-1.5 mt-5 text-[#444444] group-hover:text-[#3b82f6] transition-colors">
        <span className="text-xs">Read article</span>
        <ArrowRight size={12} />
      </div>
    </motion.article>
  );
}

export default function Writing() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });

  return (
    <section id="writing" className="py-10 sm:py-14 px-6 bg-transparent">
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
              04 — Writing
            </span>
            <div className="flex-1 h-px bg-[#1a1a1a]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#e8e8e8] mb-4 tracking-tight">
            Thinking in public.
          </h2>
          <p className="text-[#666666] max-w-xl leading-relaxed">
            Notes on industrial software, infrastructure, robotics operations, and
            the engineering decisions that don&apos;t show up in documentation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {articles.map((article, i) => (
            <ArticleCard key={article.slug} article={article} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <span className="text-sm text-[#333333]">
            More articles coming soon.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
