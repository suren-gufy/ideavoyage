// Simple JS wrapper calling the TS Express app (fallback for Vercel runtime)
const handler = require('./index.ts').default;
module.exports = handler;
