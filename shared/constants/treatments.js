export const TREATMENT_OFFERS = [
    {
        id: "udvarthana",
        name: "Udvarthana Herbal Powder Scrub",
        focusDosha: "kapha",
        durationMinutes: 75,
        description:
            "Stimulating full-body scrub with warm herbal powders to activate lymphatic flow and mobilize kapha stagnation before eliminative therapies.",
        idealPhase: "Purva Karma · Preparation",
        recommendedResources: ["Massage Cot", "Herbal Powder Kit", "Steam Unit"],
        steps: [
            {
                name: "Pre-steam warm up",
                durationMinutes: 10,
                description: "Gentle swedana to open channels prior to herbal scrub application.",
                instructions: ["Light steam", "Protect head from excess heat"],
            },
            {
                name: "Herbal powder massage",
                durationMinutes: 50,
                description: "Rhythmic upward strokes with warm powders to exfoliate and stimulate circulation.",
                instructions: ["Focus on lymphatic drainage pathways", "Adjust pressure per patient tolerance"],
            },
            {
                name: "Post-scrub rest",
                durationMinutes: 15,
                description: "Allow powders to settle before warm water cleanse and hydration guidance.",
                instructions: ["Cover with warm sheet", "Offer warm ginger water"],
            },
        ],
    },
    {
        id: "abhyanga_swedana",
        name: "Abhyanga with Herbal Swedana",
        focusDosha: "vata",
        durationMinutes: 90,
        description:
            "Classic medicated oil massage followed by localized steam to nourish tissues, calm vata, and ready the body for deeper detox.",
        idealPhase: "Purva Karma · Snehan & Swedana",
        recommendedResources: ["Shirodhara Table", "Steam Box", "Medicated Oils"],
        steps: [
            {
                name: "Full-body abhyanga",
                durationMinutes: 60,
                description: "Synchronized massage with warm oil to lubricate joints and soothe the nervous system.",
                instructions: ["Use dosha-specific oil", "Maintain continuous strokes"],
            },
            {
                name: "Localized steam therapy",
                durationMinutes: 20,
                description: "Targeted fomentation over key muscle groups to loosen ama.",
                instructions: ["Monitor heat tolerance", "Protect heart region"],
            },
            {
                name: "Grounding recovery",
                durationMinutes: 10,
                description: "Cooling towel wipe-down followed by light snack guidance.",
                instructions: ["Offer warm water", "Suggest light kitchari"],
            },
        ],
    },
    {
        id: "shirodhara",
        name: "Shirodhara Calming Stream",
        focusDosha: "pitta",
        durationMinutes: 60,
        description:
            "Steady stream of medicated oil over the forehead to quiet the mind, regulate hormones, and ease pitta-driven stress.",
        idealPhase: "Throughout cleanse · Nervous system support",
        recommendedResources: ["Shirodhara Stand", "Dhara Pot", "Medicated Oil"],
        steps: [
            {
                name: "Head and neck warm-up",
                durationMinutes: 10,
                description: "Short abhyanga of scalp and neck to settle patient before flow starts.",
                instructions: ["Seat patient comfortably", "Check oil temperature"],
            },
            {
                name: "Shirodhara flow",
                durationMinutes: 40,
                description: "Continuous stream covering brow line in gentle patterns.",
                instructions: ["Maintain rhythm", "Adjust flow width every 5 minutes"],
            },
            {
                name: "Integration",
                durationMinutes: 10,
                description: "Quiet rest with head wrap, followed by herbal tea guidance.",
                instructions: ["Wrap head with cotton", "Offer brahmi tea"],
            },
        ],
    },
    {
        id: "pizhichil",
        name: "Pizhichil Royal Oil Bath",
        focusDosha: "vata",
        durationMinutes: 105,
        description:
            "Continuous warm oil stream massage combining snehan and swedana to relieve joint pain and deep-seated vata imbalance.",
        idealPhase: "Purva Karma · Intensive Snehan",
        recommendedResources: ["Oil Bath Setup", "Heated Oil Reservoir", "Two Therapists"],
        steps: [
            {
                name: "Oil stream massage",
                durationMinutes: 70,
                description: "Team choreography to bathe body with medicated oil while massaging in long strokes.",
                instructions: ["Maintain oil at 40°C", "Rotate therapists for endurance"],
            },
            {
                name: "Thermal sealing",
                durationMinutes: 20,
                description: "Blanket wrap to lock in warmth and promote absorption.",
                instructions: ["Monitor sweating", "Ventilate room mildly"],
            },
            {
                name: "Recovery & hydration",
                durationMinutes: 15,
                description: "Gentle wipe-down, rehydration, and post-care briefing.",
                instructions: ["Offer cumin-coriander tea", "Advise rest for remainder of day"],
            },
        ],
    },
    {
        id: "nasya",
        name: "Nasya Sinus Cleanse",
        focusDosha: "kapha",
        durationMinutes: 45,
        description:
            "Therapeutic nasal administration to clear prana pathways, relieve kapha congestion, and sharpen senses.",
        idealPhase: "Purva Karma · Daily Therapy",
        recommendedResources: ["Nasya Drops", "Mild Steam Setup", "Shoulder Support"],
        steps: [
            {
                name: "Face steam & massage",
                durationMinutes: 15,
                description: "Warm compress and gentle facial strokes to loosen sinus congestion.",
                instructions: ["Use eucalyptus steam", "Protect eyes"],
            },
            {
                name: "Nasya instillation",
                durationMinutes: 10,
                description: "Administer medicated drops with head tilted back for optimal absorption.",
                instructions: ["Support neck", "Massage sinus points post drops"],
            },
            {
                name: "Post-care breathing",
                durationMinutes: 20,
                description: "Guided pranayama and rest while drainage completes.",
                instructions: ["Encourage nadi shodhana", "Provide warm towel"],
            },
        ],
    },
    {
        id: "kati_basti",
        name: "Kati Basti Lumbar Therapy",
        focusDosha: "vata",
        durationMinutes: 60,
        description:
            "Dough dam filled with warm medicated oil over the lower back to relieve stiffness and nourish spinal tissues.",
        idealPhase: "Pradhana Karma · Supportive Care",
        recommendedResources: ["Dough Dam Kit", "Heating Plate", "Therapeutic Oil"],
        steps: [
            {
                name: "Dough dam prep",
                durationMinutes: 10,
                description: "Shape flour dough ring and secure over lumbar region.",
                instructions: ["Ensure seal prevents leakage", "Test patient comfort"],
            },
            {
                name: "Oil pooling",
                durationMinutes: 35,
                description: "Maintain warm oil pool, replacing as temperature drops.",
                instructions: ["Check temperature every 5 minutes", "Cover patient with blanket"],
            },
            {
                name: "Post-therapy mobilization",
                durationMinutes: 15,
                description: "Gentle spinal stretches and instructions for home care.",
                instructions: ["Guide cat-cow movements", "Suggest warm compress nightly"],
            },
        ],
    },
    {
        id: "matra_basti",
        name: "Matra / Anuvasana Basti",
        focusDosha: "vata",
        durationMinutes: 50,
        description:
            "Nourishing oil enema to lubricate colon, balance vata, and support elimination during Panchakarma.",
        idealPhase: "Pradhana Karma · Vasti",
        recommendedResources: ["Sterile Basti Kit", "Private Therapy Room", "Supervising Practitioner"],
        steps: [
            {
                name: "Preparation & briefing",
                durationMinutes: 10,
                description: "Explain process, check vitals, and ensure bladder elimination.",
                instructions: ["Confirm light meal 2 hours prior", "Offer calming breathwork"],
            },
            {
                name: "Oil administration",
                durationMinutes: 10,
                description: "Warm oil gently infused with patient on left lateral pose.",
                instructions: ["Use sterile technique", "Maintain steady pace"],
            },
            {
                name: "Retention & observation",
                durationMinutes: 30,
                description: "Patient rests while practitioner monitors comfort and response.",
                instructions: ["Dim lights", "Provide warm blanket"],
            },
        ],
    },
    {
        id: "virechana_pre",
        name: "Virechana Preparation Consult",
        focusDosha: "pitta",
        durationMinutes: 40,
        description:
            "Detailed consultation to brief patient on purgation day protocol, herbs, and post-care diet.",
        idealPhase: "Transition to Virechana",
        recommendedResources: ["Consultation Room", "Diet Protocol Handouts", "Herbal Kit"],
        steps: [
            {
                name: "Assessment & customization",
                durationMinutes: 15,
                description: "Review vitals, prakriti, and current response to preparatory therapies.",
                instructions: ["Update vitals chart", "Note contraindications"],
            },
            {
                name: "Protocol briefing",
                durationMinutes: 15,
                description: "Walk through herbal dosage, schedule, and warning signs.",
                instructions: ["Demonstrate dosage measurement", "Provide written schedule"],
            },
            {
                name: "Diet & aftercare guidance",
                durationMinutes: 10,
                description: "Share cleansing diet plan, rest instructions, and contact details.",
                instructions: ["Highlight hydration goals", "Confirm support availability"],
            },
        ],
    },
];

export const getTreatmentById = (id) =>
    TREATMENT_OFFERS.find((treatment) => treatment.id === id) || null;

export default TREATMENT_OFFERS;
