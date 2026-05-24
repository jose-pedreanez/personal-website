"use client";

import { useEffect, useRef } from "react";

interface Packet {
  x: number;
  y: number;
  dx: number;
  dy: number;
  life: number;
  maxLife: number;
  opacity: number;
}

interface Node {
  x: number;
  y: number;
  pulse: number;
  pulseSpeed: number;
  active: boolean;
}

export default function TelemetryGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CELL = 70;
    const PACKET_SPEED = 0.6;
    let animId: number;
    let lastPacketTime = 0;
    const packets: Packet[] = [];
    const nodes: Node[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      nodes.length = 0;
      const cols = Math.ceil(canvas.width / CELL) + 1;
      const rows = Math.ceil(canvas.height / CELL) + 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (Math.random() < 0.15) {
            nodes.push({
              x: i * CELL,
              y: j * CELL,
              pulse: Math.random() * Math.PI * 2,
              pulseSpeed: 0.01 + Math.random() * 0.02,
              active: Math.random() < 0.4,
            });
          }
        }
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const addPacket = () => {
      const horiz = Math.random() > 0.5;
      const cols = Math.ceil(canvas.width / CELL);
      const rows = Math.ceil(canvas.height / CELL);
      const col = Math.floor(Math.random() * cols);
      const row = Math.floor(Math.random() * rows);
      const maxLife = horiz
        ? canvas.width / PACKET_SPEED
        : canvas.height / PACKET_SPEED;

      packets.push({
        x: horiz ? 0 : col * CELL,
        y: horiz ? row * CELL : 0,
        dx: horiz ? PACKET_SPEED : 0,
        dy: horiz ? 0 : PACKET_SPEED,
        life: 0,
        maxLife,
        opacity: 0,
      });
    };

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = "rgba(59,130,246,0.04)";
      ctx.lineWidth = 1;
      const cols = Math.ceil(canvas.width / CELL) + 1;
      const rows = Math.ceil(canvas.height / CELL) + 1;
      for (let i = 0; i < cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL, 0);
        ctx.lineTo(i * CELL, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j < rows; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * CELL);
        ctx.lineTo(canvas.width, j * CELL);
        ctx.stroke();
      }

      // Draw nodes
      for (const node of nodes) {
        node.pulse += node.pulseSpeed;
        const alpha = node.active
          ? 0.06 + Math.sin(node.pulse) * 0.04
          : 0.02 + Math.sin(node.pulse) * 0.01;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#3b82f6";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Spawn packets
      if (timestamp - lastPacketTime > 1200 && packets.length < 8) {
        addPacket();
        lastPacketTime = timestamp;
      }

      // Update and draw packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.x += p.dx;
        p.y += p.dy;
        p.life++;

        const progress = p.life / p.maxLife;
        if (progress < 0.08) p.opacity = progress / 0.08;
        else if (progress > 0.88) p.opacity = (1 - progress) / 0.12;
        else p.opacity = 1;

        if (p.life >= p.maxLife) {
          packets.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.opacity * 0.8;

        // Glow dot
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 5);
        grd.addColorStop(0, "rgba(96,165,250,1)");
        grd.addColorStop(1, "rgba(59,130,246,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Trail
        const tLen = 40;
        const tx = p.x - p.dx * tLen;
        const ty = p.y - p.dy * tLen;
        const trail = ctx.createLinearGradient(tx, ty, p.x, p.y);
        trail.addColorStop(0, "rgba(59,130,246,0)");
        trail.addColorStop(1, "rgba(59,130,246,0.35)");
        ctx.strokeStyle = trail;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.65 }}
    />
  );
}
