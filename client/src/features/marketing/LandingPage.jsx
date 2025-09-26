import { Link } from "react-router-dom";

const features = [
    {
        title: "Automated Panchakarma Scheduling",
        description:
            "Generate therapy journeys tailored to each patient's dosha balance, practitioner availability, and resource capacity with a single click.",
        icon: "📅",
    },
    {
        title: "Holistic Patient Monitoring",
        description:
            "Track pre- and post-procedure vitals, lifestyle guidance, and recovery milestones across every stage of the Panchakarma cleanse.",
        icon: "🧘",
    },
    {
        title: "Smart Notifications",
        description:
            "Deliver timely reminders through in-app alerts, SMS, or email so patients never miss a Snehan, Svedana, or Shodana step.",
        icon: "🔔",
    },
    {
        title: "Insightful Feedback Analytics",
        description:
            "Visualize symptom relief, energy levels, and mood improvements to continuously refine therapy plans.",
        icon: "📊",
    },
];

const therapies = [
    {
        name: "Vaman (Therapeutic Vomiting)",
        description:
            "Kapha-balancing detox that expels toxins from the upper body using emetic herbal formulations after Snehan and Svedana prep.",
    },
    {
        name: "Virechan (Purgation)",
        description:
            "Gentle yet potent bowel cleansing designed for Pitta disorders such as jaundice, colitis, and inflammatory skin conditions.",
    },
    {
        name: "Basti (Medicated Enema)",
        description:
            "Ayurveda's signature Vata therapy using herbal decoctions, oils, or ghee to nurture the colon and relieve chronic disorders.",
    },
    {
        name: "Nasya (Nasal Therapy)",
        description:
            "Cleanses the head and sinuses to alleviate headaches, insomnia, neurological imbalances, and long-standing respiratory issues.",
    },
    {
        name: "Raktamokshan (Blood Cleansing)",
        description:
            "Targeted detoxification that purifies the bloodstream to treat stubborn dermatological and localized inflammatory conditions.",
    },
];

const journeySteps = [
    {
        title: "Assess Dosha & Intake",
        copy: "Capture Prakriti, Vikriti, lifestyle patterns, and any contraindications to craft a personalized detox schedule.",
    },
    {
        title: "Design Therapy Blueprint",
    copy: "Publish ready-to-go Panchakarma treatments that map Snehan, Svedana, and Shodana combinations across the cleanse duration.",
    },
    {
        title: "Auto-Schedule & Coordinate",
        copy: "Match practitioners, therapy rooms, and equipment slots instantly while honoring prep/recovery buffers.",
    },
    {
        title: "Guide, Track, Refine",
        copy: "Send multi-channel reminders, capture post-session feedback, and evolve protocols with insightful analytics.",
    },
];

const testimonials = [
    {
        name: "Dr. Ananya Deshpande",
        role: "Lead Ayurvedic Consultant, Tridosha Wellness",
        quote:
            "VaidyaDesk lets our team deliver Panchakarma with precision. We finally coordinate therapists, rooms, and patient needs without scrambling.",
    },
    {
        name: "Rohan Menon",
        role: "Panchakarma Recipient",
        quote:
            "Daily reminders and progress charts made my cleanse effortless. I could sense improvements and share feedback instantly with my doctor.",
    },
];

const stats = [
    { value: "6x", label: "Faster therapy planning" },
    { value: "92%", label: "Patient adherence uplift" },
    { value: "24/7", label: "Responsive digital guidance" },
];

