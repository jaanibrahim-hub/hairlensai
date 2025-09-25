/**
 * Progress Tracking System for Hair Analysis
 * Tracks hair health improvements over time with AI-powered insights
 */

export interface HairAnalysisSnapshot {
  id: string;
  timestamp: string;
  imageUrl: string;
  analysisData: any;
  treatmentPlan?: TreatmentPlan;
  userNotes?: string;
  weather?: WeatherCondition;
  lifestyle?: LifestyleFactors;
}

export interface TreatmentPlan {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  treatments: Treatment[];
  milestones: Milestone[];
  expectedOutcomes: string[];
}

export interface Treatment {
  id: string;
  name: string;
  type: 'topical' | 'oral' | 'procedure' | 'lifestyle';
  frequency: string;
  startDate: string;
  endDate?: string;
  dosage?: string;
  notes?: string;
}

export interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  targetMetrics: Record<string, number>;
  achieved: boolean;
}

export interface WeatherCondition {
  humidity: number;
  temperature: number;
  season: 'spring' | 'summer' | 'fall' | 'winter';
  uvIndex: number;
}

export interface LifestyleFactors {
  stressLevel: number; // 1-10
  sleepQuality: number; // 1-10
  dietQuality: number; // 1-10
  exerciseFrequency: number; // days per week
  waterIntake: number; // liters per day
}

export interface ProgressAnalysis {
  overallImprovement: number; // percentage
  keyMetricsComparison: MetricComparison[];
  trends: Trend[];
  recommendations: string[];
  predictedOutcome: PredictedOutcome;
  treatmentEffectiveness: TreatmentEffectiveness[];
}

export interface MetricComparison {
  metric: string;
  baseline: number;
  current: number;
  change: number;
  changePercentage: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface Trend {
  metric: string;
  direction: 'upward' | 'downward' | 'stable' | 'fluctuating';
  confidence: number;
  timeframe: string;
  significance: 'high' | 'medium' | 'low';
}

export interface PredictedOutcome {
  timeframe: string; // e.g., "3 months"
  confidenceLevel: number;
  expectedImprovement: number;
  keyPredictions: string[];
  factors: string[];
}

export interface TreatmentEffectiveness {
  treatmentId: string;
  treatmentName: string;
  effectivenessScore: number; // 0-100
  observedBenefits: string[];
  sideEffects: string[];
  recommendation: 'continue' | 'adjust' | 'discontinue' | 'increase' | 'decrease';
}

class ProgressTracker {
  private storageKey = 'hairlens_progress_data';
  
  /**
   * Save a new analysis snapshot
   */
  saveSnapshot(snapshot: Omit<HairAnalysisSnapshot, 'id' | 'timestamp'>): HairAnalysisSnapshot {
    const fullSnapshot: HairAnalysisSnapshot = {
      ...snapshot,
      id: this.generateId(),
      timestamp: new Date().toISOString()
    };
    
    const existing = this.getAllSnapshots();
    existing.push(fullSnapshot);
    
    // Keep only last 50 snapshots to prevent storage overflow
    const limited = existing.slice(-50);
    
    localStorage.setItem(this.storageKey, JSON.stringify(limited));
    return fullSnapshot;
  }
  
  /**
   * Get all stored snapshots
   */
  getAllSnapshots(): HairAnalysisSnapshot[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading progress data:', error);
      return [];
    }
  }
  
  /**
   * Get snapshots within a date range
   */
  getSnapshotsInRange(startDate: Date, endDate: Date): HairAnalysisSnapshot[] {
    const all = this.getAllSnapshots();
    return all.filter(snapshot => {
      const date = new Date(snapshot.timestamp);
      return date >= startDate && date <= endDate;
    });
  }
  
  /**
   * Analyze progress between two snapshots or over time
   */
  async analyzeProgress(snapshots: HairAnalysisSnapshot[]): Promise<ProgressAnalysis> {
    if (snapshots.length < 2) {
      throw new Error('At least 2 snapshots required for progress analysis');
    }
    
    const baseline = snapshots[0];
    const latest = snapshots[snapshots.length - 1];
    
    // Calculate metric comparisons
    const keyMetricsComparison = this.calculateMetricComparisons(baseline, latest);
    
    // Analyze trends over time
    const trends = this.analyzeTrends(snapshots);
    
    // Calculate overall improvement
    const overallImprovement = this.calculateOverallImprovement(keyMetricsComparison);
    
    // Generate AI-powered recommendations
    const recommendations = await this.generateProgressRecommendations(snapshots);
    
    // Predict future outcomes
    const predictedOutcome = this.predictOutcome(snapshots);
    
    // Analyze treatment effectiveness
    const treatmentEffectiveness = this.analyzeTreatmentEffectiveness(snapshots);
    
    return {
      overallImprovement,
      keyMetricsComparison,
      trends,
      recommendations,
      predictedOutcome,
      treatmentEffectiveness
    };
  }
  
