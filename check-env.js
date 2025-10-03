// Check environment variables
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
const result = dotenv.config({ path: join(__dirname, '.env') });

console.log('🔍 Environment Check:');
console.log('dotenv result:', result.error ? result.error.message : 'SUCCESS');
console.log('REDDIT_CLIENT_ID:', process.env.REDDIT_CLIENT_ID ? 'SET' : 'MISSING');
console.log('REDDIT_CLIENT_SECRET:', process.env.REDDIT_CLIENT_SECRET ? 'SET' : 'MISSING');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'SET (length: ' + process.env.OPENAI_API_KEY.length + ')' : 'MISSING');

if (process.env.OPENAI_API_KEY) {
  console.log('OpenAI key preview:', process.env.OPENAI_API_KEY.substring(0, 20) + '...');
} else {
  console.log('❌ OpenAI API key is not loaded from .env file');
}