import React, { useRef, useMemo } from 'react';
import { motion, useInView, useScroll, useTransform, MotionValue } from 'motion/react';

export interface ScrollRevealProps {
  children?: React.ReactNode;
  text?: string;
  baseOpacity?: number;
  enableBlur?: boolean;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
  animationMode?: 'section' | 'scroll';
}

interface WordProps {
  children: string;
  progress?: MotionValue<number>;
  range?: [number, number];
  baseOpacity: number;
  enableBlur: boolean;
  blurStrength: number;
  textClassName?: string;
  isInView?: boolean;
  index?: number;
}

const Word: React.FC<WordProps> = ({
  children,
  baseOpacity,
  enableBlur,
  blurStrength,
  textClassName = '',
  isInView = true,
  index = 0,
}) => {
  return (
    <span className="relative inline-block mr-[0.18em] last:mr-0">
      <motion.span
        initial={{
          opacity: baseOpacity,
          y: 8,
          filter: enableBlur ? `blur(${blurStrength}px)` : 'none',
        }}
        animate={
          isInView
            ? {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
              }
            : {
                opacity: baseOpacity,
                y: 8,
                filter: enableBlur ? `blur(${blurStrength}px)` : 'none',
              }
        }
        transition={{
          duration: 0.45,
          delay: Math.min(index * 0.02, 0.4),
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`inline-block will-change-[opacity,transform,filter] ${textClassName}`}
      >
        {children}
      </motion.span>
    </span>
  );
};

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  text,
  baseOpacity = 0.2,
  enableBlur = true,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.25 });

  const contentText = text || (typeof children === 'string' ? children : '');

  const words = useMemo(() => {
    if (!contentText) return [];
    return contentText.split(/\s+/).filter(Boolean);
  }, [contentText]);

  const isCentered =
    containerClassName.includes('justify-center') ||
    containerClassName.includes('text-center') ||
    containerClassName.includes('mx-auto');

  if (words.length > 0) {
    return (
      <div ref={containerRef} className={`relative ${containerClassName}`}>
        <p
          className={`flex flex-wrap items-baseline leading-tight sm:leading-snug ${
            isCentered ? 'justify-center text-center' : 'justify-start text-left'
          }`}
        >
          {words.map((word, i) => (
            <Word
              key={i}
              index={i}
              isInView={isInView}
              baseOpacity={baseOpacity}
              enableBlur={enableBlur}
              blurStrength={blurStrength}
              textClassName={textClassName}
            >
              {word}
            </Word>
          ))}
        </p>
      </div>
    );
  }

  // Fallback if children is complex JSX node
  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: baseOpacity, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: baseOpacity, y: 16 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={containerClassName}
    >
      {children}
    </motion.div>
  );
};

