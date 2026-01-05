/**
 * Badge Definitions v2
 * Big 8 Complete winners + Category Masters winners
 */

export function generateBadges(oscarsData, categoryOrder) {
  const badges = [];
  const years = Object.keys(oscarsData).map(Number).sort((a, b) => a - b);
  const minYear = years[0];
  const maxYear = years[years.length - 1];

  // Rule 1: Big 8 Complete per year - Winners only
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

  // Rule 2: Category Master per decade - Winners only
  const categoryBadgeNames = {
    'Best Picture': 'Best Picture Master',
    'Best Director': 'Best Director Master',
    'Best Actor': 'Best Actor Master',
    'Best Actress': 'Best Actress Master',
    'Best Supporting Actor': 'Best Supporting Actor Master',
    'Best Supporting Actresses': 'Best Supporting Actress Master',
    'Best Original Screenplay': 'Best Original Screenplay Master',
    'Best Adapted Screenplay': 'Best Adapted Screenplay Master'
  };

  const minDecade = Math.floor(minYear / 10) * 10;
  const maxDecade = Math.floor(maxYear / 10) * 10;

  for (let decadeStart = minDecade; decadeStart <= maxDecade; decadeStart += 10) {
    categoryOrder.forEach(category => {
      const categoryKey = category.toLowerCase().replace(/\s+/g, '-');
      const decadeLabel = `${decadeStart}s`;
      
      badges.push({
        id: `${categoryKey}-${decadeStart}s-winners`,
        title: categoryBadgeNames[category],
        subtitle: 'Winners',
        type: 'category-decade',
        category: category,
        decadeStart: decadeStart,
        periodLabel: decadeLabel,
        includeNominees: false
      });
    });
  }

  return badges;
}

// No custom resolvers needed - uses built-in types only
export const badgeResolvers = {};

export const badgeMetadata = {
  id: 'badges-b8wdmw',
  name: 'Badge Collection (b8wdmw)',
  description: 'Big 8 Complete winners + Category Masters winners',
  version: '2.0.0'
};
