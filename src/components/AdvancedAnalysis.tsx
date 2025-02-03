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
  data: any; // Replace with proper type when available
}

const AdvancedAnalysis = ({ data }: AdvancedAnalysisProps) => {
  console.log("Advanced Analysis Data:", data); // Debug log

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
                      <span className="text-purple-400">{data?.microscopicAnalysis?.cuticleLayerScore || 0}</span>
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
                      <p className="text-sm text-gray-300">{data?.microscopicAnalysis?.surfaceMapping?.texture || "N/A"}</p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Damage</h4>
                      <p className="text-sm text-gray-300">{data?.microscopicAnalysis?.surfaceMapping?.damage || "N/A"}</p>
                    </div>
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
                <CardTitle>Scalp Condition</CardTitle>
                <CardDescription>Analysis of scalp health indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Sebum Level</h4>
                      <p className="text-sm text-gray-300">{data?.metrics?.scalpCondition || "N/A"}</p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Hydration</h4>
                      <Progress value={data?.metrics?.hydrationLevel || 0} className="h-2" />
                    </div>
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
                <CardTitle>Growth Phase Distribution</CardTitle>
                <CardDescription>Analysis of hair growth cycles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data?.growthPhaseData?.datasets?.[0]?.data || []}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#9b87f5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chemical" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800/80">
              <CardHeader>
                <CardTitle>Chemical Treatment Analysis</CardTitle>
                <CardDescription>Impact of chemical treatments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Treatment Level</h4>
                    <p className="text-sm text-gray-300">{data?.metrics?.chemicalTreatment || "N/A"}</p>
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
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Protection Level</h4>
                    <p className="text-sm text-gray-300">{data?.metrics?.protectionLevel || "N/A"}</p>
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
                <CardTitle>Recommended Treatments</CardTitle>
                <CardDescription>Personalized treatment suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.recommendedTreatments?.primary && (
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Primary Treatment</h4>
                      <p className="text-sm text-gray-300">{data.recommendedTreatments.primary.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{data.recommendedTreatments.primary.description}</p>
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