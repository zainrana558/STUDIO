import React from "react";

export default function NextJSGenreHubLoading() {
  return (
    <div className="flex flex-col gap-8 py-10 w-full animate-pulse select-none text-left">
      {/* Dynamic Title Skeleton */}
      <div className="flex flex-col gap-1.5 pb-2">
        <div className="w-24 h-3 bg-white/5 rounded" />
        <div className="w-56 h-8 bg-white/5 rounded-md" />
      </div>

      {/* Hero Banner Skeleton Grid */}
      <div className="w-full h-[45vh] lg:h-[55vh] rounded-2xl bg-white/2 relative flex flex-col justify-end p-8 border border-white/5">
        <div className="w-1/3 h-8 bg-white/5 rounded mb-3.5" />
        <div className="w-2/3 h-4 bg-white/4 rounded mb-2" />
        <div className="w-1/2 h-4 bg-white/3 rounded" />
      </div>

      {/* Media Horizontal Shelf Skeletons */}
      <div className="flex flex-col gap-3">
        <div className="w-40 h-4 bg-white/5 rounded border-l border-white/20 pl-2" />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <div className="aspect-[2/3] w-full bg-white/2 rounded-xl border border-white/5 relative overflow-hidden">
                {/* Visual shimmer loop sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>
              <div className="w-2/3 h-3 bg-white/4 rounded" />
              <div className="w-1/3 h-2.5 bg-white/3 rounded mt-0.5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}