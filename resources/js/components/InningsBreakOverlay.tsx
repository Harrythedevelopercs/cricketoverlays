import { useEffect, useState } from "react";

export default function InningsBreakOverlay({ show, tournamentName, onClose }: any) {
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
                className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-700 pointer-events-auto ${show ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            ></div>

            {/* Main Clean Container */}
            <div className={`relative w-[900px] h-[300px] flex flex-col items-center justify-center transition-all duration-700 transform ${show ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                
                {/* Glow behind */}
                <div className="absolute inset-0 bg-[#0055ff] rounded-full blur-[100px] opacity-30 animate-pulse"></div>

                {/* Central Panel */}
                <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] rounded-xl shadow-2xl border-y-4 border-[#ffb703] flex flex-col items-center justify-center w-full py-12 px-16 relative overflow-hidden z-10">
                    
                    {/* Subtle Background pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] mix-blend-overlay"></div>

                    {/* Header */}
                    <h3 className="text-[#ffb703] font-bold text-xl tracking-[0.4em] uppercase mb-4 shadow-black drop-shadow-lg" style={{ animation: 'fadeInDown 0.8s ease-out forwards' }}>
                        {tournamentName || "LIVE BROADCAST"}
                    </h3>

                    {/* Main Text */}
                    <div className="relative" style={{ animation: 'zoomIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 0.2s', opacity: 0 }}>
                        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-400 uppercase tracking-widest drop-shadow-[0_10px_20px_rgba(0,0,0,1)] text-center">
                            INNINGS BREAK
                        </h1>
                        {/* Shimmer line */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-gradient-to-r from-transparent via-[#ffb703] to-transparent"></div>
                    </div>

                    {/* Subtext */}
                    <p className="text-gray-300 font-semibold tracking-widest mt-6 uppercase text-sm" style={{ animation: 'fadeInUp 0.8s ease-out forwards 0.4s', opacity: 0 }}>
                        Action Will Resume Shortly
                    </p>
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
                        from { transform: scale(0.8); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                `}</style>
            </div>
        </div>
    );
}
