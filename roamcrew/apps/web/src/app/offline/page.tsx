export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#F0F9FF] flex flex-col items-center justify-center p-8 text-center">
      {/* Animated signal waves */}
      <div className="relative mb-10">
        <div className="w-24 h-24 rounded-full bg-[#0EA5E9]/10 flex items-center justify-center border-4 border-[#0EA5E9]/20 relative">
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-full border-2 border-[#0EA5E9]/20 animate-ping" />
          <div className="absolute -inset-3 rounded-full border border-[#0EA5E9]/10 animate-pulse" />
          <svg className="w-12 h-12 text-[#0EA5E9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8.11 16.11a5 5 0 0 1 7.78 0" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.93 12.93a10 10 0 0 1 14.14 0" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1.42 9.42a15 15 0 0 1 21.16 0" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
            <circle cx="12" cy="20" r="1" fill="currentColor"/>
          </svg>
        </div>
        {/* X overlay */}
        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-md shadow-red-500/30">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="m18 6-12 12M6 6l12 12" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <h1 className="text-4xl font-extrabold text-[#0C4A6E] tracking-tight mb-3">
        You&apos;re Offline
      </h1>
      <p className="text-lg text-[#486581] font-medium max-w-md mb-2">
        No internet connection detected. Don&apos;t worry — your cached trips and itinerary data are still available.
      </p>
      <p className="text-sm text-[#9fb3c8] mb-10 max-w-sm">
        Any changes you make will be queued and synced automatically when you&apos;re back online.
      </p>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full mb-10">
        {[
          { icon: "📍", title: "Itinerary", desc: "View your saved destinations and plans" },
          { icon: "📋", title: "Tasks", desc: "See and check off your packing list" },
          { icon: "💰", title: "Budget", desc: "Review your trip expenses" },
        ].map((item) => (
          <div key={item.title} className="bg-white/80 backdrop-blur-sm border border-white rounded-2xl p-5 shadow-sm text-left">
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="font-bold text-[#0C4A6E] mb-0.5">{item.title}</div>
            <div className="text-xs text-[#486581]">{item.desc}</div>
          </div>
        ))}
      </div>

      <button
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#0EA5E9] text-white font-bold shadow-lg shadow-[#0EA5E9]/25 hover:bg-[#0284c7] transition-all hover:-translate-y-0.5"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Go Back
      </button>
    </div>
  );
}
