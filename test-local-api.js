#!/usr/bin/env node

/**
 * Test the local API to debug scoring issues
 */

import fetch from 'node-fetch';

async function testLocalAPI() {
  console.log('🧪 Testing Local API Scoring...');
  
  const testIdeas = [
    "AI music creation tool",
    "Real estate property finder", 
    "Simple todo app"
  ];

  for (const idea of testIdeas) {
    console.log(`\n📝 Testing: "${idea}"`);
    
    try {
      const response = await fetch('http://localhost:5000/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea: idea,
          industry: 'Technology',
          targetAudience: 'General users',
          country: 'global',
          platform: 'web',
          fundingMethod: 'bootstrapped',
          timeRange: '6months'
        })
      });

      if (!response.ok) {
        console.error(`❌ HTTP ${response.status}: ${response.statusText}`);
        continue;
      }

      const data = await response.json();
      console.log(`📊 Overall Score: ${data.overall_score}`);
      console.log(`📊 Viability Score: ${data.viability_score}`);
      console.log(`📊 Market Interest: ${data.market_interest_level}`);
      console.log(`📊 Data Source: ${data.data_source}`);
      console.log(`📊 Analysis Confidence: ${data.analysis_confidence}`);
      
    } catch (error) {
      console.error(`❌ Error testing "${idea}":`, error.message);
    }
  }
}

testLocalAPI().catch(console.error);