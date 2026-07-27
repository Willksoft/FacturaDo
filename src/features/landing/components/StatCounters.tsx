import React, { useState, useEffect } from 'react';

function AnimatedNumber({ target, duration = 2000, suffix = '', prefix = '' }: { target: number; duration?: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeProgress * target));
      
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };
    
    animationFrameId = window.requestAnimationFrame(step);
    
    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
  }, [target, duration]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export function StatCounters() {
  return (
    <div className="w-full bg-slate-50 pb-8 pt-4 px-4 sm:px-6 lg:px-8 border-b border-slate-100/50 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Facturas Emitidas', value: 2542000, suffix: '+' },
          { label: 'Negocios Activos', value: 10500, suffix: '+' },
          { label: 'Ahorro de Tiempo', value: 85, prefix: '', suffix: '%' },
          { label: 'Uptime Sistema', value: 99, suffix: '.9%' }
        ].map((stat, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center bg-transparent p-6 text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-700 font-heading mb-2">
              <AnimatedNumber target={stat.value} suffix={stat.suffix} prefix={stat.prefix} duration={2500 + (idx * 300)} />
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
