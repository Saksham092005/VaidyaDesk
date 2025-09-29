import { useId, useMemo } from "react";

const Sparkline = ({ values, width = 220, height = 80, stroke = "#34d399", fill = "rgba(52, 211, 153, 0.12)", showArea = false }) => {
    const pathData = useMemo(() => {
        if (!values?.length) {
            return { line: "", area: "" };
        }

        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min || 1;

        const stepX = width / Math.max(values.length - 1, 1);
        const points = values.map((value, index) => {
            const x = index * stepX;
            const normalized = (value - min) / range;
            const y = height - normalized * height;
            return [x, y];
        });

        const line = points
            .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`)
            .join(" ");

        const lastPoint = points[points.length - 1];
        const area = showArea
            ? `${line} L${lastPoint[0].toFixed(2)} ${height.toFixed(2)} L0 ${height.toFixed(2)} Z`
            : "";

        return { line, area };
    }, [values, width, height, showArea]);

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="h-20 w-full" preserveAspectRatio="none">
            {showArea && pathData.area ? (
                <path d={pathData.area} fill={fill} stroke="none" />
            ) : null}
            {pathData.line ? (
                <path d={pathData.line} fill="none" stroke={stroke} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            ) : null}
        </svg>
    );
};

const GaugeRing = ({ value, max = 100, label, trend }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const clamped = Math.min(Math.max(value, 0), max);
    const progress = clamped / max;
    const dashOffset = circumference * (1 - progress);
    const rawId = useId();
    const gradientId = useMemo(() => rawId.replace(/:/g, ""), [rawId]);

    return (
        <div className="flex items-center gap-5 rounded-2xl border border-white/10 bg-slate-950/50 p-5">
            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                <circle
                    className="text-slate-800"
                    stroke="currentColor"
                    strokeWidth={10}
                    fill="transparent"
                    cx={50}
                    cy={50}
                    r={radius}
                    opacity={0.4}
                />
                <circle
                    stroke={`url(#${gradientId})`}
                    strokeWidth={10}
                    strokeLinecap="round"
                    fill="transparent"
                    cx={50}
                    cy={50}
                    r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                />
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                </defs>
            </svg>
            <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
                <p className="mt-1 text-xs text-emerald-300">{trend}</p>
            </div>
        </div>
    );
};

const BalanceBar = ({ label, value, helper }) => (
    <div className="space-y-2 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
                {helper ? <p className="text-xs text-slate-500">{helper}</p> : null}
            </div>
            <p className="text-sm font-semibold text-white">{value}%</p>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-slate-800/70">
            <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-500"
                style={{ width: `${value}%` }}
            />
        </div>
    </div>
);

const TrendCard = ({ title, subtitle, data, unit, stroke, fill, showArea }) => (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/50 p-5">
        <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{subtitle}</p>
            <h3 className="mt-1 text-lg font-semibold text-white">{title}</h3>
        </div>
        <Sparkline values={data} stroke={stroke} fill={fill} showArea={showArea} />
        <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Last 7 days</span>
            <span>
                Peak {Math.max(...data)} {unit}
            </span>
        </div>
    </div>
);

const BalanceOverview = () => {
    const metrics = [
        {
            label: "Hydration",
            value: 82,
            helper: "Herbal infusions & electrolyte water",
        },
        {
            label: "Mindfulness",
            value: 74,
            helper: "Morning pranayama consistency",
        },
        {
            label: "Nourishment",
            value: 68,
            helper: "Seasonal sattvic meals logged",
        },
    ];

    return (
        <div className="space-y-3">
            {metrics.map((metric) => (
                <BalanceBar key={metric.label} {...metric} />
            ))}
        </div>
    );
};

const trendSeries = [
    {
        title: "Vital energy",
        subtitle: "Prana capacity",
        unit: "%",
        data: [68, 72, 75, 73, 78, 81, 84],
        stroke: "#34d399",
        fill: "rgba(52, 211, 153, 0.18)",
        showArea: true,
    },
    {
        title: "Sleep restoration",
        subtitle: "Deep rest score",
        unit: "pts",
        data: [62, 65, 63, 70, 72, 76, 79],
        stroke: "#38bdf8",
        fill: "rgba(56, 189, 248, 0.18)",
        showArea: true,
    },
    {
        title: "Nervous system ease",
        subtitle: "Vata calming",
        unit: "pts",
        data: [58, 60, 63, 61, 67, 70, 73],
        stroke: "#a855f7",
        fill: "rgba(168, 85, 247, 0.18)",
        showArea: false,
    },
    {
        title: "Metabolic harmony",
        subtitle: "Agni balance",
        unit: "%",
        data: [71, 69, 72, 74, 78, 80, 82],
        stroke: "#f97316",
        fill: "rgba(249, 115, 22, 0.18)",
        showArea: true,
    },
];

const HealthInsightsSection = () => {
    return (
        <section className="space-y-6 rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-400/10 via-slate-900/60 to-fuchsia-500/10 p-6 shadow-lg shadow-slate-950/40">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Mind-body insights</p>
                    <h2 className="mt-1 text-2xl font-semibold text-white">Your daily vitals at a glance</h2>
                    <p className="mt-3 max-w-xl text-sm text-slate-200">
                        These readings refresh with each journal entry, wearable sync, or practitioner note so you can celebrate momentum and
                        spot areas that need extra grounding.
                    </p>
                </div>
                <div className="ml-auto flex w-full max-w-xs flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-right shadow-inner">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Patient snapshot</p>
                    <p className="text-lg font-semibold text-white">Ananya Rao</p>
                    <p className="text-xs text-slate-400">Guided by Dr. Meera Sharma · Visit #12</p>
                    <div className="flex items-center justify-between text-xs text-slate-300">
                        <span>Journey stage</span>
                        <span className="font-medium text-emerald-300">Rejuvenation</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-300">
                        <span>Next check-in</span>
                        <span className="font-medium text-violet-300">Oct 3 · 9:30 AM</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="grid gap-4 md:grid-cols-2">
                    {trendSeries.map((series) => (
                        <TrendCard key={series.title} {...series} />
                    ))}
                </div>
                <div className="space-y-4">
                    <GaugeRing value={58} label="Resting heart rate" trend="Down 4 bpm since last week" />
                    <GaugeRing value={72} label="HRV balance" trend="+6 ms variability uplift" />
                    <BalanceOverview />
                </div>
            </div>
        </section>
    );
};

export default HealthInsightsSection;
