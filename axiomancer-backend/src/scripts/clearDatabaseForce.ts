import dotenv from 'dotenv';
import { DatabaseService } from '../services/database.service';

// Load environment variables
dotenv.config();

/**
 * Force clear database without confirmation
 * Use this for automated scripts or when you're absolutely sure
 */
async function clearDatabaseForce(): Promise<void> {
  try {
    console.log('\n🔄 Initializing database connection...');
    await DatabaseService.initialize();
    
    console.log('🗑️  Clearing all data...');
    await DatabaseService.clearDatabase();
    
    console.log('✅ Database cleared successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
}

// Run the script
clearDatabaseForce();

