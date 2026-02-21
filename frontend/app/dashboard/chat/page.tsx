'use client';
import React from "react";
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Plus, Copy, ThumbsUp, ThumbsDown, MoreVertical, Upload, Zap, Brain, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChat } from '@/hooks/useChat';

// ─── Styled Feedback Response ─────────────────────────────────────────────────

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

        if (trimmed.startsWith('Analyzed') || lowerTrimmed.includes('feedback analysis')) {
          icon = config.icon;
          title = lowerTrimmed.includes('negative') ? "🔴 Negative Feedback Analysis" :
            lowerTrimmed.includes('positive') ? "🟢 Positive Feedback Analysis" :
              lowerTrimmed.includes('mixed') ? "⊗ Mixed Feedback Analysis" :
                "Intelligence Analysis";
          bgColor = config.bgColor;
          borderColor = config.borderColor;
          titleColor = config.color;
        } else if (lowerTrimmed.includes('key insights') || lowerTrimmed.includes('insights')) {
          title = "💡 Key Insights";
          bgColor = "bg-zinc-900/40";
          titleColor = "text-zinc-300";
        } else if (lowerTrimmed.includes('patterns')) {
          title = "🧩 Identified Patterns";
          bgColor = "bg-zinc-900/40";
          titleColor = "text-blue-300";
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
        } else if (lowerTrimmed.includes('priority action') || lowerTrimmed.includes('priority actions')) {
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
        } else if (lowerTrimmed.includes('how to use')) {
          title = "ℹ️ Getting Started";
          bgColor = "bg-blue-950/20";
          titleColor = "text-blue-300";
        }

        const cleanedContent = trimmed
          .replace(/^(###\s*)?\**\s*(Analyzed|Key Insights|Breakdown|Main Strengths|Strengths|Main Issues|Weaknesses|Detailed Analysis|Priority Action|Priority Actions|Recommendation|Expected Impact)\s*:?\**\s*\n?/, '')
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

// ─── User Message (with show more/less for long messages) ────────────────────

const UserMessage = ({ text }: { text: string }) => {
  const [expanded, setExpanded] = useState(false);
  const MAX_CHARS = 300;
  const isLong = text.length > MAX_CHARS;
  const displayText = isLong && !expanded ? text.slice(0, MAX_CHARS) + '…' : text;

  return (
    <div>
      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{displayText}</p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 flex items-center gap-1 text-xs text-blue-300 hover:text-blue-200 transition-colors"
        >
          <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

// ─── Main Chat Page ────────────────────────────────────────────────────────────

export default function ChatPage() {
  const {
    messages,
    inputValue,
    setInputValue,
    loading,
    messagesEndRef,
    fileInputRef,
    handleSendMessage,
    handleFileInputChange,
    triggerFileUpload,
    handleCopyMessage,
    startNewChat,
  } = useChat();

  return (
    <div className="h-screen flex bg-background">
      {/* Hidden file input for CSV upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileInputChange}
        id="csv-file-input"
      />

      {/* ── Sidebar ───────────────────────────────── */}
      <div className="w-72 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <button
            onClick={startNewChat}
            className="w-full flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition"
          >
            <Plus className="w-5 h-5" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          <div className="text-xs font-semibold text-muted-foreground px-2 uppercase">Current Session</div>
          {messages
            .filter(m => m.sender === 'user')
            .slice(0, 5)
            .map((m, i) => (
              <div
                key={i}
                className="w-full text-left px-3 py-2 rounded-lg bg-secondary/40 text-sm text-foreground"
              >
                <p className="truncate">{m.text}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          {messages.filter(m => m.sender === 'user').length === 0 && (
            <p className="text-xs text-muted-foreground px-2 py-4 text-center">
              No messages yet. Start by pasting feedback or uploading a CSV.
            </p>
          )}
        </div>

        <div className="border-t border-border p-4 space-y-2">
          <Link href="/dashboard" className="block w-full text-left px-3 py-2 rounded-lg hover:bg-secondary transition text-sm">
            ← Dashboard
          </Link>
        </div>
      </div>

      {/* ── Main Chat Area ───────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card">
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Feedback Analysis Chat
            </h1>
            <p className="text-xs text-muted-foreground">
              {messages.filter(m => m.sender !== 'agent' || m.id.startsWith('welcome')).length > 1
                ? `${messages.filter(m => m.sender === 'user').length} messages in current session`
                : 'Beta · Powered by LLaMA 3.3'}
            </p>
          </div>
          <button className="p-2 hover:bg-secondary rounded-lg transition">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-2xl w-full ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary border border-border'
                    }`}
                >
                  {message.sender === 'user' ? 'You' : 'AI'}
                </div>

                {/* Bubble */}
                <div className="space-y-2 min-w-0 flex-1">
                  <div
                    className={`rounded-2xl px-5 py-4 ${message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : message.type === 'error'
                        ? 'bg-red-950/40 border border-red-800/50 text-red-100'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-100'
                      }`}
                  >
                    {message.sender === 'agent' ? (
                      <StyledFeedbackResponse text={message.text} />
                    ) : (
                      <UserMessage text={message.text} />
                    )}
                  </div>

                  {/* Action buttons */}
                  {message.sender === 'agent' && message.hasActions && (
                    <div className="flex gap-2 px-1 pt-1">
                      <button
                        onClick={() => handleCopyMessage(message.text)}
                        className="p-1.5 hover:bg-secondary rounded transition"
                        title="Copy"
                      >
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 hover:bg-secondary rounded transition" title="Helpful">
                        <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 hover:bg-secondary rounded transition" title="Not helpful">
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

          {/* Loading indicator */}
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

        {/* Suggestion chips (show only at beginning) */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <p className="text-sm text-muted-foreground mb-3">Try asking me:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                'What are the top complaints?',
                'Show me positive feedback',
                'Give me an analytics summary',
                'What should I improve first?',
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setInputValue(suggestion)}
                  className="text-left text-xs px-3 py-2 rounded-lg border border-border hover:bg-secondary transition bg-card"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="border-t border-border px-6 py-4 bg-card">
          <div className="space-y-3 mb-4">
            <div className="flex gap-2">
              <button
                onClick={triggerFileUpload}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 text-sm rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                title="Upload a CSV file with customer feedback"
              >
                <Upload className="w-4 h-4" />
                Upload CSV
              </button>
              <button
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 text-sm rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                title="Paste feedback text directly in the chat input below"
                onClick={() => setInputValue('')}
              >
                <Brain className="w-4 h-4" />
                Paste Feedback
              </button>
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Input
              type="text"
              placeholder="Paste feedback or ask a question..."
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
