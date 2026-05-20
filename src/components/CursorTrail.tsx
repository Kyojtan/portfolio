import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface Particle {
  x: number;
  y: number;
  val: string;
  life: number;
  vx: number;
  vy: number;
}

const CursorTrail = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let particles: Particle[] = [];

      p.setup = () => {
        const p5Canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        p5Canvas.parent(containerRef.current!);
        p.clear();
        p.textFont('Courier New');
        p.textSize(14);
      };

      p.draw = () => {
        p.clear();
        
        // Add particle on movement
        if (p.mouseX !== 0 && p.mouseY !== 0 && (p.abs(p.mouseX - p.pmouseX) > 2 || p.abs(p.mouseY - p.pmouseY) > 2)) {
          particles.push({
            x: p.mouseX,
            y: p.mouseY,
            val: p.floor(p.random(10)).toString(),
            life: 255,
            vx: p.random(-0.5, 0.5),
            vy: p.random(0.5, 1.5) // Slight float down
          });
        }

        // Limit particles for performance
        if (particles.length > 50) {
          particles.splice(0, particles.length - 50);
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          const part = particles[i];
          p.fill(255, 167, 235, part.life); // #ffa7eb
          p.text(part.val, part.x, part.y);
          
          part.x += part.vx;
          part.y += part.vy;
          part.life -= 8;

          if (part.life <= 0) {
            particles.splice(i, 1);
          }
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    const myP5 = new p5(sketch);

    return () => {
      myP5.remove();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-[9998]"
    />
  );
};

export default CursorTrail;
