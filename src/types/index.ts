export type CategoryType = 
  | 'Semua'
  | 'Humanoid & Mekatronika'
  | 'Model AI & LLM'
  | 'Sistem Otonom & Navigasi'
  | 'AI Medis & Bio-Robotika'
  | 'Otomasi Industri'
  | 'Komputasi Neuromorfik';

export interface NewsItem {
  id: string;
  title: string;
  category: CategoryType;
  date: string;
  readTime: string;
  author: string;
  organization: string;
  badge: 'Terkini' | 'Trending' | 'Riset Kunci' | 'Eksklusif';
  impactLevel: 'Tinggi' | 'Sedang' | 'Revolusioner';
  summary: string;
  content: string[];
  keyFacts: string[];
  tags: string[];
  stats?: {
    metric: string;
    value: string;
    change?: string;
  }[];
}

export interface ResearchArticle {
  id: string;
  title: string;
  organization: string;
  authors: string[];
  publicationDate: string;
  journal: string;
  doi: string;
  category: CategoryType;
  executiveSummary: string;
  background: string;
  methodology: {
    approach: string;
    hardwareOrModel: string;
    sampleSizeOrCompute: string;
  };
  keyFindings: string[];
  dataPoints: {
    label: string;
    value: string;
    comparison?: string;
  }[];
  chartData?: {
    title: string;
    description: string;
    labels: string[];
    series: {
      name: string;
      data: number[];
      unit: string;
    }[];
  };
  criticalAnalysis: string[];
  futureImplications: string;
  citations: string[];
}

export interface TechFact {
  id: string;
  title: string;
  category: CategoryType;
  statement: string;
  myth: string;
  fact: string;
  scientificExplanation: string;
  verifiedSource: string;
  year: number;
  dataMetric?: {
    label: string;
    val: string;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  category: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  scientificReference: string;
}
