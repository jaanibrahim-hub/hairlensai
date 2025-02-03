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
  BarChart,
  Bar,
} from "recharts";

interface AdvancedAnalysisProps {
  data: any;
}

const AdvancedAnalysis = ({ data }: AdvancedAnalysisProps) => {
  console.log("Advanced Analysis Data:", data);

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
                <CardTitle>Cuticle Analysis</CardTitle>
                <CardDescription>Detailed assessment of hair structure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Cuticle Layer Score</span>
                      <span className="text-purple-400">{data?.microscopicAnalysis?.cuticleLayerScore || 0}%</span>
                    </div>
                    <Progress value={data?.microscopicAnalysis?.cuticleLayerScore || 0} className="h-2" />
                  </div>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={[
                        { subject: "Integrity", value: data?.microscopicAnalysis?.shaftStructure?.integrity || 0 },
                        { subject: "Uniformity", value: data?.microscopicAnalysis?.crossSection?.uniformity || 0 },
                        { subject: "Continuity", value: data?.microscopicAnalysis?.medullaAnalysis?.continuity || 0 },
                      ]}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis />
                        <Radar dataKey="value" fill="#9b87f5" fillOpacity={0.6} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scalp" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800/80">
              <CardHeader>
                <CardTitle>Scalp Health Indicators</CardTitle>
                <CardDescription>Comprehensive scalp analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Sebum Level</span>
                      <span className="text-purple-400">{data?.scalpHealth?.sebumLevel || 0}%</span>
                    </div>
                    <Progress value={data?.scalpHealth?.sebumLevel || 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Hydration Level</span>
                      <span className="text-purple-400">{data?.scalpHealth?.hydrationLevel || 0}%</span>
                    </div>
                    <Progress value={data?.scalpHealth?.hydrationLevel || 0} className="h-2" />
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">pH Balance</h4>
                    <p className="text-2xl font-bold text-purple-400">{data?.scalpHealth?.pHBalance || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800/80">
              <CardHeader>
                <CardTitle>Growth Cycle Distribution</CardTitle>
                <CardDescription>Analysis of hair growth phases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: "Anagen", value: data?.growthCycleAnalysis?.distribution?.anagen || 0 },
                      { name: "Catagen", value: data?.growthCycleAnalysis?.distribution?.catagen || 0 },
                      { name: "Telogen", value: data?.growthCycleAnalysis?.distribution?.telogen || 0 },
                    ]}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#9b87f5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between mb-2">
                    <span>Growth Rate</span>
                    <span className="text-purple-400">{data?.growthCycleAnalysis?.growthRate || 0}%</span>
                  </div>
                  <Progress value={data?.growthCycleAnalysis?.growthRate || 0} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chemical" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800/80">
              <CardHeader>
                <CardTitle>Chemical Analysis</CardTitle>
                <CardDescription>Chemical treatment impact assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Treatment Residue</span>
                      <span className="text-purple-400">{data?.chemicalAnalysis?.treatmentResidueLevel || 0}%</span>
                    </div>
                    <Progress value={data?.chemicalAnalysis?.treatmentResidueLevel || 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Damage Level</span>
                      <span className="text-purple-400">{data?.chemicalAnalysis?.damageLevel || 0}%</span>
                    </div>
                    <Progress value={data?.chemicalAnalysis?.damageLevel || 0} className="h-2" />
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">pH Level</h4>
                    <p className="text-2xl font-bold text-purple-400">{data?.chemicalAnalysis?.pHLevel || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="environmental" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800/80">
              <CardHeader>
                <CardTitle>Environmental Impact</CardTitle>
                <CardDescription>Analysis of environmental factors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={[
                        { subject: "UV Damage", value: data?.environmentalImpact?.uvDamage || 0 },
                        { subject: "Pollution", value: data?.environmentalImpact?.pollutionLevel || 0 },
                        { subject: "Moisture", value: data?.environmentalImpact?.moistureRetention || 0 },
                        { subject: "Protection", value: data?.environmentalImpact?.protectiveBarrier || 0 },
                      ]}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis />
                        <Radar dataKey="value" fill="#9b87f5" fillOpacity={0.6} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="treatment" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800/80">
              <CardHeader>
                <CardTitle>Treatment Plan</CardTitle>
                <CardDescription>Recommended treatments and efficacy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.treatmentPlan?.primary && (
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Primary Treatment</h4>
                      <p className="text-lg font-semibold text-purple-400">{data.treatmentPlan.primary.name}</p>
                      <p className="text-sm text-gray-300 mt-1">{data.treatmentPlan.primary.description}</p>
                      <div className="mt-2">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Efficacy</span>
                          <span className="text-sm text-purple-400">{data.treatmentPlan.primary.efficacy}%</span>
                        </div>
                        <Progress value={data.treatmentPlan.primary.efficacy || 0} className="h-2" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalysis;