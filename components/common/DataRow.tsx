
import React from 'react';
import { Theme } from '../../styles/theme';

interface DataRowProps {
  label: string;
  value: React.ReactNode;
  subValue?: string;
}

export const DataRow: React.FC<DataRowProps> = ({ label, value, subValue }) => (
  <div className={Theme.dayan.dataRow}>
    <span className={Theme.typography.bodySm}>{label}</span>
    <div className="flex flex-col items-end">
       <div className={Theme.typography.monoBase}>{value}</div>
       {subValue && <span className={Theme.typography.monoXs}>{subValue}</span>}
    </div>
  </div>
);
