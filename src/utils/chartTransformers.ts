export const transformRegionalData = (data: any) => {
  if (!data) return null;
  
  return {
    labels: Object.keys(data),
    datasets: [{
      label: 'Health Score',
      data: Object.values(data).map((region: any) => region.health),
      backgroundColor: ['rgba(155, 135, 245, 0.6)', 'rgba(99, 102, 241, 0.6)', 'rgba(129, 140, 248, 0.6)'],
      borderColor: ['#9b87f5', '#6366f1', '#818cf8'],
      borderWidth: 1,
    }]
  };
};

export const transformCompositionData = (data: any) => {
  if (!data) return null;

  return {
    labels: ['Protein Content', 'Lipid Levels', 'Mineral Balance'],
    datasets: [{
      data: [
        data.proteinContent?.score || 0,
        data.lipidLevels?.score || 0,
        data.mineralContent?.levels?.length || 0
      ],
      backgroundColor: [
        'rgba(155, 135, 245, 0.6)',
        'rgba(99, 102, 241, 0.6)',
        'rgba(129, 140, 248, 0.6)'
      ],
      borderColor: ['#9b87f5', '#6366f1', '#818cf8'],
      borderWidth: 1,
    }]
  };
};

export const transformGrowthData = (data: any) => {
  if (!data) return null;

  return {
    labels: ['Consistency', 'Pattern Strength', 'Direction'],
    datasets: [{
      label: 'Growth Metrics',
      data: [
        data.consistency || 0,
        data.growthZones?.strong?.length || 0,
        data.direction ? 100 : 0
      ],
      backgroundColor: 'rgba(155, 135, 245, 0.2)',
      borderColor: '#9b87f5',
      borderWidth: 2,
      fill: true,
    }]
  };
};

export const transformScalpHealthData = (data: any) => {
  if (!data) return null;

  return {
    labels: ['Hydration', 'Sebum', 'Microbial Balance'],
    datasets: [{
      label: 'Scalp Health',
      data: [
        data.hydrationLevel || 0,
        data.sebumProduction === 'High' ? 100 : data.sebumProduction === 'Medium' ? 50 : 0,
        data.microbialBalance || 0
      ],
      backgroundColor: [
        'rgba(155, 135, 245, 0.6)',
        'rgba(99, 102, 241, 0.6)',
        'rgba(129, 140, 248, 0.6)'
      ],
      borderColor: '#9b87f5',
      borderWidth: 1,
    }]
  };
};