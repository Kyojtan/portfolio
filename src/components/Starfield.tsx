import { useEffect, useRef, useState } from "react";

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [speed, setSpeed] = useState<number>(0.15); // Adjust star movement speed
  const [starCount] = useState<number>(100);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Star model
    interface Star {
      x: number;
      y: number;
      size: number;
      baseOpacity: number;
      opacity: number;
      speedY: number;
      speedX: number;
      twinkleSpeed: number;
      twinkleDir: number;
      color: string;
    }

    const stars: Star[] = [];
    const colors = [
      "rgba(255, 255, 255,", // white
      "rgba(173, 223, 255,", // light blue star
      "rgba(255, 230, 170,", // soft gold yellow star
      "rgba(255, 200, 220,", // cosmic pink reddish star
    ];

    // Generate random star stars
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.3,
        baseOpacity: Math.random() * 0.6 + 0.2,
        opacity: Math.random() * 0.8,
        speedX: (Math.random() - 0.5) * 0.1,
        speedY: (Math.random() - 0.5) * 0.1,
        twinkleSpeed: 0.005 + Math.random() * 0.012,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Nebula dust gas clouds
    interface Nebula {
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
    }

    const nebulae: Nebula[] = [
      {
        x: width * 0.3,
        y: height * 0.4,
        radius: Math.min(width, height) * 0.35,
        color: "rgba(112, 72, 232, 0.04)", // purple cloud
        vx: 0.02,
        vy: 0.01,
      },
      {
        x: width * 0.7,
        y: height * 0.6,
        radius: Math.min(width, height) * 0.40,
        color: "rgba(16, 152, 173, 0.03)", // teal cloud
        vx: -0.015,
        vy: 0.02,
      },
    ];

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        width = canvas.width = entry.contentRect.width || canvas.parentElement?.clientWidth || window.innerWidth;
        height = canvas.height = entry.contentRect.height || canvas.parentElement?.clientHeight || window.innerHeight;
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw space dark gradient state
      const spaceGrad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, Math.max(width, height));
      spaceGrad.addColorStop(0, "#080718");
      spaceGrad.addColorStop(0.5, "#04030a");
      spaceGrad.addColorStop(1, "#020104");
      ctx.fillStyle = spaceGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw moving soft nebulae
      nebulae.forEach((neb) => {
        neb.x += neb.vx;
        neb.y += neb.vy;

        // Bounce nebulae off boundaries.
        if (neb.x < 0 || neb.x > width) neb.vx *= -1;
        if (neb.y < 0 || neb.y > height) neb.vy *= -1;

        const radGrad = ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, neb.radius);
        radGrad.addColorStop(0, neb.color);
        radGrad.addColorStop(0.5, "rgba(0,0,0,0)");
        ctx.fillStyle = radGrad;
        ctx.fillRect(neb.x - neb.radius, neb.y - neb.radius, neb.radius * 2, neb.radius * 2);
      });

      // 3. Draw and animate twinkling stars
      stars.forEach((star) => {
        // Twinkle effect
        star.opacity += star.twinkleSpeed * star.twinkleDir;
        if (star.opacity > 1) {
          star.opacity = 1;
          star.twinkleDir = -1;
        } else if (star.opacity < 0.1) {
          star.opacity = 0.1;
          star.twinkleDir = 1;
        }

        // Drifting stars
        star.x += star.speedX * speed * 8;
        star.y += star.speedY * speed * 8;

        // Wrap around screen boundaries
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        // Render star
        ctx.fillStyle = `${star.color}${star.baseOpacity * star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Extra subtle cross flare on brighter stars
        if (star.size > 1.3 && star.opacity > 0.75) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 * star.opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(star.x - star.size * 3, star.y);
          ctx.lineTo(star.x + star.size * 3, star.y);
          ctx.moveTo(star.x, star.y - star.size * 3);
          ctx.lineTo(star.x, star.y + star.size * 3);
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [speed, starCount]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
      
      {/* Subtle control overlay bottom right */}
      <div className="absolute bottom-2 left-4 z-10 flex items-center gap-2 text-[10px] font-mono text-zinc-600 select-none">
        <span>STAR DRIVES:</span>
        <button 
          onClick={() => setSpeed(0.05)} 
          className={`px-1.5 py-0.5 rounded transition ${speed === 0.05 ? "text-star-gold bg-zinc-900 border border-zinc-800" : "hover:text-zinc-400"}`}
          title="Gentle speed"
        >
          SLO
        </button>
        <button 
          onClick={() => setSpeed(0.18)} 
          className={`px-1.5 py-0.5 rounded transition ${speed === 0.18 ? "text-star-gold bg-zinc-900 border border-zinc-800" : "hover:text-zinc-400"}`}
          title="Normal cruising speed"
        >
          NRM
        </button>
        <button 
          onClick={() => setSpeed(0.6)} 
          className={`px-1.5 py-0.5 rounded transition ${speed === 0.6 ? "text-star-gold bg-zinc-900 border border-zinc-800" : "hover:text-zinc-400"}`}
          title="Warp speed simulation"
        >
          WRP
        </button>
      </div>
    </div>
  );
}
