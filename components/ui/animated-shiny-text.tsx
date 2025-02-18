export const AnimatedShinyText = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative inline-flex items-center justify-center group">
      <div className="relative px-4 py-2 bg-black/5 backdrop-blur-sm rounded-full text-sm text-gray-600 font-medium overflow-hidden">
        <div className="relative z-10 flex items-center gap-2">
          <span className="text-amber-500 text-base">✨</span>
          <span>{children}</span>
        </div>
        <div className="absolute inset-0 w-[200%]">
          <div className="absolute inset-0 -left-[100%] animate-[shine_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
      </div>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-500/0 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}; 