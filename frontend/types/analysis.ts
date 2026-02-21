export interface ThemeAnalysis {
    theme: string;
    count: number;
    sentiment: string;
    examples: string[];
    percentage: number;
    satisfaction: number;
}

export interface FeatureSuggestion {
    feature: string;
    priority: string;
    reasoning: string;
    affected_users: number;
    impact_score?: number;
}

export interface SentimentDistribution {
    positive: number;
    neutral: number;
    negative: number;
    mixed: number;
}

export interface FeedbackAnalysis {
    total_feedbacks_analyzed: number;
    overall_sentiment: string;
    satisfaction_index: number;
    sentiment_distribution: SentimentDistribution;
    total_themes_detected: number;
    themes: ThemeAnalysis[];
    key_features_count: number;
    feature_suggestions: FeatureSuggestion[];
    chat_response: string;
    is_question_response: boolean;
    analyzed_at?: string;
}

export interface AnalysisRequest {
    reviews: string[];
    history?: ChatMessage[];
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatResponse {
    conversation_id: string;
    response: string;
    analysis: FeedbackAnalysis | null;
    is_question: boolean;
}

export interface AnalyticsSummary {
    satisfaction_index: number;
    overall_sentiment: string;
    detected_themes: number;
    key_features_count: number;
    total_feedbacks: number;
    sentiment_distribution: SentimentDistribution;
    themes: ThemeAnalysis[];
    theme_satisfaction: Array<{
        theme: string;
        satisfaction: number;
    }>;
    feature_suggestions: FeatureSuggestion[];
    chat_response: string;
    last_updated: string | null;
}

export interface HistoricalAnalytic {
    date: string;
    satisfaction_index: number;
    feedback_count: number;
    themes_count: number;
    sentiment: string;
}

export interface Recommendations {
    critical: FeatureSuggestion[];
    high: FeatureSuggestion[];
    medium: FeatureSuggestion[];
    low: FeatureSuggestion[];
}
