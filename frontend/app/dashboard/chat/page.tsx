'use client';
import React from "react"
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Plus, Copy, ThumbsUp, ThumbsDown, MoreVertical, Upload, Zap, Brain } from 'lucide-react';
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

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const StyledFeedbackResponse = ({ text }: { text: string }) => {
  const detectSentiment = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('negative')) return 'negative';
    if (lower.includes('positive')) return 'positive';
    if (lower.includes('neutral')) return 'neutral';
    if (lower.includes('mixed')) return 'mixed';
    return 'unknown';
  };

  const sentiment = detectSentiment(text);

  const sentimentConfig: Record<string, { color: string; bgColor: string; borderColor: string; icon: string }> = {
    positive: { color: 'text-emerald-300', bgColor: 'bg-emerald-950/40', borderColor: 'border-emerald-700/50', icon: '✓' },
    negative: { color: 'text-red-300', bgColor: 'bg-red-950/40', borderColor: 'border-red-700/50', icon: '⚠' },
    neutral: { color: 'text-amber-300', bgColor: 'bg-amber-950/40', borderColor: 'border-amber-700/50', icon: '◇' },
    mixed: { color: 'text-blue-300', bgColor: 'bg-blue-950/40', borderColor: 'border-blue-700/50', icon: '⊗' },
    unknown: { color: 'text-gray-300', bgColor: 'bg-gray-950/40', borderColor: 'border-gray-700/50', icon: '?' },
  };

  const config = sentimentConfig[sentiment];

  // Split by double newline OR single newline before a Bold/Header section
  const sections = text.split(/\n\n|\n(?=\*\*|###)/);

  return (
    <div className="space-y-4">
      {sections.map((section, idx) => {
        const trimmed = section.trim();
        if (!trimmed) return null;

        let icon = null;
        let title = null;
        let bgColor = "bg-zinc-900/50";
        let borderColor = "border-zinc-800";
        let titleColor = "text-zinc-400";

        const lowerTrimmed = trimmed.toLowerCase();

        if (trimmed.startsWith('Analyzed')) {
          icon = config.icon;
          title = "Intelligence Analysis";
          bgColor = config.bgColor;
          borderColor = config.borderColor;
          titleColor = config.color;
        } else if (lowerTrimmed.includes('key insights') || lowerTrimmed.includes('insights')) {
          title = "💡 Key Insights";
          bgColor = "bg-zinc-900/40";
          titleColor = "text-zinc-300";
        } else if (lowerTrimmed.includes('breakdown')) {
          title = "📊 Sentiment Distribution";
          bgColor = "bg-amber-950/40";
          borderColor = "border-amber-700/50";
          titleColor = "text-amber-300";
        } else if (lowerTrimmed.includes('strengths')) {
          title = "💪 Strategic Strengths";
          bgColor = "bg-emerald-950/40";
          borderColor = "border-emerald-700/50";
          titleColor = "text-emerald-300";
        } else if (lowerTrimmed.includes('issues') || lowerTrimmed.includes('weaknesses')) {
          title = "🔴 Areas for Improvement";
          bgColor = "bg-red-950/40";
          borderColor = "border-red-700/50";
          titleColor = "text-red-300";
        } else if (lowerTrimmed.includes('detailed analysis')) {
          title = "🧐 Feature Breakdown";
          bgColor = "bg-zinc-900/40";
          titleColor = "text-zinc-300";
        } else if (lowerTrimmed.includes('priority action')) {
          title = "🎯 Tactical Priority";
          bgColor = "bg-blue-950/40";
          borderColor = "border-blue-700/50";
          titleColor = "text-blue-300";
        } else if (lowerTrimmed.includes('recommendation')) {
          title = "💡 Lead Strategist Advice";
          bgColor = "bg-zinc-900/40";
          titleColor = "text-zinc-300";
        } else if (lowerTrimmed.includes('expected impact')) {
          title = "🚀 Business Forecast";
          bgColor = "bg-emerald-950/20";
          titleColor = "text-emerald-400";
        }

        // Only strip the title if it's at the very beginning and followed by newline or colon
        const cleanedContent = trimmed
          .replace(/^(###\s*)?\**\s*(Analyzed|Key Insights|Breakdown|Main Strengths|Strengths|Main Issues|Weaknesses|Detailed Analysis|Priority Action|Recommendation|Expected Impact)\s*:?\**\s*\n?/, '')
          .trim();

        return (
          <div key={idx} className={`${bgColor} border ${borderColor} rounded-xl p-4 transition-all hover:bg-opacity-60 shadow-sm shadow-black/20`}>
            {title && (
              <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2">
                {icon && <span className={`text-lg ${titleColor}`}>{icon}</span>}
                <p className={`text-[10px] font-black ${titleColor} uppercase tracking-[0.2em]`}>{title}</p>
              </div>
            )}
            <div className="markdown-content text-sm leading-relaxed text-zinc-200">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {cleanedContent || trimmed}
              </ReactMarkdown>
            </div>
          </div>
        );
      })}
    </div>
  );
};


import { useChat } from '@/hooks/useChat';

export default function ChatPage() {
  const {
    messages,
    inputValue,
    setInputValue,
    loading,
    messagesEndRef,
    handleSendMessage,
    handleCopyMessage,
  } = useChat();

  return (
    <div className="h-screen flex bg-background">
      { }
      <div className="w-72 bg-card border-r border-border flex flex-col">
        { }
        <div className="p-4 border-b border-border">
          <button className="w-full flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition">
            <Plus className="w-5 h-5" />
            New Chat
          </button>
        </div>
        { }
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          <div className="text-xs font-semibold text-muted-foreground px-2 uppercase">Today</div>
          {[
            'Analyzing Q4 feedback trends',
            'Customer satisfaction insights',
            'Feature request prioritization',
          ].map((title, i) => (
            <button
              key={i}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary transition group text-sm text-foreground"
            >
              <p className="truncate">{title}</p>
              <p className="text-xs text-muted-foreground truncate">2 minutes ago</p>
            </button>
          ))}
          <div className="text-xs font-semibold text-muted-foreground px-2 uppercase mt-6">Yesterday</div>
          {[
            'Sentiment analysis for new features',
            'Competitor feedback comparison',
          ].map((title, i) => (
            <button
              key={i}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary transition text-sm text-foreground"
            >
              <p className="truncate">{title}</p>
              <p className="text-xs text-muted-foreground truncate">1 day ago</p>
            </button>
          ))}
        </div>
        { }
        <div className="border-t border-border p-4 space-y-2">
          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary transition text-sm">
            Settings
          </button>
          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary transition text-sm">
            Help & Feedback
          </button>
        </div>
      </div>
      { }
      <div className="flex-1 flex flex-col overflow-hidden">
        { }
        <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card">
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Feedback Analysis Chat
            </h1>
            <p className="text-xs text-muted-foreground">3 active conversations</p>
          </div>
          <button className="p-2 hover:bg-secondary rounded-lg transition">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        { }
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-2xl ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                { }
                <div
                  className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary border border-border'
                    }`}
                >
                  {message.sender === 'user' ? 'You' : 'AI'}
                </div>
                { }
                <div className={`space-y-2`}>
                  <div
                    className={`rounded-2xl px-5 py-4 ${message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-100'
                      }`}
                  >
                    {message.sender === 'agent' ? (
                      <StyledFeedbackResponse text={message.text} />
                    ) : (
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    )}
                  </div>
                  { }
                  {message.sender === 'agent' && message.hasActions && (
                    <div className="flex gap-2 px-1 pt-1">
                      <button
                        onClick={() => handleCopyMessage(message.text)}
                        className="p-1.5 hover:bg-secondary rounded transition"
                        title="Copy"
                      >
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-secondary rounded transition"
                        title="Helpful"
                      >
                        <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-secondary rounded transition"
                        title="Not helpful"
                      >
                        <ThumbsDown className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground px-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          { }
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-bold">
                  AI
                </div>
                <div className="bg-secondary border border-border rounded-2xl px-4 py-3 flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        { }
        {messages.length === 2 && (
          <div className="px-6 pb-6">
            <p className="text-sm text-muted-foreground mb-3">Try asking me:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Analyze this feedback for me',
                'What are the top themes?',
                'Show sentiment breakdown',
                'Find improvement opportunities',
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInputValue(suggestion);
                  }}
                  className="text-left text-xs px-3 py-2 rounded-lg border border-border hover:bg-secondary transition bg-card"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        { }
        <div className="border-t border-border px-6 py-4 bg-card">
          <div className="space-y-3 mb-4">
            { }
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 text-sm rounded-lg transition">
                <Upload className="w-4 h-4" />
                Upload CSV
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 text-sm rounded-lg transition">
                <Brain className="w-4 h-4" />
                Paste Feedback
              </button>
            </div>
          </div>
          { }
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Input
              type="text"
              placeholder="Ask your AI analyst anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
            <Button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            FeedbackAI can make mistakes. Always verify important insights with your team.
          </p>
        </div>
      </div>
    </div>
  );
}
