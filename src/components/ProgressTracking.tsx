import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Line } from 'react-chartjs-2';
import { 
  progressTracker, 
  HairAnalysisSnapshot, 
  ProgressAnalysis,
  MetricComparison 
} from '@/utils/progressTracking';
import { toast } from 'sonner';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target, 
  Award,
  Camera,
  Download,
  Upload
} from 'lucide-react';

const ProgressTracking: React.FC = () => {
  const [snapshots, setSnapshots] = useState<HairAnalysisSnapshot[]>([]);
  const [progressAnalysis, setProgressAnalysis] = useState<ProgressAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedSnapshots, setSelectedSnapshots] = useState<[HairAnalysisSnapshot | null, HairAnalysisSnapshot | null]>([null, null]);

  useEffect(() => {
    loadSnapshots();
  }, []);

  useEffect(() => {
    if (snapshots.length >= 2) {
      analyzeProgress();
    }
  }, [snapshots]);

  const loadSnapshots = () => {
    const allSnapshots = progressTracker.getAllSnapshots();
    setSnapshots(allSnapshots.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  };

  const analyzeProgress = async () => {
    if (snapshots.length < 2) return;

    setIsAnalyzing(true);
    try {
      const analysis = await progressTracker.analyzeProgress(snapshots);
      setProgressAnalysis(analysis);
    } catch (error) {
      console.error('Progress analysis error:', error);
      toast.error('Failed to analyze progress');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCompareSnapshots = (snapshot1: HairAnalysisSnapshot, snapshot2: HairAnalysisSnapshot) => {
    setSelectedSnapshots([snapshot1, snapshot2]);
    setShowComparison(true);
  };

  const exportProgress = () => {
    const data = progressTracker.exportProgressData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hairlens-progress-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Progress data exported');
  };

  const importProgress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (progressTracker.importProgressData(result)) {
        loadSnapshots();
        toast.success('Progress data imported successfully');
      } else {
        toast.error('Invalid progress data file');
      }
    };
    reader.readAsText(file);
  };

  const getMetricTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'stable': return <Minus className="w-4 h-4 text-yellow-400" />;
      default: return null;
    }
  };

  const getMetricColor = (changePercentage: number) => {
    if (changePercentage > 5) return 'text-green-400';
    if (changePercentage < -5) return 'text-red-400';
    return 'text-yellow-400';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const createProgressChart = () => {
    if (!progressAnalysis || snapshots.length < 2) return null;

    const chartData = {
      labels: snapshots.slice().reverse().map(s => formatDate(s.timestamp)),
      datasets: [{
        label: 'Overall Health Score',
        data: snapshots.slice().reverse().map(s => 
          s.analysisData?.overallHealthScore || s.analysisData?.healthScore || 0
        ),
        borderColor: '#9b87f5',
        backgroundColor: 'rgba(155, 135, 245, 0.1)',
        fill: true,
        tension: 0.4
      }]
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: '#ffffff'
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#9ca3af' },
          grid: { color: 'rgba(156, 163, 175, 0.2)' }
        },
        y: {
          ticks: { color: '#9ca3af' },
          grid: { color: 'rgba(156, 163, 175, 0.2)' },
          min: 0,
          max: 100
        }
      }
    };

    return <Line data={chartData} options={options} />;
  };

  if (snapshots.length === 0) {
    return (
      <Card className="bg-gray-800/80 border-gray-700">
        <CardContent className="p-8 text-center">
          <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-white mb-2">Start Your Hair Journey</h3>
          <p className="text-gray-400 mb-4">
            Upload your first hair analysis to begin tracking your progress over time.
          </p>
          <p className="text-sm text-gray-500">
            🚀 Powered by AI progress tracking and predictive analytics
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Progress Tracking</h2>
          <p className="text-gray-400">Monitor your hair health journey over time</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportProgress}
            className="border-gray-600 text-gray-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <input
            type="file"
            accept=".json"
            onChange={importProgress}
            className="hidden"
            id="import-progress"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('import-progress')?.click()}
            className="border-gray-600 text-gray-300"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overall Progress Summary */}
          {progressAnalysis && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-800/80 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Overall Improvement</p>
                      <p className={`text-2xl font-bold ${getMetricColor(progressAnalysis.overallImprovement)}`}>
                        {progressAnalysis.overallImprovement > 0 ? '+' : ''}
                        {progressAnalysis.overallImprovement.toFixed(1)}%
                      </p>
                    </div>
                    <Award className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/80 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Analysis Count</p>
                      <p className="text-2xl font-bold text-white">{snapshots.length}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/80 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Tracking Period</p>
                      <p className="text-2xl font-bold text-white">
                        {Math.ceil((new Date(snapshots[0].timestamp).getTime() - 
                                  new Date(snapshots[snapshots.length - 1].timestamp).getTime()) / 
                                  (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                    <Target className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Progress Chart */}
          <Card className="bg-gray-800/80 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Health Score Progression</CardTitle>
            </CardHeader>
            <CardContent>
              {createProgressChart()}
            </CardContent>
          </Card>

          {/* Key Metrics Comparison */}
          {progressAnalysis && (
            <Card className="bg-gray-800/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Key Metrics Changes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {progressAnalysis.keyMetricsComparison.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getMetricTrendIcon(metric.trend)}
                      <span className="text-white capitalize">
                        {metric.metric.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${getMetricColor(metric.changePercentage)}`}>
                        {metric.changePercentage > 0 ? '+' : ''}{metric.changePercentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-400">
                        {metric.baseline.toFixed(1)} → {metric.current.toFixed(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          {/* Detailed Metrics Analysis */}
          {progressAnalysis && (
            <div className="space-y-6">
              {/* Trends Analysis */}
              <Card className="bg-gray-800/80 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Trend Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {progressAnalysis.trends.map((trend, index) => (
                    <div key={index} className="p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{trend.metric}</span>
                        <Badge 
                          variant="outline"
                          className={`
                            ${trend.significance === 'high' ? 'border-green-400 text-green-400' : 
                              trend.significance === 'medium' ? 'border-yellow-400 text-yellow-400' : 
                              'border-gray-400 text-gray-400'}
                          `}
                        >
                          {trend.significance} confidence
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <span className="capitalize">{trend.direction}</span>
                        <span>•</span>
                        <span>{trend.timeframe}</span>
                        <span>•</span>
                        <span>{trend.confidence.toFixed(1)}% confidence</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Treatment Effectiveness */}
              {progressAnalysis.treatmentEffectiveness.length > 0 && (
                <Card className="bg-gray-800/80 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Treatment Effectiveness</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {progressAnalysis.treatmentEffectiveness.map((treatment, index) => (
                      <div key={index} className="p-4 bg-gray-700/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{treatment.treatmentName}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={treatment.effectivenessScore} className="w-24 h-2" />
                            <span className="text-sm text-gray-300">{treatment.effectivenessScore}/100</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline"
                            className={`
                              ${treatment.recommendation === 'continue' ? 'border-green-400 text-green-400' : 
                                treatment.recommendation === 'adjust' ? 'border-yellow-400 text-yellow-400' : 
                                'border-red-400 text-red-400'}
                            `}
                          >
                            {treatment.recommendation}
                          </Badge>
                          <span className="text-sm text-gray-400">
                            {treatment.observedBenefits.join(', ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          {/* Timeline View */}
          <Card className="bg-gray-800/80 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Analysis Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {snapshots.map((snapshot, index) => (
                  <div key={snapshot.id} className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg">
                    <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
                      {snapshot.imageUrl ? (
                        <img 
                          src={snapshot.imageUrl} 
                          alt="Analysis" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Camera className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium">
                          Analysis #{snapshots.length - index}
                        </span>
                        <Badge variant="outline" className="border-purple-400 text-purple-400">
                          Score: {snapshot.analysisData?.overallHealthScore || snapshot.analysisData?.healthScore || 'N/A'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatDate(snapshot.timestamp)}
                        {snapshot.userNotes && (
                          <span className="ml-2 text-gray-300">• {snapshot.userNotes}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {index < snapshots.length - 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCompareSnapshots(snapshot, snapshots[index + 1])}
                          className="border-gray-600 text-gray-300"
                        >
                          Compare
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          {/* Predictions and Recommendations */}
          {progressAnalysis && (
            <div className="space-y-6">
              <Card className="bg-gray-800/80 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Predicted Outcomes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">
                        Expected Progress ({progressAnalysis.predictedOutcome.timeframe})
                      </span>
                      <Badge className="bg-blue-500 text-white">
                        {progressAnalysis.predictedOutcome.confidenceLevel}% confidence
                      </Badge>
                    </div>
                    <div className="text-blue-200">
                      +{progressAnalysis.predictedOutcome.expectedImprovement.toFixed(1)}% improvement expected
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-white font-medium">Key Predictions:</h4>
                    {progressAnalysis.predictedOutcome.keyPredictions.map((prediction, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                        <span className="text-green-400">✓</span>
                        <span>{prediction}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/80 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {progressAnalysis.recommendations.map((recommendation, index) => (
                    <div key={index} className="p-3 bg-gray-700/50 rounded-lg text-gray-200">
                      {recommendation}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Comparison Dialog */}
      <Dialog open={showComparison} onOpenChange={setShowComparison}>
        <DialogContent className="max-w-4xl bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Compare Analyses</DialogTitle>
          </DialogHeader>
          {selectedSnapshots[0] && selectedSnapshots[1] && (
            <div className="grid grid-cols-2 gap-6">
              {selectedSnapshots.map((snapshot, index) => (
                <div key={index} className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-white font-medium mb-2">
                      {formatDate(snapshot!.timestamp)}
                    </h3>
                    {snapshot!.imageUrl && (
                      <img 
                        src={snapshot!.imageUrl} 
                        alt="Analysis" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Health Score:</span>
                      <span className="text-white font-medium">
                        {snapshot!.analysisData?.overallHealthScore || snapshot!.analysisData?.healthScore || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Hair Type:</span>
                      <span className="text-white font-medium">
                        {snapshot!.analysisData?.metrics?.hairType || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Scalp Condition:</span>
                      <span className="text-white font-medium">
                        {snapshot!.analysisData?.metrics?.scalpCondition || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProgressTracking;