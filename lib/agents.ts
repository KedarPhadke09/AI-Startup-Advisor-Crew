import { callGeminiJson } from './gemini';
import {
  StartupInput,
  IdeaValidationResult,
  MarketResearchResult,
  BusinessModelResult,
  MarketingStrategyResult,
  VerifiedSearchResult,
} from './types';

// ==========================================
// AGENT 1: IDEA VALIDATOR
// ==========================================
export async function runIdeaValidator(
  input: StartupInput
): Promise<IdeaValidationResult> {
  const systemInstruction = `You are the Lead Startup Idea Validator in the AI Startup Advisor Crew.
Your mission is to objectively dissect student startup proposals.
Identify the actual root problem being solved, evaluate feasibility, highlight core strengths, pin down weaknesses, and uncover critical pitfalls and potential risks early.
Be constructive, realistic, and highly analytical.`;

  const prompt = `Analyze the following startup proposal:
- Startup Name: "${input.name}"
- Startup Idea: "${input.idea}"
- Target Industry: "${input.industry}"
- Target Audience: "${input.audience}"
- Initial Budget: "${input.budget}"

Return a JSON object with this exact structure:
{
  "problemSolved": "Detailed description of the fundamental problem being solved and why existing alternatives fail",
  "feasibilityScore": 8,
  "feasibilityReasoning": "Concise reasoning for the given feasibility score considering student resources and budget",
  "strengths": [
    "Specific strength 1",
    "Specific strength 2",
    "Specific strength 3"
  ],
  "weaknesses": [
    "Critical weakness or vulnerability 1",
    "Critical weakness 2",
    "Critical weakness 3"
  ],
  "potentialRisks": [
    "Major market or execution risk 1",
    "Technical or operational risk 2",
    "Adoption or regulatory risk 3"
  ]
}`;

  return await callGeminiJson<IdeaValidationResult>(prompt, systemInstruction);
}

// ==========================================
// AGENT 2: MARKET RESEARCH AGENT
// ==========================================
export async function runMarketResearchAgent(
  input: StartupInput,
  verifiedData: VerifiedSearchResult[]
): Promise<MarketResearchResult> {
  const systemInstruction = `You are the Market Research Agent in the AI Startup Advisor Crew.
CRITICAL MANDATE:
1. You MUST distinguish verified API results from AI-generated assumptions.
2. Competitors and market statistics MUST NOT be invented.
3. Every verified competitor MUST refer to actual real-world entities identified in the provided verified data, or well-established real industry leaders.
4. Mark exploratory hypotheses explicitly as AI assumptions so the student founder knows the difference between verified facts and strategic projections.`;

  const verifiedDataSummary = verifiedData.length > 0
    ? verifiedData
        .map(
          (d, i) =>
            `[API Result ${i + 1}] Title: ${d.title}\nSource: ${d.source}\nSnippet: ${d.snippet}\nLink: ${d.url || 'N/A'}`
        )
        .join('\n\n')
    : 'No direct API hits. Rely only on universally known real competitors and state clearly that stats are preliminary hypotheses.';

  const prompt = `Conduct market research for:
- Startup Name: "${input.name}"
- Pitch: "${input.idea}"
- Industry: "${input.industry}"
- Target Audience: "${input.audience}"

VERIFIED API SEARCH RESULTS:
${verifiedDataSummary}

INSTRUCTIONS:
1. Identify detailed target customer segments.
2. For competitors: Extract real competitors from the verified API data and universally recognized market incumbents in the ${input.industry} space. Under no circumstances invent fake company names!
3. For verifiedStats: Cite only factual observations supported by the search data or well-known verified benchmarks.
4. For aiHypotheses: Formulate your AI-generated hypotheses, market opportunities, and assumptions, explicitly labeled.

Return a JSON object matching this schema:
{
  "targetCustomerSegments": [
    "Detailed segment 1 with demographic/behavioral traits",
    "Detailed segment 2",
    "Detailed segment 3"
  ],
  "verifiedCompetitors": [
    {
      "name": "Real Competitor Name",
      "description": "What they do and their market positioning",
      "source": "Source name or verified reference",
      "isVerified": true
    }
  ],
  "marketOpportunities": [
    "Specific underserved gap or differentiator 1",
    "Specific gap 2",
    "Specific gap 3"
  ],
  "marketSummary": "Concise summary of the current market landscape in this industry",
  "verifiedStats": [
    "Verified fact/data point grounded in real industry context 1",
    "Verified fact/data point 2"
  ],
  "aiHypotheses": [
    "AI Strategic Assumption: Unverified hypothesis regarding customer conversion",
    "AI Strategic Assumption: Market timing and willingness-to-pay hypothesis"
  ]
}`;

  return await callGeminiJson<MarketResearchResult>(prompt, systemInstruction);
}

