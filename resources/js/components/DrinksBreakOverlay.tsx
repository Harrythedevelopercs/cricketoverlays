import { useEffect, useState } from "react";

export default function DrinksBreakOverlay({ show, tournamentName, onClose }: any) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setVisible(true);
        } else {
            setTimeout(() => setVisible(false), 500);
        }
    }, [show]);

    if (!visible) {
return null;
}

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center pointer-events-none font-sans overflow-hidden">
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-700 pointer-events-auto ${show ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            ></div>

            {/* Main Clean Container */}
            <div className={`relative w-[800px] h-[250px] flex flex-col items-center justify-center transition-all duration-700 transform ${show ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
                
                {/* Glow behind */}
                <div className="absolute inset-0 bg-[#00ffff] rounded-full blur-[80px] opacity-20 animate-pulse"></div>

                {/* Central Panel */}
                <div className="bg-gradient-to-r from-[#0a192f] via-[#112240] to-[#0a192f] rounded-2xl shadow-2xl border border-[#64ffda]/30 flex flex-col items-center justify-center w-full py-10 px-12 relative overflow-hidden z-10">
                    
                    {/* Header */}
                    <h3 className="text-[#64ffda] font-bold text-lg tracking-[0.5em] uppercase mb-2 shadow-black drop-shadow-md" style={{ animation: 'fadeInDown 0.6s ease-out forwards' }}>
                        {tournamentName || "LIVE BROADCAST"}
                    </h3>

                    {/* Main Text */}
                    <div className="relative" style={{ animation: 'zoomIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 0.2s', opacity: 0 }}>
                        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-[#64ffda] uppercase tracking-widest drop-shadow-[0_10px_10px_rgba(0,0,0,1)] text-center">
                            DRINKS BREAK
                        </h1>
                    </div>

                    {/* Subtext */}
                    <p className="text-blue-200/70 font-semibold tracking-widest mt-4 uppercase text-sm" style={{ animation: 'fadeInUp 0.8s ease-out forwards 0.4s', opacity: 0 }}>
                        Time for a quick breather
                    </p>
                    
                    {/* Water drop graphic */}
                    <div className="absolute top-4 left-10 opacity-10">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="#64ffda"><path d="M12 21.5c-3.31 0-6-2.69-6-6 0-3.1 4.54-10.74 5.51-12.27.24-.37.75-.37.99 0C13.46 4.76 18 12.4 18 15.5c0 3.31-2.69 6-6 6z"/></svg>
                    </div>
                    <div className="absolute bottom-4 right-10 opacity-10">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="#64ffda"><path d="M12 21.5c-3.31 0-6-2.69-6-6 0-3.1 4.54-10.74 5.51-12.27.24-.37.75-.37.99 0C13.46 4.76 18 12.4 18 15.5c0 3.31-2.69 6-6 6z"/></svg>
                    </div>
                </div>

                <style>{`
                    @keyframes fadeInDown {
                        from { transform: translateY(-20px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    @keyframes fadeInUp {
                        from { transform: translateY(20px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    @keyframes zoomIn {
                        from { transform: scale(0.9); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                `}</style>
            </div>
        </div>
    );
}
