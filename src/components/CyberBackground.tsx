import React from 'react';

export const CyberBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[var(--bg-main)] transition-colors duration-200" aria-hidden="true">
      {/* Luxury ambient atmospheric lighting gradients - visible only in dark mode */}
      <div className="hidden dark:block absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-blue-500/10 via-blue-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="hidden dark:block absolute top-1/3 right-[-100px] w-[500px] h-[400px] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden dark:block absolute top-2/3 left-[-100px] w-[500px] h-[400px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Subtle clean grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-subtle)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-subtle)_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 pointer-events-none" />
    </div>
  );
};