// ==========================================
// AGENT 3: BUSINESS MODEL ADVISOR
// ==========================================
export async function runBusinessModelAdvisor(
  input: StartupInput,
  validator?: IdeaValidationResult,
  market?: MarketResearchResult
): Promise<BusinessModelResult> {
  const systemInstruction = `You are the Business Model Advisor in the AI Startup Advisor Crew.
Your task is to recommend viable revenue models, suggest realistic tiered pricing strategies, map operating costs, and chart an actionable revenue generation roadmap.
Keep in mind this is an early-stage venture with an estimated initial budget of "${input.budget}".
Ensure cost estimates are realistic for a lean startup (cloud, domain, physical/operational tools, marketing).`;

  const prompt = `Advise on the business model for:
- Startup: "${input.name}" (${input.idea})
- Industry: "${input.industry}"
- Target Audience: "${input.audience}"
- Initial Budget: "${input.budget}"
${validator ? `- Feasibility Insights: ${validator.feasibilityReasoning}` : ''}
${market?.marketOpportunities?.length ? `- Market Gaps: ${market.marketOpportunities.join('; ')}` : ''}

Return a JSON object matching this schema:
{
  "revenueModels": [
    "Primary revenue model (e.g. Service fee, Subscription, Marketplace commission, Pay-per-service)",
    "Secondary / Expansion revenue model"
  ],
  "pricingStrategies": [
    {
      "tier": "Starter / Basic Tier",
      "price": "$X / unit or month",
      "features": ["Feature A", "Feature B"]
    },
    {
      "tier": "Core / Standard Tier",
      "price": "$Y / unit or month",
      "features": ["Feature A", "Feature B", "Feature C"]
    },
    {
      "tier": "Premium / VIP Tier",
      "price": "$Z / unit or month",
      "features": ["Feature A", "Feature B", "Feature C", "Priority Support"]
    }
  ],
  "operatingCosts": [
    {
      "category": "Operational / Service Equipment & Space",
      "estimate": "Cost range tailored to ${input.budget}",
      "notes": "Key operational necessities"
    },
    {
      "category": "Digital Presence, Booking & Domain",
      "estimate": "$10 - $25/mo",
      "notes": "Online booking, website or social profile"
    },
    {
      "category": "Supplies & Inventory",
      "estimate": "Allocated portion of initial budget",
      "notes": "Essential opening supplies"
    },
    {
      "category": "Local Marketing & Customer Acquisition",
      "estimate": "Remaining budget allocation",
      "notes": "Promotions, local listings, flyers, social reels"
    }
  ],
  "revenueGenerationRoadmap": [
    "Phase 1: Soft launch to first 30 customers with introductory discount to gather reviews",
    "Phase 2: Formalize recurring packages and loyalty referral incentives",
    "Phase 3: Expand capacity and partner with complementary local businesses"
  ]
}`;

  return await callGeminiJson<BusinessModelResult>(prompt, systemInstruction);
}

// ==========================================
// AGENT 4: MARKETING STRATEGIST
// ==========================================
export async function runMarketingStrategist(
  input: StartupInput,
  market?: MarketResearchResult,
  business?: BusinessModelResult
): Promise<MarketingStrategyResult> {
  const systemInstruction = `You are the Marketing Strategist in the AI Startup Advisor Crew.
Your task is to design an ultra-scrappy, high-impact marketing strategy tailored for founders with an initial budget of "${input.budget}".
Recommend exact social media platforms, design creative promotional launch campaigns, and formulate a customer acquisition strategy that minimizes Customer Acquisition Cost (CAC).`;

  const prompt = `Create a marketing and customer acquisition strategy for:
- Startup: "${input.name}"
- Concept: "${input.idea}"
- Target Industry: "${input.industry}"
- Target Audience: "${input.audience}"
- Initial Budget: "${input.budget}"
${market?.marketOpportunities?.length ? `- Market Angles: ${market.marketOpportunities.join('; ')}` : ''}

Return a JSON object matching this schema:
{
  "marketingStrategy": "Comprehensive narrative explaining the core go-to-market angle and brand positioning",
  "recommendedPlatforms": [
    {
      "platform": "Platform Name (e.g. Instagram, TikTok, Google Maps/Local SEO, WhatsApp)",
      "rationale": "Why the target audience lives here",
      "contentFormat": "Specific content format (e.g. before/after transformations, behind-the-scenes clips, local deals)"
    }
  ],
  "promotionalCampaigns": [
    {
      "name": "Campaign Title",
      "channel": "Channel",
      "description": "How the campaign operates and drives customer acquisition",
      "budgetAllocation": "Budget share"
    }
  ],
  "customerAcquisitionStrategy": [
    "Step 1: Scrappy organic activation",
    "Step 2: Community & word-of-mouth referral flywheel",
    "Step 3: Conversion loop & repeat business incentive"
  ]
}`;

  return await callGeminiJson<MarketingStrategyResult>(prompt, systemInstruction);
}

