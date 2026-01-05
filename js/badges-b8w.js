/**
 * Default Badge Definitions (v1)
 * Minimal badge collection - Big 8 Complete winners only
 */

export function generateBadges(oscarsData, categoryOrder) {
  const badges = [];
  const years = Object.keys(oscarsData).map(Number).sort((a, b) => a - b);
  const minYear = years[0];
  const maxYear = years[years.length - 1];

  // Big 8 Complete per year - Winners only
  for (let year = minYear; year <= maxYear; year++) {
    if (oscarsData[year]) {
      badges.push({
        id: `big8-${year}-winners`,
        title: 'Big 8 Complete',
        subtitle: 'Winners',
        type: 'big8',
        year: year,
        periodLabel: String(year),
        includeNominees: false
      });
    }
  }

  return badges;
}

// No custom resolvers needed - uses built-in types only
export const badgeResolvers = {};

export const badgeMetadata = {
  id: 'badges-b8w',
  name: 'Default Badges (b8w)',
  description: 'Minimal badge collection - Big 8 Complete winners only',
  version: '1.0.0'
};
