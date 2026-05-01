import { useEffect, useState } from 'react';

export default function Overlay({ type }: { type: string | null }) {
    const [activeType, setActiveType] = useState<string | null>(type);
    const [show, setShow] = useState(Boolean(type));

    useEffect(() => {
        if (type) {
            setActiveType(type);
            window.requestAnimationFrame(() => setShow(true));

            return;
        }

        setShow(false);
        const timeout = window.setTimeout(() => setActiveType(null), 500);

        return () => window.clearTimeout(timeout);
    }, [type]);

    if (!activeType) {
        return null;
    }

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden pointer-events-none transition-all duration-500 ease-out ${
                show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
        >
            <style>{`
                @keyframes slideInGlow {
                    0% { transform: translateX(-150%) skewX(-15deg); opacity: 0; }
                    60% { transform: translateX(5%) skewX(-15deg); opacity: 1; }
                    100% { transform: translateX(0) skewX(-15deg); opacity: 1; }
                }
                @keyframes popSix {
                    0% { transform: scale(0.1) translateY(200px); opacity: 0; }
                    60% { transform: scale(1.1) translateY(-20px); opacity: 1; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                @keyframes smashWicket {
                    0% { transform: scale(3); opacity: 0; filter: blur(15px); }
                    50% { transform: scale(0.9); opacity: 1; filter: blur(0px); }
                    75% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                @keyframes flashRedBg {
                    0%, 100% { background-color: rgba(220, 38, 38, 0.85); box-shadow: 0 0 80px rgba(220,38,38,0.8); }
                    50% { background-color: rgba(153, 27, 27, 0.95); box-shadow: 0 0 120px rgba(153,27,27,1); }
                }
                @keyframes zoomTextFour {
                    0% { letter-spacing: -20px; opacity: 0; }
                    100% { letter-spacing: 8px; opacity: 1; }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px) rotate(-1deg); }
                    75% { transform: translateX(10px) rotate(1deg); }
                }
            `}</style>

            {activeType === "FOUR" && (
                <div 
                    className="relative px-24 py-6 bg-gradient-to-r from-[#003366] via-[#0055ff] to-[#00bfff] border-y-8 border-white shadow-[0_0_100px_rgba(0,191,255,0.8)]"
                    style={{ animation: 'slideInGlow 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}
                >
                    <div className="absolute inset-0 bg-white/20 skew-x-[45deg] animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC4yIi8+PC9zdmc+')] z-0 pointer-events-none"></div>
                    <h1 
                        className="text-[130px] font-black text-white italic drop-shadow-[6px_6px_0_#001a33] relative z-10 m-0 leading-none"
                        style={{ animation: 'zoomTextFour 1s ease-out forwards' }}
                    >
                        FOUR
                    </h1>
                </div>
            )}

            {activeType === "SIX" && (
                <div className="relative flex flex-col items-center justify-center">
                    <div 
                        className="absolute bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-400/60 via-orange-600/30 to-transparent blur-3xl"
                        style={{ width: '800px', height: '600px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', animation: 'pulse 2s infinite' }}
                    ></div>
                    <h1 
                        className="text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-b from-[#fff700] via-[#ffa500] to-[#ff0000] italic relative z-10 m-0 leading-none"
                        style={{ 
                            animation: 'popSix 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                            WebkitTextStroke: '5px white',
                            filter: 'drop-shadow(0 25px 25px rgba(255, 69, 0, 0.8)) drop-shadow(0 0 10px rgba(0,0,0,1))'
                        }}
                    >
                        SIX
                    </h1>
                    <div 
                        className="text-white text-5xl font-black tracking-[0.5em] uppercase mt-[-10px] z-10"
                        style={{ animation: 'popSix 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 0.2s', opacity: 0, textShadow: '0 5px 10px #000' }}
                    >
                        Maximum
                    </div>
                </div>
            )}

            {activeType === "WICKET" && (
                <div 
                    className="w-full flex items-center justify-center py-12 border-y-8 border-[#500] relative overflow-hidden"
                    style={{ animation: 'flashRedBg 0.4s infinite alternate' }}
                >
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(0,0,0,0.3)_20px,rgba(0,0,0,0.3)_40px)] mix-blend-multiply"></div>
                    <h1 
                        className="text-[160px] font-black text-white tracking-tighter uppercase relative z-10 m-0 leading-none"
                        style={{ 
                            animation: 'smashWicket 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards, shake 0.5s ease-in-out infinite alternate 0.6s',
                            textShadow: '12px 12px 0 #000, -2px -2px 0 #fff, 0 0 60px #fff'
                        }}
                    >
                        WICKET
                    </h1>
                </div>
            )}
        </div>
    );
}
