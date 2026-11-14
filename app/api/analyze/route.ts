import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { StartupInput, CrewAnalysisResponse } from '@/lib/types';
import { searchVerifiedMarketData } from '@/lib/marketSearch';
import {
  runIdeaValidator,
  runMarketResearchAgent,
  runBusinessModelAdvisor,
  runMarketingStrategist,
  generateStartupReportMarkdown,
} from '@/lib/agents';

export const maxDuration = 60; // Allow sufficient time on Vercel Pro/Hobby

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, idea, industry, audience, budget } = body as StartupInput;

    if (!name || !idea || !industry || !audience || !budget) {
      return NextResponse.json(
        { error: 'All fields (name, idea, industry, audience, budget) are required.' },
        { status: 400 }
      );
    }

    const input: StartupInput = {
      name: name.trim(),
      idea: idea.trim(),
      industry: industry.trim(),
      audience: audience.trim(),
      budget: budget.trim(),
    };

    console.log(`[Crew] Initiating analysis for "${input.name}" (${input.industry})...`);

    // Step 1: Fetch Verified Market API Data (Wikipedia + HN Algolia)
    console.log('[Crew] Fetching verified market benchmarks...');
    const verifiedData = await searchVerifiedMarketData(input.industry, input.idea, input.name);

    // Step 2: Run all 4 agents in parallel for high speed (<6s) to avoid Vercel timeouts
    console.log('[Crew] Executing 4-agent crew in parallel...');
    const [validatorResult, marketResult, businessResult, marketingResult] = await Promise.all([
      runIdeaValidator(input),
      runMarketResearchAgent(input, verifiedData),
      runBusinessModelAdvisor(input),
      runMarketingStrategist(input),
    ]);

    // Step 3: Generate final startup_report.md
    console.log('[Crew] Synthesizing final startup_report.md...');
    const markdownReport = generateStartupReportMarkdown(
      input,
      validatorResult,
      marketResult,
      businessResult,
      marketingResult
    );

    // Save physical file startup_report.md to root if running in Node environment
    try {
      const filePath = path.join(process.cwd(), 'startup_report.md');
      fs.writeFileSync(filePath, markdownReport, 'utf8');
      console.log(`[Crew] Successfully saved report to ${filePath}`);
    } catch (fsErr) {
      console.warn('[Crew] Note: Read-only filesystem or serverless disk write skipped:', fsErr);
    }

    const responseData: CrewAnalysisResponse = {
      startupName: input.name,
      inputs: input,
      agent1_validator: validatorResult,
      agent2_market: marketResult,
      agent3_business: businessResult,
      agent4_marketing: marketingResult,
      markdownReport,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(responseData);
  } catch (err: any) {
    console.error('[Crew Error]:', err);
    return NextResponse.json(
      {
        error: err.message || 'An unexpected error occurred while running the startup advisor crew.',
      },
      { status: 500 }
    );
  }
}
