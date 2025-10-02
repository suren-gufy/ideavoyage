#!/usr/bin/env node

/**
 * Database Setup Script for IdeaVoyage
 * 
 * This script helps set up the Supabase database with the required tables and policies.
 * Run this after creating your Supabase project.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
import dotenv from 'dotenv'
dotenv.config()

// Hardcode the values for now since dotenv isn't loading properly in ES modules
const supabaseUrl = process.env.SUPABASE_URL || 'https://qazgaxpodnmnelvkegyo.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhemdheHBvZG5tbmVsdmtlZ3lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMTI3MjQsImV4cCI6MjA3NDg4ODcyNH0.7POADGu_sgyotL5gNdmTxQwm26T1RmsxvXPc5ofbtr8'

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase')) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file')
  console.error('You can find these at: https://app.supabase.com/project/[your-project]/settings/api')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  console.log('🚀 Setting up IdeaVoyage database...')
  console.log('📍 Supabase URL:', supabaseUrl)
  
  try {
    // Read the schema SQL file
    const schemaPath = join(__dirname, 'database', 'schema.sql')
    const schema = readFileSync(schemaPath, 'utf-8')
    
    console.log('📄 Executing database schema...')
    
    // Execute the schema - Note: This might need to be done manually in Supabase SQL editor
    // due to RLS policies and permissions
    console.log('⚠️  IMPORTANT: You need to execute the SQL schema manually in Supabase')
    console.log('📋 Steps:')
    console.log('1. Go to your Supabase project dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Copy and paste the contents of database/schema.sql')
    console.log('4. Click "Run" to execute the schema')
    console.log('5. Then run this script again to test the connection')
    
    // Test basic connection
    console.log('🔍 Testing Supabase connection...')
    const { data, error } = await supabase
      .from('analysis_results')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      if (error.message.includes('relation "analysis_results" does not exist')) {
        console.log('⚠️  Database schema not yet created. Please follow the steps above.')
        return false
      } else {
        console.error('❌ Connection test failed:', error.message)
        return false
      }
    }
    
    console.log('✅ Database connection successful!')
    console.log(`📊 Current analysis records: ${data?.length || 0}`)
    
    // Test insert capability
    console.log('🧪 Testing database write permissions...')
    const testRecord = {
      idea: 'Database Setup Test',
      industry: 'Technology',
      target_audience: 'Developers',
      country: 'global',
      analysis_results: { test: true },
      data_source: 'ai_only',
      analysis_confidence: 'high',
      overall_score: 85,
      viability_score: 80,
      user_session: 'setup-test-session'
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('analysis_results')
      .insert([testRecord])
      .select()
      .single()
    
    if (insertError) {
      console.error('❌ Database write test failed:', insertError.message)
      return false
    }
    
    console.log('✅ Database write test successful!')
    console.log(`📝 Test record created with ID: ${insertData.id}`)
    
    // Clean up test record
    await supabase
      .from('analysis_results')
      .delete()
      .eq('id', insertData.id)
    
    console.log('🧹 Test record cleaned up')
    console.log('')
    console.log('🎉 Database setup complete!')
    console.log('💡 Your IdeaVoyage app is now ready to store analysis results in Supabase')
    
    return true
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
    return false
  }
}

// Run the setup
setupDatabase().then(success => {
  if (success) {
    console.log('\n✅ All done! Your database is ready.')
  } else {
    console.log('\n❌ Setup incomplete. Please check the errors above.')
    process.exit(1)
  }
})