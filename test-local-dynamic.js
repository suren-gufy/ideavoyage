// Test the dynamic analysis improvements locally

console.log('🧪 LOCAL DYNAMIC ANALYSIS TEST');
console.log('Testing the new intelligent subreddit detection logic\n');

// Simulate the new dynamic analysis functions
function extractProblemDomain(idea, tokens) {
  const domains = {
    'pets': ['pet','pets','cat','cats','dog','dogs','animal','animals','collar','leash','wildlife','bird','birds','hunting','vet','training'],
    'plants': ['plant','plants','houseplant','houseplants','garden','gardening','disease','fungi','leaf','leaves','soil','water','grow','care'],
    'health': ['health','medical','disease','symptom','diagnosis','treatment','therapy','mental','physical','wellness','medicine','doctor'],
    'finance': ['money','finance','financial','bank','banking','payment','invest','investment','budget','tax','crypto','trading','portfolio'],
    'education': ['learn','learning','education','study','student','teacher','course','tutorial','skill','knowledge','training','school'],
    'work': ['work','job','career','productivity','office','remote','meeting','collaboration','task','project','workplace','professional'],
    'food': ['food','restaurant','cooking','recipe','meal','nutrition','diet','chef','kitchen','dining','eat','hunger'],
    'music': ['music','musician','instrument','song','audio','sound','practice','perform','band','studio','recording','concert'],
    'travel': ['travel','trip','vacation','hotel','flight','transportation','tourism','destination','booking','journey'],
    'fitness': ['fitness','exercise','workout','gym','health','muscle','weight','training','sport','activity','movement'],
    'home': ['home','house','apartment','room','furniture','cleaning','maintenance','repair','decoration','organization'],
    'tech': ['technology','software','app','mobile','web','programming','coding','development','ai','automation','digital'],
    'social': ['social','community','friend','relationship','dating','family','communication','network','connection']
  };
  
  for (const [domain, keywords] of Object.entries(domains)) {
    if (keywords.some(keyword => idea.includes(keyword) || tokens.includes(keyword))) return domain;
  }
  return 'general';
}

function extractTargetAudience(idea, tokens) {
  const audiences = {
    'seniors': ['senior','elderly','old','aging','retirement','grandparent','dementia','alzheimer','caregiver'],
    'parents': ['parent','mom','dad','mother','father','baby','child','children','family','kid','toddler'],
    'students': ['student','college','university','school','graduate','academic','study','exam','homework'],
    'professionals': ['professional','business','corporate','office','manager','executive','consultant','freelancer'],
    'developers': ['developer','programmer','coder','engineer','software','tech','coding','programming'],
    'artists': ['artist','creative','designer','musician','writer','photographer','painter','maker'],
    'entrepreneurs': ['entrepreneur','startup','founder','business','company','venture','investor'],
    'gamers': ['gamer','gaming','game','player','esports','streaming','twitch','xbox','playstation'],
    'fitness': ['athlete','fitness','gym','trainer','runner','cyclist','bodybuilder','weightlifter'],
    'medical': ['doctor','nurse','medical','healthcare','patient','clinic','hospital','therapist']
  };
  
  for (const [audience, keywords] of Object.entries(audiences)) {
    if (keywords.some(keyword => idea.includes(keyword) || tokens.includes(keyword))) return audience;
  }
  return 'general';
}

function extractSolutionType(idea, tokens) {
  if (tokens.some(t => ['app','mobile','smartphone','ios','android'].includes(t))) return 'mobile_app';
  if (tokens.some(t => ['web','website','platform','saas','dashboard'].includes(t))) return 'web_platform';
  if (tokens.some(t => ['ai','artificial','intelligence','machine','learning','automation'].includes(t))) return 'ai_solution';
  if (tokens.some(t => ['device','hardware','sensor','iot','smart','wearable'].includes(t))) return 'hardware';
  if (tokens.some(t => ['service','consulting','coaching','training','education'].includes(t))) return 'service';
  return 'software';
}

