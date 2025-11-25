export interface PredictionPoint {
  label: string;
  price: number;
  annotation?: string;
}

export enum Verdict {
  BUY = 'BUY',
  SELL = 'SELL',
  HOLD = 'HOLD',
  WAIT = 'WAIT',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  EXTREME = 'EXTREME',
}

export interface CryptoAnalysis {
  coin: string;
  currentPrice: string;
  verdict: Verdict;
  confidenceScore: number; // 0-100
  riskLevel: RiskLevel;
  summary: string;
  detailedAnalysis: string; // Markdown content
  keyFactors: string[];
  entryPrice: string;
  takeProfit: string;
  stopLoss: string;
  predictedTrend: PredictionPoint[];
  sources: Array<{ title: string; uri: string }>;
}

export interface LoadingStep {
  message: string;
  completed: boolean;
}