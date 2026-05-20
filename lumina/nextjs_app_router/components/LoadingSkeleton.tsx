"use client";

import { Loader2 } from "lucide-react";

export function LoadingSkeleton({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
      <div className="text-center font-mono">
        <p className="text-sm font-bold text-gray-200 tracking-wider uppercase">
          Loading
        </p>
        <p className="text-xs text-gray-500 mt-1">{message}</p>
      </div>
    </div>
  );
}
