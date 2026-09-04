import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulsePhase: number;
  color: string;
}

export const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Smooth mouse coordinates for ambient CSS spotlight
  const [glowPos, setGlowPos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 190,
      isActive: false,
    };

    // Color palette for neural risk nodes
    const colors = [
      'rgba(157, 124, 255, ',
      'rgba(0, 145, 245, ',
      'rgba(139, 92, 246, ',
      'rgba(0, 212, 255, ',
      'rgba(236, 72, 153, ',
    ];

    // Determine density based on screen dimensions
    const getParticleCount = () => {
      const area = width * height;
      if (width < 640) return Math.floor(area / 17000);
      if (width < 1024) return Math.floor(area / 19000);
      return Math.min(110, Math.floor(area / 20000));
    };

    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      const count = getParticleCount();
      for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        particles.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 1.8 + 1.0,
          baseAlpha: Math.random() * 0.4 + 0.25,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulsePhase: Math.random() * Math.PI * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    initParticles();

    // Click pulse waves
    interface Wave {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
    }
    const waves: Wave[] = [];

    // Resize handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    // Mouse movement listener on window
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isActive = true;
      setIsHovered(true);
      setGlowPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
      mouse.isActive = false;
      setIsHovered(false);
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleClick = (e: MouseEvent) => {
      waves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 6,
        maxRadius: 220,
        alpha: 0.85,
      });
    };

    // Touch support for mobile / tablets
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY } as MouseEvent);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Main render loop
    let lastTime = performance.now();
    let ringAngle = 0;

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      ringAngle += 0.02;

      ctx.clearRect(0, 0, width, height);

      // =====================================================================
      // 1. DRAW SHOCKWAVES ON CLICK
      // =====================================================================
      for (let i = waves.length - 1; i >= 0; i--) {
        const wave = waves[i];
        wave.radius += 3.5;
        wave.alpha *= 0.95;

        ctx.save();
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(157, 124, 255, ${wave.alpha})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 212, 255, ${wave.alpha * 0.7})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        if (wave.alpha < 0.02 || wave.radius >= wave.maxRadius) {
          waves.splice(i, 1);
        }
      }

      // =====================================================================
      // 2. DRAW PARTICLES & NEURAL FILAMENTS CONNECTING TO CURSOR
      // =====================================================================
      const particleLen = particles.length;

      for (let i = 0; i < particleLen; i++) {
        const p = particles[i];

        // Organic drift
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Pulsing luminosity
        p.pulsePhase += p.pulseSpeed;
        const pulse = Math.sin(p.pulsePhase) * 0.2;
        let currentAlpha = Math.max(0.12, p.baseAlpha + pulse);

        // Interaction with mouse cursor
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Repulsion / energetic attraction physics
        if (mouse.isActive && dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          
          // Push particles outward
          p.x -= Math.cos(angle) * force * 2.8;
          p.y -= Math.sin(angle) * force * 2.8;
          currentAlpha = Math.min(1.0, currentAlpha + force * 0.85);

          // Highly highlighted electric laser filament
          const filamentAlpha = (1 - dist / mouse.radius) * 0.85;
          const grad = ctx.createLinearGradient(mouse.x, mouse.y, p.x, p.y);
          grad.addColorStop(0, `rgba(255, 255, 255, ${filamentAlpha * 0.95})`);
          grad.addColorStop(0.3, `rgba(0, 212, 255, ${filamentAlpha * 0.85})`);
          grad.addColorStop(1, `rgba(157, 124, 255, ${filamentAlpha * 0.6})`);

          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2 + force * 1.5;
          ctx.stroke();

          // Glowing contact ring around particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius + 4 * force, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 212, 255, ${filamentAlpha * 0.5})`;
          ctx.fill();
        }

        // Draw the particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.fill();

        // Connect nearby particles to form an ambient cyber mesh
        for (let j = i + 1; j < particleLen; j++) {
          const p2 = particles[j];
          const distNodes = Math.hypot(p.x - p2.x, p.y - p2.y);
          const maxLinkDist = 125;

          if (distNodes < maxLinkDist) {
            const linkAlpha = (1 - distNodes / maxLinkDist) * 0.18;

            // Extra brightness if cursor is nearby
            let enhancedAlpha = linkAlpha;
            if (mouse.isActive) {
              const mouseToEdge = Math.min(
                Math.hypot(mouse.x - p.x, mouse.y - p.y),
                Math.hypot(mouse.x - p2.x, mouse.y - p2.y)
              );
              if (mouseToEdge < 160) {
                enhancedAlpha += (1 - mouseToEdge / 160) * 0.45;
              }
            }

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${enhancedAlpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      // =====================================================================
      // 3. DRAW HIGHLIGHTED CURSOR RETICLE AROUND MOUSE POSITION
      // =====================================================================
      if (mouse.isActive && mouse.x > 0 && mouse.y > 0) {
        ctx.save();
        
        // Inner luminous core dot
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Rotating optic reticle ring
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 20, ringAngle, ringAngle + Math.PI * 1.4);
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.65)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 20, ringAngle + Math.PI, ringAngle + Math.PI * 2.4);
        ctx.strokeStyle = 'rgba(157, 124, 255, 0.65)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* 1. Base Subtle Geometric Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.25) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: '44px 44px',
          backgroundPosition: '22px 32px',
        }}
      />

      {/* 2. Highlighted Interactive Cursor Focal Core Spotlight (Synchronized directly with cursor) */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-opacity duration-200"
        style={{
          left: `${glowPos.x}px`,
          top: `${glowPos.y}px`,
          width: '240px',
          height: '240px',
          background: `radial-gradient(circle, rgba(0, 212, 255, 0.35) 0%, rgba(157, 124, 255, 0.25) 40%, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
          filter: 'blur(20px)',
          mixBlendMode: 'screen',
        }}
      />

      {/* 3. Primary Wide Interactive Ambient Spotlight (Synchronized without trailing delay) */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-opacity duration-300"
        style={{
          left: `${glowPos.x}px`,
          top: `${glowPos.y}px`,
          width: '720px',
          height: '720px',
          background: `radial-gradient(circle, rgba(157, 124, 255, 0.25) 0%, rgba(0, 145, 245, 0.18) 35%, rgba(139, 92, 246, 0.06) 60%, transparent 80%)`,
          opacity: isHovered ? 1 : 0,
          filter: 'blur(50px)',
        }}
      />

      {/* 4. Interactive Neural Constellation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-95"
      />

      {/* 5. Vignette mask to keep outer screen boundaries soft and cinematic */}
      <div className="absolute inset-0 bg-radial-vignette opacity-60 pointer-events-none" />
    </div>
  );
};

export default InteractiveBackground;
