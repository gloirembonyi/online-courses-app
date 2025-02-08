import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Helper function to split SQL statements
function splitSqlStatements(sql: string): string[] {
  // Split on semicolons, but keep CREATE TYPE statements together
  const statements = sql
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0)
    .map(stmt => stmt + ';');
  
  return statements;
}

async function runMigrations() {
  try {
    console.log('🔄 Running migrations...');
    
    const sql = neon(process.env.DATABASE_URL!);
    const migrationsDir = path.join(process.cwd(), 'src', 'lib', 'db', 'migrations');
    
    // Read all SQL files from migrations directory
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    // Execute each migration file
    for (const file of migrationFiles) {
      console.log(`\nRunning migration: ${file}`);
      const migration = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      
      // Split the migration file into individual statements
      const statements = splitSqlStatements(migration);
      
      // Execute each statement separately
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        try {
          await sql(statement);
          console.log(`✅ Executed statement ${i + 1}/${statements.length}`);
        } catch (error: any) {
          // If the error is about the relation already existing, we can continue
          if (error.code === '42P07') { // duplicate_table error code
            console.log(`⚠️ Table already exists, continuing...`);
            continue;
          }
          throw error;
        }
      }
      
      console.log(`✅ Completed migration: ${file}`);
    }
    
    console.log('\n✨ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

runMigrations(); 