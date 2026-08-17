import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black selection:bg-[#00D4FF] selection:text-black relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] bg-[#00D4FF]/10 blur-[150px] rounded-full animate-pulse" />
      </div>

      <div className="text-center relative z-10 px-6">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00D4FF] mb-8 animate-bounce">System Error</p>
        <h1 className="text-[12rem] lg:text-[20rem] font-black text-white leading-none tracking-tighter mb-8 select-none">404</h1>
        <p className="text-xl lg:text-2xl font-black uppercase tracking-widest text-white/20 mb-16">The requested node is unreachable.</p>
        <a 
          href="/" 
          className="inline-flex items-center gap-4 px-12 py-6 rounded-2xl bg-[#00D4FF] text-black text-xs font-black uppercase tracking-widest hover:bg-white transition-all duration-500 shadow-[0_0_30px_rgba(0,212,255,0.2)]"
        >
          Re-establish Connection →
        </a>
      </div>
    </div>
  );
};

export default NotFound;