// ==========================================
// REPORT SYNTHESIZER: startup_report.md
// ==========================================
export function generateStartupReportMarkdown(
  input: StartupInput,
  validator: IdeaValidationResult,
  market: MarketResearchResult,
  business: BusinessModelResult,
  marketing: MarketingStrategyResult
): string {
  const today = new Date().toISOString().split('T')[0];

  return `# Startup Planning Report: ${input.name}
*Generated on ${today} by AI Startup Advisor Crew*
*Powered by Google Gemini 3.5 Flash*

---

## Executive Summary
- **Startup Name:** ${input.name}
- **Industry:** ${input.industry}
- **Target Audience:** ${input.audience}
- **Initial Budget:** ${input.budget}
- **Feasibility Score:** ${validator.feasibilityScore}/10 (${validator.feasibilityReasoning})

---

## 1. Startup Idea Analysis
### Overview & Value Proposition
${input.idea}

### Strengths
${validator.strengths.map((s) => `- **Strength:** ${s}`).join('\n')}

### Weaknesses
${validator.weaknesses.map((w) => `- **Weakness:** ${w}`).join('\n')}

---

## 2. Problem and Solution
### Problem Being Solved
${validator.problemSolved}

### Proposed Solution
${input.name} addresses this challenge directly by offering a tailored solution for ${input.audience} within the ${input.industry} sector, designed to operate leanly starting with an estimated budget of ${input.budget}.

---

## 3. Target Audience
### Primary Customer Segments
${market.targetCustomerSegments.map((seg, i) => `${i + 1}. **${seg}**`).join('\n')}

### Market Landscape Summary
${market.marketSummary}

### Market Opportunities
${market.marketOpportunities.map((op) => `- [Opportunity] ${op}`).join('\n')}

---

## 4. Competitor Analysis

> **[IMPORTANT] Grounded Data Verification Notice**
> Market research strictly distinguishes verified API results from AI-generated assumptions. Competitors and market statistics must not be invented.

### Verified Real-World Competitors & Benchmarks
${
  market.verifiedCompetitors.length > 0
    ? market.verifiedCompetitors
        .map(
          (c) =>
            `- **${c.name}** \`[VERIFIED DATA]\`\n  - *Profile:* ${c.description}\n  - *Reference Source:* ${c.source}`
        )
        .join('\n\n')
    : `- *Note:* No verified API competitors matched directly; relying on standard industry benchmarks.`
}

### Verified Industry Observations
${
  market.verifiedStats.length > 0
    ? market.verifiedStats.map((stat) => `- **[Verified Data Point]** ${stat}`).join('\n')
    : `- General industry benchmarks applied.`
}

### AI Strategic Assumptions & Projections
${market.aiHypotheses
  .map(
    (hyp) =>
      `- **[AI Strategic Assumption - Unverified]** ${hyp}`
  )
  .join('\n')}

---

## 5. Business Model
### Recommended Revenue Models
${business.revenueModels.map((m, i) => `${i + 1}. **${m}**`).join('\n')}

### Revenue Generation Roadmap
${business.revenueGenerationRoadmap.map((step) => `- ${step}`).join('\n')}

### Estimated Operating Costs (Lean Budget: ${input.budget})
| Cost Category | Estimated Expense | Operating Notes |
| :--- | :--- | :--- |
${business.operatingCosts
  .map((c) => `| ${c.category} | ${c.estimate} | ${c.notes} |`)
  .join('\n')}

---

## 6. Pricing Strategy
### Tiered Pricing Structure
${business.pricingStrategies
  .map(
    (p) =>
      `### ${p.tier} — \`${p.price}\`\n${p.features.map((f) => `- ${f}`).join('\n')}`
  )
  .join('\n\n')}

---

## 7. Marketing Plan
### Go-To-Market Strategy
${marketing.marketingStrategy}

### Recommended Social Media & Distribution Channels
| Platform | Rationale | Recommended Content Format |
| :--- | :--- | :--- |
${marketing.recommendedPlatforms
  .map((p) => `| **${p.platform}** | ${p.rationale} | ${p.contentFormat} |`)
  .join('\n')}

### Promotional Launch Campaigns
${marketing.promotionalCampaigns
  .map(
    (c, i) =>
      `#### Campaign ${i + 1}: ${c.name}
- **Channel:** ${c.channel}
- **Budget Allocation:** \`${c.budgetAllocation}\`
- **Execution:** ${c.description}`
  )
  .join('\n\n')}

### Customer Acquisition Strategy (CAC Reduction)
${marketing.customerAcquisitionStrategy.map((s, i) => `${i + 1}. ${s}`).join('\n')}

---

## 8. Potential Risks & Mitigation Strategy
### Identified Risks
${validator.potentialRisks
  .map(
    (risk, i) =>
      `### Risk ${i + 1}: ${risk}
- **Mitigation:** Pilot with tight user feedback loops, monitor cost-per-user against the ${input.budget} budget, and validate demand prior to heavy development.`
  )
  .join('\n\n')}

---

*Report prepared by AI Startup Advisor Crew (Idea Validator, Market Research Agent, Business Model Advisor, Marketing Strategist).*
`;
}
