/**
 * Equipment and Item System Types
 * 
 * ISOLATED MODULE - Only import this in equipment-specific components and utilities
 * Do NOT import or reference these types in core game types (Character, Enemy, etc.)
 */

import { BaseStats } from './game';

/**
 * Equipment slot types
 */
export type EquipmentSlot = 'helmet' | 'bodyArmor' | 'gloves' | 'boots' | 'leftHand' | 'rightHand' | 'leftRing' | 'rightRing' | 'bracelet' | 'amulet' | 'cloak';

/**
 * Equipment type categories
 */
export type EquipmentType = 'weapon' | 'armor' | 'accessory' | 'consumable';

/**
 * Item type categories
 */
export type ItemType = 'weapon' | 'armor' | 'consumable' | 'crafting' | 'quest' | 'misc';

/**
 * Equipment item that can be equipped in specific slots
 */
export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  subtype?: 'ring' | 'amulet' | 'bracelet';
  stats: Partial<BaseStats>;
  special?: string;
  icon: string;
}

/**
 * General inventory item
 */
export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  value: number;
  stackable: boolean;
  quantity: number;
  icon: string;
}

/**
 * Equipped items organized by slot
 */
export interface EquippedItems {
  helmet?: Equipment;
  bodyArmor?: Equipment;
  gloves?: Equipment;
  boots?: Equipment;
  leftHand?: Equipment;
  rightHand?: Equipment;
  leftRing?: Equipment;
  rightRing?: Equipment;
  bracelet?: Equipment;
  amulet?: Equipment;
  cloak?: Equipment;
}

/**
 * @planned Future feature for categorized inventory
 * Currently unused - inventory uses flat Item[] array
 */
export interface InventoryCategories {
  equipment: Item[];
  consumables: Item[];
  materials: Item[];
  keyItems: Item[];
  questItems: Item[];
}
