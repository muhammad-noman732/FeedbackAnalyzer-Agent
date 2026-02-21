'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAnalysis } from '@/hooks/useAnalysis';
import { FeedbackAnalysis, AnalyticsSummary } from '@/types/analysis';

export function useDashboard() {
    const { user, logout } = useAuth();
    const { sendChatMessage, uploadCsv, getAnalyticsSummary, isLoading: isAnalyzing, error: analysisError } = useAnalysis();

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState<'analytics' | 'chat' | 'insights'>('analytics');
    const [messages, setMessages] = useState([
        { id: 1, text: `Hi ${user?.first_name || 'there'}! I'm your Lead Insight Strategist. Provide customer feedback text or upload a CSV, and I'll analyze it FOR you - extracting themes, sentiments, and actionable recommendations.`, sender: 'agent' },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [analysisResult, setAnalysisResult] = useState<FeedbackAnalysis | null>(null);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary | null>(null);
    const [hasAnalyzedData, setHasAnalyzedData] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await getAnalyticsSummary();
                if (data && data.total_feedbacks > 0) {
                    setAnalyticsData(data);
                    setHasAnalyzedData(true);
                }
            } catch (err) {
                console.log('No existing analytics data');
            }
        };
        fetchAnalytics();
    }, [getAnalyticsSummary]);

    const getSentimentChartData = useCallback(() => {
        if (analysisResult) {
            const { positive, neutral, negative, mixed } = analysisResult.sentiment_distribution;
            return [
                { name: 'Positive', value: positive || 0, fill: '#a855f7' },
                { name: 'Neutral', value: neutral || 0, fill: '#2d3748' },
                { name: 'Mixed', value: mixed || 0, fill: '#f59e0b' },
                { name: 'Negative', value: negative || 0, fill: '#ef4444' },
            ];
        }
        if (analyticsData && hasAnalyzedData) {
            const { positive, neutral, negative, mixed } = analyticsData.sentiment_distribution;
            return [
                { name: 'Positive', value: positive || 0, fill: '#a855f7' },
                { name: 'Neutral', value: neutral || 0, fill: '#2d3748' },
                { name: 'Mixed', value: mixed || 0, fill: '#f59e0b' },
                { name: 'Negative', value: negative || 0, fill: '#ef4444' },
            ];
        }
        return [
            { name: 'Positive', value: 0, fill: '#a855f7' },
            { name: 'Neutral', value: 0, fill: '#2d3748' },
            { name: 'Mixed', value: 0, fill: '#f59e0b' },
            { name: 'Negative', value: 0, fill: '#ef4444' },
        ];
    }, [analysisResult, analyticsData, hasAnalyzedData]);

    const getThemeChartData = useCallback(() => {
        if (analysisResult && analysisResult.themes.length > 0) {
            return analysisResult.themes.map(t => ({
                label: t.theme.replace(/_/g, ' '),
                positive: t.satisfaction ?? 50,
                count: t.count,
            }));
        }
        if (analyticsData && analyticsData.themes && analyticsData.themes.length > 0) {
            return analyticsData.themes.map(t => ({
                label: t.theme.replace(/_/g, ' '),
                positive: t.satisfaction ?? 50,
                count: t.count,
            }));
        }
        return [
            { label: 'No themes yet', positive: 0, count: 0 },
        ];
    }, [analysisResult, analyticsData]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isAnalyzing) return;

        const textToSend = inputValue;
        const userMessage = {
            id: Date.now(),
            text: textToSend,
            sender: 'user' as const,
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        const pendingFile = (window as any)._pendingFile;
        if (pendingFile) {
            (window as any)._pendingFile = null;
            try {
                const result = await uploadCsv(pendingFile);
                if (result.analysis) {
                    setAnalysisResult(result.analysis);
                }
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: result.response,
                    sender: 'agent' as const,
                    sentiment: result.analysis?.overall_sentiment as any,
                    index: result.analysis ? Math.round(result.analysis.satisfaction_index * 100) : 50,
                    breakdown: result.analysis?.sentiment_distribution,
                    is_question: false
                }]);

                return;
            } catch (err) {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: "Dataset processing error. Ensure CSV contains a 'review' column.",
                    sender: 'agent' as const
                }]);
                return;
            }
        }

        try {
            const chatResponse = await sendChatMessage(textToSend, conversationId || undefined);

            if (chatResponse.conversation_id) {
                setConversationId(chatResponse.conversation_id);
            }

            if (chatResponse.analysis) {
                setAnalysisResult(chatResponse.analysis);
            }

            const agentResponse = {
                id: Date.now() + 2,
                text: chatResponse.response,
                sender: 'agent' as const,
                sentiment: chatResponse.analysis?.overall_sentiment || 'neutral',
                index: chatResponse.analysis ? Math.round(chatResponse.analysis.satisfaction_index * 100) : 50,
                breakdown: chatResponse.analysis?.sentiment_distribution,
                is_question: chatResponse.is_question
            };
            setMessages(prev => [...prev, agentResponse]);

        } catch (err) {
            setMessages(prev => [...prev, {
                id: Date.now() + 3,
                text: "Neural analysis interrupted. Please check your network connection.",
                sender: 'agent' as const,
            }]);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setInputValue(`Analysis request for dataset: ${file.name}`);
        (window as any)._pendingFile = file;

        setMessages(prev => [...prev, {
            id: Date.now(),
            text: `📎 File attached: ${file.name}. Click send to start analysis.`,
            sender: 'agent' as const
        }]);
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return {
        user,
        logout,
        isAnalyzing,
        analysisError,
        sidebarOpen,
        activeTab,
        setActiveTab,
        messages,
        inputValue,
        setInputValue,
        analysisResult,
        analyticsData,
        hasAnalyzedData,
        fileInputRef,
        getSentimentChartData,
        getThemeChartData,
        handleSendMessage,
        handleFileUpload,
        toggleSidebar
    };
}
