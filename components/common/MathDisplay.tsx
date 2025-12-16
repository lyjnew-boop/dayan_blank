
import React from 'react';
import { Theme } from '../../styles/theme';

interface MathDisplayProps {
  label: string;
  dividend: number;
  divisor: number;
  fraction: string;
  approx: string;
}

export const MathDisplay: React.FC<MathDisplayProps> = ({ label, dividend, divisor, fraction, approx }) => (
  <div className={Theme.dayan.mathDisplay}>
    <span className={Theme.typography.label}>{label}</span>
    <div className="flex items-baseline gap-2 mt-1">
      <span className={Theme.typography.monoSm}>{dividend} ÷ {divisor} =</span>
      <span className={Theme.typography.monoLg}>{fraction}</span>
    </div>
    <span className={Theme.typography.caption}>≈ {approx}</span>
  </div>
);
