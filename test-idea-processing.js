// Test script for intelligent idea preprocessing
// Run with: node test-idea-processing.js

import dotenv from 'dotenv'
dotenv.config()

// Test the API with different types of ideas to see preprocessing in action
const TEST_IDEAS = [
  {
    name: "Simple with spelling errors",
    idea: "an app for managment of small buisness inventery with ai recomendations"
  },
  {
    name: "Vague idea",
    idea: "social media app"
  },
  {
    name: "Detailed health idea", 
    idea: "A comprehensive telemedicine platform that connects patients with doctors for virtual consultations, prescription management, and health monitoring using IoT devices"
  },
  {
    name: "Fintech with typos",
    idea: "blockchin based payment system for criptocurrency transactions with smart contrats"
  }
]

async function testIdeaProcessing() {
  console.log('🧪 Testing Intelligent Idea Preprocessing...\n')
  
  for (const test of TEST_IDEAS) {
    console.log(`\n🔍 Testing: ${test.name}`)
    console.log(`Original: "${test.idea}"`)
    
    try {
      const response = await fetch('http://localhost:3001/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea: test.idea,
          industry: 'Technology',
          targetAudience: 'General consumers',
          country: 'US'
        })
      })
      
      if (!response.ok) {
        console.log(`❌ Failed: ${response.status} ${response.statusText}`)
        continue
      }
      
      const result = await response.json()
      
      if (result.idea_processing) {
        const proc = result.idea_processing
        console.log(`✨ Enhanced: "${proc.enhanced_idea}"`)
        
        if (proc.spelling_corrections.length > 0) {
          console.log(`🔧 Corrections: ${proc.spelling_corrections.join(', ')}`)
        }
        
        console.log(`📊 Clarity: ${proc.clarity_score}/10`)
        console.log(`🏷️ Category: ${proc.business_category}`)
        console.log(`🎯 Target: ${proc.intent_analysis.target_market}`)
        console.log(`💡 Problem: ${proc.intent_analysis.problem_focus}`)
        
        if (proc.extracted_concepts.length > 0) {
          console.log(`🧠 Concepts: ${proc.extracted_concepts.join(', ')}`)
        }
      } else {
        console.log('⚠️ No preprocessing data found in response')
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`)
    }
    
    console.log('─'.repeat(50))
  }
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  testIdeaProcessing().catch(console.error)
}