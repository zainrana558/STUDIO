"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Flame, 
  Film, 
  Tv, 
  Bookmark, 
  History as HistoryIcon, 
  Settings as SettingsIcon,
  Sparkles,
  Search,
  Share2,
  Check
} from "lucide-react";
import { motion, useMotionValue, useSpring } from "motion/react";

// --- CUSTOM CURSOR FOLLOWER & MAGNETIC SNAP COMPONENT ---
interface MagneticTargetProps {
  children: React.ReactNode;
  radius?: number;
  className?: string;
}

export const MagneticTarget: React.FC<MagneticTargetProps> = ({ children, radius = 40, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < radius) {
      const pull = 0.42; 
      setPosition({ x: distanceX * pull, y: distanceY * pull });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 220, damping: 14 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: "Lumina Cinema",
      text: "Check out Lumina Cinema!",
      url: shareUrl,
    };

    if (
      typeof navigator !== "undefined" &&
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        console.log("Web Share API rejected, falling back to copy", err);
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  // Custom Cursor Spring Coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { stiffness: 450, damping: 28 };
  const cursorSpringX = useSpring(cursorX, springConfig);
  const cursorSpringY = useSpring(cursorY, springConfig);

  const [mouseActive, setMouseActive] = useState(false);

  useEffect(() => {
    const updateMouseCoords = (e: MouseEvent) => {
      cursorX.set(e.clientX - 10);
      cursorY.set(e.clientY - 10);
      setMouseActive(true);
    };

    const handleMouseLeaveWindow = () => {
      setMouseActive(false);
    };

    window.addEventListener("mousemove", updateMouseCoords);
    document.addEventListener("mouseleave", handleMouseLeaveWindow);

    return () => {
      window.removeEventListener("mousemove", updateMouseCoords);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
    };
  }, [cursorX, cursorY]);

  const navItems = [
    { path: "/genre/scifi", label: "Sci-Fi", icon: Sparkles },
    { path: "/genre/horror", label: "The Abyss", icon: Flame },
    { path: "/genre/anime", label: "Anime", icon: Tv },
  ];

  return (
    <>
      {/* 1. Cinematic Liquid Cursor Tracker Glow */}
      {mouseActive && (
        <motion.div
          id="lumina-custom-cursor-glow-next"
          className="pointer-events-none fixed top-0 left-0 w-5 h-5 rounded-full z-100 hidden lg:block mix-blend-screen overflow-visible"
          style={{
            x: cursorSpringX,
            y: cursorSpringY,
            backgroundColor: "#ff073a",
            boxShadow: "0 0 16px #ff073a, 0 0 32px #ff073a",
          }}
          transition={{ ease: "easeOut" }}
        />
      )}

      {/* 2. Top-Fixed Glassmorphic Bar */}
      <nav 
        id="lumina-cinema-navbar-next"
        className="fixed top-0 left-0 right-0 h-16 bg-[#0a0d11]/80 backdrop-blur-2xl border-b border-white/5 z-45 flex items-center justify-between px-6 select-none"
      >
        <div className="flex items-center gap-3">
          <MagneticTarget radius={40}>
            <Link 
              href="/genre/scifi"
              className="cursor-pointer font-bold leading-none pr-1 text-white font-mono uppercase text-sm tracking-widest flex items-center gap-2"
            >
              <Sparkles className="w-4.5 h-4.5 text-rose-500" />
              <span>luminaa2</span>
            </Link>
          </MagneticTarget>

          {/* Integrated Navbar Share Trigger */}
          <MagneticTarget radius={30}>
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center justify-center p-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-rose-500/20 hover:bg-rose-500/5 transition-all text-gray-400 hover:text-white cursor-pointer"
              title="Share Page Link"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
              ) : (
                <Share2 className="w-3.5 h-3.5 text-rose-500" />
              )}
            </button>
          </MagneticTarget>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <MagneticTarget key={item.path} radius={35}>
                <Link
                  href={item.path}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wide transition-all uppercase ${
                    isActive 
                      ? "text-rose-400 bg-rose-500/10 border border-rose-500/20" 
                      : "text-white/40 hover:text-white/80"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              </MagneticTarget>
            );
          })}
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-3.5">
          {/* Prominent Search Bar */}
          <div className="relative w-40 sm:w-52 md:w-60 lg:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              id="navbar-search-input-next"
              type="text"
              placeholder="Search films, series..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#00f0ff]/50 rounded-full text-xs font-medium text-white placeholder-gray-500 transition-all focus:outline-none"
            />
          </div>

          <div className="h-5 w-[1px] bg-white/10 hidden sm:block" />
          <div className="w-7.5 h-7.5 rounded-lg bg-rose-500/10 border border-rose-500/20 p-0.5 flex items-center justify-center font-mono text-[10px] text-rose-400 font-bold uppercase">
            A
          </div>
        </div>
      </nav>
    </>
  );
};
export default Navbar;