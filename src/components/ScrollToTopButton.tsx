import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  threshold?: number;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ threshold = 280 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          key="scroll-to-top"
          initial={{ opacity: 0, y: 16, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.8 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/15 bg-[#050814]/90 text-slate-200 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.8),0_0_20px_-3px_rgba(0,145,245,0.35)] backdrop-blur-xl transition-all duration-300 hover:border-[#0091F5]/70 hover:bg-[#0091F5]/20 hover:text-white hover:shadow-[0_0_30px_rgba(0,145,245,0.6)] active:scale-95 group focus:outline-none focus:ring-2 focus:ring-[#0091F5]/50"
          aria-label="Scroll to top of page"
          title="Scroll to top"
        >
          {/* Subtle pulse ring around the button */}
          <span className="absolute inset-0 rounded-full border border-[#0091F5]/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:scale-110" />

          {/* Up arrow icon with hover translate */}
          <ArrowUp className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5 text-white" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
