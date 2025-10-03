/**
 * Debug the actual API response structure
 */

async function debugAPIResponse() {
    console.log('Debugging API response structure...\n');
    
    const testIdea = "AI-powered fitness app";
    const testUrl = `https://ideavoyage.vercel.app/api?idea=${encodeURIComponent(testIdea)}`;
    
    try {
        const response = await fetch(testUrl);
        const data = await response.json();
        
        console.log('=== Full Response Structure ===');
        console.log(JSON.stringify(data, null, 2));
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

debugAPIResponse();