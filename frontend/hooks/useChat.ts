'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '@/lib/api-config';

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    timestamp: Date;
    hasActions?: boolean;
    type?: 'feedback' | 'question' | 'csv' | 'meta' | 'error';
}

function getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function sendChatMessage(message: string, conversationId?: string) {
    const response = await fetch(API_ENDPOINTS.ANALYZE.CHAT, {
        method: 'POST',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, conversation_id: conversationId ?? null }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || 'Chat request failed');
    }
    return response.json();
}

async function uploadCsvFile(file: File, conversationId?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (conversationId) {
        formData.append('conversation_id', conversationId);
    }
    const response = await fetch(API_ENDPOINTS.ANALYZE.UPLOAD, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || 'CSV upload failed');
    }
    return response.json();
}

const WELCOME_MESSAGES: Message[] = [
    {
        id: 'welcome-1',
        text: "Hi! I am your AI feedback analyst. I can help you analyze customer reviews, identify patterns, and discover actionable insights.\n\n**How to use me:**\n- **Paste feedback** directly in the chat (e.g., \"app crashes every time\")\n- **Upload a CSV** using the button below\n- **Ask questions** about your data (e.g., \"What are the top complaints?\")",
        sender: 'agent',
        timestamp: new Date(),
    },
];

export function useChat() {
    const [messages, setMessages] = useState<Message[]>(WELCOME_MESSAGES);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | undefined>(undefined);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const addUserMessage = useCallback((text: string): Message => {
        const msg: Message = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, msg]);
        return msg;
    }, []);

    const addAgentMessage = useCallback((text: string, type?: Message['type']): Message => {
        const msg: Message = {
            id: (Date.now() + 1).toString(),
            text,
            sender: 'agent',
            timestamp: new Date(),
            hasActions: true,
            type,
        };
        setMessages(prev => [...prev, msg]);
        return msg;
    }, []);

    const handleSendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = inputValue.trim();
        if (!trimmed || loading) return;

        addUserMessage(trimmed);
        setInputValue('');
        setLoading(true);

        try {
            const result = await sendChatMessage(trimmed, conversationId);

            if (result.conversation_id && result.conversation_id !== 'error') {
                setConversationId(result.conversation_id);
            }

            const responseText = result.response || 'I encountered an issue. Please try again.';
            addAgentMessage(responseText, result.is_question ? 'question' : 'feedback');
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred.';
            addAgentMessage(
                `Warning: **Error:** ${errorMsg}\n\nPlease check your connection and try again.`,
                'error'
            );
        } finally {
            setLoading(false);
        }
    }, [inputValue, loading, conversationId, addUserMessage, addAgentMessage]);

    const handleCsvUpload = useCallback(async (file: File) => {
        if (!file || !file.name.endsWith('.csv')) {
            addAgentMessage('Warning: **Invalid file.** Please upload a `.csv` file.', 'error');
            return;
        }

        addUserMessage(`Uploading: **${file.name}** (${(file.size / 1024).toFixed(1)} KB)`);
        setLoading(true);

        const processingId = (Date.now() + 2).toString();
        setMessages(prev => [
            ...prev,
            {
                id: processingId,
                text: `Processing **${file.name}**... This may take a moment for large files.`,
                sender: 'agent',
                timestamp: new Date(),
                type: 'csv',
            },
        ]);

        try {
            const result = await uploadCsvFile(file, conversationId);

            setMessages(prev => prev.filter(m => m.id !== processingId));

            if (result.conversation_id && result.conversation_id !== 'error') {
                setConversationId(result.conversation_id);
            }

            const responseText = result.response || 'CSV processed successfully.';
            addAgentMessage(responseText, 'csv');
        } catch (err) {
            setMessages(prev => prev.filter(m => m.id !== processingId));
            const errorMsg = err instanceof Error ? err.message : 'Upload failed.';
            addAgentMessage(
                `Warning **Upload Error:** ${errorMsg}\n\nMake sure the CSV has a column named "review", "feedback", "text", or "comment".`,
                'error'
            );
        } finally {
            setLoading(false);
        }
    }, [conversationId, addUserMessage, addAgentMessage]);

    const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleCsvUpload(file);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [handleCsvUpload]);

    const triggerFileUpload = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleCopyMessage = useCallback((text: string) => {
        navigator.clipboard.writeText(text).catch(() => {});
    }, []);

    const startNewChat = useCallback(() => {
        setConversationId(undefined);
        setMessages(WELCOME_MESSAGES);
        setInputValue('');
    }, []);

    return {
        messages,
        inputValue,
        setInputValue,
        loading,
        conversationId,
        messagesEndRef,
        fileInputRef,
        handleSendMessage,
        handleCsvUpload,
        handleFileInputChange,
        triggerFileUpload,
        handleCopyMessage,
        startNewChat,
    };
}
