import { BaseStats, DerivedStats, Skill, PhilosophicalAspect } from '../../../../types/game';
import { calculateDerivedStats, calculateMaxHP, calculateMaxMP } from '../../../../utils/statCalculations';

/**
 * Enemy Type Definition
 * Note: loot property removed - handle loot logic in combat-specific utilities
 */
export interface Enemy {
    id: string;
    name: string;
    level: number;
    health: number;
    maxHealth: number;
    mana: number;
    maxMana: number;
    baseStats: BaseStats;
    derivedStats: DerivedStats;
    skills: Skill[];
    enemyTier?: 'normal' | 'elite' | 'boss';
    image?: string;
    description: string;
    locations?: string[]; // Which locations/maps this enemy can appear in
}

/**
 * Helper function to create enemy with calculated stats
 */
function createEnemy(baseStats: BaseStats, enemyData: Partial<Enemy>): Enemy {
    const derivedStats = calculateDerivedStats(baseStats);
    const maxHP = calculateMaxHP(baseStats);
    const maxMP = calculateMaxMP(baseStats);

    return {
        id: '',
        name: '',
        level: 1,
        description: '',
        baseStats,
        derivedStats,
        health: maxHP,
        maxHealth: maxHP,
        mana: maxMP,
        maxMana: maxMP,
        skills: [],
        locations: [],
        ...enemyData,
    } as Enemy;
}

/**
 * Enemy Database
 * Add all enemies here with their stats, portraits, and locations
 */
export const ENEMIES: Enemy[] = [
    createEnemy(
        { heart: 1, body: 1, mind: 2 },
        {
            id: 'happy_tree1',
            name: 'Joyful Oak Spirit',
            level: 2,
            image: '/enemies/forest/happy_tree1.jpg',
            description: 'A cheerful tree spirit that protects the forest with gentle strength and earthy wisdom.',
            locations: ['fishing_town'],
            enemyTier: 'normal',
        }
    ),

    createEnemy(
        { heart: 2, body: 1, mind: 1 },
        {
            id: 'happy_tree2',
            name: 'Serene Willow Guardian',
            level: 2,
            image: '/enemies/forest/happy_tree2.jpg',
            description: 'A peaceful willow spirit that tests travelers with questions of balance and harmony.',
            locations: ['fishing_town'],
            enemyTier: 'normal',
        }
    ),
];

/**
 * Get enemy by ID
 * @param enemyId - The unique identifier for the enemy
 * @returns The enemy object or undefined if not found
 */
export function getEnemyById(enemyId: string): Enemy | undefined {
    const enemy = ENEMIES.find(e => e.id === enemyId);
    if (!enemy) {
        console.warn(`Enemy with ID "${enemyId}" not found`);
        return undefined;
    }

    // Return a copy to avoid mutations
    return {
        ...enemy,
        health: enemy.maxHealth,
        mana: enemy.maxMana,
    };
}

/**
 * Get a random enemy based on the current map/location
 * @param location - The location/map ID (e.g., 'fishing_town', 'forest')
 * @returns A random enemy that can appear in this location
 */
export function getRandomEnemyBasedOnMap(location: string): Enemy | undefined {
    // Filter enemies that can appear in this location
    const availableEnemies = ENEMIES.filter(enemy =>
        enemy.locations?.includes(location)
    );

    if (availableEnemies.length === 0) {
        console.warn(`No enemies found for location "${location}". Using fallback enemy.`);
        // Fallback to first enemy if no match
        const fallbackEnemy = ENEMIES[0];
        if (!fallbackEnemy) {
            console.error('No enemies available in database!');
            return undefined;
        }
        return getEnemyById(fallbackEnemy.id);
    }

    // Randomly select one
    const randomIndex = Math.floor(Math.random() * availableEnemies.length);
    const selectedEnemy = availableEnemies[randomIndex];

    if (!selectedEnemy) {
        console.error('Failed to select random enemy');
        return undefined;
    }

    return getEnemyById(selectedEnemy.id);
}

/**
 * Get all enemies for a specific location (useful for testing/debugging)
 */
export function getEnemiesByLocation(location: string): Enemy[] {
    return ENEMIES.filter(enemy => enemy.locations?.includes(location));
}

