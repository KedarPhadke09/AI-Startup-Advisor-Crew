# 🚀 AI Startup Advisor Crew

> An autonomous multi-agent advisory system built for student entrepreneurs and early-stage founders to validate ideas, conduct verified market research, design lean business models, and generate comprehensive startup planning reports (`startup_report.md`). Powered by **Google Gemini 3.5 Flash**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![Gemini 3.5 Flash](https://img.shields.io/badge/Model-Gemini%203.5%20Flash-4285F4?style=flat-square&logo=google)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)

---

## 🎯 Problem Statement
Students have innovative startup ideas but often struggle to:
1. Evaluate their technical and operational feasibility.
2. Accurately identify target customers and avoid confirmation bias.
3. Conduct grounded competitor research without hallucinating fake players.
4. Develop realistic revenue models, pricing tiers, and lean budget allocations.
5. Create low-CAC marketing playbooks tailored for campus and early-stage distribution.

**AI Startup Advisor Crew** automates this by deploying a collaborative crew of 4 specialized AI agents that systematically analyze the business proposal and generate a full strategic planning report (`startup_report.md`).

---

## 🤖 The 4-Agent Advisory Crew

```
┌──────────────────────────────────────────────────────────────┐
│                    User Startup Proposal                     │
│  (Name, Idea, Target Industry, Target Audience, Lean Budget) │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                  Agent 1: Idea Validator                     │
│  • Dissects core problem & value proposition                 │
│  • Computes Feasibility Score (1-10) with reasoning          │
│  • Identifies Strengths, Weaknesses, and Potential Risks     │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│             Agent 2: Market Research Agent                   │
│  • Queries real-world open APIs (Wikipedia & HN Archive)     │
│  • Distinguishes VERIFIED competitors from AI assumptions    │
│  • Identifies target customer segments & market landscape   │
│  • STRICTURE: Competitors and statistics are NOT invented    │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│              Agent 3: Business Model Advisor                 │
│  • Recommends revenue models (Freemium, Transaction, etc.)   │
│  • Designs tiered pricing structures                         │
│  • Maps lean operating costs against initial student budget  │
│  • Sets milestone-based revenue generation roadmap           │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                Agent 4: Marketing Strategist                 │
│  • Formulates scrappy Go-To-Market (GTM) narrative          │
│  • Recommends high-affinity distribution platforms           │
│  • Outlines promotional launch campaigns                     │
│  • Builds low-CAC customer acquisition flywheel              │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│             Final Output: startup_report.md                  │
│       • Formatted Markdown File written to workspace         │
│       • Instant In-Browser Download & Copy to Clipboard      │
└──────────────────────────────────────────────────────────────┘
```

---

## 🛡️ Grounded Market Research Guarantee
A critical failure of generic LLMs in startup analysis is hallucinating competitors or fabricating market statistics.

To solve this:
1. **Live Search Integration:** Queries live encyclopedic and startup launch databases (Wikipedia Official REST API & Hacker News Algolia Launch Archive).
2. **Strict Verification Labeling:**
   - `[VERIFIED REAL-WORLD DATA]`: Real, established competitors and verified factual entities.
   - `[AI STRATEGIC ASSUMPTION / HYPOTHESIS]`: Exploratory strategic opportunities, explicitly designated as AI hypotheses rather than claimed facts.
3. **No Hallucinated Incumbents:** Competitors and industry figures must never be invented.

---

## 📊 Final Output: `startup_report.md`
The report structure includes:
- **Startup Idea Analysis** (Overview, Strengths, Weaknesses)
- **Problem and Solution** (Root problem, value proposition)
- **Target Audience** (Primary customer personas, market landscape)
- **Competitor Analysis** (Verified competitors vs AI assumptions)
- **Business Model** (Revenue models, milestone roadmap, operating costs)
- **Pricing Strategy** (Tiered pricing with feature gating)
- **Marketing Plan** (GTM narrative, recommended platforms, campaigns, CAC reduction)
- **Potential Risks & Mitigations** (Identified risks & actionable counter-measures)

---

## ⚡ Quick Start (Local Setup)

### 1. Clone the repository
```bash
git clone https://github.com/KedarPhadke09/ai-startup-advisor-crew.git
cd ai-startup-advisor-crew
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create `.env.local` in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash
```

### 4. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to use the application.

---

## ☁️ Deployment on Vercel

1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "feat: complete AI Startup Advisor Crew"
   git push origin main
   ```
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import your GitHub repository `ai-startup-advisor-crew`.
4. Add the Environment Variable:
   - `GEMINI_API_KEY`: Your Gemini API Key
   - `GEMINI_MODEL`: `gemini-3.5-flash`
5. Click **Deploy**!

---

## 🛠️ Tech Stack
- **Framework:** Next.js 14 (App Router, Server-side API Routes)
- **AI Model:** Google Gemini 3.5 Flash (`gemini-3.5-flash`)
- **Styling:** Tailwind CSS, Lucide React Icons
- **Ground Truth APIs:** Wikipedia REST API & Hacker News Algolia Startup Archive
- **Language:** TypeScript
