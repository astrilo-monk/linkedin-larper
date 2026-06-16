export const LOADING_MESSAGES = [
  "Scanning for thought leadership...",
  "Measuring synergy density...",
  "Cross-referencing with reality...",
  "Detecting founder energy signatures...",
  "Analyzing buzzword-per-sentence ratio...",
  "Checking for AI hype contamination...",
  "Comparing title to actual job responsibilities...",
  "Searching for substance...",
  "Calculating LinkedIn-to-reality ratio...",
  "Evaluating thought leadership syndrome severity...",
];

export const ARCHETYPES = [
  "Corporate Alchemist",
  "Synergy Shaman",
  "KPI Necromancer",
  "AI Oracle",
  "Founder Emeritus",
  "Professional Panelist",
  "Fractional Human",
  "LinkedInfluencer",
  "Deck-Based Lifeform",
  "Vision Maxxer",
  "Disruption Tourist",
  "Growth Hacker Emeritus",
  "Serial Pivoter",
] as const;

export const QUICK_EXAMPLES = [
  "CEO & Founder | AI Visionary | Building the Future of Work | Ex-Google, Ex-Meta | Angel Investor | Speaker",
  "Fractional CMO | Growth Strategist | Helping Startups Scale 10x | Published Author | TEDx Speaker",
  "Software Engineer at Acme Corp",
];

export const DEEP_EXAMPLES = [
  `Serial entrepreneur and visionary leader with 15+ years of experience disrupting industries through AI-powered innovation. Currently building the future of work as CEO of SynergyAI Labs, a pre-seed stealth startup revolutionizing how humans interface with large language models.\n\nPreviously held the title of Chief Innovation Evangelist at a Fortune 500 company where I led cross-functional teams to deliver 10x ROI through my proprietary Agile Disruption Framework™. Passionate thought leader with 50K+ followers who believe in my vision of a world where every business decision is augmented by artificial intelligence.\n\nFrequent keynote speaker at Web Summit, SXSW, and Davos. Published author of "The Synergy Mindset: How to 100x Your Impact." Angel investor in 20+ startups (3 exits). Board advisor to multiple AI-first companies.\n\nBelieve in radical transparency, servant leadership, and building in public. Let's connect and change the world together.`,
  `Marketing Manager at Johnson & Johnson. 8 years of experience in consumer packaged goods. I manage a small team, run campaigns, and try to hit our quarterly targets. Previously worked at P&G in brand management. Ohio State University graduate. I like my job and I'm decent at it.`,
];

export const CLASSIFICATION_THRESHOLDS = [
  { max: 20, label: "Reality-Based" as const },
  { max: 40, label: "Slight LinkedIn Syndrome" as const },
  { max: 60, label: "Moderate LARP" as const },
  { max: 80, label: "Advanced LARP" as const },
  { max: 100, label: "Legendary LARP" as const },
] as const;

export const BREAKDOWN_LABELS: Record<string, { label: string; description: string }> = {
  buzzword_density: { label: "Buzzword Density", description: "Synergy per paragraph" },
  title_inflation: { label: "Title Inflation", description: "Gap between title and reality" },
  achievement_inflation: { label: "Achievement Inflation", description: "How many 10x claims" },
  thought_leadership: { label: "Thought Leadership", description: "Unsolicited wisdom quotient" },
  founder_energy: { label: "Founder Energy", description: "Building-in-public intensity" },
  ai_hype: { label: "AI Hype", description: "LLM name-dropping frequency" },
  substance: { label: "Substance", description: "Actual verifiable content" },
};

export const INPUT_LIMITS = {
  quick: { min: 5, max: 300 },
  deep: { min: 50, max: 10000 },
} as const;

export const RATE_LIMIT = {
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
} as const;
