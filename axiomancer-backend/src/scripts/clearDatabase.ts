import dotenv from 'dotenv';
import { DatabaseService } from '../services/database.service';
import * as readline from 'readline';

// Load environment variables
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function clearDatabase(): Promise<void> {
  try {
    console.log('\n⚠️  WARNING: This will DELETE ALL DATA from the database!');
    console.log('This includes:');
    console.log('  - All users');
    console.log('  - All character states');
    console.log('  - All game progress\n');

    rl.question('Are you sure you want to continue? (yes/no): ', async (answer) => {
      if (answer.toLowerCase() === 'yes') {
        console.log('\n🔄 Initializing database connection...');
        await DatabaseService.initialize();
        
        console.log('🗑️  Clearing all data...');
        await DatabaseService.clearDatabase();
        
        console.log('✅ Database cleared successfully!\n');
      } else {
        console.log('\n❌ Database clear cancelled.\n');
      }
      
      rl.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    rl.close();
    process.exit(1);
  }
}

// Run the script
clearDatabase();

