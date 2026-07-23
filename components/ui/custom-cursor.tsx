"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const [isMobile, setIsMobile] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if it's a touch device
    const checkTouch = () => {
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      setIsMobile(isTouch);
    };
    
    checkTouch();
    window.addEventListener("resize", checkTouch);

    // Mouse coordinates tracker
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Instantly position the inner small dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    // Smooth animation loop for the outer circle
    let animationFrameId: number;
    const animateCursor = () => {
      // Linear interpolation (lerp) for smooth trailing
      const ease = 0.15;
      cursorX += (mouseX - cursorX) * ease;
      cursorY += (mouseY - cursorY) * ease;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(animateCursor);
    };

    // Listeners for hover state detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target && (
          target.closest("a") ||
          target.closest("button") ||
          target.closest('[role="button"]') ||
          target.closest('[data-cursor="magnetic"]') ||
          target.closest(".interactive")
        )
      ) {
        setIsHovered(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovered(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mouseout", handleMouseOut, { passive: true });
    
    // Start animation loop
    animateCursor();

    return () => {
      window.removeEventListener("resize", checkTouch);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 mix-blend-difference">
      {/* Outer Glow Circle */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border border-[#2997FF]/50 bg-white/5 backdrop-blur-xs transition-all duration-300 ease-out will-change-transform ${
          isHovered ? "w-14 h-14 bg-white/10 border-white/40" : ""
        }`}
      />
      {/* Inner Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-1.5 h-1.5 bg-[#2997FF] rounded-full -translate-x-1/2 -translate-y-1/2 will-change-transform transition-transform duration-300 ${
          isHovered ? "scale-0" : ""
        }`}
      />
    </div>
  );
}
