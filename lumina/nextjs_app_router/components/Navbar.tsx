"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Sparkles, Tv, Share2, Check } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const navItems = [
    { path: "/genre/scifi", label: "Sci-Fi", icon: Sparkles },
    { path: "/genre/horror", label: "Horror", icon: Flame },
    { path: "/genre/anime", label: "Anime", icon: Tv },
  ];

  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-lg border-b border-white/10 z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="font-bold text-xl text-white font-mono uppercase tracking-widest flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-rose-500" />
          Lumina
        </Link>
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center justify-center p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-gray-300 hover:text-white"
          title="Copy Page Link"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Share2 className="w-4 h-4 text-rose-400" />
          )}
        </button>
      </div>

      <div className="hidden md:flex items-center gap-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              pathname.startsWith(item.path)
                ? "text-white bg-rose-500/20"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center font-bold text-white">
          A
        </div>
      </div>
    </nav>
  );
};
