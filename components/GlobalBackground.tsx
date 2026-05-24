"use client";

import { useEffect, useRef } from "react";

export default function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let scrollY = window.scrollY;
    let time = 0;
    let w = 0, h = 0;

    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 60 }, () => ({
      rx: Math.random(), ry: Math.random() * 0.5,
      r: Math.random() * 1.2 + 0.3,
      baseAlpha: Math.random() * 0.18 + 0.04,
      speed: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    // Vertical lift particles — travel up/down along rack columns
    // Each is pinned to a specific world X and Z offset, animates wy over time
    const lifts = Array.from({ length: 12 }, (_, i) => ({
      lane: (i % 5 - 2) * 2.0,         // world X, snapped to grid
      wz_off: 3 + (i % 6) * 3.5,       // fixed depth offset from camera
      speed: 0.3 + (i % 4) * 0.15,     // world units per second
      phase: (i / 12) * Math.PI * 2,   // stagger start positions
      maxH: 2.4 + (i % 3) * 0.4,       // max height reached
    }));

    // Horizontal floor totes — travel along z-axis on grid lines
    const totes = Array.from({ length: 5 }, (_, i) => ({
      lane: (i % 5 - 2) * 2.0,
      speed: 0.35 + (i % 3) * 0.2,
      phase: (i / 5) * 22,
    }));

    const draw = (ts: number) => {
      time = ts * 0.001;
      ctx.clearRect(0, 0, w, h);

      // Three independent cameras — the parallax
      const camFar  = scrollY * 0.006 + time * 0.02;
      const camMid  = scrollY * 0.025 + time * 0.08;
      const camNear = scrollY * 0.060 + time * 0.15;

      const CAMERA_H = 2.0;
      const FOCAL    = 1.05;
      const cx       = w / 2;
      const HY       = h * 0.50;
      const S        = h * 0.50;
      const NR       = 0.5;
      const FR       = 30;
      const GS       = 2.0;
      const GW       = 16;

      const makeProject = (camZ: number) =>
        (wx: number, wy: number, wz: number) => {
          const dz = wz - camZ;
          if (dz < 0.06) return null;
          return {
            x:    cx + (wx / dz) * FOCAL * S,
            y:    HY + ((CAMERA_H - wy) / dz) * FOCAL * S,
            fade: Math.max(0, 1 - dz / 28),
            dz,
          };
        };

      const pFar  = makeProject(camFar);
      const pMid  = makeProject(camMid);
      const pNear = makeProject(camNear);

      // ── FAR LAYER: Distant rack silhouettes ───────────────────────────
      const FAR_COLS = [-8, -4, 0, 4, 8];
      const FAR_ROWS = [3, 7, 11, 16, 21, 26];
      for (const rzo of FAR_ROWS) {
        const wz = camFar + NR + rzo;
        for (const col of FAR_COLS) {
          const base = pFar(col, 0, wz);
          const top  = pFar(col, 2.8, wz);
          if (!base || !top) continue;
          if (base.y < HY || base.y > h) continue;
          const a = base.fade * 0.12;
          if (a < 0.003) continue;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59,130,246,${a.toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(base.x, base.y);
          ctx.lineTo(top.x, top.y);
          ctx.stroke();
          for (const lvl of [0.65, 1.3, 2.0]) {
            const sL = pFar(col - 1.1, lvl, wz);
            const sR = pFar(col + 1.1, lvl, wz);
            if (!sL || !sR || sL.y < HY) continue;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59,130,246,${(a * 0.45).toFixed(3)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(sL.x, sL.y); ctx.lineTo(sR.x, sR.y); ctx.stroke();
          }
        }
      }

      // ── MID LAYER: Floor grid ─────────────────────────────────────────

      // Vertical (depth) floor lines
      for (let c = -GW; c <= GW; c++) {
        const wx = c * GS;
        const n = pMid(wx, 0, camMid + NR);
        const f = pMid(wx, 0, camMid + FR);
        if (!n || !f) continue;
        if (Math.max(n.x, f.x) < -60 || Math.min(n.x, f.x) > w + 60) continue;
        const isCenter = c === 0;
        const peakOp = isCenter ? 0.5 : Math.max(0.06, 0.28 * (1 - Math.abs(c) / GW));
        const gy0 = Math.max(0, Math.min(h, f.y));
        const gy1 = Math.max(0, Math.min(h, n.y));
        const g = ctx.createLinearGradient(0, gy0, 0, gy1);
        g.addColorStop(0, `rgba(59,130,246,${peakOp.toFixed(3)})`);
        g.addColorStop(1, "rgba(59,130,246,0)");
        const clamp = (x: number) => Math.max(-200, Math.min(w + 200, x));
        ctx.beginPath();
        ctx.strokeStyle = g;
        ctx.lineWidth = isCenter ? 2.25 : 1.5;
        ctx.moveTo(clamp(n.x), n.y); ctx.lineTo(clamp(f.x), f.y); ctx.stroke();
      }

      // Horizontal floor lines
      const firstZ = Math.ceil((camMid + NR) / GS) * GS;
      for (let wz = firstZ; wz < camMid + FR; wz += GS) {
        const l = pMid(-GW * GS, 0, wz);
        const r = pMid( GW * GS, 0, wz);
        if (!l || !r || l.y > h + 4 || l.y < HY) continue;
        const alpha = l.fade * 0.22;
        if (alpha < 0.005) continue;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(59,130,246,${alpha.toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.moveTo(Math.max(-200, l.x), l.y);
        ctx.lineTo(Math.min(w + 200, r.x), r.y);
        ctx.stroke();
      }

      // ── VERTICAL GRID LINES (up/down pillars at intersections) ───────
      // Every 2nd column × every 2nd row in depth gives a sparse 3D cage.
      // Lines run from floor (wy=0) up through the horizon into the sky.
      const VCOLS = [-6, -4, -2, 0, 2, 4, 6];
      const VROWS_OFF = [2, 4, 6, 8, 10, 12, 14];
      const V_TOP = 4.0; // world height — well above camera (2.0) so it crosses horizon

      for (const wz_off of VROWS_OFF) {
        const wz = camMid + NR + wz_off * GS * 0.7;
        for (const col of VCOLS) {
          const base = pMid(col, 0,     wz); // floor
          const top  = pMid(col, V_TOP, wz); // above horizon

          if (!base || !top) continue;
          // base.y is below horizon (in floor area), top.y is above horizon
          if (base.y > h) continue;

          const alpha = base.fade * 0.2;
          if (alpha < 0.004) continue;

          // Gradient: bright at floor level, fades toward sky
          const vg = ctx.createLinearGradient(0, base.y, 0, top.y);
          vg.addColorStop(0,   `rgba(59,130,246,${alpha.toFixed(3)})`);
          vg.addColorStop(0.45, `rgba(59,130,246,${(alpha * 0.5).toFixed(3)})`);
          vg.addColorStop(1,   "rgba(59,130,246,0)");

          ctx.beginPath();
          ctx.strokeStyle = vg;
          ctx.lineWidth = 1;
          ctx.moveTo(base.x, base.y);
          ctx.lineTo(top.x,  top.y);
          ctx.stroke();
        }
      }

      // Floor intersection nodes
      for (let c = -5; c <= 5; c += 2) {
        for (let row = 2; row <= 7; row++) {
          const wz = camMid + NR + row * GS * 1.4;
          const p = pMid(c * GS, 0, wz);
          if (!p || p.y < HY || p.y > h) continue;
          const pulse = 0.4 + 0.6 * Math.sin(time * 1.1 + c * 0.7 + row * 0.4);
          const a = p.fade * pulse * 0.35;
          if (a < 0.01) continue;
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 5);
          grd.addColorStop(0, `rgba(96,165,250,${a.toFixed(3)})`);
          grd.addColorStop(1, "rgba(59,130,246,0)");
          ctx.fillStyle = grd;
          ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2); ctx.fill();
        }
      }

      // ── LIFT PARTICLES — move up/down along vertical grid lines ──────
      // wy oscillates between 0 and maxH, snapped to the same column
      // positions as the vertical lines above.
      for (const lift of lifts) {
        const wz = camMid + NR + lift.wz_off;
        // Smooth up-and-down oscillation
        const wy = lift.maxH * 0.5 * (1 + Math.sin(time * lift.speed + lift.phase));
        const p = pMid(lift.lane, wy, wz);
        if (!p) continue;
        // Visible anywhere along the pillar — floor to above horizon
        if (p.y > h || p.y < 0) continue;

        // Fade based on depth and also based on how close to extremes (slow at top/bottom)
        const a = p.fade * 0.45;
        if (a < 0.02) continue;

        const sz = Math.min(14, 0.22 * (S / Math.max(p.dz, 0.1)) * FOCAL);

        // Glow
        const tg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, sz * 2.2);
        tg.addColorStop(0,   `rgba(147,197,253,${a.toFixed(3)})`);
        tg.addColorStop(0.5, `rgba(59,130,246,${(a * 0.35).toFixed(3)})`);
        tg.addColorStop(1,   "rgba(59,130,246,0)");
        ctx.fillStyle = tg;
        ctx.beginPath(); ctx.arc(p.x, p.y, sz * 2.2, 0, Math.PI * 2); ctx.fill();

        // Core dot
        ctx.fillStyle = `rgba(210,232,255,${(a * 0.95).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(1.2, sz * 0.35), 0, Math.PI * 2); ctx.fill();

        // Trail — small line segment showing direction of travel
        const wyNext = lift.maxH * 0.5 * (1 + Math.sin(time * lift.speed + lift.phase + 0.15));
        const pNext = pMid(lift.lane, wyNext, wz);
        if (pNext) {
          const trailG = ctx.createLinearGradient(p.x, p.y, pNext.x, pNext.y);
          trailG.addColorStop(0, `rgba(147,197,253,${(a * 0.6).toFixed(3)})`);
          trailG.addColorStop(1, "rgba(147,197,253,0)");
          ctx.beginPath();
          ctx.strokeStyle = trailG;
          ctx.lineWidth = Math.max(0.5, sz * 0.25);
          ctx.moveTo(p.x, p.y); ctx.lineTo(pNext.x, pNext.y); ctx.stroke();
        }
      }

      // ── NEAR LAYER: Horizontal floor totes ───────────────────────────
      for (const tote of totes) {
        const wz = camNear + NR + ((tote.phase + time * tote.speed) % (FR - 2));
        const p  = pNear(tote.lane, 0.08, wz);
        if (!p || p.y < HY || p.y > h) continue;
        const a = p.fade * 0.38;
        if (a < 0.02) continue;
        const sz = Math.min(12, 0.18 * (S / Math.max(p.dz, 0.1)) * FOCAL);
        const tg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, sz * 2);
        tg.addColorStop(0,   `rgba(147,197,253,${a.toFixed(3)})`);
        tg.addColorStop(0.5, `rgba(59,130,246,${(a * 0.35).toFixed(3)})`);
        tg.addColorStop(1,   "rgba(59,130,246,0)");
        ctx.fillStyle = tg;
        ctx.beginPath(); ctx.arc(p.x, p.y, sz * 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(210,232,255,${(a * 0.9).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(1, sz * 0.35), 0, Math.PI * 2); ctx.fill();
      }

      // ── Telemetry badges ──────────────────────────────────────────────
      const badges = [
        { wx: -4.5, wy: 1.3, wz_off: 7,  label: "AISLE-A  ·  CLEAR" },
        { wx:  4.0, wy: 1.0, wz_off: 11, label: "TOTE:247  ·  Z:11"  },
        { wx: -1.5, wy: 1.6, wz_off: 16, label: "SYS  ·  NOMINAL"    },
        { wx:  2.5, wy: 0.9, wz_off: 9,  label: "ZONE-C  ·  ACTIVE"  },
      ];
      ctx.save();
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let bi = 0; bi < badges.length; bi++) {
        const badge = badges[bi];
        const wz = camMid + badge.wz_off;
        const p  = pMid(badge.wx, badge.wy, wz);
        if (!p || p.y > HY - 8 || p.y < 10) continue;
        const pulse = 0.55 + 0.45 * Math.sin(time * 0.5 + bi * 1.4);
        const a = p.fade * pulse * 0.65;
        if (a < 0.05) continue;
        const textW = ctx.measureText(badge.label).width;
        const px = 7, py = 4;
        const bx = p.x - textW / 2 - px;
        const by = p.y - 7 - py;
        const bw = textW + px * 2;
        const bh = 14 + py * 2;
        ctx.fillStyle = `rgba(6,8,16,${(a * 0.75).toFixed(3)})`;
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = `rgba(59,130,246,${(a * 0.55).toFixed(3)})`;
        ctx.lineWidth = 0.75;
        ctx.strokeRect(bx, by, bw, bh);
        ctx.strokeStyle = `rgba(147,197,253,${(a * 0.9).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bx, by + 5); ctx.lineTo(bx, by); ctx.lineTo(bx + 5, by);
        ctx.stroke();
        ctx.fillStyle = `rgba(147,197,253,${a.toFixed(3)})`;
        ctx.fillText(badge.label, p.x, p.y);
        ctx.strokeStyle = `rgba(59,130,246,${(a * 0.15).toFixed(3)})`;
        ctx.lineWidth = 0.5;
        ctx.setLineDash([3, 5]);
        ctx.beginPath();
        ctx.moveTo(p.x, by + bh); ctx.lineTo(p.x, HY); ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.restore();

      // ── Stars ──────────────────────────────────────────────────────────
      for (const s of stars) {
        const a = s.baseAlpha * (0.5 + 0.5 * Math.sin(time * s.speed + s.phase));
        ctx.globalAlpha = a;
        ctx.fillStyle = "#93c5fd";
        ctx.beginPath();
        ctx.arc(s.rx * w, s.ry * HY, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // ── Atmospheric gradients ──────────────────────────────────────────
      const skyG = ctx.createLinearGradient(0, 0, 0, HY);
      skyG.addColorStop(0, "rgba(10,10,10,0.55)");
      skyG.addColorStop(1, "rgba(10,10,10,0)");
      ctx.fillStyle = skyG; ctx.fillRect(0, 0, w, HY);

      const fogG = ctx.createLinearGradient(0, h * 0.7, 0, h);
      fogG.addColorStop(0, "rgba(10,10,10,0)");
      fogG.addColorStop(1, "rgba(10,10,10,0.85)");
      ctx.fillStyle = fogG; ctx.fillRect(0, h * 0.7, w, h * 0.3);

      const horizG = ctx.createLinearGradient(0, HY - 8, 0, HY + 8);
      horizG.addColorStop(0,   "rgba(59,130,246,0)");
      horizG.addColorStop(0.5, "rgba(59,130,246,0.06)");
      horizG.addColorStop(1,   "rgba(59,130,246,0)");
      ctx.fillStyle = horizG; ctx.fillRect(0, HY - 8, w, 16);

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 10,
        pointerEvents: "none",
      }}
    />
  );
}
