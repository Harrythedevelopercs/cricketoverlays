import { useEffect, useState } from "react";

export default function TeamOneStats({ show, onClose }: any) {

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setVisible(true);
        } else {
            setTimeout(() => setVisible(false), 300);
        }
    }, [show]);

    if (!visible) {
return null;
}

    const players = [
        { name: "RASHID KHAN", status: "c COLIN B AARON C", runs: 12 },
        { name: "MOHAMMAD AFZAL", status: "b RUPNARINE S", runs: 0 },
        { name: "ZAHEER AHMED", status: "RUN OUT (RAM R)", runs: 11 },
        { name: "FARMAN KHAN", status: "c DANT B RUPNARINE S", runs: 11 },
        { name: "SUFIAN MAHMOOD", status: "c YOUDEO N B JASON D", runs: 35 },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-start">

            {/* BACKDROP */}
            <div
                className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
                    show ? "opacity-100" : "opacity-0"
                }`}
                onClick={onClose}
            ></div>

            {/* PANEL */}
            <div
                className={`relative w-[700px] h-[80%] bg-[#06243A] text-white shadow-2xl transform transition-all duration-500 ${
                    show ? "translate-x-0" : "-translate-x-full"
                }`}
            >

                {/* HEADER */}
                <div className="flex items-center gap-3 px-6 py-4 bg-[#0B3554] border-b border-blue-400">

                    <img
                        src="/storage/livestream/team1.png"
                        className="h-10"
                    />

                    <h2 className="text-xl font-bold tracking-wide">
                        PAK GYMKHANA
                    </h2>
                </div>

                {/* LIST */}
                <div className="px-6 py-4 space-y-3 overflow-y-auto h-[70%]">

                    {players.map((p, index) => (
                        <div
                            key={index}
                            className="flex justify-between border-b border-gray-700 pb-2"
                        >
                            <div>
                                <p className="font-semibold">{p.name}</p>
                                <p className="text-xs text-blue-400">
                                    {p.status}
                                </p>
                            </div>

                            <div className="text-blue-400 font-bold">
                                {p.runs}
                            </div>
                        </div>
                    ))}

                </div>

                {/* FOOTER */}
                <div className="absolute bottom-0 w-full bg-[#0B3554] px-6 py-3 flex justify-between text-sm text-blue-300">

                    <p>OVERS 40.0</p>
                    <p>RR 2.67</p>
                    <p>EXTRAS 16</p>
                    <p className="font-bold text-white">TOTAL 107/10</p>

                </div>

            </div>
        </div>
    );
}