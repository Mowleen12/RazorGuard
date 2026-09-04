import React, { useState, useEffect, useRef } from 'react';

export interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: 'view' | 'hover';
  delay?: number;
}

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 75,
  maxIterations = 14,
  sequential = true,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><',
  className = '',
  parentClassName = '',
  encryptedClassName = 'text-[#0091F5] font-mono',
  animateOn = 'view',
  delay = 0,
}) => {
  const [displayText, setDisplayText] = useState<string>(text);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const availableChars = useOriginalCharsOnly
    ? Array.from(new Set(text.split(''))).filter((c) => c !== ' ').join('') || characters
    : characters;

  const getRandomChar = () => {
    return availableChars[Math.floor(Math.random() * availableChars.length)] || '*';
  };

  const triggerAnimation = () => {
    let iteration = 0;
    const totalChars = text.length;
    const currentRevealed = new Set<number>();

    // Spaces are immediately revealed
    for (let i = 0; i < totalChars; i++) {
      if (text[i] === ' ') currentRevealed.add(i);
    }
    setRevealedIndices(new Set(currentRevealed));

    const timeoutId = setTimeout(() => {
      const interval = setInterval(() => {
        iteration++;

        if (sequential) {
          // Calculate how many characters should be revealed based on iteration progress
          const charsToReveal = Math.floor((iteration / (maxIterations + totalChars)) * totalChars);

          for (let i = 0; i < charsToReveal; i++) {
            let targetIndex = i;
            if (revealDirection === 'end') {
              targetIndex = totalChars - 1 - i;
            } else if (revealDirection === 'center') {
              const mid = Math.floor(totalChars / 2);
              targetIndex = i % 2 === 0 ? mid + Math.floor(i / 2) : mid - Math.ceil(i / 2);
            }
            if (targetIndex >= 0 && targetIndex < totalChars) {
              currentRevealed.add(targetIndex);
            }
          }
          setRevealedIndices(new Set(currentRevealed));
        }

        const nextChars = text.split('').map((char, index) => {
          if (char === ' ') return ' ';
          if (currentRevealed.has(index)) return char;
          if (!sequential && iteration > maxIterations) return char;
          return getRandomChar();
        });

        setDisplayText(nextChars.join(''));

        // Completion condition
        const allRevealed = text.split('').every((char, index) => {
          if (char === ' ') return true;
          return currentRevealed.has(index) || (!sequential && iteration > maxIterations);
        });

        if (allRevealed || iteration > maxIterations + totalChars * 2) {
          clearInterval(interval);
          setDisplayText(text);
          // Mark all revealed
          const fullSet = new Set<number>();
          for (let i = 0; i < totalChars; i++) fullSet.add(i);
          setRevealedIndices(fullSet);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeoutId);
  };

  useEffect(() => {
    if (animateOn === 'view') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated) {
              setHasAnimated(true);
              triggerAnimation();
            }
          });
        },
        { threshold: 0.1 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }
  }, [animateOn, hasAnimated, text, delay, speed]);

  const handleMouseEnter = () => {
    if (animateOn === 'hover') {
      triggerAnimation();
    }
  };

  return (
    <span
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className={`inline-block ${parentClassName}`}
    >
      {displayText.split('').map((char, idx) => {
        const isRevealed = revealedIndices.has(idx) || char === ' ';
        return (
          <span
            key={idx}
            className={isRevealed ? className : encryptedClassName}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};
