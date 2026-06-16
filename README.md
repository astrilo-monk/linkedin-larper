# LARPIn

**Find out how much you're LARPing on LinkedIn.**

LARPIn analyzes LinkedIn profile text and calculates a "LARP Score" from 0-100 that measures how much a profile relies on buzzwords, title inflation, thought leadership signaling, AI hype, founder cosplay, and vague corporate jargon.

## Features

- **Quick Scan** — Paste a LinkedIn headline for instant analysis
- **Deep Scan** — Paste a full LinkedIn profile for thorough breakdown
- **LARP Score** — 0-100 Reality Gap visualization
- **7-Dimension Breakdown** — Buzzword Density, Title Inflation, Achievement Inflation, Thought Leadership, Founder Energy, AI Hype, Substance
- **Archetype Assignment** — Corporate Alchemist, Synergy Shaman, KPI Necromancer, AI Oracle, and more
- **The Roast** — A pointed editorial assessment
- **Reality Rewrite** — What the profile would say if the person was honest
- **Shareable Results** — Every result gets a unique URL
- **Download as Image** — Screenshot-ready score cards

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui**
- **Groq API** (Llama 3.3 70B Instruct)
- **Zod** (strict LLM output validation)
- **Framer Motion** (minimal — view transitions only)

## Getting Started

### Prerequisites

- Node.js 18+
- A [Groq API key](https://console.groq.com) (free tier available)

### Setup

```bash
git clone https://github.com/astrilo-monk/linkedin-larper.git
cd linkedin-larper
npm install
```

Copy the environment template and add your Groq API key:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
GROQ_API_KEY=gsk_your_key_here
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts        # POST /api/analyze
│   │   └── result/[id]/route.ts    # GET /api/result/:id
│   ├── result/[id]/
│   │   ├── page.tsx                # Shareable result page (server)
│   │   └── client.tsx              # Result page (client)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                    # Homepage
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── header.tsx
│   ├── footer.tsx
│   ├── mode-toggle.tsx
│   ├── profile-input.tsx
│   ├── loading-state.tsx
│   ├── score-display.tsx
│   ├── breakdown-section.tsx
│   ├── details-section.tsx
│   └── result-actions.tsx
└── lib/
    ├── types.ts                    # TypeScript interfaces
    ├── schemas.ts                  # Zod validation schemas
    ├── prompt.ts                   # Groq system prompts
    ├── constants.ts                # Examples, archetypes, config
    ├── storage.ts                  # Result persistence
    ├── rate-limit.ts               # IP-based rate limiting
    └── utils.ts                    # Helpers
```

## Deployment

Deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/astrilo-monk/linkedin-larper&env=GROQ_API_KEY)

> **Note:** The default in-memory storage works for demo purposes. For persistent shareable URLs in production, swap `src/lib/storage.ts` for Vercel KV or Upstash Redis.

## License

MIT
