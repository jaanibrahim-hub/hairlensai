
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

export interface RegionalDensity {
  overall: string;
  regions: {
    crown: {
      density: string;
      status: string;
      comparison: string;
    };
    temples: {
      left: {
        density: string;
        status: string;
        comparison: string;
      };
      right: {
        density: string;
        status: string;
        comparison: string;
      };
    };
    hairline: {
      density: string;
      status: string;
      comparison: string;
    };
    vertex: {
      density: string;
      status: string;
      comparison: string;
    };
  };
}

