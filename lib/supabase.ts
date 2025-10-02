import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types for analysis results
export interface AnalysisRecord {
  id?: string
  created_at?: string
  idea: string
  industry?: string
  target_audience?: string
  country?: string
  analysis_results: any // JSON field containing the full analysis
  data_source: string
  analysis_confidence: string
  overall_score: number
  viability_score: number
  user_session?: string // Optional user tracking
}

// Partial analysis record for summary queries
export interface AnalysisSummary {
  id: string
  created_at: string
  idea: string
  industry?: string
  data_source: string
  analysis_confidence: string
  overall_score: number
  viability_score: number
}

// Database service functions
export class DatabaseService {
  // Save analysis results to database
  static async saveAnalysis(analysis: Omit<AnalysisRecord, 'id' | 'created_at'>): Promise<AnalysisRecord | null> {
    try {
      const { data, error } = await supabase
        .from('analysis_results')
        .insert([analysis])
        .select()
        .single()

      if (error) {
        console.error('❌ Error saving analysis to database:', error)
        return null
      }

      console.log('✅ Analysis saved to database:', data.id)
      return data
    } catch (err) {
      console.error('❌ Database save failed:', err)
      return null
    }
  }

  // Get analysis by ID
  static async getAnalysis(id: string): Promise<AnalysisRecord | null> {
    try {
      const { data, error } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('❌ Error fetching analysis:', error)
        return null
      }

      return data
    } catch (err) {
      console.error('❌ Database fetch failed:', err)
      return null
    }
  }

  // Get recent analyses (for dashboard/history)
  static async getRecentAnalyses(limit = 10): Promise<AnalysisSummary[]> {
    try {
      const { data, error } = await supabase
        .from('analysis_results')
        .select('id, created_at, idea, industry, data_source, analysis_confidence, overall_score, viability_score')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('❌ Error fetching recent analyses:', error)
        return []
      }

      // Explicit type assertion to ensure correct typing
      return (data || []) as AnalysisSummary[]
    } catch (err) {
      console.error('❌ Database query failed:', err)
      return []
    }
  }

  // Get analytics/stats
  static async getAnalyticsStats() {
    try {
      const { count } = await supabase
        .from('analysis_results')
        .select('*', { count: 'exact', head: true })

      const { data: topIdeas } = await supabase
        .from('analysis_results')
        .select('idea, industry, overall_score')
        .order('overall_score', { ascending: false })
        .limit(5)

      const { data: dataSourceStats } = await supabase
        .from('analysis_results')
        .select('data_source')

      return {
        total_analyses: count || 0,
        top_scoring_ideas: topIdeas || [],
        data_source_breakdown: dataSourceStats?.reduce((acc: any, curr) => {
          acc[curr.data_source] = (acc[curr.data_source] || 0) + 1
          return acc
        }, {}) || {}
      }
    } catch (err) {
      console.error('❌ Analytics query failed:', err)
      return null
    }
  }
}