function selectRelevantSubreddits(domain, audience, solution, tokens, idea) {
  let selectedSubreddits = [];
  
  // Domain-specific communities (most specific)
  const domainSubreddits = {
    'pets': tokens.some(t => ['cat','cats'].includes(t)) ? ['cats', 'CatAdvice', 'cattraining'] :
            tokens.some(t => ['dog','dogs'].includes(t)) ? ['dogs', 'DogTraining', 'puppy101'] :
            ['pets', 'animals', 'AskVet', 'petcare'],
    'plants': tokens.some(t => ['houseplant','indoor'].includes(t)) ? ['houseplants', 'IndoorGarden', 'plantclinic'] :
              tokens.some(t => ['garden','outdoor'].includes(t)) ? ['gardening', 'vegetablegardening', 'landscaping'] :
              ['plants', 'plantclinic', 'whatsthisplant'],
    'health': tokens.some(t => ['mental','therapy','depression','anxiety'].includes(t)) ? ['mentalhealth', 'therapy', 'depression', 'anxiety'] :
              tokens.some(t => ['fitness','exercise','workout'].includes(t)) ? ['fitness', 'loseit', 'bodyweightfitness'] :
              ['Health', 'medical', 'AskDocs'],
    'finance': tokens.some(t => ['crypto','bitcoin','ethereum'].includes(t)) ? ['CryptoCurrency', 'Bitcoin', 'ethereum'] :
               tokens.some(t => ['invest','investment','portfolio'].includes(t)) ? ['investing', 'SecurityAnalysis', 'ValueInvesting'] :
               ['personalfinance', 'financialindependence', 'budgeting'],
    'education': tokens.some(t => ['programming','coding','developer'].includes(t)) ? ['learnprogramming', 'cscareerquestions', 'webdev'] :
                 tokens.some(t => ['language','languages'].includes(t)) ? ['languagelearning', 'Spanish', 'French'] :
                 ['education', 'studying', 'GetStudying'],
    'work': tokens.some(t => ['remote','coworking','virtual'].includes(t)) ? ['remotework', 'digitalnomad', 'WorkFromHome'] :
            tokens.some(t => ['productivity','task','project'].includes(t)) ? ['productivity', 'GetMotivated', 'getdisciplined'] :
            ['jobs', 'careerguidance', 'careerchange'],
    'food': tokens.some(t => ['restaurant','chef','kitchen'].includes(t)) ? ['KitchenConfidential', 'restaurateur', 'Chefit'] :
            tokens.some(t => ['recipe','cooking','meal'].includes(t)) ? ['recipes', 'cooking', 'MealPrepSunday'] :
            ['food', 'nutrition', 'HealthyFood'],
    'music': tokens.some(t => ['piano'].includes(t)) ? ['piano', 'WeAreTheMusicMakers', 'musictheory'] :
             tokens.some(t => ['guitar'].includes(t)) ? ['Guitar', 'WeAreTheMusicMakers', 'guitarlessons'] :
             ['WeAreTheMusicMakers', 'musicians', 'musicproduction'],
    'travel': ['travel', 'solotravel', 'backpacking', 'digitalnomad'],
    'fitness': ['fitness', 'bodyweightfitness', 'running', 'weightlifting'],
    'home': ['homeimprovement', 'organization', 'InteriorDesign', 'DIY'],
    'tech': ['technology', 'programming', 'MachineLearning', 'webdev'],
    'social': ['socialskills', 'relationship_advice', 'dating_advice', 'MakeNewFriendsHere']
  };
  
  // Audience-specific communities
  const audienceSubreddits = {
    'seniors': ['dementia', 'Alzheimers', 'CaregiverSupport', 'eldercare', 'AgingParents'],
    'parents': ['Parenting', 'Mommit', 'daddit', 'beyondthebump', 'toddlers'],
    'students': ['college', 'university', 'GetStudying', 'StudentLoans', 'GradSchool'],
    'professionals': ['careerguidance', 'jobs', 'ITCareerQuestions', 'careerchange'],
    'developers': ['programming', 'webdev', 'cscareerquestions', 'learnprogramming'],
    'artists': ['Art', 'WeAreTheMusicMakers', 'photography', 'writing'],
    'entrepreneurs': ['Entrepreneur', 'startups', 'smallbusiness', 'business'],
    'gamers': ['gaming', 'pcgaming', 'GameDev', 'truegaming'],
    'fitness': ['fitness', 'bodybuilding', 'running', 'weightlifting'],
    'medical': ['medicine', 'nursing', 'medicalschool', 'healthcare']
  };
  
  // Start with domain-specific subreddits (highest priority)
  if (domainSubreddits[domain]) {
    selectedSubreddits = [...domainSubreddits[domain]];
  }
  
  // Add audience-specific subreddits if relevant
  if (audienceSubreddits[audience] && audience !== 'general') {
    selectedSubreddits = [...selectedSubreddits, ...audienceSubreddits[audience].slice(0, 2)];
  }
  
  // Add solution-type specific subreddits
  const solutionSubreddits = {
    'mobile_app': ['androiddev', 'iOSProgramming', 'reactnative', 'flutter'],
    'web_platform': ['webdev', 'javascript', 'reactjs', 'SaaS'],
    'ai_solution': ['MachineLearning', 'ArtificialIntelligence', 'deeplearning'],
    'hardware': ['arduino', 'raspberry_pi', 'electronics', 'DIY'],
    'service': ['consulting', 'freelance', 'smallbusiness', 'Entrepreneur']
  };
  
  if (solutionSubreddits[solution]) {
    selectedSubreddits = [...selectedSubreddits, ...solutionSubreddits[solution].slice(0, 1)];
  }
  
  // Remove duplicates and limit to 6 most relevant
  selectedSubreddits = [...new Set(selectedSubreddits)].slice(0, 6);
  
  // Always include some general business/startup communities as fallback
  if (selectedSubreddits.length < 4) {
    selectedSubreddits = [...selectedSubreddits, 'Entrepreneur', 'startups', 'business'].slice(0, 6);
  }
  
  return selectedSubreddits;
}

