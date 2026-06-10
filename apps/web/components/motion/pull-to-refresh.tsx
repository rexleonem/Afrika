"use client";

import { useState, useEffect, ReactNode } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh?: () => Promise<void>;
}

export function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const controls = useAnimation();
  const y = useMotionValue(0);
  
  useEffect(() => {
    let startY = 0;
    let currentY = 0;
    let isPulling = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0]?.clientY ?? 0;
        isPulling = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || isRefreshing) return;
      
      currentY = e.touches[0]?.clientY ?? 0;
      const dy = currentY - startY;

      // Only allow pulling down when at the top
      if (dy > 0 && window.scrollY === 0) {
        // Apply resistance
        const pullDistance = Math.min(dy * 0.4, 100);
        y.set(pullDistance);
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;
      isPulling = false;

      if (y.get() > 60) {
        setIsRefreshing(true);
        controls.start({ y: 50, transition: { type: "spring", stiffness: 300, damping: 20 } });
        
        if (onRefresh) {
          await onRefresh();
        } else {
          // Default refresh behavior
          await new Promise(resolve => setTimeout(resolve, 800)); // Visual delay
          window.location.reload();
        }
        
        setIsRefreshing(false);
        controls.start({ y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
      } else {
        controls.start({ y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isRefreshing, onRefresh, controls, y]);

  return (
    <div className="relative w-full h-full">
      {/* Refresh Indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex justify-center items-center h-16 pointer-events-none z-0"
        style={{ opacity: useMotionValue(1) }}
      >
        <motion.div
          animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
          transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
          className="w-6 h-6 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: "var(--accent-gold)",
            borderRightColor: "var(--accent-gold)",
            opacity: y.get() > 10 ? 1 : 0
          }}
        />
      </motion.div>

      {/* Content wrapper */}
      <motion.div
        animate={controls}
        style={{ y }}
        className="relative z-10 w-full h-full bg-transparent"
      >
        {children}
      </motion.div>
    </div>
  );
}
