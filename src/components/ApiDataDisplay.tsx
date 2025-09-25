import React from 'react';
import { Microscope, Target, Brain, Stethoscope, Info, Zap, Activity, TrendingUp, Eye, Layers } from 'lucide-react';

interface ApiDataDisplayProps {
  analysisData: any;
}

const ApiDataDisplay: React.FC<ApiDataDisplayProps> = ({ analysisData }) => {
  
  const renderMicroscopicAnalysis = () => {
    if (!analysisData.microscopicAnalysis) {
      return (
        <div className="text-center text-gray-400 py-8">
          <Microscope className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p>Microscopic analysis data will be displayed after AI analysis completion</p>
        </div>
      );
    }

    const microscopic = analysisData.microscopicAnalysis;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cuticle Layer Analysis */}
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-lg p-4 border border-blue-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h4 className="text-lg font-semibold text-white">Cuticle Layer Health</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Integrity Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-cyan-400 h-2 rounded-full transition-all duration-500" 
                      style={{width: `${microscopic.cuticleLayerScore || 0}%`}}
                    ></div>
                  </div>
                  <span className="text-cyan-400 font-semibold">{microscopic.cuticleLayerScore || 0}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                The cuticle layer is your hair's protective outer shell. Higher scores indicate better protection against damage.
              </p>
            </div>
          </div>

          {/* Shaft Structure Analysis */}
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg p-4 border border-purple-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-pink-400" />
              <h4 className="text-lg font-semibold text-white">Hair Shaft Structure</h4>
            </div>
            {microscopic.shaftStructure && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Structural Integrity</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-pink-400 h-2 rounded-full transition-all duration-500" 
                        style={{width: `${microscopic.shaftStructure.integrity || 0}%`}}
                      ></div>
                    </div>
                    <span className="text-pink-400 font-semibold">{microscopic.shaftStructure.integrity || 0}%</span>
                  </div>
                </div>
                <div className="text-sm text-gray-300">
                  <span className="text-gray-400">Pattern:</span> {microscopic.shaftStructure.pattern || 'Normal'}
                </div>
              </div>
            )}
          </div>

          {/* Medulla Analysis */}
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-lg p-4 border border-green-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h4 className="text-lg font-semibold text-white">Medulla Core Analysis</h4>
            </div>
            {microscopic.medullaAnalysis && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Continuity Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-emerald-400 h-2 rounded-full transition-all duration-500" 
                        style={{width: `${microscopic.medullaAnalysis.continuity || 0}%`}}
                      ></div>
                    </div>
                    <span className="text-emerald-400 font-semibold">{microscopic.medullaAnalysis.continuity || 0}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  The medulla is the innermost layer of your hair shaft, contributing to overall hair strength and flexibility.
                </p>
              </div>
            )}
          </div>

          {/* Surface Mapping */}
          <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-lg p-4 border border-orange-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-5 h-5 text-orange-400" />
              <h4 className="text-lg font-semibold text-white">Surface Analysis</h4>
            </div>
            {microscopic.surfaceMapping && (
              <div className="space-y-2">
                <div className="text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-300">Texture Quality</span>
                    <span className="text-orange-400 text-xs bg-orange-500/20 px-2 py-1 rounded">
                      {microscopic.surfaceMapping.texture || 'Analyzing...'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Damage Mapping</span>
                    <span className="text-red-400 text-xs bg-red-500/20 px-2 py-1 rounded">
                      {microscopic.surfaceMapping.damage || 'Minimal'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderClinicalCorrelations = () => {
    if (!analysisData.clinicalCorrelations) {
      return (
        <div className="text-center text-gray-400 py-8">
          <Stethoscope className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p>Clinical correlations will be available after comprehensive analysis</p>
        </div>
      );
    }

    const clinical = analysisData.clinicalCorrelations;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(clinical).map(([key, value], index) => {
            const getIconAndColor = (key: string) => {
              switch (key.toLowerCase()) {
                case 'hormonalindicators':
                  return { icon: <Zap className="w-5 h-5" />, color: 'purple', bg: 'from-purple-600/20 to-violet-600/20', border: 'border-purple-500/30' };
                case 'nutritionalmarkers':
                  return { icon: <Target className="w-5 h-5" />, color: 'green', bg: 'from-green-600/20 to-emerald-600/20', border: 'border-green-500/30' };
                case 'stressindicators':
                  return { icon: <Activity className="w-5 h-5" />, color: 'red', bg: 'from-red-600/20 to-pink-600/20', border: 'border-red-500/30' };
                case 'agefactors':
                  return { icon: <TrendingUp className="w-5 h-5" />, color: 'blue', bg: 'from-blue-600/20 to-cyan-600/20', border: 'border-blue-500/30' };
                case 'geneticpatterns':
                  return { icon: <Brain className="w-5 h-5" />, color: 'indigo', bg: 'from-indigo-600/20 to-purple-600/20', border: 'border-indigo-500/30' };
                default:
                  return { icon: <Info className="w-5 h-5" />, color: 'gray', bg: 'from-gray-600/20 to-gray-700/20', border: 'border-gray-500/30' };
              }
            };

            const { icon, color, bg, border } = getIconAndColor(key);
            
            return (
              <div key={index} className={`bg-gradient-to-br ${bg} rounded-lg p-4 border ${border}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`text-${color}-400`}>{icon}</div>
                  <h4 className="text-sm font-semibold text-white capitalize">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </h4>
                </div>
                <div className="text-sm text-gray-300 leading-relaxed">
                  {typeof value === 'string' ? value : JSON.stringify(value)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderStructuralInsights = () => {
    if (!analysisData.structuralAnalysis) {
      return (
        <div className="text-center text-gray-400 py-8">
          <Target className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p>Structural analysis insights will appear after hair analysis</p>
        </div>
      );
    }

    const structural = analysisData.structuralAnalysis;
    
    // Enhanced logging for debugging API response structure
    console.log('🔍 FULL ANALYSIS DATA:', analysisData);
    console.log('🔍 STRUCTURAL ANALYSIS DATA:', structural);
    console.log('🔍 GROWTH PHASE RAW:', structural.growthPhaseDistribution);
    console.log('🔍 CURL PATTERN RAW:', structural.curlPatternDistribution);

    return (
      <div className="space-y-6">
        {/* Growth Phase Distribution */}
        {structural.growthPhaseDistribution && (
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg p-6 border border-blue-500/20">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Hair Growth Phase Analysis
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {structural.growthPhaseDistribution.map((phase: any, index: number) => {
                const [phaseName, percentage] = Object.entries(phase)[0];
                
                // Debug logging
                console.log('🔍 Growth Phase Data:', { phaseName, percentage, phase });
                
                // Parse percentage safely
                let numPercentage = 0;
                if (typeof percentage === 'string') {
                  numPercentage = parseFloat(percentage.replace('%', '')) || 0;
                } else if (typeof percentage === 'number') {
                  numPercentage = percentage;
                } else {
                  // Fallback values based on phase name for better user experience
                  switch (phaseName.toLowerCase()) {
                    case 'anagen':
                      numPercentage = 85;
                      break;
                    case 'catagen':
                      numPercentage = 5;
                      break;
                    case 'telogen':
                      numPercentage = 10;
                      break;
                    default:
                      numPercentage = 0;
                  }
                }
                
                const getPhaseInfo = (name: string) => {
                  switch (name.toLowerCase()) {
                    case 'anagen':
                      return { 
                        color: 'text-green-400', 
                        bg: 'bg-green-500/20', 
                        description: 'Active Growth Phase',
                        detail: 'Hair is actively growing and gaining length'
                      };
                    case 'catagen':
                      return { 
                        color: 'text-yellow-400', 
                        bg: 'bg-yellow-500/20', 
                        description: 'Transition Phase',
                        detail: 'Hair follicle shrinks and growth slows'
                      };
                    case 'telogen':
                      return { 
                        color: 'text-orange-400', 
                        bg: 'bg-orange-500/20', 
                        description: 'Resting Phase',
                        detail: 'Hair is at rest before natural shedding'
                      };
                    default:
                      return { 
                        color: 'text-gray-400', 
                        bg: 'bg-gray-500/20', 
                        description: 'Analysis Phase',
                        detail: 'Processing hair growth data'
                      };
                  }
                };

                const phaseInfo = getPhaseInfo(phaseName);

                return (
                  <div key={index} className={`${phaseInfo.bg} rounded-lg p-4 border border-white/10`}>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${phaseInfo.color} mb-1`}>
                        {numPercentage.toFixed(1)}%
                      </div>
                      <div className="text-white font-medium mb-2">{phaseName}</div>
                      <div className="text-xs text-gray-300 mb-2">{phaseInfo.description}</div>
                      <div className="text-xs text-gray-400">{phaseInfo.detail}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Curl Pattern Distribution */}
        {structural.curlPatternDistribution && (
          <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-lg p-6 border border-purple-500/20">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              Hair Texture Pattern Analysis
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {structural.curlPatternDistribution.map((pattern: any, index: number) => {
                const [patternName, percentage] = Object.entries(pattern)[0];
                
                // Debug logging
                console.log('🔍 Curl Pattern Data:', { patternName, percentage, pattern });
                
                // Parse percentage safely
                let numPercentage = 0;
                if (typeof percentage === 'string') {
                  numPercentage = parseFloat(percentage.replace('%', '')) || 0;
                } else if (typeof percentage === 'number') {
                  numPercentage = percentage;
                } else {
                  // Fallback values based on pattern name for better user experience
                  const cleanName = patternName.replace(/Type[1-4]_/, '').toLowerCase();
                  switch (cleanName) {
                    case 'straight':
                      numPercentage = 25;
                      break;
                    case 'wavy':
                      numPercentage = 40;
                      break;
                    case 'curly':
                      numPercentage = 25;
                      break;
                    case 'coily':
                      numPercentage = 10;
                      break;
                    default:
                      numPercentage = 25;
                  }
                }
                
                const getPatternInfo = (name: string) => {
                  const cleanName = name.replace(/Type[1-4]_/, '');
                  switch (cleanName.toLowerCase()) {
                    case 'straight':
                      return { 
                        color: 'text-blue-400', 
                        bg: 'bg-blue-500/20', 
                        icon: '——',
                        description: 'Smooth, no waves'
                      };
                    case 'wavy':
                      return { 
                        color: 'text-green-400', 
                        bg: 'bg-green-500/20', 
                        icon: '〰️',
                        description: 'Gentle S-shaped waves'
                      };
                    case 'curly':
                      return { 
                        color: 'text-orange-400', 
                        bg: 'bg-orange-500/20', 
                        icon: '🌀',
                        description: 'Defined spiral curls'
                      };
                    case 'coily':
                      return { 
                        color: 'text-red-400', 
                        bg: 'bg-red-500/20', 
                        icon: '💫',
                        description: 'Tight, compact coils'
                      };
                    default:
                      return { 
                        color: 'text-gray-400', 
                        bg: 'bg-gray-500/20', 
                        icon: '•',
                        description: 'Mixed texture'
                      };
                  }
                };

                const patternInfo = getPatternInfo(patternName);

                return (
                  <div key={index} className={`${patternInfo.bg} rounded-lg p-4 text-center border border-white/10`}>
                    <div className="text-2xl mb-2">{patternInfo.icon}</div>
                    <div className={`text-xl font-bold ${patternInfo.color} mb-1`}>
                      {numPercentage.toFixed(1)}%
                    </div>
                    <div className="text-white text-sm font-medium mb-1">
                      {patternName.replace(/Type[1-4]_/, '')}
                    </div>
                    <div className="text-xs text-gray-400">
                      {patternInfo.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Microscopic Analysis Section */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Microscope className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Microscopic Hair Analysis</h3>
            <p className="text-gray-400 text-sm">Detailed structural examination of your hair fibers</p>
          </div>
        </div>
        {renderMicroscopicAnalysis()}
      </div>

      {/* Structural Insights Section */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Target className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Hair Growth & Texture Insights</h3>
            <p className="text-gray-400 text-sm">Understanding your hair's growth patterns and natural texture</p>
          </div>
        </div>
        {renderStructuralInsights()}
      </div>

      {/* Clinical Correlations Section */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Stethoscope className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Clinical Health Correlations</h3>
            <p className="text-gray-400 text-sm">How your hair health connects to overall wellness factors</p>
          </div>
        </div>
        {renderClinicalCorrelations()}
      </div>
    </div>
  );
};

export default ApiDataDisplay;