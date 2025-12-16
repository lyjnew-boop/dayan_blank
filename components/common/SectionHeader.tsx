
import React from 'react';
import { Theme } from '../../styles/theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, icon }) => (
  <div className={Theme.dayan.sectionHeader}>
    <span className={Theme.dayan.headerIcon}>{icon}</span>
    <div>
      <h3 className={Theme.typography.h3}>{title}</h3>
      {subtitle && <p className={Theme.typography.caption}>{subtitle}</p>}
    </div>
  </div>
);
