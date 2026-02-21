const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
    AUTH: {
        SIGNUP: `${API_BASE_URL}/auth/signup`,
        LOGIN: `${API_BASE_URL}/auth/login`,
        ME: `${API_BASE_URL}/auth/me`,
    },
    ANALYZE: {
        TEXT: `${API_BASE_URL}/analyze/text`,
        UPLOAD: `${API_BASE_URL}/analyze/upload`,
        CHAT: `${API_BASE_URL}/analyze/chat`,
        QUICK_SENTIMENT: `${API_BASE_URL}/analyze/quick-sentiment`,
    },
    ANALYTICS: {
        SUMMARY: `${API_BASE_URL}/analytics/summary`,
        HISTORY: `${API_BASE_URL}/analytics/history`,
        THEMES: `${API_BASE_URL}/analytics/themes`,
        RECOMMENDATIONS: `${API_BASE_URL}/analytics/recommendations`,
        STATS: `${API_BASE_URL}/analytics/stats`,
    },
} as const;

export { API_BASE_URL };
