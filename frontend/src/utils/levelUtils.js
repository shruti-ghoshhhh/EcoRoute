export const LEVELS = [
  { level: 1, title: 'Seedling', icon: '🌱', minXP: 0, maxXP: 100 },
  { level: 2, title: 'Sprout', icon: '🌿', minXP: 100, maxXP: 300 },
  { level: 3, title: 'Eco-Apprentice', icon: '🧤', minXP: 300, maxXP: 600 },
  { level: 4, title: 'Green Guardian', icon: '🌳', minXP: 600, maxXP: 1000 },
  { level: 5, title: 'Forest Keeper', icon: '🌲', minXP: 1000, maxXP: 1500 },
  { level: 6, title: 'Ocean Advocate', icon: '🌊', minXP: 1500, maxXP: 2100 },
  { level: 7, title: 'Planet Protector', icon: '🌍', minXP: 2100, maxXP: 2800 },
  { level: 8, title: 'Eco-Warrior', icon: '⚔️', minXP: 2800, maxXP: 3600 },
  { level: 9, title: 'Sustainability Sage', icon: '🦉', minXP: 3600, maxXP: 4500 },
  { level: 10, title: 'Apex Environmentalist', icon: '🦁', minXP: 4500, maxXP: 5500 },
  { level: 11, title: "Gaia's Chosen", icon: '✨', minXP: 5500, maxXP: Infinity },
];

export const getRank = (xp) => {
  const currentLevel = LEVELS.find((l) => xp >= l.minXP && xp < l.maxXP) || LEVELS[LEVELS.length - 1];
  return {
    ...currentLevel,
    progressPercent: currentLevel.maxXP === Infinity 
      ? 100 
      : ((xp - currentLevel.minXP) / (currentLevel.maxXP - currentLevel.minXP)) * 100,
    remainingXP: currentLevel.maxXP === Infinity ? 0 : currentLevel.maxXP - xp
  };
};
