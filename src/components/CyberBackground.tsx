import React from 'react';

export const CyberBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#07090e]" aria-hidden="true">
      {/* Luxury ambient atmospheric lighting gradients */}
      <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-rose-500/8 via-rose-600/4 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-[-100px] w-[500px] h-[400px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 left-[-100px] w-[500px] h-[400px] bg-rose-600/4 rounded-full blur-3xl pointer-events-none" />
      
      {/* Subtle luxury grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e263810_1px,transparent_1px),linear-gradient(to_bottom,#1e263810_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
    </div>
  );
};
