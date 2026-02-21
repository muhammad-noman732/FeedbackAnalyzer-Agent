'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  LogOut, Menu, MoreVertical, Send, MessageSquare, TrendingUp,
  Lightbulb, Brain, Zap, Sparkles, Upload, FileText, AlertCircle, User
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAnalysis } from '@/hooks/useAnalysis';
import { FeedbackAnalysis, AnalyticsSummary } from '@/types/analysis';
import { useDashboard } from '@/hooks/useDashboard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


const TRUNCATE_LIMIT = 300;

function UserMessage({ text }: { text: string }) {
  const [expanded, setExpanded] = React.useState(false);
  const isLong = text.length > TRUNCATE_LIMIT;
  const display = isLong && !expanded ? text.slice(0, TRUNCATE_LIMIT) + '…' : text;
  return (
    <div className="whitespace-pre-wrap break-words">
      {display}
      {isLong && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="block mt-2 text-[10px] font-black uppercase tracking-widest opacity-70 hover:opacity-100 underline transition-opacity"
        >
          {expanded ? 'Show less' : 'Show full message'}
        </button>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const {
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
  } = useDashboard();

  return (
    <div className="h-screen flex bg-background text-foreground">
      { }
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-card/50 backdrop-blur border-r border-border transition-all duration-300 flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {sidebarOpen && (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-sm bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">FeedbackAI</span>
            </Link>
          )}
          <button onClick={toggleSidebar} className="p-1.5 hover:bg-secondary rounded transition">
            <Menu className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
          {[
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'chat', label: 'Chat & Upload', icon: MessageSquare },
            { id: 'insights', label: 'Strategic Roadmap', icon: Lightbulb },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === item.id
                ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-l-2 border-primary'
                : 'hover:bg-secondary'
                }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className={`border-t border-border p-4 ${sidebarOpen ? 'space-y-3' : 'space-y-2'}`}>
          {sidebarOpen && (
            <div className="text-sm">
              <p className="font-medium truncate">{user ? `${user.first_name} ${user.last_name}` : 'Loading...'}</p>
              <p className="text-xs text-muted-foreground font-medium">Enterprise Analytics</p>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary text-sm transition text-destructive"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Sign out</span>}
          </button>
        </div>
      </div>
      { }
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {activeTab === 'analytics' && 'Global Sentiment Analysis'}
              {activeTab === 'chat' && 'Machine Intelligence Interface'}
              {activeTab === 'insights' && 'Strategic Roadmap'}
            </h1>
            {isAnalyzing && (
              <div className="flex items-center gap-2 text-xs text-primary animate-pulse">
                <Zap className="h-3 w-3 animate-spin" />
                Processing Neural Insights...
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".csv"
              onChange={handleFileUpload}
            />
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-primary/20 hover:border-primary/50 bg-secondary/30"
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
            >
              <Upload className="h-4 w-4" />
              Import Data
            </Button>
          </div>
        </header>
        <div className="flex-1 overflow-hidden relative">
          {analysisError && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm backdrop-blur-md animate-fade-in shadow-2xl">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{analysisError}</p>
            </div>
          )}
          { }
          {activeTab === 'analytics' && (
            <div className="h-full overflow-y-auto p-6 space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    label: 'Satisfaction Index',
                    value: analysisResult
                      ? `${Math.round(analysisResult.satisfaction_index * 100)}%`
                      : analyticsData && hasAnalyzedData
                        ? `${analyticsData.satisfaction_index}%`
                        : '0%',
                    icon: Sparkles,
                    subtitle: hasAnalyzedData || analysisResult ? 'From Analysis' : 'Awaiting Data'
                  },
                  {
                    label: 'Detected Themes',
                    value: analysisResult
                      ? analysisResult.total_themes_detected
                      : analyticsData && hasAnalyzedData
                        ? analyticsData.detected_themes
                        : 0,
                    icon: Zap,
                    subtitle: hasAnalyzedData || analysisResult ? 'From Analysis' : 'Awaiting Data'
                  },
                  {
                    label: 'Feature Suggestions',
                    value: analysisResult
                      ? analysisResult.key_features_count
                      : analyticsData && hasAnalyzedData
                        ? analyticsData.key_features_count
                        : 0,
                    icon: Brain,
                    subtitle: hasAnalyzedData || analysisResult ? 'From Analysis' : 'Awaiting Data'
                  },
                ].map((metric, i) => (
                  <div key={i} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-all group shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">{metric.label}</p>
                      <metric.icon className="h-4 w-4 text-primary opacity-50 group-hover:opacity-100 transition" />
                    </div>
                    <p className="text-4xl font-black tracking-tight">{metric.value}</p>
                    <p className={`text-[10px] font-bold mt-2 uppercase tracking-widest ${hasAnalyzedData || analysisResult ? 'text-primary/60' : 'text-muted-foreground/40'}`}>{metric.subtitle}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold mb-6 flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Sentiment Distribution
                  </h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getSentimentChartData()}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={110}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {getSentimentChartData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-2">
                    {getSentimentChartData().map((entry, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.fill }} />
                        <span className="text-xs font-medium text-muted-foreground">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm overflow-hidden">
                  <h3 className="font-bold mb-6 text-lg">Theme Satisfaction Coefficient</h3>
                  <div className="space-y-6">
                    {getThemeChartData().map((theme, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-bold text-zinc-300">{theme.label}</span>
                          <span className="text-primary text-xs font-black">{theme.positive}%</span>
                        </div>
                        <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-1000 ease-out"
                            style={{ width: `${theme.positive}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {(analysisResult || (analyticsData && hasAnalyzedData)) && (
                <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                  <h3 className="font-bold mb-4 text-lg text-primary uppercase tracking-widest text-xs">AI Analysis Summary</h3>
                  <p className="text-zinc-300 leading-relaxed font-medium text-lg italic border-l-4 border-primary pl-8 py-2">
                    "{analysisResult?.chat_response || analyticsData?.chat_response || 'No analysis summary available.'}"
                  </p>
                </div>
              )}
              {!analysisResult && !hasAnalyzedData && (
                <div className="bg-card border border-dashed border-border/50 rounded-2xl p-8 shadow-sm text-center">
                  <div className="max-w-md mx-auto">
                    <Brain className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2 text-muted-foreground">No Analysis Data Yet</h3>
                    <p className="text-sm text-muted-foreground/70 mb-4">
                      Go to the <strong className="text-primary">Chat & Upload</strong> tab to submit customer feedback or upload a CSV file. I'll analyze it and provide actionable insights for your dashboard.
                    </p>
                    <Button
                      onClick={() => setActiveTab('chat')}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Start Analyzing Feedback
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          { }
          {activeTab === 'chat' && (
            <div className="h-full flex flex-col p-6 animate-fade-in">
              <div className="flex-1 bg-card border border-border rounded-3xl flex flex-col overflow-hidden shadow-2xl">
                <div className="px-8 py-6 border-b border-border bg-zinc-950/20 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">Intelligence Agent</h3>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Enterprise Neural Network</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-muted-foreground">System Online</span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/20">
                        <Brain className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold">How can I help you today?</h2>
                      <p className="text-muted-foreground max-w-sm">Provide feedback text or upload a CSV to extract themes, sentiments, and actionable insights.</p>
                    </div>
                  )}

                  {messages.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-slide-up space-y-2`}>
                      {(msg as any).sentiment && !(msg as any).is_question && (
                        <div className="flex flex-col gap-1 w-full max-w-[85%]">
                          <div className="flex justify-between items-end px-1">
                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${(msg as any).sentiment === 'positive' ? 'text-green-500' :
                              (msg as any).sentiment === 'negative' ? 'text-red-500' :
                                'text-amber-500'
                              }`}>
                              {(msg as any).sentiment} Intelligence
                            </span>
                            <span className="text-[10px] font-black text-muted-foreground opacity-60">
                              {(msg as any).index}% Satisfaction
                            </span>
                          </div>
                          <div className="h-1 w-full bg-secondary/30 rounded-full overflow-hidden flex">
                            <div className="h-full bg-green-500" style={{ width: `${(msg as any).breakdown?.positive * 100 / ((msg as any).breakdown?.total || 1) || 0}%` }} />
                            <div className="h-full bg-zinc-500" style={{ width: `${(msg as any).breakdown?.neutral * 100 / ((msg as any).breakdown?.total || 1) || 0}%` }} />
                            <div className="h-full bg-red-500" style={{ width: `${(msg as any).breakdown?.negative * 100 / ((msg as any).breakdown?.total || 1) || 0}%` }} />
                          </div>
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] rounded-2xl px-6 py-4 text-sm shadow-sm leading-relaxed ${msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground font-bold border-b-4 border-primary-foreground/20'
                          : 'bg-zinc-900 text-zinc-200 border border-border markdown-content'
                          }`}
                      >
                        {msg.sender === 'user' ? (
                          <UserMessage text={msg.text} />
                        ) : (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.text}
                          </ReactMarkdown>
                        )}
                      </div>

                      { }
                      {(msg as any).sentiment && !(msg as any).is_question && (
                        <div className="flex items-center gap-1.5 px-1 mt-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${(msg as any).sentiment === 'positive' ? 'bg-green-500' :
                            (msg as any).sentiment === 'negative' ? 'bg-red-500' :
                              'bg-amber-500'
                            }`} />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Overall Status: {(msg as any).sentiment}
                          </span>
                        </div>
                      )}

                    </div>
                  ))}
                  {isAnalyzing && (
                    <div className="flex justify-start">
                      <div className="bg-zinc-900 px-6 py-4 rounded-2xl border border-border">
                        <div className="flex gap-1.5 items-center">
                          <span className="text-[10px] uppercase font-black text-primary mr-2">Analyzing</span>
                          <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                          <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6 border-t border-border bg-zinc-950/40 space-y-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-black bg-secondary hover:bg-zinc-800 px-4 py-2 rounded-xl transition-all border border-border/50"
                    >
                      <FileText className="h-3 w-3 text-primary" />
                      Bulk Import
                    </button>
                    <span className="text-[10px] text-muted-foreground font-bold tracking-tight">System accepts raw text or structured CSV datasets</span>
                  </div>
                  <form onSubmit={handleSendMessage} className="relative">
                    <Input
                      type="text"
                      placeholder="Input customer feedback for real-time analysis..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      disabled={isAnalyzing}
                      className="h-16 bg-zinc-900 border-border rounded-2xl pl-6 pr-16 text-base font-medium focus:ring-primary/20 transition-all shadow-inner"
                    />
                    <button
                      type="submit"
                      disabled={isAnalyzing || !inputValue.trim()}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-xl bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-lg"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
          { }
          {activeTab === 'insights' && (
            <div className="h-full overflow-y-auto p-6 space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Priority Actions',
                    icon: Zap,
                    items: analysisResult ? analysisResult.feature_suggestions.filter(f => f.priority === 'critical' || f.priority === 'high').map(f => f.feature) : ['Optimize Mobile API', 'Fix UI Latency'],
                    color: 'from-red-500/10 to-transparent',
                    iconColor: 'text-red-400'
                  },
                  {
                    title: 'Feature Suggestions',
                    icon: Sparkles,
                    items: analysisResult && analysisResult.feature_suggestions.length > 0
                      ? analysisResult.feature_suggestions.map(f => f.feature)
                      : ['Gather more feedback', 'Identify patterns'],
                    color: 'from-primary/10 to-transparent',
                    iconColor: 'text-primary'
                  },
                  {
                    title: 'Detected Themes',
                    icon: MessageSquare,
                    items: analysisResult && analysisResult.themes.length > 0
                      ? analysisResult.themes.map(t => t.theme.replace(/_/g, ' '))
                      : ['General feedback'],
                    color: 'from-accent/10 to-transparent',
                    iconColor: 'text-accent'
                  },
                ].map((card, i) => (
                  <div key={i} className={`bg-gradient-to-b ${card.color} border border-border rounded-2xl p-6 space-y-5 hover:border-primary/20 transition shadow-sm`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-border">
                        <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                      </div>
                      <h3 className="font-black text-base uppercase tracking-wider">{card.title}</h3>
                    </div>
                    <ul className="space-y-4">
                      {card.items.slice(0, 4).map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-zinc-400 font-medium">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
                <div className="p-8 border-b border-border bg-zinc-950/40">
                  <h3 className="text-xl font-black flex items-center gap-3 uppercase tracking-widest">
                    <Sparkles className="w-6 h-6 text-primary" />
                    Engineering Roadmap
                  </h3>
                  <p className="text-xs text-muted-foreground font-black mt-2 uppercase tracking-widest opacity-50">Machine Generated Strategy</p>
                </div>
                <div className="p-8 grid gap-4">
                  {(analysisResult?.feature_suggestions || [
                    { priority: 'high', feature: 'Gather more specific feedback', reasoning: 'Need more data for actionable insights', affected_users: 0 },
                  ]).map((fs, i) => (
                    <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-zinc-900 rounded-2xl border border-border/50 hover:border-primary/40 transition-all group">
                      <div className="flex items-center gap-6 flex-1 mb-3 md:mb-0">
                        <span className={`text-[10px] uppercase font-black px-4 py-2 rounded-lg ${fs.priority === 'critical' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                          fs.priority === 'high' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                            fs.priority === 'medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                              'bg-green-500/10 text-green-500 border border-green-500/20'
                          }`}>
                          {fs.priority}
                        </span>
                        <div>
                          <p className="font-bold text-zinc-100 group-hover:text-primary transition text-lg">{fs.feature}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black uppercase text-muted-foreground">{fs.affected_users} users affected</span>
                            <div className="w-1 h-1 rounded-full bg-border" />
                            <p className="text-xs text-muted-foreground font-bold">{fs.reasoning}</p>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-xl font-black uppercase tracking-widest text-[10px] h-10 border-border hover:bg-zinc-800">Review</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slideUp 0.4s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div >
  );
}
