// Simple script to test if the backend is running and configured correctly
// Run with: node test-connection.js

import dotenv from 'dotenv';

dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

async function testConnection() {
  console.log('🔍 Testing Chat Backend Connection...\n');

  // Test 1: Check if .env file has API key
  console.log('1️⃣ Checking environment variables...');
  if (process.env.OPENAI_API_KEY) {
    const keyPreview = process.env.OPENAI_API_KEY.substring(0, 7) + '...';
    console.log(`   ✅ OPENAI_API_KEY is set: ${keyPreview}`);
  } else {
    console.log('   ❌ OPENAI_API_KEY is NOT set in .env file');
    console.log('   💡 Add OPENAI_API_KEY=sk-your-key-here to .env file');
    return;
  }

  // Test 2: Check backend health
  console.log('\n2️⃣ Testing backend health endpoint...');
  try {
    const healthResponse = await fetch(`${BACKEND_URL}/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log(`   ✅ Backend is running: ${JSON.stringify(healthData)}`);
    } else {
      console.log(`   ❌ Backend returned error: ${healthResponse.status}`);
      console.log('   💡 Make sure backend is running: npm run server');
      return;
    }
  } catch (error) {
    console.log(`   ❌ Cannot connect to backend: ${error.message}`);
    console.log('   💡 Start the backend server: npm run server');
    return;
  }

  // Test 3: Test chat endpoint
  console.log('\n3️⃣ Testing chat endpoint...');
  try {
    const chatResponse = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello, test message',
        conversationHistory: [],
        lang: 'en',
        systemPrompt: 'You are a helpful assistant.',
      }),
    });

    if (chatResponse.ok) {
      const chatData = await chatResponse.json();
      console.log('   ✅ Chat endpoint is working!');
      console.log(`   📝 Response: ${chatData.response?.substring(0, 50)}...`);
    } else {
      const errorText = await chatResponse.text();
      console.log(`   ❌ Chat endpoint error: ${chatResponse.status}`);
      console.log(`   📝 Error: ${errorText}`);
    }
  } catch (error) {
    console.log(`   ❌ Chat endpoint error: ${error.message}`);
  }

  console.log('\n✅ Connection test complete!');
  console.log('\n💡 If all tests passed, your chat should work!');
  console.log('   Start frontend: npm run dev');
  console.log('   Then test the chat in your browser.');
}

testConnection().catch(console.error);


