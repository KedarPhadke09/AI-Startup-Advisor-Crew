export interface StartupInput {
  name: string;
  idea: string;
  industry: string;
  audience: string;
  budget: string;
}

export interface AgentStatusUpdate {
  agent: 'validator' | 'market' | 'business' | 'marketing' | 'synthesis';
  status: 'pending' | 'running' | 'completed' | 'error';
  message: string;
  data?: any;
}

export interface IdeaValidationResult {
  problemSolved: string;
  feasibilityScore: number;
  feasibilityReasoning: string;
  strengths: string[];
  weaknesses: string[];
  potentialRisks: string[];
}

export interface VerifiedSearchResult {
  title: string;
  snippet: string;
  source: string;
  url?: string;
}

export interface MarketResearchResult {
  targetCustomerSegments: string[];
  verifiedCompetitors: {
    name: string;
    description: string;
    source: string;
    isVerified: boolean;
  }[];
  marketOpportunities: string[];
  marketSummary: string;
  verifiedStats: string[];
  aiHypotheses: string[];
}

export interface BusinessModelResult {
  revenueModels: string[];
  pricingStrategies: {
    tier: string;
    price: string;
    features: string[];
  }[];
  operatingCosts: {
    category: string;
    estimate: string;
    notes: string;
  }[];
  revenueGenerationRoadmap: string[];
}

export interface MarketingStrategyResult {
  marketingStrategy: string;
  recommendedPlatforms: {
    platform: string;
    rationale: string;
    contentFormat: string;
  }[];
  promotionalCampaigns: {
    name: string;
    channel: string;
    description: string;
    budgetAllocation: string;
  }[];
  customerAcquisitionStrategy: string[];
}

export interface CrewAnalysisResponse {
  startupName: string;
  inputs: StartupInput;
  agent1_validator: IdeaValidationResult;
  agent2_market: MarketResearchResult;
  agent3_business: BusinessModelResult;
  agent4_marketing: MarketingStrategyResult;
  markdownReport: string;
  timestamp: string;
}
