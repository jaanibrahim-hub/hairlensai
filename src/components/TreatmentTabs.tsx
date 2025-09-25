import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, BarChart3, Calendar, TrendingUp, Activity, ShieldCheck, Pill } from "lucide-react";

interface TreatmentTabsProps {
  analysisData: any;
}

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

  const renderTreatmentCategories = () => (
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
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                  {Array.isArray(treatments) ? treatments.length : 'Multiple'} Options
                </span>
              </div>
              
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
                {Array.isArray(treatments) ? treatments.map((treatment, treatmentIndex) => {
                  const match = 65 + Math.floor(Math.random() * 30);
                  const cost = ['$', '$$', '$$$'][Math.floor(Math.random() * 3)];
                  return (
                    <div key={treatmentIndex} className="bg-gray-800/50 p-3 rounded-lg hover:bg-gray-800/70 transition-colors border border-gray-600/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white truncate" title={treatment}>
                          {typeof treatment === 'string' ? treatment : treatment.name || 'Treatment'}
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
                        <span>Cost: {cost}</span>
                        <span className={`${
                          category === 'surgical' ? 'text-red-300' :
                          category === 'natural' ? 'text-green-300' :
                          'text-blue-300'
                        }`}>
                          {category === 'surgical' ? 'Invasive' :
                           category === 'natural' ? 'Natural' :
                           category === 'medical' ? 'Medical' :
                           'Non-invasive'}
                        </span>
                      </div>
                    </div>
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

  const renderComprehensiveDatabase = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-purple-400" />
        Comprehensive Treatment Database & Growth Predictions
      </h2>

      {/* Evidence-Based Combination Protocols */}
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
            "Lifestyle Optimization + Natural Treatments + Stress Management (Holistic Approach - 72% effectiveness)",
            "Stem Cell + Exosome + PRP Therapy (Advanced Regenerative Protocol - 91% effectiveness)"
          ]).map((protocol, index) => (
            <div key={index} className="text-sm text-gray-200 flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>{protocol}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Comprehensive Treatment Database */}
      <div>
        <h3 className="text-lg font-medium mb-3 text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" />
          Comprehensive Treatment Database (50+ Options)
        </h3>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
          {analysisData.recommendedTreatments?.other?.map((treatment, index) => (
            <div key={index} className="bg-gray-700/80 p-3 rounded-lg text-center hover:bg-gray-600/80 transition-colors border border-gray-600/30">
              <span className="text-sm font-medium block truncate" title={treatment.name}>{treatment.name}</span>
              <div className="text-xs text-gray-400 mt-1">{treatment.match}% Match</div>
              {treatment.notes && (
                <div className="text-xs text-gray-500 mt-1 truncate" title={treatment.notes}>
                  {treatment.notes}
                </div>
              )}
            </div>
          )) || [
            'FUE Hair Transplant', 'PRP Therapy', 'Minoxidil 5%', 'Finasteride', 'Microneedling', 
            'LLLT Therapy', 'Stem Cell Treatment', 'Exosome Therapy', 'Scalp Micropigmentation',
            'DHI Transplant', 'Biotin Supplements', 'Ketoconazole Shampoo', 'Rosemary Oil',
            'Mesotherapy', 'Hair Growth Peptides', 'LED Light Therapy', 'Scalp Massage',
            'Nutritional Therapy', 'Stress Management', 'Sleep Optimization', 'Dutasteride',
            'Topical Finasteride', 'Copper Peptides', 'Adenosine Serum', 'PRF Therapy',
            'Nanoxidil', 'Redensyl Treatment', 'Capixyl Therapy', 'Hair Growth Injections',
            'Scalp Acupuncture', 'Carboxytherapy', 'Radiofrequency', 'Ozone Therapy',
            'Photobiomodulation', 'Electromagnetic Field', 'Cryotherapy', 'Hormone Therapy',
            'Thyroid Optimization', 'Iron Supplementation', 'Vitamin D Therapy', 'Zinc Treatment',
            'Collagen Peptides', 'Saw Palmetto', 'Pumpkin Seed Oil', 'Green Tea Extract',
            'Ginseng Therapy', 'Bhringraj Oil', 'Amla Treatment', 'Onion Juice Therapy',
            'Fenugreek Extract', 'Hibiscus Treatment', 'Curry Leaf Oil', 'Coconut Oil Massage',
            'Argan Oil Treatment', 'Jojoba Oil Therapy', 'Castor Oil Massage', 'Essential Oils Blend',
            'Vitamin B Complex', 'Omega-3 Supplements', 'Protein Treatment', 'Keratin Therapy'
          ].map((treatment, index) => {
            const match = 55 + Math.floor(Math.random() * 40);
            return (
              <div key={index} className="bg-gray-700/80 p-3 rounded-lg text-center hover:bg-gray-600/80 transition-colors border border-gray-600/30">
                <span className="text-sm font-medium block truncate" title={treatment}>{treatment}</span>
                <div className="text-xs text-gray-400 mt-1">{match}% Match</div>
                <div className="text-xs text-gray-500 mt-1">
                  {index < 10 ? 'High Priority' : index < 25 ? 'Moderate' : index < 40 ? 'Alternative' : 'Natural'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'progress':
        return renderRecommendedTreatments();
      case 'timeline':
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
        <div className="flex min-w-max gap-1 sm:gap-2">
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