  private calculateMetricComparisons(baseline: HairAnalysisSnapshot, latest: HairAnalysisSnapshot): MetricComparison[] {
    const comparisons: MetricComparison[] = [];
    
    // Define key metrics to compare
    const keyMetrics = [
      'overallHealthScore',
      'hairDensity', 
      'scalpCondition',
      'hairThickness',
      'growthRate'
    ];
    
    keyMetrics.forEach(metric => {
      const baselineValue = this.extractMetricValue(baseline.analysisData, metric);
      const latestValue = this.extractMetricValue(latest.analysisData, metric);
      
      if (baselineValue !== null && latestValue !== null) {
        const change = latestValue - baselineValue;
        const changePercentage = baselineValue > 0 ? (change / baselineValue) * 100 : 0;
        
        let trend: 'improving' | 'declining' | 'stable';
        if (Math.abs(changePercentage) < 5) {
          trend = 'stable';
        } else {
          trend = changePercentage > 0 ? 'improving' : 'declining';
        }
        
        comparisons.push({
          metric,
          baseline: baselineValue,
          current: latestValue,
          change,
          changePercentage,
          trend
        });
      }
    });
    
    return comparisons;
  }
  
  private analyzeTrends(snapshots: HairAnalysisSnapshot[]): Trend[] {
    const trends: Trend[] = [];
    const metrics = ['overallHealthScore', 'hairDensity', 'scalpCondition'];
    
    metrics.forEach(metric => {
      const values = snapshots.map(s => ({
        value: this.extractMetricValue(s.analysisData, metric),
        date: new Date(s.timestamp)
      })).filter(v => v.value !== null);
      
      if (values.length >= 3) {
        const trend = this.calculateTrendDirection(values);
        trends.push(trend);
      }
    });
    
    return trends;
  }
  
