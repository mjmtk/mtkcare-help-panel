import { supabase } from "@/lib/supabase"
import type { HelpContent, HelpSearchParams, HelpAnalytics } from "@/types/help"

export class HelpAPI {
  static async getHelpContent(params?: HelpSearchParams): Promise<HelpContent[]> {
    try {
      let query = supabase
        .from('help_articles')
        .select(`
          *,
          categories (
            name,
            icon
          )
        `)
        .eq('is_published', true)

      // Apply filters
      if (params?.category) {
        query = query.eq('categories.name', params.category)
      }

      if (params?.tags && params.tags.length > 0) {
        query = query.contains('tags', params.tags)
      }

      if (params?.query) {
        // Full-text search using the search_vector
        query = query.textSearch('search_vector', params.query)
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Supabase query error:', error)
        throw new Error(`Failed to fetch help content: ${error.message}`)
      }

      // Transform data to match HelpContent interface
      return (data || []).map(article => ({
        id: article.id,
        title: article.title,
        description: article.description,
        content: article.content,
        category: article.categories?.name || 'General',
        tags: article.tags || [],
        createdAt: article.created_at,
        updatedAt: article.updated_at,
        viewCount: article.view_count || 0
      }))
    } catch (error) {
      console.error("Error in getHelpContent:", error)
      throw error
    }
  }

  static async getHelpTopic(id: string): Promise<HelpContent | null> {
    try {
      const { data, error } = await supabase
        .from('help_articles')
        .select(`
          *,
          categories (
            name,
            icon
          )
        `)
        .eq('id', id)
        .eq('is_published', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Not found
        }
        console.error('Supabase query error:', error)
        throw new Error(`Failed to fetch help topic: ${error.message}`)
      }

      // Increment view count
      await this.incrementViewCount(id)

      // Transform to HelpContent interface
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        content: data.content,
        category: data.categories?.name || 'General',
        tags: data.tags || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        viewCount: data.view_count || 0
      }
    } catch (error) {
      console.error("Error in getHelpTopic:", error)
      throw error
    }
  }

  static async getPopularTopics(): Promise<HelpContent[]> {
    try {
      const { data, error } = await supabase
        .from('help_articles')
        .select(`
          *,
          categories (
            name,
            icon
          )
        `)
        .eq('is_published', true)
        .order('view_count', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Supabase query error:', error)
        throw new Error(`Failed to fetch popular topics: ${error.message}`)
      }

      // Transform data to match HelpContent interface
      return (data || []).map(article => ({
        id: article.id,
        title: article.title,
        description: article.description,
        content: article.content,
        category: article.categories?.name || 'General',
        tags: article.tags || [],
        createdAt: article.created_at,
        updatedAt: article.updated_at,
        viewCount: article.view_count || 0
      }))
    } catch (error) {
      console.error("Error in getPopularTopics:", error)
      throw error
    }
  }

  static async trackAnalytics(analytics: Omit<HelpAnalytics, 'timestamp'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('help_analytics')
        .insert({
          article_id: analytics.topicId || null,
          action: analytics.action,
          context: analytics.context || null,
          session_hash: analytics.sessionHash || null,
          timestamp: new Date().toISOString()
        })

      if (error) {
        console.warn('Analytics tracking error:', error)
        // Don't throw - analytics failures shouldn't break the app
      }
    } catch (error) {
      console.warn("Analytics tracking error:", error)
      // Don't throw error for analytics failures
    }
  }

  private static async incrementViewCount(articleId: string): Promise<void> {
    try {
      const { error } = await supabase
        .rpc('increment_view_count', { article_id: articleId })

      if (error) {
        console.error('View count increment error:', error)
      }
    } catch (error) {
      console.error('View count increment error:', error)
    }
  }
}