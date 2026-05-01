import { useEffect, useState } from "react";

export default function VersusOverlay({ show, teamOneName, teamTwoName, teamOneLogo, teamTwoLogo, tournamentName, onClose }: any) {
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

    const t1Name = teamOneName || "TEAM ONE";
    const t2Name = teamTwoName || "TEAM TWO";
    const t1Logo = teamOneLogo || "https://placehold.co/300x300/1e3a8a/white?text=T1";
    const t2Logo = teamTwoLogo || "https://placehold.co/300x300/7f1d1d/white?text=T2";

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none font-sans">
            {/* Soft Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 pointer-events-auto ${show ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            ></div>

            {/* Main Clean Container */}
            <div className={`relative w-[1100px] h-[350px] flex flex-col transition-all duration-700 transform ${show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                
                {/* Header Banner */}
                <div className="mx-auto bg-[#ffb703] text-black px-8 py-2 rounded-t-lg font-bold text-[15px] tracking-[0.2em] uppercase shadow-md z-20">
                    {tournamentName || "LIVE MATCH INTRODUCTION"}
                </div>

                {/* Central Panel */}
                <div className="flex-1 bg-gradient-to-b from-[#1a202c] to-[#0f172a] rounded-2xl shadow-2xl border border-gray-700/50 flex items-center justify-between px-16 relative overflow-hidden">
                    
                    {/* Subtle Background Accent */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#fff_10px,#fff_20px)]"></div>

                    {/* Team 1 */}
                    <div className="flex items-center space-x-6 w-[40%] z-10" style={{ animation: 'fadeSlideLeft 0.8s ease-out forwards' }}>
                        <div className="w-36 h-36 bg-white/5 rounded-full p-4 border border-white/10 shadow-lg flex-shrink-0">
                            <img src={t1Logo} className="w-full h-full object-contain drop-shadow-md" alt="Team 1 Logo" />
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-wider leading-tight">
                            {t1Name}
                        </h2>
                    </div>

                    {/* VS Circle */}
                    <div className="relative flex flex-col items-center justify-center z-20" style={{ animation: 'fadeScaleIn 0.8s ease-out forwards 0.2s', opacity: 0 }}>
                        <div className="w-20 h-20 bg-[#ffb703] rounded-full flex items-center justify-center shadow-xl border-4 border-[#0f172a]">
                            <span className="text-2xl font-black text-[#0f172a] italic">VS</span>
                        </div>
                    </div>

                    {/* Team 2 */}
                    <div className="flex items-center space-x-6 w-[40%] flex-row-reverse space-x-reverse z-10" style={{ animation: 'fadeSlideRight 0.8s ease-out forwards' }}>
                        <div className="w-36 h-36 bg-white/5 rounded-full p-4 border border-white/10 shadow-lg flex-shrink-0">
                            <img src={t2Logo} className="w-full h-full object-contain drop-shadow-md" alt="Team 2 Logo" />
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-wider leading-tight text-right">
                            {t2Name}
                        </h2>
                    </div>

                </div>

                <style>{`
                    @keyframes fadeSlideLeft {
                        from { transform: translateX(-30px); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes fadeSlideRight {
                        from { transform: translateX(30px); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes fadeScaleIn {
                        from { transform: scale(0.8); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                `}</style>
            </div>
        </div>
    );
}
