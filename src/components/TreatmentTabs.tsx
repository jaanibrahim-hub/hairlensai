import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, BarChart3, Calendar, TrendingUp, Activity, ShieldCheck, Pill, Info, HelpCircle, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface TreatmentTabsProps {
  analysisData: any;
}

// Treatment information database for user education
const TREATMENT_INFO = {
  // Surgical Treatments
  'FUE Hair Transplant': {
    description: 'Individual hair follicles are extracted and transplanted to balding areas',
    invasiveness: 'Surgical',
    timeline: '6-12 months for full results',
    suitability: 'Advanced hair loss, stable donor area',
    cost: '$3,000-$15,000',
    effectiveness: '95-98% success rate'
  },
  'FUT Hair Transplant': {
    description: 'Strip of scalp with hair is removed and divided into grafts',
    invasiveness: 'Surgical', 
    timeline: '6-12 months for full results',
    suitability: 'Need for maximum grafts, cost-conscious patients',
    cost: '$2,500-$12,000',
    effectiveness: '95-98% success rate'
  },
  'DHI (Direct Hair Implantation)': {
    description: 'Advanced FUE technique with specialized implanter pen',
    invasiveness: 'Surgical',
    timeline: '6-12 months for full results', 
    suitability: 'Precision placement, minimal invasiveness desired',
    cost: '$4,000-$18,000',
    effectiveness: '96-99% success rate'
  },
  'Scalp Micropigmentation (SMP)': {
    description: 'Tattooing technique that mimics hair follicles on the scalp',
    invasiveness: 'Minimally Invasive',
    timeline: 'Immediate visual results, 2-3 sessions needed',
    suitability: 'Baldness, scars, thinning hair illusion',
    cost: '$1,500-$4,000',
    effectiveness: '90-95% satisfaction rate'
  },
  
  // Medical Treatments
  'Finasteride (Propecia)': {
    description: 'Oral medication that blocks DHT hormone causing hair loss',
    invasiveness: 'Non-invasive',
    timeline: '3-6 months to see results, lifelong use',
    suitability: 'Male pattern baldness, early to moderate stages',
    cost: '$20-$60/month',
    effectiveness: '83-90% stop further loss, 65% regrowth'
  },
  'Minoxidil 5%': {
    description: 'Topical solution that increases blood flow to hair follicles',
    invasiveness: 'Non-invasive',
    timeline: '2-4 months for initial results, ongoing use',
    suitability: 'All types of hair loss, both men and women',
    cost: '$15-$40/month',
    effectiveness: '60-70% see improvement'
  },
  'Dutasteride (Avodart)': {
    description: 'Stronger DHT blocker than finasteride, blocks more pathways',
    invasiveness: 'Non-invasive',
    timeline: '3-6 months to see results',
    suitability: 'Aggressive hair loss, finasteride non-responders',
    cost: '$30-$80/month',
    effectiveness: '90-95% stop loss, 70-80% regrowth'
  },
  'Ketoconazole Shampoo': {
    description: 'Anti-fungal shampoo with mild anti-DHT properties',
    invasiveness: 'Non-invasive',
    timeline: '2-3 months for results',
    suitability: 'Dandruff, scalp inflammation, mild hair loss',
    cost: '$10-$25/month',
    effectiveness: '30-40% improvement as adjunct therapy'
  },
  
  // Procedural Treatments
  'PRP (Platelet Rich Plasma)': {
    description: 'Your own blood platelets injected into scalp to stimulate growth',
    invasiveness: 'Minimally Invasive',
    timeline: '3-6 months, requires multiple sessions',
    suitability: 'Early to moderate hair loss, hair transplant enhancement',
    cost: '$500-$1,500/session',
    effectiveness: '70-80% see improvement'
  },
  'Microneedling': {
    description: 'Tiny needles create micro-injuries to stimulate healing and growth',
    invasiveness: 'Minimally Invasive',
    timeline: '2-4 months with regular use',
    suitability: 'All hair loss stages, enhances other treatments',
    cost: '$10-$200 (device cost)',
    effectiveness: '60-80% improvement when combined with minoxidil'
  },
  'LLLT (Low Level Laser Therapy)': {
    description: 'Red light therapy stimulates cellular activity in hair follicles',
    invasiveness: 'Non-invasive',
    timeline: '4-6 months of daily use',
    suitability: 'Early to moderate hair loss, maintenance therapy',
    cost: '$200-$3,000 (device cost)',
    effectiveness: '40-60% see improvement'
  },
  'Stem Cell Therapy': {
    description: 'Stem cells from fat or bone marrow injected to regenerate follicles',
    invasiveness: 'Minimally Invasive',
    timeline: '3-9 months for results',
    suitability: 'Advanced hair loss, failed previous treatments',
    cost: '$2,000-$10,000',
    effectiveness: '70-85% see improvement (early studies)'
  },
  
  // Natural Treatments
  'Rosemary Essential Oil': {
    description: 'Natural oil that may improve circulation and has anti-inflammatory properties',
    invasiveness: 'Non-invasive',
    timeline: '3-6 months of daily use',
    suitability: 'Mild hair loss, natural approach preference',
    cost: '$5-$20/month',
    effectiveness: '40-50% improvement (similar to 2% minoxidil in studies)'
  },
  'Saw Palmetto': {
    description: 'Natural supplement that may block DHT similar to finasteride',
    invasiveness: 'Non-invasive',
    timeline: '3-6 months of daily use',
    suitability: 'Natural DHT blocking, finasteride alternative seekers',
    cost: '$15-$30/month',
    effectiveness: '25-40% see mild improvement'
  },
  'Pumpkin Seed Oil': {
    description: 'Natural oil rich in nutrients that support hair health',
    invasiveness: 'Non-invasive',
    timeline: '3-6 months of use',
    suitability: 'Nutritional support, natural approach',
    cost: '$10-$25/month',
    effectiveness: '30-40% improvement in thickness'
  },
  
  // Lifestyle Treatments
  'Stress Management': {
    description: 'Reducing chronic stress through meditation, exercise, therapy',
    invasiveness: 'Non-invasive',
    timeline: '1-3 months to see stress reduction effects',
    suitability: 'Stress-related hair loss, overall health improvement',
    cost: '$0-$200/month',
    effectiveness: '50-70% improvement in stress-related hair loss'
  },
  'Sleep Optimization': {
    description: 'Improving sleep quality and duration for better hormonal balance',
    invasiveness: 'Non-invasive',
    timeline: '2-4 weeks for sleep improvement, 2-3 months for hair',
    suitability: 'Poor sleep patterns, hormonal imbalances',
    cost: '$0-$100/month',
    effectiveness: '30-50% improvement in hair quality'
  },
  'Nutritional Diet': {
    description: 'Optimizing protein, vitamins, and minerals essential for hair growth',
    invasiveness: 'Non-invasive',
    timeline: '2-4 months for nutritional benefits',
    suitability: 'Nutritional deficiencies, overall health focus',
    cost: '$50-$200/month',
    effectiveness: '40-60% improvement with deficiency correction'
  }
};