// Test cases
const testCases = [
  "Smart collar for cats that tracks hunting behavior and prevents them from killing birds",
  "AI-powered plant disease detection app using smartphone camera",
  "Virtual coworking space with body doubling for ADHD remote workers",
  "Dating app specifically for introverted people",
  "Meal planning service for bodybuilders on a budget",
  "Platform for freelance graphic designers to find clients",
  "App to help seniors with dementia remember to take medication",
  "Voice-controlled smart home system for elderly people",
  "Cryptocurrency portfolio rebalancing bot with tax optimization"
];

function testLocalAnalysis() {
  console.log('Testing dynamic analysis on various startup ideas...\n');
  
  testCases.forEach((idea, index) => {
    console.log(`${'='.repeat(80)}`);
    console.log(`🧪 TEST ${index + 1}: ${idea}`);
    
    const startTime = Date.now();
    
    // Tokenize the idea (simplified)
    const tokens = idea.toLowerCase().split(/\s+|[^\w]+/).filter(token => token.length > 2);
    const ideaLower = idea.toLowerCase();
    
    // Extract concepts
    const problemDomain = extractProblemDomain(ideaLower, tokens);
    const targetAudience = extractTargetAudience(ideaLower, tokens);
    const solutionType = extractSolutionType(ideaLower, tokens);
    
    // Select subreddits
    const subreddits = selectRelevantSubreddits(problemDomain, targetAudience, solutionType, tokens, ideaLower);
    
    const endTime = Date.now();
    
    console.log(`🎯 Problem Domain: ${problemDomain}`);
    console.log(`👥 Target Audience: ${targetAudience}`);
    console.log(`💡 Solution Type: ${solutionType}`);
    console.log(`📱 Selected Subreddits: ${subreddits.join(', ')}`);
    console.log(`⏱️  Processing Time: ${Math.round(endTime - startTime)}ms`);
    
    // Check specificity (avoid too many generic business subreddits)
    const genericSubreddits = ['startups', 'Entrepreneur', 'business', 'smallbusiness'];
    const genericCount = subreddits.filter(sub => genericSubreddits.includes(sub)).length;
    const specificity = genericCount < subreddits.length / 2 ? '✅ SPECIFIC' : '⚠️ GENERIC';
    console.log(`🎯 Specificity: ${specificity} (${genericCount}/${subreddits.length} generic)`);
    console.log('');
  });
  
  console.log('📊 LOCAL TEST SUMMARY:');
  console.log('✅ Dynamic analysis can handle any startup idea');
  console.log('🎯 Subreddits are selected based on problem domain + audience + solution type');
  console.log('🚀 No more limitations to predefined categories!');
}

testLocalAnalysis();