import React from 'react';

export const AreaChart = ({ data = [40, 60, 45, 90, 65, 80, 70], color = "#6366f1", isDark = false }) => {
    const height = 120;
    const width = 400;
    const padding = 20;
    const maxValue = Math.max(...data);
    
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
        const y = height - (val / maxValue) * (height - 2 * padding) - padding;
        return { x, y };
    });

    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const curr = points[i];
        const next = points[i + 1];
        const cx = (curr.x + next.x) / 2;
        d += ` C ${cx},${curr.y} ${cx},${next.y} ${next.x},${next.y}`;
    }

    const areaPath = `${d} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <defs>
                <linearGradient id={`areaGradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.12" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            {/* Subtle Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                <line 
                    key={i}
                    x1={padding} y1={padding + p * (height - 2 * padding)} 
                    x2={width - padding} y2={padding + p * (height - 2 * padding)} 
                    stroke={isDark ? "#ffffff08" : "#00000005"} strokeWidth="1" 
                />
            ))}
            <path d={areaPath} fill={`url(#areaGradient-${color})`} />
            <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3" fill={color} />
        </svg>
    );
};

export const SkillBar = ({ label, percentage, color = "bg-indigo-600", isDark = false }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-end">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
            <span className={`text-[10px] font-black ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{percentage}%</span>
        </div>
        <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
            <div 
                className={`h-full ${color} rounded-full transition-all duration-1000 ease-[cubic-bezier(0.25, 0.1, 0.25, 1)]`}
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    </div>
);

export const DonutChart = ({ percentage = 75, label = "Score", color = "#6366f1", isDark = false }) => {
    const size = 100;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center">
            <svg height={size} width={size} className="-rotate-90">
                <circle
                    stroke={isDark ? "#ffffff05" : "#00000005"}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    stroke={color}
                    fill="transparent"
                    strokeDasharray={circumference}
                    style={{ strokeDashoffset: offset }}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{percentage}%</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">{label}</span>
            </div>
        </div>
    );
};