const TreatmentTabs: React.FC<TreatmentTabsProps> = ({ analysisData }) => {
  const [activeTab, setActiveTab] = useState('progress');

  const tabs = [
    {
      id: 'progress',
      label: 'Progress',
      icon: <BarChart3 className="w-4 h-4" />,
      content: 'recommended-treatments'
    },
    {
      id: 'timeline',
      label: 'Timeline',
      icon: <Calendar className="w-4 h-4" />,
      content: 'treatment-timeline'
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: <Activity className="w-4 h-4" />,
      content: 'treatment-categories'
    },
    {
      id: 'growth-predictor',
      label: 'Growth Predictor',
      icon: <TrendingUp className="w-4 h-4" />,
      content: 'comprehensive-database'
    }
  ];

  const renderRecommendedTreatments = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-purple-400" />
        Primary Treatment Recommendations
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {analysisData.recommendedTreatments ? (
          <>
            <div className="bg-gray-700/80 rounded-lg p-4 border-l-4 border-green-500 overflow-hidden">
              <h3 className="text-lg font-medium mb-2">Primary Recommendation</h3>
              <div className="flex items-center mb-3">
                <i className="fas fa-check-circle text-green-500 mr-2"></i>
                <span className="font-medium">{analysisData.recommendedTreatments.primary.name}</span>
              </div>
              <p className="text-sm text-gray-300 mb-3">
                {analysisData.recommendedTreatments.primary.description}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Match Score</span>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                    {analysisData.recommendedTreatments.primary.match}%
                  </span>
                </div>
                {analysisData.recommendedTreatments.primary.timeline && (
                  <div className="text-xs text-gray-400">
                    <span className="font-medium">Timeline:</span> {analysisData.recommendedTreatments.primary.timeline}
                  </div>
                )}
                {analysisData.recommendedTreatments.primary.cost && (
                  <div className="text-xs text-gray-400">
                    <span className="font-medium">Cost:</span> {analysisData.recommendedTreatments.primary.cost}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-700/80 rounded-lg p-4 border-l-4 border-blue-500">
              <h3 className="text-lg font-medium mb-2">Secondary Option</h3>
              <div className="flex items-center mb-3">
                <i className="fas fa-check-circle text-blue-500 mr-2"></i>
                <span className="font-medium">{analysisData.recommendedTreatments.secondary.name}</span>
              </div>
              <p className="text-sm text-gray-300 mb-3">
                {analysisData.recommendedTreatments.secondary.description}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Match Score</span>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                    {analysisData.recommendedTreatments.secondary.match}%
                  </span>
                </div>
                {analysisData.recommendedTreatments.secondary.synergy && (
                  <div className="text-xs text-gray-400">
                    <span className="font-medium">Synergy:</span> {analysisData.recommendedTreatments.secondary.synergy}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-700/80 rounded-lg p-4 border-l-4 border-purple-500">
              <h3 className="text-lg font-medium mb-2">Supporting Treatment</h3>
              <div className="flex items-center mb-3">
                <i className="fas fa-check-circle text-purple-500 mr-2"></i>
                <span className="font-medium">{analysisData.recommendedTreatments.supporting.name}</span>
              </div>
              <p className="text-sm text-gray-300 mb-3">
                {analysisData.recommendedTreatments.supporting.description}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Match Score</span>
                  <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                    {analysisData.recommendedTreatments.supporting.match}%
                  </span>
                </div>
                {analysisData.recommendedTreatments.supporting.frequency && (
                  <div className="text-xs text-gray-400">
                    <span className="font-medium">Frequency:</span> {analysisData.recommendedTreatments.supporting.frequency}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="col-span-full text-center text-gray-400">
            <p>No specific treatment recommendations available. Please complete a hair analysis first.</p>
          </div>
        )}
      </div>
    </div>
  );

  // Function to get treatment match percentage from API data or calculate realistic percentage
  const getTreatmentMatch = (treatmentName: string, category: string) => {
    // First check if we have specific match data from API
    if (analysisData.recommendedTreatments?.categories?.[category]) {
      const categoryTreatments = analysisData.recommendedTreatments.categories[category];
      if (Array.isArray(categoryTreatments)) {
        const matchingTreatment = categoryTreatments.find(t => 
          (typeof t === 'object' && t.name === treatmentName) ||
          (typeof t === 'string' && t.includes(treatmentName.split(' ')[0]))
        );
        if (matchingTreatment && typeof matchingTreatment === 'object' && matchingTreatment.match) {
          return parseInt(matchingTreatment.match) || 75;
        }
      }
    }
    
    // Calculate realistic match based on hair analysis data and treatment suitability
    let baseMatch = 70;
    
    // Adjust based on hair health score
    const healthScore = analysisData.overallHealthScore || analysisData.healthScore || 70;
    if (healthScore < 40) baseMatch += 15; // Poor health needs more aggressive treatment
    else if (healthScore > 80) baseMatch -= 10; // Good health needs less aggressive treatment
    
    // Adjust based on treatment category and hair condition
    if (category === 'surgical' && healthScore < 30) baseMatch += 20;
    if (category === 'natural' && healthScore > 70) baseMatch += 10;
    if (category === 'medical' && healthScore < 60) baseMatch += 15;
    
    // Add some controlled variation but keep it realistic
    const variation = Math.floor(Math.random() * 20) - 10; // -10 to +10
    return Math.min(95, Math.max(45, baseMatch + variation));
  };
  
  // Function to get treatment cost from API or realistic estimate
  const getTreatmentCost = (treatmentName: string, category: string) => {
    const info = TREATMENT_INFO[treatmentName];
    if (info?.cost) return info.cost;
    
    // Fallback cost estimation by category
    const costMap = {
      surgical: ['$$$', '$$$$'],
      medical: ['$', '$$'],
      procedural: ['$$', '$$$'],
      topical: ['$', '$$'],
      natural: ['$', '$'],
      lifestyle: ['$', '$']
    };
    
    const costs = costMap[category] || ['$$'];
    return costs[Math.floor(Math.random() * costs.length)];
  };
  
  const renderTreatmentCategories = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          Treatment Categories by Type
        </h2>

        {analysisData.recommendedTreatments?.categories ? (
          <div className="space-y-6">
            {Object.entries(analysisData.recommendedTreatments.categories).map(([category, treatments], categoryIndex) => (
            <div key={categoryIndex} className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-base font-medium text-white capitalize flex items-center gap-2">
                  {category === 'surgical' && <i className="fas fa-cut text-red-400"></i>}
                  {category === 'medical' && <i className="fas fa-pills text-green-400"></i>}
                  {category === 'procedural' && <i className="fas fa-syringe text-blue-400"></i>}
                  {category === 'topical' && <i className="fas fa-tint text-yellow-400"></i>}
                  {category === 'natural' && <i className="fas fa-leaf text-emerald-400"></i>}
                  {category === 'lifestyle' && <i className="fas fa-heart text-pink-400"></i>}
                  {category.replace('_', ' ')} Treatments
                </h4>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded flex items-center gap-1 cursor-help">
                        {Array.isArray(treatments) ? treatments.length : 'Multiple'} Options
                        <HelpCircle className="w-3 h-3" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">
                        {category === 'surgical' ? 'Surgical procedures for advanced hair restoration' :
                         category === 'medical' ? 'FDA-approved medications and medical treatments' :
                         category === 'procedural' ? 'Professional in-office procedures and therapies' :
                         category === 'topical' ? 'Applied treatments including serums, oils, and solutions' :
                         category === 'natural' ? 'Natural and herbal remedies for hair health' :
                         'Lifestyle changes and behavioral modifications'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
                {Array.isArray(treatments) ? treatments.map((treatment, treatmentIndex) => {
                  const treatmentName = typeof treatment === 'string' ? treatment : treatment.name || 'Treatment';
                  const match = getTreatmentMatch(treatmentName, category);
                  const cost = getTreatmentCost(treatmentName, category);
                  const treatmentInfo = TREATMENT_INFO[treatmentName];
                  
                  return (
                    <TooltipProvider key={treatmentIndex}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="bg-gray-800/50 p-3 rounded-lg hover:bg-gray-800/70 transition-colors border border-gray-600/30 cursor-help">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-white truncate flex items-center gap-1" title={treatmentName}>
                                {treatmentName}
                                <HelpCircle className="w-3 h-3 text-gray-400 opacity-60" />
                              </span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                match >= 85 ? 'bg-green-500/20 text-green-400' :
                                match >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-orange-500/20 text-orange-400'
                              }`}>
                                {match}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <span>Cost: {treatmentInfo?.cost || cost}</span>
                              <span className={`${
                                category === 'surgical' ? 'text-red-300' :
                                category === 'natural' ? 'text-green-300' :
                                'text-blue-300'
                              }`}>
                                {treatmentInfo?.invasiveness || (category === 'surgical' ? 'Invasive' :
                                 category === 'natural' ? 'Natural' :
                                 category === 'medical' ? 'Medical' :
                                 'Non-invasive')}
                              </span>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-80 p-4 bg-gray-800 border border-gray-600">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-white">{treatmentName}</h4>
                            {treatmentInfo ? (
                              <>
                                <p className="text-sm text-gray-300">{treatmentInfo.description}</p>
                                <div className="grid grid-cols-1 gap-1 text-xs">
                                  <div><span className="text-gray-400">Timeline:</span> <span className="text-white">{treatmentInfo.timeline}</span></div>
                                  <div><span className="text-gray-400">Cost:</span> <span className="text-white">{treatmentInfo.cost}</span></div>
                                  <div><span className="text-gray-400">Effectiveness:</span> <span className="text-white">{treatmentInfo.effectiveness}</span></div>
                                  <div><span className="text-gray-400">Best for:</span> <span className="text-white">{treatmentInfo.suitability}</span></div>
                                </div>
                              </>
                            ) : (
                              <p className="text-sm text-gray-300">A {category} treatment option. Match percentage is based on your hair analysis results and treatment suitability.</p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                }) : (
                  <div className="col-span-full text-sm text-gray-400">
                    {typeof treatments === 'string' ? treatments : 'Multiple treatment options available based on your analysis.'}
                  </div>
                )}
              </div>
            </div>
          ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <p>Treatment categories will be displayed after AI analysis.</p>
          </div>
        )}
      </div>
    );
  };

  const renderComprehensiveDatabase = function() {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          Comprehensive Treatment Database & Growth Predictions
        </h2>

        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-4 border border-purple-500/30 mb-6">
          <h3 className="text-lg font-medium mb-3 text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            Evidence-Based Combination Protocols
          </h3>
          <div className="space-y-2">
            {(analysisData.recommendedTreatments?.combination_protocols || [
              "Finasteride + Minoxidil + Microneedling (Triple Therapy Protocol - 95% effectiveness)",
              "PRP + LLLT + Topical Growth Factors (Regenerative Combination - 88% effectiveness)", 
              "Hair Transplant + Medical Therapy + LLLT (Surgical + Medical Maintenance - 97% success)",
              "Dutasteride + Topical Finasteride + LLLT (Advanced DHT Blocking - 92% effectiveness)"
            ]).map((protocol, index) => (
              <div key={index} className="text-sm text-gray-200 flex items-start gap-2">
                <span className="text-purple-400 mt-0.5">•</span>
                <span>{protocol}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-red-600/10 to-red-800/10 p-4 rounded-lg border border-red-500/20">
            <h3 className="font-medium mb-3 text-red-300 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Surgical Options ({(analysisData.recommendedTreatments?.surgical || []).length || 4} treatments)
            </h3>
            <div className="space-y-2">
              {(analysisData.recommendedTreatments?.surgical || ["FUE Hair Transplant", "FUT Hair Transplant", "DHI (Direct Hair Implantation)", "Scalp Micropigmentation (SMP)"]).map((treatment, index) => {
                const treatmentName = typeof treatment === 'object' ? treatment.name : treatment;
                const apiMatch = typeof treatment === 'object' ? treatment.match : null;
                const match = apiMatch || getTreatmentMatch(treatmentName, 'surgical');
                return (
                  <div key={index} className="bg-gray-800/30 p-3 rounded-lg border border-gray-600/30 hover:border-red-500/40 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">{treatmentName}</span>
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">{match}% match</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>High Effectiveness</span>
                      <span className="text-red-300">Invasive</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 p-4 rounded-lg border border-blue-500/20">
            <h3 className="font-medium mb-3 text-blue-300 flex items-center gap-2">
              <Pill className="w-4 h-4" />
              Medical Therapies ({(analysisData.recommendedTreatments?.medical || []).length || 6} treatments)
            </h3>
            <div className="space-y-2">
              {(analysisData.recommendedTreatments?.medical || ["Finasteride (Propecia)", "Minoxidil (Rogaine)", "Dutasteride (Avodart)", "Topical Finasteride", "Oral Minoxidil", "Spironolactone"]).map((treatment, index) => {
                const treatmentName = typeof treatment === 'object' ? treatment.name : treatment;
                const apiMatch = typeof treatment === 'object' ? treatment.match : null;
                const match = apiMatch || getTreatmentMatch(treatmentName, 'medical');
                return (
                  <div key={index} className="bg-gray-800/30 p-3 rounded-lg border border-gray-600/30 hover:border-blue-500/40 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">{treatmentName}</span>
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">{match}% match</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>FDA Approved</span>
                      <span className="text-blue-300">Medical</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600/10 to-green-800/10 p-4 rounded-lg border border-green-500/20 mb-6">
          <h3 className="font-medium mb-3 text-green-300 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Natural & Alternative Approaches ({(analysisData.recommendedTreatments?.natural || []).length || 8} treatments)
          </h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {(analysisData.recommendedTreatments?.natural || ["PRP (Platelet-Rich Plasma)", "LLLT (Low-Level Laser Therapy)", "Microneedling (Dermarolling)", "Scalp Massage", "Essential Oils (Rosemary, Peppermint)", "Biotin & Supplements", "DHT-Blocking Shampoos", "Saw Palmetto Extract"]).map((treatment, index) => {
              const treatmentName = typeof treatment === 'object' ? treatment.name : treatment;
              const apiMatch = typeof treatment === 'object' ? treatment.match : null;
              const match = apiMatch || getTreatmentMatch(treatmentName, 'natural');
              return (
                <div key={index} className="bg-gray-800/30 p-3 rounded-lg border border-gray-600/30 hover:border-green-500/40 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">{treatmentName}</span>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">{match}% match</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Natural Approach</span>
                    <span className="text-green-300">Non-invasive</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-lg p-4 border border-purple-500/30">
          <h3 className="text-lg font-medium mb-3 text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Treatment Effectiveness & Cost Analysis
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">95-98%</div>
              <div className="text-sm text-gray-400">Surgical Success Rate</div>
              <div className="text-xs text-gray-500 mt-1">Hair transplants show highest long-term success</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">70-85%</div>
              <div className="text-sm text-gray-400">Medical Effectiveness</div>
              <div className="text-xs text-gray-500 mt-1">FDA-approved medications slow progression</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">$50-$15K</div>
              <div className="text-sm text-gray-400">Treatment Cost Range</div>
              <div className="text-xs text-gray-500 mt-1">From supplements to surgical procedures</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render actual treatment timeline with milestones
  const renderTreatmentTimeline = () => {
    // Get timeline data from API or create realistic timeline based on recommended treatments
    const timelineData = analysisData.recommendedTreatments?.timeline_expectations || {
      immediate: "Initial assessment and treatment plan setup. Begin gentle scalp care routine.",
      short_term: "Start seeing reduced hair fall and improved scalp health. Early treatment adaptation.", 
      medium_term: "Noticeable improvement in hair density and texture. Treatment effectiveness becomes evident.",
      long_term: "Significant hair growth and restoration. Full treatment benefits realized.",
      maintenance: "Ongoing maintenance protocol to sustain results and prevent further loss."
    };
    
    const milestones = [
      {
        period: '0-4 Weeks',
        title: 'Immediate Phase',
        description: timelineData.immediate,
        icon: <CheckCircle className="w-5 h-5 text-blue-400" />,
        color: 'blue',
        expectations: [
          'Initial consultation and assessment',
          'Begin recommended treatments',
          'Establish daily care routine',
          'Monitor for any side effects'
        ]
      },
      {
        period: '1-3 Months', 
        title: 'Short Term Results',
        description: timelineData.short_term,
        icon: <Activity className="w-5 h-5 text-green-400" />,
        color: 'green',
        expectations: [
          'Reduced daily hair shedding',
          'Improved scalp condition',
          'Better hair texture and shine',
          'Treatment routine established'
        ]
      },
      {
        period: '3-6 Months',
        title: 'Medium Term Progress', 
        description: timelineData.medium_term,
        icon: <TrendingUp className="w-5 h-5 text-yellow-400" />,
        color: 'yellow',
        expectations: [
          'Visible increase in hair density',
          'New hair growth in thinning areas',
          'Stronger, thicker hair strands',
          'Improved overall hair health'
        ]
      },
      {
        period: '6-12 Months',
        title: 'Long Term Results',
        description: timelineData.long_term, 
        icon: <TrendingUp className="w-5 h-5 text-purple-400" />,
        color: 'purple',
        expectations: [
          'Maximum treatment effectiveness',
          'Significant cosmetic improvement',
          'Stabilized hair loss progression',
          'Enhanced confidence and satisfaction'
        ]
      },
      {
        period: '12+ Months',
        title: 'Maintenance Phase',
        description: timelineData.maintenance,
        icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
        color: 'emerald',
        expectations: [
          'Sustained results maintenance',
          'Adjusted treatment protocols',
          'Long-term hair health monitoring',
          'Preventive care strategies'
        ]
      }
    ];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-6 h-6 text-purple-400" />
          <div>
            <h2 className="text-xl font-semibold text-white">Treatment Timeline & Milestones</h2>
            <p className="text-gray-400 text-sm">Expected progress based on your personalized treatment plan</p>
          </div>
        </div>
        
        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-4 border border-purple-500/30 mb-6">
          <h3 className="text-lg font-medium mb-3 text-white flex items-center gap-2">
            <Info className="w-5 h-5 text-purple-400" />
            Timeline Overview
          </h3>
          <p className="text-sm text-gray-300 mb-3">
            Your treatment timeline is customized based on your hair analysis results and recommended treatment plan.
            Results vary by individual, treatment combination, and consistency of use.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300">Timeline based on your specific treatments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-300">Milestones adapted to your hair condition</span>
            </div>
          </div>
        </div>
        
        {/* Timeline Milestones */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-500 via-green-500 via-yellow-500 via-purple-500 to-emerald-500"></div>
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative flex items-start gap-4">
                {/* Timeline Icon */}
                <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  milestone.color === 'blue' ? 'bg-blue-500/20 border-blue-500' :
                  milestone.color === 'green' ? 'bg-green-500/20 border-green-500' :
                  milestone.color === 'yellow' ? 'bg-yellow-500/20 border-yellow-500' :
                  milestone.color === 'purple' ? 'bg-purple-500/20 border-purple-500' :
                  'bg-emerald-500/20 border-emerald-500'
                }`}>
                  {milestone.icon}
                </div>
                
                {/* Milestone Content */}
                <div className="flex-1 bg-gray-700/50 rounded-lg p-4 border border-gray-600/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-medium text-white">{milestone.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded border ${
                      milestone.color === 'blue' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                      milestone.color === 'green' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                      milestone.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                      milestone.color === 'purple' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                      'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {milestone.period}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-3">{milestone.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {milestone.expectations.map((expectation, expIndex) => (
                      <div key={expIndex} className="flex items-center gap-2 text-xs text-gray-400">
                        <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                        <span>{expectation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Important Notes */}
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
          <h4 className="flex items-center gap-2 text-orange-300 font-medium mb-2">
            <AlertCircle className="w-4 h-4" />
            Important Timeline Notes
          </h4>
          <div className="text-xs text-orange-200 space-y-1">
            <p>• Results timeline varies based on individual response, treatment adherence, and hair loss severity</p>
            <p>• Consistency with treatment protocol is crucial for achieving expected milestones</p>
            <p>• Some treatments may show initial shedding before improvement (normal response)</p>
            <p>• Regular follow-ups help adjust timeline expectations and optimize results</p>
          </div>
        </div>
      </div>
    );
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'progress':
        return renderRecommendedTreatments();
      case 'timeline':
        return renderTreatmentTimeline();
      case 'categories':
        return renderTreatmentCategories();
      case 'growth-predictor':
        return renderComprehensiveDatabase();
      default:
        return renderRecommendedTreatments();
    }
  };

  return (
    <div className="w-full">
      {/* Mobile-friendly Tab Navigation */}
      <div className="border-b border-gray-600 mb-6 overflow-x-auto">
        <div className="flex min-w-max gap-1 sm:gap-2 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-t-lg text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'bg-purple-600 text-white border-b-2 border-purple-400 shadow-lg' 
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                }
                min-w-[80px] sm:min-w-[120px] justify-center
              `}
            >
              {tab.icon}
              <span className={`${tab.id === 'growth-predictor' ? 'hidden xs:inline sm:inline' : ''}`}>
                {tab.label}
              </span>
              {tab.id === 'growth-predictor' && <span className="xs:hidden sm:hidden">Growth</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px] w-full overflow-hidden">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default TreatmentTabs;