function SectionHeading({ eyebrow, title, description }) {
    return (
        <div className="section-container text-center">
            {eyebrow && (
                <span className="mb-3 inline-flex items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                    {eyebrow}
                </span>
            )}
            <h2 className="text-3xl font-semibold leading-tight text-slate-100 sm:text-4xl md:text-5xl">
                {title}
            </h2>
            {description && (
                <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
                    {description}
                </p>
            )}
        </div>
    );
}

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950 text-slate-50">
            <header className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.18),_transparent_55%)]" />
                <div className="section-container flex items-center justify-between py-6">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200">
                            VD
                        </span>
                        <div>
                            <p className="text-lg font-semibold tracking-wide">VaidyaDesk</p>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                                Panchakarma OS
                            </p>
                        </div>
                    </div>
                    <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 lg:flex">
                        <a
                            href="#features"
                            className="hover:text-emerald-200"
                        >
                            Why VaidyaDesk
                        </a>
                        <a
                            href="#therapies"
                            className="hover:text-emerald-200"
                        >
                            Therapies
                        </a>
                        <a
                            href="#journey"
                            className="hover:text-emerald-200"
                        >
                            Journey
                        </a>
                        <a
                            href="#testimonials"
                            className="hover:text-emerald-200"
                        >
                            Voices
                        </a>
                    </nav>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/login"
                            className="rounded-full border border-emerald-400/40 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:border-emerald-300/60 hover:text-emerald-100"
                        >
                            Sign in
                        </Link>
                        <Link
                            to="/register"
                            className="hidden rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300 lg:inline-flex"
                        >
                            Start free trial
                        </Link>
                    </div>
                </div>

                <div className="section-container grid gap-10 pb-24 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-slate-300 backdrop-blur">
                            Panchakarma, digitized with care
                        </div>
                        <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
                            Orchestrate authentic Panchakarma journeys with modern precision.
                        </h1>
                        <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
                            VaidyaDesk unifies therapists, treatment rooms, herbal inventory, and patient needs. Build Snehan-to-Shodana plans, auto-schedule resources, and guide every patient with personalized education and empathetic follow-up.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/register"
                                className="flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300"
                            >
                                Create an account
                            </Link>
                            <Link
                                to="/login"
                                className="flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
                            >
                                View practitioner dashboard
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-8 pt-4 text-sm text-slate-300">
                            {stats.map((stat) => (
                                <div key={stat.value}>
                                    <div className="text-3xl font-semibold text-emerald-300">
                                        {stat.value}
                                    </div>
                                    <p className="mt-1 text-slate-400">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute right-10 top-6 hidden h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl lg:block" />
                        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur">
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
                                Session Flow Preview
                            </p>
                            <div className="mt-6 space-y-4">
                                {[
                                    {
                                        title: "Day 01 · Snehan & Abhyanga",
                                        subtitle: "Vata pacification · Therapist: Megha",
                                    },
                                    {
                                        title: "Day 03 · Svedana",
                                        subtitle: "Herbal steam · Room: Agni Suite",
                                    },
                                    {
                                        title: "Day 05 · Virechan",
                                        subtitle: "Pitta detox · Prep window confirmed",
                                    },
                                    {
                                        title: "Day 07 · Nasya",
                                        subtitle: "Head rejuvenation · Post-care sent",
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.title}
                                        className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 shadow-lg shadow-slate-950/70"
                                    >
                                        <p className="text-sm font-semibold text-white">
                                            {item.title}
                                        </p>
                                        <p className="mt-1 text-xs text-emerald-200">
                                            {item.subtitle}
                                        </p>
                                        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                                            <span>Prep ✓</span>
                                            <span>Resources ✓</span>
                                            <span>Notifications ✓</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="space-y-28 pb-24">
                <section id="features" className="section-container">
                    <SectionHeading
                        eyebrow="Why Practitioners Choose Us"
                        title="A digital nerve center for classical Panchakarma care"
                        description="Streamline pre-purification prep, therapy assignments, and recovery coaching while preserving the authenticity of Ayurveda."
                    />
                    <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="group rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl transition hover:-translate-y-1 hover:border-emerald-300/40 hover:bg-emerald-400/10"
                            >
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/20 text-lg">
                                    <span aria-hidden>{feature.icon}</span>
                                </div>
                                <h3 className="text-xl font-semibold text-white">
                                    {feature.title}
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="therapies" className="bg-slate-900/40 py-16">
                    <SectionHeading
                        eyebrow="Five Foundational Therapies"
                        title="We honor every Panchakarma pillar"
                        description="Design individualized detox pathways with vivid guidance for every cleansing modality—Vata, Pitta, and Kapha stay balanced from consult to completion."
                    />
                    <div className="section-container mt-12 grid gap-6 lg:grid-cols-2">
                        {therapies.map((therapy) => (
                            <article
                                key={therapy.name}
                                className="rounded-3xl border border-white/5 bg-white/5 p-6 shadow-lg backdrop-blur transition hover:border-emerald-300/30 hover:bg-emerald-400/5"
                            >
                                <h3 className="text-xl font-semibold text-white">
                                    {therapy.name}
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                                    {therapy.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>

                <section id="journey" className="section-container">
                    <SectionHeading
                        eyebrow="Guided Journey"
                        title="From intake to rejuvenation in four graceful steps"
                    />
                    <div className="mt-12 grid gap-6 md:grid-cols-2">
                        {journeySteps.map((step, index) => (
                            <div
                                key={step.title}
                                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg"
                            >
                                <span className="absolute -right-6 -top-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-4xl font-bold text-emerald-200">
                                    0{index + 1}
                                </span>
                                <h3 className="text-xl font-semibold text-white">
                                    {step.title}
                                </h3>
                                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                                    {step.copy}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="section-container">
                    <div className="grid gap-10 rounded-3xl border border-white/10 bg-slate-900/60 p-10 shadow-2xl backdrop-blur md:grid-cols-[1.1fr_0.9fr]">
                        <div>
                            <h3 className="text-3xl font-semibold text-white sm:text-4xl">
                                Never miss a Snehan, Svedana, or Shodana again.
                            </h3>
                            <p className="mt-4 text-sm leading-relaxed text-slate-300">
                                Automated notifications orchestrate preparation windows, therapy sequencing, diet reminders, and recovery guidance so your team stays in flow and patients stay committed. Choose in-app, SMS, or email nudges—or all three.
                            </p>
                            <ul className="mt-6 space-y-3 text-sm text-slate-200">
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 text-emerald-300">✓</span>
                                    <span>
                                        Dynamic scheduling that adapts to therapist availability and room resources in real time.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 text-emerald-300">✓</span>
                                    <span>
                                        Pre- and post-therapy checklists that honour dosha-specific diet, rest, and herbal support.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 text-emerald-300">✓</span>
                                    <span>
                                        Rich feedback loop to capture symptom shifts, emotional wellbeing, and energy levels.
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-6 text-slate-100">
                            <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
                                Notification Timeline
                            </h4>
                            <div className="mt-5 space-y-4 text-sm">
                                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                                    <p className="font-semibold text-white">
                                        12 hrs before Virechan
                                    </p>
                                    <p className="mt-1 text-xs text-emerald-200">
                                        SMS · Hydration, light meals, rest guidance
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                                    <p className="font-semibold text-white">
                                        Post Nasya check-in
                                    </p>
                                    <p className="mt-1 text-xs text-emerald-200">
                                        In-app · Breathing exercises, head massage tips
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="font-semibold text-white">Day 10 follow-up</p>
                                    <p className="mt-1 text-xs text-emerald-200">
                                        Email · Lifestyle sheet, herbal support update
                                    </p>
                                </div>
                            </div>
                            <button className="mt-6 w-full rounded-full bg-emerald-400 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-300">
                                See Notification Playbook
                            </button>
                        </div>
                    </div>
                </section>

                <section id="testimonials" className="bg-slate-900/40 py-16">
                    <SectionHeading
                        eyebrow="Testimonials"
                        title="Trusted by Ayurvedic centers and Panchakarma recipients"
                    />
                    <div className="section-container mt-12 grid gap-6 md:grid-cols-2">
                        {testimonials.map((testimonial) => (
                            <blockquote
                                key={testimonial.name}
                                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur"
                            >
                                <p className="text-lg italic text-slate-200">
                                    “{testimonial.quote}”
                                </p>
                                <footer className="mt-6 text-sm text-slate-400">
                                    <p className="font-semibold text-slate-100">
                                        {testimonial.name}
                                    </p>
                                    <p>{testimonial.role}</p>
                                </footer>
                            </blockquote>
                        ))}
                    </div>
                </section>

                <section className="section-container text-center">
                    <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-r from-emerald-500/20 via-emerald-400/10 to-sky-500/20 p-10 shadow-2xl">
                        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/30 blur-3xl" />
                        <div className="absolute bottom-0 right-0 h-60 w-60 translate-x-24 translate-y-24 rounded-full bg-sky-400/20 blur-3xl" />
                        <h3 className="text-3xl font-semibold text-white sm:text-4xl">
                            Ready to elevate your Panchakarma practice?
                        </h3>
                        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-100">
                            Launch a unified command center for intake, scheduling, notifications, and compassionate patient engagement.
                        </p>
                        <div className="mt-6 flex flex-wrap justify-center gap-4">
                            <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100">
                                Book a Guided Tour
                            </button>
                            <button className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:border-white">
                                Download Starter Kit
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 bg-slate-950/80 py-10">
                <div className="section-container flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-400">
                    <div>
                        <p className="text-base font-semibold text-slate-100">VaidyaDesk</p>
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                            Panchakarma Operating System
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <a
                            href="#features"
                            className="hover:text-emerald-200"
                        >
                            Features
                        </a>
                        <a
                            href="#therapies"
                            className="hover:text-emerald-200"
                        >
                            Therapies
                        </a>
                        <a
                            href="#journey"
                            className="hover:text-emerald-200"
                        >
                            Journey
                        </a>
                        <a
                            href="#testimonials"
                            className="hover:text-emerald-200"
                        >
                            Testimonials
                        </a>
                    </div>
                    <p className="text-xs text-slate-600">
                        © {new Date().getFullYear()} VaidyaDesk. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
