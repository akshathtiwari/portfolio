// AXON's visual form: an abstract attention-graph entity (R8, N1).
// Purely decorative, so aria-hidden and pointer-events none. State-reactive:
// idle breathes, decoding flickers, forward_pass sweeps, cold_start is dim.
import { useEffect, useRef } from "react";
import type { AgentVisualState } from "../../agent/machine";

interface Node {
  x: number;
  y: number;
  r: number;
  phase: number;
}

interface Props {
  state: AgentVisualState;
  size?: number;
  reduced?: boolean;
}

const EMERALD = "52,211,153";
const TEAL = "34,211,238";

export default function AgentEntity({ state, size = 132, reduced = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<AgentVisualState>(state);
  stateRef.current = state;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    const cx = size / 2;
    const cy = size / 2;

    // A small constellation: one hub plus a ring of nodes.
    const nodes: Node[] = [{ x: cx, y: cy, r: 4, phase: 0 }];
    const ring = 6;
    for (let i = 0; i < ring; i++) {
      const a = (i / ring) * Math.PI * 2;
      const rad = size * 0.32;
      nodes.push({
        x: cx + Math.cos(a) * rad,
        y: cy + Math.sin(a) * rad,
        r: 3,
        phase: i,
      });
    }

    let raf = 0;
    let t = 0;

    function draw() {
      if (!ctx) return;
      const s = stateRef.current;
      t += 1;
      ctx.clearRect(0, 0, size, size);

      const dim = s === "cold_start" ? 0.25 : 1;
      const breathe = 0.5 + 0.5 * Math.sin(t * 0.03);
      const sweep = s === "forward_pass" ? (t % 60) / 60 : -1;
      const flicker = s === "decoding";
      const color = s === "attending" ? TEAL : EMERALD;

      // edges from hub to ring
      for (let i = 1; i < nodes.length; i++) {
        const n = nodes[i];
        let alpha = 0.12 + 0.16 * breathe;
        if (sweep >= 0) {
          const near = Math.abs((i - 1) / (nodes.length - 1) - sweep);
          alpha += near < 0.18 ? 0.5 : 0;
        }
        if (flicker) alpha += 0.3 * Math.random();
        ctx.strokeStyle = `rgba(${color},${(alpha * dim).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nodes[0].x, nodes[0].y);
        ctx.lineTo(n.x, n.y);
        ctx.stroke();
      }

      // nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const pulse = 0.6 + 0.4 * Math.sin(t * 0.05 + n.phase);
        let glow = i === 0 ? 0.9 : 0.5 + 0.4 * pulse;
        if (flicker && i > 0) glow = Math.random() > 0.5 ? 1 : 0.3;
        ctx.fillStyle = `rgba(${color},${(glow * dim).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduced) raf = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(raf);
  }, [size, reduced]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      aria-hidden="true"
      style={{ width: size, height: size, pointerEvents: "none", display: "block" }}
    />
  );
}
