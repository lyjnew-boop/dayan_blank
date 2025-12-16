
import React from 'react';
import { Theme } from '../styles/theme';

interface HexagramSymbolProps {
  binary: string; // e.g. "111000" (Bottom is index 0)
  color?: string;
  size?: number;
  activeLineIndex?: number; // 1-6, optional
}

export const HexagramSymbol: React.FC<HexagramSymbolProps> = ({ 
  binary, 
  color = "currentColor", 
  size = 64,
  activeLineIndex 
}) => {
  // Standard I Ching binary usually reads bottom to top. 
  // Input string index 0 is the BOTTOM line (Initial Line).
  const lines = binary.split(''); 
  // We render from Top (index 5) to Bottom (index 0) visually.
  const visualOrder = [...lines].reverse();
  const activeVisualIndex = activeLineIndex ? (6 - activeLineIndex) : -1;

  return (
    <div 
      style={{ width: size, height: size }} 
      className={Theme.hexagram.container}
      title={`Hexagram: ${binary}`}
    >
      {visualOrder.map((bit, idx) => {
        const isActive = idx === activeVisualIndex;
        const opacity = activeLineIndex ? (isActive ? 1 : 0.3) : 1;
        const glow = isActive ? `0 0 8px ${color}` : 'none';

        return (
          <div 
            key={idx} 
            className={Theme.hexagram.lineWrapper}
            style={{ opacity, filter: isActive ? `drop-shadow(0 0 2px ${color})` : 'none' }}
          >
            {bit === '1' ? (
              // Yang Line (Solid)
              <div 
                className={Theme.hexagram.solidLine} 
                style={{ backgroundColor: color, boxShadow: glow }}
              ></div>
            ) : (
              // Yin Line (Broken)
              <>
                <div 
                  className={Theme.hexagram.brokenLinePart} 
                  style={{ backgroundColor: color, boxShadow: glow }}
                ></div>
                <div className={Theme.hexagram.brokenLineSpacer}></div>
                <div 
                  className={Theme.hexagram.brokenLinePart} 
                  style={{ backgroundColor: color, boxShadow: glow }}
                ></div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
