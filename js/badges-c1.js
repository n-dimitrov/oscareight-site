/**
 * Badge Definitions c1
 * Big 8 Complete winners + Person/Director-specific badges
 */

export function generateBadges(oscarsData, categoryOrder) {
  const badges = [];
  const years = Object.keys(oscarsData).map(Number).sort((a, b) => a - b);
  const minYear = years[0];
  const maxYear = years[years.length - 1];

  // ========================================
  // SECTION 1: Big 8 Complete Winners Only
  // ========================================
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

  // ========================================
  // SECTION 2: Person/Director-Specific Badges
  // ========================================
  
  // Define notable people with their categories
  const notablePeople = [
    {
      name: 'Woody Allen',
      matchName: 'Woody Allen',
      categories: ['Best Director', 'Best Original Screenplay', 'Best Adapted Screenplay'],
      shortCode: 'WA',
      includeNominees: true,
      separateByCategory: false  // One badge combining all categories
    },
    {
      name: 'Steven Spielberg',
      matchName: 'Steven Spielberg',
      categories: ['Best Director'],
      shortCode: 'SS',
      includeNominees: true,
      separateByCategory: false
    },
    {
      name: 'Martin Scorsese',
      matchName: 'Martin Scorsese',
      categories: ['Best Director'],
      shortCode: 'MS',
      includeNominees: true,
      separateByCategory: false
    },
    {
      name: 'Meryl Streep',
      matchName: 'Meryl Streep',
      categories: null,  // Search in all Big 8 categories
      shortCode: 'MSt',
      includeNominees: false,  // Only winning movies
      separateByCategory: false  // Single badge
    }
  ];

  notablePeople.forEach(person => {
    if (person.separateByCategory) {
      // Create one badge per category
      person.categories.forEach(category => {
        const categoryShort = category.replace('Best ', '').split(' ')[0];
        const subtitle = person.includeNominees ? 'Nominees' : 'Winners';
        
        badges.push({
          id: `person-${person.shortCode.toLowerCase()}-${category.toLowerCase().replace(/\s+/g, '-')}`,
          title: person.name,
          subtitle: `${categoryShort} - ${subtitle}`,
          type: 'person-category',
          personName: person.matchName,
          category: category,
          categories: [category],
          periodLabel: `${person.shortCode}-${categoryShort[0]}`,
          includeNominees: person.includeNominees
        });
      });
    } else {
      // One badge combining all categories
      const subtitle = person.includeNominees ? 'Nominees' : 'Winners';
      badges.push({
        id: `person-${person.shortCode.toLowerCase()}`,
        title: person.name,
        subtitle: subtitle,
        type: 'person-all-categories',
        personName: person.matchName,
        categories: person.categories,
        periodLabel: person.shortCode,
        includeNominees: person.includeNominees
      });
    }
  });

  return badges;
}

// Custom resolvers for new badge types
export const badgeResolvers = {
  'person-category': (badge, oscarsData, categoryOrder) => {
    const ids = new Set();
    const years = Object.keys(oscarsData);
    
    years.forEach(year => {
      const yearData = oscarsData[year];
      if (!yearData) return;
      
      const catData = yearData[badge.category];
      if (!catData) return;
      
      // Check winner
      if (catData.winner) {
        const winnerNames = catData.winner.names || [];
        const hasMatch = winnerNames.some(name => name && name.includes(badge.personName));
        if (hasMatch) {
          ids.add(catData.winner.id);
        }
      }
      
      // Check nominees
      if (badge.includeNominees && Array.isArray(catData.nominees)) {
        catData.nominees.forEach(nominee => {
          if (!nominee) return;
          const nomineeNames = nominee.names || [];
          const hasMatch = nomineeNames.some(name => name && name.includes(badge.personName));
          if (hasMatch) {
            ids.add(nominee.id);
          }
        });
      }
    });
    
    return Array.from(ids);
  },

  'person-all-categories': (badge, oscarsData, categoryOrder) => {
    const ids = new Set();
    const years = Object.keys(oscarsData);
    
    years.forEach(year => {
      const yearData = oscarsData[year];
      if (!yearData) return;
      
      // Use the specific categories defined in the badge, or fall back to all Big 8
      const categories = (badge.categories && badge.categories.length > 0) 
        ? badge.categories 
        : categoryOrder;
      
      categories.forEach(cat => {
        const catData = yearData[cat];
        if (!catData) return;
        
        // Check winner
        if (catData.winner) {
          const winnerNames = catData.winner.names || [];
          const hasMatch = winnerNames.some(name => name && name.includes(badge.personName));
          if (hasMatch) {
            ids.add(catData.winner.id);
          }
        }
        
        // Check nominees
        if (badge.includeNominees && Array.isArray(catData.nominees)) {
          catData.nominees.forEach(nominee => {
            if (!nominee) return;
            const nomineeNames = nominee.names || [];
            const hasMatch = nomineeNames.some(name => name && name.includes(badge.personName));
            if (hasMatch) {
              ids.add(nominee.id);
            }
          });
        }
      });
    });
    
    return Array.from(ids);
  }
};

export const badgeMetadata = {
  id: 'badges-c1',
  name: 'Badge Collection (c1)',
  description: 'Big 8 Complete winners + Person/Director-specific badges',
  version: '4.0.0',
  newFeatures: [
    'Person-specific badges by category',
    'Person-specific badges across all categories',
    'Notable directors and actors included'
  ]
};
