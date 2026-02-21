'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    timestamp: Date;
    hasActions?: boolean;
}

const SAMPLE_RESPONSES = [
    "Analyzed **10** feedbacks. **Mixed** sentiment (**60%** satisfaction).\n\n**Breakdown:** **40%** positive, **20%** neutral, **40%** negative.\n\n**Main Strengths:** Ambiance and desserts (**3x**).\n\n**Main Issues:** Service and food temperature (**2x**), Overpriced portions (**1x**), Broken reservation system (**1x**).\n\n**Priority Action:** Improve the reservation system and address food temperature issues to increase overall customer satisfaction.",
    "Based on the sentiment analysis, your strongest points are customer support (**91%** **Positive**) and design (**82%** **Positive**). However, pricing is contentious with **35%** **Negative** mentions.",
    "Analyzed **50** feedbacks. **Positive** sentiment (**88%** satisfaction).\n\n**Breakdown:** **88%** positive, **8%** neutral, **4%** negative.\n\n**Main Strengths:** User interface and features (**15x**), Fast performance (**12x**).\n\n**Main Issues:** Pricing concerns (**3x**).",
    "Analyzed **25** feedbacks. **Negative** sentiment (**35%** satisfaction).\n\n**Breakdown:** **20%** positive, **15%** neutral, **65%** negative.\n\n**Main Strengths:** Concept idea (**2x**).\n\n**Main Issues:** Poor customer service (**18x**), Bugs and crashes (**10x**), Missing features (**8x**).\n\n**Priority Action:** Address customer service quality immediately and fix critical bugs.",
    "The data shows your mobile app has **Neutral** sentiment (**62%**) compared to desktop (**88%** **Positive**). Mobile optimization should be a **Priority Action**.",
    "Analyzed **1** feedback. **Positive** sentiment (**100%** satisfaction).\n\n**Breakdown:** **100%** positive, **0%** neutral, **0%** negative.\n\n**Main Strengths:** Excellent overall experience (**1x**).\n\n**Main Issues:** None identified.\n\n**Priority Action:** Continue delivering the same level of quality and service.",
    "Analyzed **1** feedback. **Negative** sentiment (**0%** satisfaction).\n\n**Breakdown:** **0%** positive, **0%** neutral, **100%** negative.\n\n**Main Issues:** Product quality (**1x**).\n\n**Priority Action:** Investigate and address the specific product quality issues mentioned in the feedback to improve customer satisfaction.",
    "Analyzed **1** feedback. **Neutral** sentiment (**50%** satisfaction).\n\n**Breakdown:** **0%** positive, **100%** neutral, **0%** negative.\n\n**Main Strengths:** None.\n\n**Main Issues:** None.\n\n**Priority Action:** Collect more feedback to determine areas of improvement.",
];

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi! I'm your AI feedback analyst. I can help you analyze customer reviews, identify patterns, and discover actionable insights. You can paste feedback directly, upload CSV files, or ask me questions about your data.",
            sender: 'agent',
            timestamp: new Date(),
        },
        {
            id: '2',
            text: "What specific aspects of customer feedback would you like me to analyze?",
            sender: 'agent',
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || loading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setLoading(true);

        // Mock API delay
        setTimeout(() => {
            const randomResponse = SAMPLE_RESPONSES[Math.floor(Math.random() * SAMPLE_RESPONSES.length)];
            const agentMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: randomResponse,
                sender: 'agent',
                timestamp: new Date(),
                hasActions: true,
            };
            setMessages(prev => [...prev, agentMessage]);
            setLoading(false);
        }, 1200);
    };

    const handleCopyMessage = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return {
        messages,
        inputValue,
        setInputValue,
        loading,
        messagesEndRef,
        handleSendMessage,
        handleCopyMessage,
    };
}
