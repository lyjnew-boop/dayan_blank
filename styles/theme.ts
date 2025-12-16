
export const Theme = {
  colors: {
    primary: "text-amber-600",
    highlight: "text-amber-500",
    textMain: "text-stone-300",
    textMuted: "text-stone-500",
    border: "border-stone-800",
    borderHighlight: "border-amber-900/30",
    accent: "bg-amber-700",
  },
  bg: {
    panel: "bg-[#1a1816]",
    card: "bg-[#24211f]",
    dark: "bg-stone-900",
    darker: "bg-stone-950",
    translucent: "bg-stone-900/40",
    translucentDark: "bg-[#1c1917]/80",
  },
  components: {
    card: "bg-[#1a1816] border border-amber-900/20 p-6 rounded-sm relative overflow-hidden group hover:border-amber-900/40 transition-colors",
    headerIcon: "text-amber-600 scale-110",
    headerTitle: "text-amber-500 text-base font-bold uppercase tracking-widest",
    headerSubtitle: "text-xs text-stone-500 font-serif italic mt-0.5",
    valueBox: "bg-stone-900/40 rounded border border-stone-800/50 text-center p-3",
    sectionHeader: "flex items-center gap-3 mb-5 border-b border-amber-900/20 pb-3",
    dataRow: "flex justify-between items-center py-2 border-b border-stone-800/50 last:border-0",
    progressBarTrack: "w-full h-1.5 bg-stone-800 rounded-full overflow-hidden",
    progressBarFill: "h-full bg-amber-700 transition-all duration-500",
    badge: "px-2 py-0.5 bg-amber-900/40 text-amber-500 text-xs rounded font-bold uppercase tracking-wider border border-amber-900/50",
    interpretationBox: "bg-[#1c1917]/80 p-4 border-l-2 border-amber-600 mb-5 shadow-inner backdrop-blur-sm relative z-10",
    mathDisplay: "flex flex-col border-l-2 border-amber-900/30 pl-4"
  },
  typography: {
    h1: "text-6xl md:text-7xl font-serif font-bold text-stone-100 mb-3 tracking-tight",
    subtext: "text-xs text-stone-600 font-mono tracking-widest",
    serifLg: "text-5xl font-serif text-amber-500 font-bold mb-2",
  }
};
