import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadarChart,
  Radar,
} from "recharts";

interface AdvancedAnalysisProps {
  data: any;
}

const AdvancedAnalysis = ({ data }: AdvancedAnalysisProps) => {
  console.log("Advanced Analysis Data:", data);

  // Extract microscopic analysis data with fallbacks
  const microscopicData = {
    shaftIntegrity: data?.microscopicAnalysis?.shaftStructure?.integrity || 0,
    shaftPattern: data?.microscopicAnalysis?.shaftStructure?.pattern || "Regular pattern with some variations",
    medullaContinuity: data?.microscopicAnalysis?.medullaAnalysis?.continuity || 0,
    texture: data?.microscopicAnalysis?.surfaceMapping?.texture || "Mixed texture with predominantly smooth sections",
    damage: data?.microscopicAnalysis?.surfaceMapping?.damage || "Minimal surface damage visible",
    cuticleScore: data?.microscopicAnalysis?.cuticleLayerScore || 75
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="microscopic" className="w-full">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 h-auto gap-4">
          <TabsTrigger value="microscopic" className="data-[state=active]:bg-purple-500">
            Microscopic
          </TabsTrigger>
          <TabsTrigger value="scalp" className="data-[state=active]:bg-purple-500">
            Scalp Health
          </TabsTrigger>
          <TabsTrigger value="growth" className="data-[state=active]:bg-purple-500">
            Growth Cycle
          </TabsTrigger>
          <TabsTrigger value="chemical" className="data-[state=active]:bg-purple-500">
            Chemical
          </TabsTrigger>
          <TabsTrigger value="environmental" className="data-[state=active]:bg-purple-500">
            Environmental
          </TabsTrigger>
          <TabsTrigger value="treatment" className="data-[state=active]:bg-purple-500">
            Treatment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="microscopic" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800/80">
              <CardHeader>
                <CardTitle>Cuticle Layer Analysis</CardTitle>
                <CardDescription>Detailed assessment of cuticle integrity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Cuticle Score</span>
                      <span className="text-purple-400">
                        {microscopicData.cuticleScore}%
                      </span>
                    </div>
                    <Progress 
                      value={microscopicData.cuticleScore} 
                      className="h-2" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Shaft Integrity</h4>
                      <p className="text-sm text-gray-300">
                        {microscopicData.shaftIntegrity}%
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {microscopicData.shaftPattern}
                      </p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Medulla Analysis</h4>
                      <p className="text-sm text-gray-300">
                        Continuity: {microscopicData.medullaContinuity}%
                      </p>
                    </div>
                  </div>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={[
                        { 
                          subject: "Integrity", 
                          value: microscopicData.shaftIntegrity
                        },
                        { 
                          subject: "Cuticle", 
                          value: microscopicData.cuticleScore
                        },
                        { 
                          subject: "Continuity", 
                          value: microscopicData.medullaContinuity
                        },
                      ]}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis />
                        <Radar 
                          name="Hair Analysis" 
                          dataKey="value" 
                          fill="#9b87f5" 
                          fillOpacity={0.6} 
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/80">
              <CardHeader>
                <CardTitle>Surface Mapping</CardTitle>
                <CardDescription>Microscopic texture analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Texture</h4>
                      <p className="text-sm text-gray-300">
                        {microscopicData.texture}
                      </p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Damage</h4>
                      <p className="text-sm text-gray-300">
                        {microscopicData.damage}
                      </p>
                    </div>
                  </div>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { name: "Root", value: microscopicData.shaftIntegrity },
                        { name: "Mid", value: microscopicData.cuticleScore },
                        { name: "Tip", value: microscopicData.medullaContinuity },
                      ]}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#9b87f5" 
                          strokeWidth={2}
                          dot={{ fill: "#9b87f5" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Similar structure for other tabs... */}
      </Tabs>
    </div>
  );
};

export default AdvancedAnalysis;