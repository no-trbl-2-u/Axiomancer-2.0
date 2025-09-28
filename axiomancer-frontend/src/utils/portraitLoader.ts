export interface Portrait {
  id: string;
  name: string;
  imageUrl: string;
  gender: 'male' | 'female';
}

// Helper function to determine gender from portrait name
const determineGenderFromName = (name: string): 'male' | 'female' => {
  const lowercaseName = name.toLowerCase();

  // Female indicators
  const femaleIndicators = [
    'circe', 'sorceress', 'female', 'woman', 'girl', 'lady', 'queen',
    'witch', 'priestess', 'maiden', 'mother', 'daughter', 'sister'
  ];

  // Male indicators
  const maleIndicators = [
    'baramon', 'houshi', 'bugler', 'ogre', 'yogi', 'male', 'man', 'boy', 'lord', 'king',
    'wizard', 'priest', 'father', 'son', 'brother', 'monk', 'warrior'
  ];

  // Check for explicit female indicators
  for (const indicator of femaleIndicators) {
    if (lowercaseName.includes(indicator)) {
      return 'female';
    }
  }

  // Check for explicit male indicators
  for (const indicator of maleIndicators) {
    if (lowercaseName.includes(indicator)) {
      return 'male';
    }
  }

  // Default assignment based on name characteristics
  // Names ending in 'a', 'e' are often female
  if (lowercaseName.endsWith('a') || lowercaseName.endsWith('e')) {
    return 'female';
  }

  // Default to male if unclear
  return 'male';
};

// Dynamic portrait detection function
// This will scan for ANY image files in the portraits directory and categorize them
export const loadAvailablePortraits = async (): Promise<{male: Portrait[], female: Portrait[]}> => {
  // List of all possible portrait files to check (based on actual directory contents)
  const potentialPortraits = [
    // Actual files found in directory
    'Arc mage.jpg',
    'Baramon.jpg',
    'Biwa Houshi 1.jpg',
    'Bugler.jpg',
    'Circe.jpg',
    'Elder Ogre.jpg',
    'Sorceress.jpg',
    'Yogi.jpg',
    // Additional potential files to check for
    'arc-mage.jpg',
    'arc_mage.jpg',
    'male_mage.jpg',
    'female_mage.jpg',
    'male_warrior.jpg',
    'female_warrior.jpg',
    'male_monk.jpg',
    'female_monk.jpg',
    'male_rogue.jpg',
    'female_rogue.jpg',
    'male_paladin.jpg',
    'female_paladin.jpg',
    'mage.jpg',
    'warrior.jpg',
    'monk.jpg',
    'rogue.jpg',
    'paladin.jpg',
    'sorcerer.jpg',
    'wizard.jpg',
    'cleric.jpg',
    'archer.jpg',
    'barbarian.jpg',
    // PNG versions of all the above
    'Arc mage.png',
    'Baramon.png',
    'Biwa Houshi 1.png',
    'Bugler.png',
    'Circe.png',
    'Elder Ogre.png',
    'Sorceress.png',
    'Yogi.png',
    'mage.png',
    'warrior.png',
    'monk.png',
    'rogue.png',
    'paladin.png',
    'sorcerer.png',
    'wizard.png',
    'cleric.png',
    'archer.png',
    'barbarian.png'
  ];

  const portraits: Portrait[] = [];

  // Check each potential portrait
  for (const filename of potentialPortraits) {
    try {
      const imageUrl = `/portraits/${filename}`;

      // Try to load the image to verify it exists
      const imageExists = await checkImageExists(imageUrl);

      if (imageExists) {
        // Extract name and determine gender from filename
        const nameWithoutExtension = filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
        const cleanName = nameWithoutExtension.replace(/[_-]/g, ' ').trim();

        // Determine gender based on name patterns and characteristics
        const gender = determineGenderFromName(cleanName);

        portraits.push({
          id: nameWithoutExtension.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          name: cleanName,
          imageUrl,
          gender
        });
      }
    } catch (error) {
      // Image doesn't exist or failed to load, skip it
      console.log(`Portrait ${filename} not found, skipping`);
    }
  }

  // Sort and separate by gender
  const malePortraits = portraits
    .filter(p => p.gender === 'male')
    .sort((a, b) => a.name.localeCompare(b.name));

  const femalePortraits = portraits
    .filter(p => p.gender === 'female')
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    male: malePortraits,
    female: femalePortraits
  };
};

// Helper function to check if an image exists
const checkImageExists = (imageUrl: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });
};

// For server-side or build-time portrait detection (alternative approach)
// This would require a build step or server endpoint to list available files
export const getPortraitManifest = (): {male: Portrait[], female: Portrait[]} => {
  // This could be generated at build time by scanning the public/portraits directory
  // For now, return empty arrays - the async version above should be used
  return {
    male: [],
    female: []
  };
};

// Fallback portrait data using ACTUAL existing files
export const getFallbackPortraits = (): {male: Portrait[], female: Portrait[]} => {
  return {
    male: [
      {
        id: 'baramon',
        name: 'Baramon',
        imageUrl: '/portraits/Baramon.jpg',
        gender: 'male'
      },
      {
        id: 'biwa_houshi_1',
        name: 'Biwa Houshi 1',
        imageUrl: '/portraits/Biwa Houshi 1.jpg',
        gender: 'male'
      },
      {
        id: 'bugler',
        name: 'Bugler',
        imageUrl: '/portraits/Bugler.jpg',
        gender: 'male'
      },
      {
        id: 'elder_ogre',
        name: 'Elder Ogre',
        imageUrl: '/portraits/Elder Ogre.jpg',
        gender: 'male'
      },
      {
        id: 'yogi',
        name: 'Yogi',
        imageUrl: '/portraits/Yogi.jpg',
        gender: 'male'
      }
    ],
    female: [
      {
        id: 'arc_mage',
        name: 'Arc Mage',
        imageUrl: '/portraits/Arc mage.jpg',
        gender: 'female'
      },
      {
        id: 'circe',
        name: 'Circe',
        imageUrl: '/portraits/Circe.jpg',
        gender: 'female'
      },
      {
        id: 'sorceress',
        name: 'Sorceress',
        imageUrl: '/portraits/Sorceress.jpg',
        gender: 'female'
      }
    ]
  };
};