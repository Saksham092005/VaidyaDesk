import { Link } from "react-router-dom";

const journeyPhases = [
    {
        name: "Purva Karma",
        focus: "Preparation",
        copy: "Snehan (oleation), svedana (steam), and sattvic nutrition soften accumulated ama while anchoring the mind for deeper detox work.",
    },
    {
        name: "Pradhana Karma",
        focus: "Therapeutic cleanse",
        copy: "The five classical therapies unfold in sequence—Vaman, Virechan, Basti, Nasya, and Raktamokshan—each aligned to the guest's vikriti.",
    },
    {
        name: "Paschat Karma",
        focus: "Rejuvenation",
        copy: "Rasayana nourishment, kitchen rituals, and gentle routines stabilise agni, restore ojas, and integrate lifestyle guidance.",
    },
];

const therapyHighlights = [
    {
        title: "Virechan",
        descriptor: "Pitta harmonising",
        description: "Therapeutic purgation clears inflammatory heat, supports liver health, and relieves skin conditions with precision dosing.",
    },
    {
        title: "Basti",
        descriptor: "Vata balancing",
        description: "Medicated decoctions and ghee bathe the colon, calming the nervous system and easing chronic fatigue or joint tension.",
    },
    {
        title: "Nasya",
        descriptor: "Clarity and breath",
        description: "Herbal oils instilled through the nasal passages cleanse the head, encouraging clear sinuses, sound sleep, and sharpened senses.",
    },
];

