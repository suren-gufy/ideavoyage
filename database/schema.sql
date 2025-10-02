-- IdeaVoyage Database Schema
-- This file contains the SQL commands to set up the database structure

-- Analysis Results Table
CREATE TABLE IF NOT EXISTS analysis_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- Input data
  idea TEXT NOT NULL,
  industry TEXT,
  target_audience TEXT,
  country TEXT DEFAULT 'global',
  
  -- Analysis results (JSON field)
  analysis_results JSONB NOT NULL,
  
  -- Metadata
  data_source TEXT NOT NULL CHECK (data_source IN ('reddit_plus_ai', 'demo_mode', 'ai_only')),
  analysis_confidence TEXT NOT NULL CHECK (analysis_confidence IN ('high', 'medium', 'low')),
  
  -- Scores
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  viability_score INTEGER CHECK (viability_score >= 0 AND viability_score <= 100),
  
  -- Optional user tracking
  user_session TEXT,
  user_agent TEXT,
  ip_address INET,
  
  -- Indexes for performance
  CONSTRAINT analysis_results_pkey PRIMARY KEY (id)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_analysis_results_created_at ON analysis_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_results_data_source ON analysis_results(data_source);
CREATE INDEX IF NOT EXISTS idx_analysis_results_scores ON analysis_results(overall_score DESC, viability_score DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_results_industry ON analysis_results(industry);
CREATE INDEX IF NOT EXISTS idx_analysis_results_user_session ON analysis_results(user_session);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger
CREATE TRIGGER update_analysis_results_updated_at BEFORE UPDATE
ON analysis_results FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- User Sessions Table (Optional - for tracking user behavior)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_agent TEXT,
  ip_address INET,
  analysis_count INTEGER DEFAULT 0,
  
  CONSTRAINT user_sessions_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON user_sessions(last_activity DESC);

-- API Usage Tracking Table (Optional - for monitoring)
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  user_session TEXT,
  error_message TEXT,
  
  CONSTRAINT api_usage_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_api_usage_timestamp ON api_usage(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_api_usage_endpoint ON api_usage(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_usage_status ON api_usage(status_code);

-- Enable Row Level Security (RLS) - Important for data protection
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now - can be restricted later)
CREATE POLICY "Enable all operations for analysis_results" ON analysis_results
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for user_sessions" ON user_sessions
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for api_usage" ON api_usage
FOR ALL USING (true) WITH CHECK (true);

-- Create a view for analysis summary (useful for dashboards)
CREATE OR REPLACE VIEW analysis_summary AS
SELECT 
  id,
  created_at,
  idea,
  industry,
  target_audience,
  country,
  data_source,
  analysis_confidence,
  overall_score,
  viability_score,
  -- Extract key metrics from JSON
  (analysis_results->>'market_size_score')::INTEGER as market_size_score,
  (analysis_results->>'competition_level')::TEXT as competition_level,
  (analysis_results->>'reddit_posts')::INTEGER as reddit_posts_analyzed,
  user_session
FROM analysis_results
ORDER BY created_at DESC;

-- Sample query examples (commented out - for reference)
/*
-- Get top performing ideas
SELECT idea, industry, overall_score, viability_score 
FROM analysis_results 
WHERE data_source = 'reddit_plus_ai' 
ORDER BY overall_score DESC 
LIMIT 10;

-- Get analysis breakdown by data source
SELECT data_source, COUNT(*) as count, AVG(overall_score) as avg_score
FROM analysis_results 
GROUP BY data_source;

-- Get recent analyses with full details
SELECT * FROM analysis_summary 
WHERE created_at > NOW() - INTERVAL '7 days' 
ORDER BY created_at DESC;
*/