  private calculateTrendDirection(values: { value: number; date: Date }[]): Trend {
    // Simple linear regression to determine trend
    const n = values.length;
    const sumX = values.reduce((sum, v, i) => sum + i, 0);
    const sumY = values.reduce((sum, v) => sum + v.value, 0);
    const sumXY = values.reduce((sum, v, i) => sum + i * v.value, 0);
    const sumXX = values.reduce((sum, v, i) => sum + i * i, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const correlation = this.calculateCorrelation(values);
    
    let direction: 'upward' | 'downward' | 'stable' | 'fluctuating';
    let significance: 'high' | 'medium' | 'low';
    
    if (Math.abs(slope) < 0.1) {
      direction = 'stable';
    } else if (Math.abs(correlation) < 0.3) {
      direction = 'fluctuating';
    } else {
      direction = slope > 0 ? 'upward' : 'downward';
    }
    
    significance = Math.abs(correlation) > 0.7 ? 'high' : 
                  Math.abs(correlation) > 0.4 ? 'medium' : 'low';
    
    return {
      metric: 'overallHealthScore', // This should be parameterized
      direction,
      confidence: Math.abs(correlation) * 100,
      timeframe: this.calculateTimeframe(values[0].date, values[values.length - 1].date),
      significance
    };
  }
  
  private calculateCorrelation(values: { value: number; date: Date }[]): number {
    const n = values.length;
    const meanX = (n - 1) / 2; // Since x values are 0, 1, 2, ..., n-1
    const meanY = values.reduce((sum, v) => sum + v.value, 0) / n;
    
    let numerator = 0;
    let denomX = 0;
    let denomY = 0;
    
    values.forEach((v, i) => {
      const diffX = i - meanX;
      const diffY = v.value - meanY;
      
      numerator += diffX * diffY;
      denomX += diffX * diffX;
      denomY += diffY * diffY;
    });
    
    return numerator / Math.sqrt(denomX * denomY);
  }
  
  private calculateOverallImprovement(comparisons: MetricComparison[]): number {
    if (comparisons.length === 0) return 0;
    
    const improvements = comparisons.map(c => {
      // Weight different metrics
      const weight = this.getMetricWeight(c.metric);
      return c.changePercentage * weight;
    });
    
    const totalWeight = comparisons.reduce((sum, c) => sum + this.getMetricWeight(c.metric), 0);
    return improvements.reduce((sum, imp) => sum + imp, 0) / totalWeight;
  }
  
  private getMetricWeight(metric: string): number {
    const weights: Record<string, number> = {
      'overallHealthScore': 0.3,
      'hairDensity': 0.25,
      'scalpCondition': 0.2,
      'hairThickness': 0.15,
      'growthRate': 0.1
    };
    return weights[metric] || 0.1;
  }
  
  private async generateProgressRecommendations(snapshots: HairAnalysisSnapshot[]): Promise<string[]> {
    // This would ideally use AI to generate personalized recommendations
    // For now, we'll use rule-based recommendations
    
    const latest = snapshots[snapshots.length - 1];
    const recommendations: string[] = [];
    
    // Analyze recent trends
    if (snapshots.length >= 3) {
      const recentSnapshots = snapshots.slice(-3);
      const healthScores = recentSnapshots.map(s => 
        this.extractMetricValue(s.analysisData, 'overallHealthScore')
      ).filter(v => v !== null) as number[];
      
      if (healthScores.length >= 2) {
        const trend = healthScores[healthScores.length - 1] - healthScores[0];
        
        if (trend > 5) {
          recommendations.push("🎉 Great progress! Continue your current treatment plan.");
        } else if (trend < -5) {
          recommendations.push("⚠️ Health score declining. Consider adjusting your treatment approach.");
        } else {
          recommendations.push("📊 Stable progress. Small adjustments may help accelerate improvement.");
        }
      }
    }
    
    // Treatment-specific recommendations
    const activeTreatments = this.getActiveTreatments(snapshots);
    if (activeTreatments.length > 0) {
      recommendations.push("💊 Continue monitoring treatment effectiveness and side effects.");
    }
    
    // Lifestyle recommendations
    const lifestyleFactors = latest.lifestyle;
    if (lifestyleFactors) {
      if (lifestyleFactors.stressLevel > 7) {
        recommendations.push("🧘 High stress levels detected. Consider stress management techniques.");
      }
      if (lifestyleFactors.sleepQuality < 6) {
        recommendations.push("😴 Improve sleep quality for better hair health.");
      }
    }
    
    return recommendations;
  }
  
  private predictOutcome(snapshots: HairAnalysisSnapshot[]): PredictedOutcome {
    // Simple prediction based on current trends
    const timeframe = "3 months";
    const confidenceLevel = Math.min(90, snapshots.length * 15);
    
    const latest = snapshots[snapshots.length - 1];
    const currentScore = this.extractMetricValue(latest.analysisData, 'overallHealthScore') || 0;
    
    // Predict based on recent trend
    let expectedImprovement = 0;
    if (snapshots.length >= 2) {
      const baseline = snapshots[0];
      const baselineScore = this.extractMetricValue(baseline.analysisData, 'overallHealthScore') || 0;
      const improvement = currentScore - baselineScore;
      
      // Extrapolate improvement
      const timeSpan = new Date(latest.timestamp).getTime() - new Date(baseline.timestamp).getTime();
      const monthsElapsed = timeSpan / (1000 * 60 * 60 * 24 * 30);
      
      if (monthsElapsed > 0) {
        const monthlyImprovement = improvement / monthsElapsed;
        expectedImprovement = monthlyImprovement * 3; // 3 months prediction
      }
    }
    
    return {
      timeframe,
      confidenceLevel,
      expectedImprovement: Math.max(0, Math.min(100, expectedImprovement)),
      keyPredictions: [
        "Continued improvement in hair density",
        "Better scalp health with current regimen",
        "Visible results from consistent treatment"
      ],
      factors: [
        "Treatment consistency",
        "Lifestyle modifications",
        "Environmental conditions"
      ]
    };
  }
  
  private analyzeTreatmentEffectiveness(snapshots: HairAnalysisSnapshot[]): TreatmentEffectiveness[] {
    const treatments = this.getAllTreatments(snapshots);
    const effectiveness: TreatmentEffectiveness[] = [];
    
    treatments.forEach(treatment => {
      const treatmentSnapshots = snapshots.filter(s => 
        s.treatmentPlan?.treatments.some(t => t.id === treatment.id)
      );
      
      if (treatmentSnapshots.length >= 2) {
        const beforeTreatment = treatmentSnapshots[0];
        const afterTreatment = treatmentSnapshots[treatmentSnapshots.length - 1];
        
        const beforeScore = this.extractMetricValue(beforeTreatment.analysisData, 'overallHealthScore') || 0;
        const afterScore = this.extractMetricValue(afterTreatment.analysisData, 'overallHealthScore') || 0;
        
        const improvement = afterScore - beforeScore;
        const effectivenessScore = Math.max(0, Math.min(100, 50 + improvement));
        
        let recommendation: TreatmentEffectiveness['recommendation'];
        if (effectivenessScore >= 80) {
          recommendation = 'continue';
        } else if (effectivenessScore >= 60) {
          recommendation = 'adjust';
        } else {
          recommendation = 'discontinue';
        }
        
        effectiveness.push({
          treatmentId: treatment.id,
          treatmentName: treatment.name,
          effectivenessScore,
          observedBenefits: improvement > 0 ? ['Improved hair health metrics'] : [],
          sideEffects: [], // Would need user input
          recommendation
        });
      }
    });
    
    return effectiveness;
  }
  
  private extractMetricValue(analysisData: any, metric: string): number | null {
    // Extract metric values from analysis data structure
    if (!analysisData) return null;
    
    switch (metric) {
      case 'overallHealthScore':
        return analysisData.overallHealthScore || analysisData.healthScore || null;
      case 'hairDensity':
        return analysisData.metrics?.density ? parseFloat(analysisData.metrics.density) : null;
      case 'scalpCondition':
        // Convert text to numeric if needed
        return this.textToNumeric(analysisData.metrics?.scalpCondition);
      default:
        return analysisData.metrics?.[metric] || null;
    }
  }
  
  private textToNumeric(text: string): number | null {
    if (!text) return null;
    
    const lowerText = text.toLowerCase();
    if (lowerText.includes('excellent') || lowerText.includes('optimal')) return 90;
    if (lowerText.includes('good') || lowerText.includes('healthy')) return 75;
    if (lowerText.includes('fair') || lowerText.includes('moderate')) return 60;
    if (lowerText.includes('poor') || lowerText.includes('concerning')) return 40;
    
    // Try to extract numeric values
    const numMatch = text.match(/\d+/);
    return numMatch ? parseInt(numMatch[0]) : null;
  }
  
  private getActiveTreatments(snapshots: HairAnalysisSnapshot[]): Treatment[] {
    const latest = snapshots[snapshots.length - 1];
    const currentDate = new Date();
    
    return latest.treatmentPlan?.treatments.filter(t => {
      const startDate = new Date(t.startDate);
      const endDate = t.endDate ? new Date(t.endDate) : null;
      
      return startDate <= currentDate && (!endDate || endDate >= currentDate);
    }) || [];
  }
  
  private getAllTreatments(snapshots: HairAnalysisSnapshot[]): Treatment[] {
    const allTreatments: Treatment[] = [];
    const seenIds = new Set<string>();
    
    snapshots.forEach(snapshot => {
      snapshot.treatmentPlan?.treatments.forEach(treatment => {
        if (!seenIds.has(treatment.id)) {
          allTreatments.push(treatment);
          seenIds.add(treatment.id);
        }
      });
    });
    
    return allTreatments;
  }
  
  private calculateTimeframe(startDate: Date, endDate: Date): string {
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.round(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.round(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''}`;
    }
  }
  
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  /**
   * Export progress data for sharing or backup
   */
  exportProgressData(): string {
    const data = {
      snapshots: this.getAllSnapshots(),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(data, null, 2);
  }
  
  /**
   * Import progress data from backup
   */
  importProgressData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.snapshots && Array.isArray(data.snapshots)) {
        localStorage.setItem(this.storageKey, JSON.stringify(data.snapshots));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing progress data:', error);
      return false;
    }
  }
  
  /**
   * Clear all progress data
   */
  clearProgressData(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export const progressTracker = new ProgressTracker();
export default ProgressTracker;