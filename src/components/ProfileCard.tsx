import React, { useState, useRef, useCallback, ReactNode, CSSProperties } from 'react';

export interface ProfileCardProps {
  children: ReactNode;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  tiltMaxAngleX?: number;
  tiltMaxAngleY?: number;
  perspective?: number;
  scale?: number;
  behindGlowEnabled?: boolean;
  behindGlowColor?: string;
  behindGlowSize?: string;
  glareEnabled?: boolean;
  glareMaxOpacity?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * ReactBits ProfileCard Component
 * Based on https://reactbits.dev/components/profile-card
 * Provides realistic 3D perspective tilt on hover, dynamic cursor-tracking glare,
 * and a smooth radial glow positioned behind the card.
 */
export const ProfileCard: React.FC<ProfileCardProps> = ({
  children,
  enableTilt = true,
  tiltMaxAngleX = 14,
  tiltMaxAngleY = 14,
  perspective = 1000,
  scale = 1.02,
  behindGlowEnabled = true,
  behindGlowColor = 'rgba(0, 145, 245, 0.35)',
  behindGlowSize = '420px',
  glareEnabled = true,
  glareMaxOpacity = 0.35,
  className = '',
  style = {},
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [glarePos, setGlarePos] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });
  const [glowPos, setGlowPos] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enableTilt || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Normalized coordinates (-1 to 1)
      const normX = (clientX - centerX) / centerX;
      const normY = (clientY - centerY) / centerY;

      // Calculate tilt angles in degrees
      const rotX = -normY * tiltMaxAngleX;
      const rotY = normX * tiltMaxAngleY;

      setRotateX(rotX);
      setRotateY(rotY);

      // Glare position in percentages (0 to 100)
      const percentX = (clientX / rect.width) * 100;
      const percentY = (clientY / rect.height) * 100;

      setGlarePos({
        x: percentX,
        y: percentY,
        opacity: glareMaxOpacity,
      });

      setGlowPos({
        x: percentX,
        y: percentY,
        opacity: 1,
      });
    },
    [enableTilt, tiltMaxAngleX, tiltMaxAngleY, glareMaxOpacity]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
    setGlowPos((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none ${className}`}
      style={{
        perspective: `${perspective}px`,
        ...style,
      }}
    >
      {/* Behind Card Radial Glow (following the mouse cursor) */}
      {behindGlowEnabled && (
        <div
          className="pointer-events-none absolute -inset-10 rounded-3xl transition-opacity duration-500 ease-out z-0"
          style={{
            opacity: glowPos.opacity,
            background: `radial-gradient(circle ${behindGlowSize} at ${glowPos.x}% ${glowPos.y}%, ${behindGlowColor} 0%, transparent 75%)`,
            filter: 'blur(30px)',
          }}
        />
      )}

      {/* 3D Tilted Card Content Wrapper */}
      <div
        className="relative z-10 w-full transition-transform ease-out will-change-transform"
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transitionDuration: isHovered ? '120ms' : '650ms',
          transitionTimingFunction: isHovered ? 'cubic-bezier(0.15, 0.85, 0.35, 1)' : 'cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        {children}

        {/* Dynamic Cursor-Tracking Glare Highlight */}
        {glareEnabled && (
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl overflow-hidden z-40 transition-opacity duration-300"
            style={{
              opacity: glarePos.opacity,
              background: `radial-gradient(circle 380px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.12) 40%, transparent 80%)`,
              mixBlendMode: 'overlay',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
