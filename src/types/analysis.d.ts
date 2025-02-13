
export interface SecondaryAnalysisResponse {
  welcome: string;
  hairStatus: string;
  growthPhase: string;
  careRoutine: string;
  lifestyleTips: string;
  seasonalCare: string;
  treatments: string;
  progressGoals: string;
  emergencyCare: string;
  productGuide: string;
}

export interface RegionalAnalysis {
  overall: string;
  regions: {
    crown: {
      status: "dense" | "medium" | "sparse";
      pattern: string;
      concerns: string;
    };
    temples: {
      leftStatus: "dense" | "medium" | "sparse";
      rightStatus: "dense" | "medium" | "sparse";
      symmetry: string;
    };
    hairline: {
      status: "dense" | "medium" | "sparse";
      pattern: string;
    };
    vertex: {
      status: "dense" | "medium" | "sparse";
      pattern: string;
    };
  };
  comparativeAnalysis: string;
}