const clinicPromises = [
    {
        title: "Dosha-first planning",
        copy: "Every cleanse blueprint begins with prakriti and vikriti insights, respecting the individuality of Kapha, Pitta, and Vata expressions.",
    },
    {
        title: "Seamless orchestration",
        copy: "Therapists, rooms, herbs, and follow-up guidance stay synchronised inside one calm workspace—no more manual juggling.",
    },
    {
        title: "Living education",
        copy: "Guests receive digestible notes, ritual reminders, and reflective journaling prompts that honour Ayurveda's timeless teaching style.",
    },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-940 to-slate-950 text-slate-100">
            <header className="border-b border-white/10 bg-slate-950/60 backdrop-blur">
                <div className="section-container flex flex-wrap items-center justify-between gap-4 py-6">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-200">
                            VD
                        </span>
                        <div>
                            <p className="text-lg font-semibold">VaidyaDesk</p>
                            <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/80">Panchakarma studio OS</p>
                        </div>
                    </div>
                    <nav className="flex items-center gap-6 text-xs uppercase tracking-[0.3em] text-slate-400">
                        <a href="#philosophy" className="hover:text-emerald-200">
                            Philosophy
                        </a>
                        <a href="#therapies" className="hover:text-emerald-200">
                            Therapies
                        </a>
                        <a href="#journey" className="hover:text-emerald-200">
                            Journey
                        </a>
                    </nav>
                    <div className="flex items-center gap-3 text-sm">
                        <Link
                            to="/login"
                            className="rounded-full border border-white/15 px-4 py-2 text-slate-200 transition hover:border-emerald-200/60 hover:text-emerald-100"
                        >
                            Sign in
                        </Link>
                        <Link
                            to="/register"
                            className="rounded-full bg-emerald-400 px-5 py-2 font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-300"
                        >
                            Begin trial
                        </Link>
                    </div>
                </div>
            </header>

            <main className="space-y-24 pb-24">
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_60%)]" />
                    <div className="section-container grid gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                        <div className="space-y-8">
                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-emerald-100">
                                Classical Panchakarma, modern clarity
                            </span>
                            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
                                Guide every cleanse with the ease and reverence Ayurveda deserves.
                            </h1>
                            <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
                                VaidyaDesk translates timeless detox principles into a calm digital workspace. Design therapies, brief guests, and orchestrate resources without losing the sacred rhythm of purification and rejuvenation.
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <Link
                                    to="/register"
                                    className="flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-300"
                                >
                                    Craft a cleanse plan
                                </Link>
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-emerald-200/60 hover:text-emerald-100"
                                >
                                    Explore practitioner view
                                </Link>
                            </div>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-emerald-500/20 backdrop-blur">
                            <div className="space-y-6 text-sm">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Clinic snapshot</p>
                                    <p className="mt-2 text-xl font-semibold text-white">12 active cleanses · 5 practitioners in flow</p>
                                    <p className="mt-1 text-xs text-slate-400">All therapy rooms prepared · Herbs curated for the week</p>
                                </div>
                                <div className="grid gap-3">
                                    {clinicPromises.map((promise) => (
                                        <div key={promise.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{promise.title}</p>
                                            <p className="mt-2 text-sm text-slate-200">{promise.copy}</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-400">
                                    Capture this hero section for your presentation to illustrate how VaidyaDesk centres both tradition and coordination.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="philosophy" className="section-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                    <div className="space-y-6">
                        <p className="text-xs uppercase tracking-[0.35em] text-emerald-200">Panchakarma in essence</p>
                        <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                            A seasonal ritual of release, restoration, and mindful living.
                        </h2>
                        <p className="text-base leading-relaxed text-slate-300">
                            Rooted in classical Ayurvedic texts, Panchakarma dissolves doshic excess, rekindles digestive fire, and nourishes the subtle body. Preparation opens the channels, therapeutic actions remove impurities, and rejuvenation seals balance through rasayana and daily routine.
                        </p>
                    </div>
                    <div className="grid gap-4 text-sm">
                        {journeyPhases.map((phase) => (
                            <article key={phase.name} className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-white/5 p-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-white">{phase.name}</p>
                                    <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs uppercase tracking-[0.3em] text-emerald-100">
                                        {phase.focus}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-300">{phase.copy}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section id="therapies" className="section-container space-y-8">
                    <div className="max-w-2xl space-y-4">
                        <p className="text-xs uppercase tracking-[0.35em] text-emerald-200">Five pillars · Pancha Karma</p>
                        <h2 className="text-3xl font-semibold text-white sm:text-4xl">Therapies that restore elemental symmetry</h2>
                        <p className="text-base leading-relaxed text-slate-300">
                            Each protocol is delivered with personalised prep, precise herbal support, and compassionate follow-up. Guests stay informed with simple explanations that honour the lineage behind every cleanse.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {therapyHighlights.map((therapy) => (
                            <article key={therapy.title} className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-slate-950/40">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white">{therapy.title}</h3>
                                    <span className="text-xs uppercase tracking-[0.28em] text-emerald-200">{therapy.descriptor}</span>
                                </div>
                                <p className="text-sm text-slate-300">{therapy.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section id="journey" className="section-container grid gap-10 rounded-3xl border border-white/10 bg-slate-900/60 p-10 shadow-2xl shadow-emerald-500/10">
                    <div className="space-y-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">How VaidyaDesk supports you</p>
                        <h2 className="text-3xl font-semibold text-white sm:text-4xl">Hold space for every guest with effortless coordination</h2>
                        <p className="text-base leading-relaxed text-slate-300">
                            While the cleanse unfolds, your team glides through scheduling, documentation, and education. Use this screen in presentations to show stakeholders how technology can protect sacred healing time.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <h3 className="text-lg font-semibold text-white">Daily flow</h3>
                            <p className="mt-3 text-sm text-slate-300">
                                Morning dashboards highlight upcoming therapies, prep checklists, and recovery notes without overwhelming detail.
                            </p>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <h3 className="text-lg font-semibold text-white">Guest storytelling</h3>
                            <p className="mt-3 text-sm text-slate-300">
                                Capture reflections, symptom shifts, and energy levels so practitioners can refine guidance with empathy.
                            </p>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <h3 className="text-lg font-semibold text-white">Resource harmony</h3>
                            <p className="mt-3 text-sm text-slate-300">
                                Treatment rooms, herbal kitchens, and support staff stay in sync—buffers and recovery windows are automatically honoured.
                            </p>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <h3 className="text-lg font-semibold text-white">Post-cleanse care</h3>
                            <p className="mt-3 text-sm text-slate-300">
                                Structured follow-ups maintain lifestyle shifts, reinforce dinacharya, and protect the gains of rejuvenation.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="section-container rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/15 via-slate-900/80 to-slate-950 p-10 text-center shadow-2xl shadow-emerald-500/20">
                    <h2 className="text-3xl font-semibold text-white sm:text-4xl">Ready to present a Panchakarma experience that feels serene and certain?</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-200">
                        VaidyaDesk preserves the heart of Ayurveda while freeing teams from coordination strain. Use this refreshed landing page in slides, proposals, or client walkthroughs to tell your story with grace.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
                        <Link
                            to="/register"
                            className="rounded-full bg-emerald-400 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300"
                        >
                            Start your free trial
                        </Link>
                        <Link
                            to="/login"
                            className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:border-emerald-200/60 hover:text-emerald-100"
                        >
                            Preview practitioner tools
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
                © {new Date().getFullYear()} VaidyaDesk · Guided technology for authentic Panchakarma care
            </footer>
        </div>
    );
}
