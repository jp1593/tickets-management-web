import React, { useEffect, useState } from 'react';
import { Ticket } from 'lucide-react';

const SplashScreen = ({ onFinished }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Animation duration
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onFinished, 500); 
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse"></div>
        <Ticket size={80} className="text-blue-500 animate-bounce relative z-10" />
      </div>
      
      <h1 className="mt-6 text-3xl font-black text-white tracking-tighter">
        CFG <span className="text-blue-500">TICKETS</span>
      </h1>
      
      <div className="mt-8 w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 animate-[loading_2s_ease-in-out]"></div>
      </div>
    </div>
  );
};

export default SplashScreen;