import { useState, useCallback } from "react";
import { API_ENDPOINTS } from "@/lib/api-config";
import { FeedbackAnalysis, AnalyticsSummary, ChatMessage, ChatResponse } from "@/types/analysis";
interface UseAnalysisReturn {
    analyzeText: (reviews: string[], history?: ChatMessage[]) => Promise<FeedbackAnalysis>;
    uploadCsv: (file: File) => Promise<ChatResponse>;
    sendChatMessage: (message: string, conversationId?: string) => Promise<ChatResponse>;
    getAnalyticsSummary: () => Promise<AnalyticsSummary>;
    isLoading: boolean;
    error: string | null;
}

export function useAnalysis(): UseAnalysisReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const getHeaders = useCallback(() => {
        const token = localStorage.getItem("access_token");
        return {
            "Authorization": `Bearer ${token}`,
        };
    }, []);
    const analyzeText = useCallback(async (reviews: string[], history: ChatMessage[] = []): Promise<FeedbackAnalysis> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(API_ENDPOINTS.ANALYZE.TEXT, {
                method: "POST",
                headers: {
                    ...getHeaders(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ reviews, history }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Analysis failed");
            }
            return await response.json();
        } catch (err) {
            const msg = err instanceof Error ? err.message : "An error occurred";
            setError(msg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [getHeaders]);
    const uploadCsv = useCallback(async (file: File): Promise<ChatResponse> => {
        setIsLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await fetch(API_ENDPOINTS.ANALYZE.UPLOAD, {
                method: "POST",
                headers: getHeaders(),
                body: formData,
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Upload failed");
            }
            return await response.json();
        } catch (err) {
            const msg = err instanceof Error ? err.message : "An error occurred";
            setError(msg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [getHeaders]);
    const sendChatMessage = useCallback(async (
        message: string,
        conversationId?: string
    ): Promise<ChatResponse> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(API_ENDPOINTS.ANALYZE.CHAT, {
                method: "POST",
                headers: {
                    ...getHeaders(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message,
                    conversation_id: conversationId
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Chat failed");
            }
            return await response.json();
        } catch (err) {
            const msg = err instanceof Error ? err.message : "An error occurred";
            setError(msg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [getHeaders]);
    const getAnalyticsSummary = useCallback(async (): Promise<AnalyticsSummary> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(API_ENDPOINTS.ANALYTICS.SUMMARY, {
                method: "GET",
                headers: getHeaders(),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to fetch analytics");
            }
            return await response.json();
        } catch (err) {
            const msg = err instanceof Error ? err.message : "An error occurred";
            setError(msg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [getHeaders]);
    return {
        analyzeText,
        uploadCsv,
        sendChatMessage,
        getAnalyticsSummary,
        isLoading,
        error
    };
}
