import React from 'react';

interface HexagramSymbolProps {
  binary: string; // e.g. "111000" (Top to Bottom or Bottom to Top depending on convention, typically Bottom is index 0)
  color?: string;
  size?: number;
}

export const HexagramSymbol: React.FC<HexagramSymbolProps> = ({ binary, color = "currentColor", size = 64 }) => {
  // Standard I Ching binary usually reads bottom to top. 
  // Let's assume the input string index 0 is the BOTTOM line (Initial Line).
  const lines = binary.split(''); 
  // We render from Top (index 5) to Bottom (index 0) visually.
  const visualOrder = [...lines].reverse();

  return (
    <div 
      style={{ width: size, height: size }} 
      className="flex flex-col justify-between py-1"
      title={`Hexagram: ${binary}`}
    >
      {visualOrder.map((bit, idx) => (
        <div key={idx} className="w-full flex justify-between gap-1 h-[10%]">
          {bit === '1' ? (
            // Yang Line (Solid)
            <div className="w-full h-full rounded-sm" style={{ backgroundColor: color }}></div>
          ) : (
            // Yin Line (Broken)
            <>
              <div className="w-[45%] h-full rounded-sm" style={{ backgroundColor: color }}></div>
              <div className="w-[10%] h-full opacity-0"></div>
              <div className="w-[45%] h-full rounded-sm" style={{ backgroundColor: color }}></div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};