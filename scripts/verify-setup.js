#!/usr/bin/env node

/**
 * Setup verification script for PagePilot Backend
 * Checks if all required environment variables and dependencies are properly configured
 */

import { existsSync } from 'fs';
import { readFileSync } from 'fs';

console.log('🔍 Verifying PagePilot Backend setup...\n');

let hasErrors = false;

// Check if .env file exists
if (!existsSync('.env')) {
  console.log('❌ .env file not found');
  console.log('   Run: cp .env.example .env');
  hasErrors = true;
} else {
  console.log('✅ .env file exists');
  
  // Check environment variables
  const envContent = readFileSync('.env', 'utf8');
  
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
  const missingVars = [];
  
  for (const varName of requiredVars) {
    if (!envContent.includes(`${varName}=`) || envContent.includes(`${varName}="your-`)) {
      missingVars.push(varName);
    }
  }
  
  if (missingVars.length > 0) {
    console.log('❌ Missing or default environment variables:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
      if (varName === 'JWT_SECRET') {
        console.log('     Generate with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
      }
    });
    hasErrors = true;
  } else {
    console.log('✅ Required environment variables configured');
  }
}

// Check if node_modules exists
if (!existsSync('node_modules')) {
  console.log('❌ Dependencies not installed');
  console.log('   Run: npm install');
  hasErrors = true;
} else {
  console.log('✅ Dependencies installed');
}

// Check if Prisma client is generated
if (!existsSync('src/generated/prisma')) {
  console.log('❌ Prisma client not generated');
  console.log('   Run: npm run db:generate');
  hasErrors = true;
} else {
  console.log('✅ Prisma client generated');
}

// Check if database exists (for SQLite)
try {
  const envContent = readFileSync('.env', 'utf8');
  const dbUrlMatch = envContent.match(/DATABASE_URL="file:\.\/(.+)"/);
  if (dbUrlMatch) {
    const dbFile = dbUrlMatch[1];
    if (!existsSync(`prisma/${dbFile}`)) {
      console.log('❌ Database not initialized');
      console.log('   Run: npm run db:push');
      hasErrors = true;
    } else {
      console.log('✅ Database exists');
    }
  }
} catch (error) {
  // Skip database check if we can't read .env
}

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('❌ Setup incomplete. Please fix the issues above.');
  process.exit(1);
} else {
  console.log('✅ Setup complete! You can now run:');
  console.log('   npm run dev     # Start development server');
  console.log('   npm run db:seed # Populate with sample data');
  console.log('   npm test        # Run tests');
} 