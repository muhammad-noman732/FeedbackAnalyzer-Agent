'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageSquare, TrendingUp, Zap, Brain, BarChart3, Lock, CloudLightning as Lightning, Users } from 'lucide-react';
const features = [
  {
    icon: MessageSquare,
    title: "AI Chat Interface",
    description: "Interact with your feedback analyst in natural language. Ask complex questions and get insights instantly.",
    highlights: ["Multi-turn conversations", "Context-aware responses", "Real-time analysis"]
  },
  {
    icon: TrendingUp,
    title: "Real-time Analytics",
    description: "Watch sentiment trends evolve live. Track positive, negative, and neutral feedback with interactive charts.",
    highlights: ["Live dashboards", "Custom date ranges", "Export reports"]
  },
  {
    icon: Brain,
    title: "Intelligent Categorization",
    description: "Automatically group feedback by topics. Our AI learns from your data to improve categorization.",
    highlights: ["Auto-tagging", "Custom categories", "Hierarchical organization"]
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Deep dive into sentiment patterns, recurring themes, and emerging issues with powerful analytics tools.",
    highlights: ["Trend analysis", "Comparative insights", "Anomaly detection"]
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share insights with your team. Collaborate on analysis and decision-making in real-time.",
    highlights: ["Team workspaces", "Permission controls", "Comments & notes"]
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Bank-level encryption, SOC 2 compliance, and granular access controls for your data.",
    highlights: ["End-to-end encryption", "GDPR compliant", "Audit logs"]
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">FeedbackAI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm hover:text-primary transition">Home</Link>
            <a href="#" className="text-sm text-primary font-medium">Features</a>
            <Link href="/" className="text-sm hover:text-primary transition">Pricing</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>
      {}
      <section className="px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 w-fit mx-auto">
            <span className="w-2 h-2 bg-primary rounded-full" />
            <span className="text-sm text-primary">Complete Feature Set</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Everything You Need to
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Master Customer Feedback
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools for analyzing, understanding, and acting on customer feedback with AI-powered insights
          </p>
        </div>
      </section>
      {}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-card border border-border rounded-2xl p-8 space-y-4 h-full">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                    <div className="space-y-2 pt-4">
                      {feature.highlights.map((highlight, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm">
                          <Lightning className="w-3 h-3 text-accent" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center">Deep Dive into Core Features</h2>
          {}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold">AI-Powered Chat Analyst</h3>
              <p className="text-lg text-muted-foreground">
                Have natural conversations about your feedback. Ask questions in plain English and get instant, contextual responses.
              </p>
              <ul className="space-y-3">
                {[
                  "Multi-turn conversations with context awareness",
                  "Understand complex sentiment patterns",
                  "Ask 'what-if' questions about your data",
                  "Get personalized recommendations",
                  "Export conversation summaries",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-primary font-bold">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/dashboard/chat">
                <Button className="bg-primary hover:bg-primary/90">Try Chat Now</Button>
              </Link>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl aspect-video flex items-center justify-center border border-border">
              <MessageSquare className="w-24 h-24 text-primary/30" />
            </div>
          </div>
          {}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl aspect-video flex items-center justify-center border border-border order-2 md:order-1">
              <BarChart3 className="w-24 h-24 text-primary/30" />
            </div>
            <div className="space-y-6 order-1 md:order-2">
              <h3 className="text-3xl font-bold">Real-time Dashboard Analytics</h3>
              <p className="text-lg text-muted-foreground">
                Visualize sentiment trends, topic distribution, and emerging patterns with beautiful, interactive charts.
              </p>
              <ul className="space-y-3">
                {[
                  "Interactive sentiment trend charts",
                  "Pie charts for sentiment distribution",
                  "Topic frequency analysis",
                  "Time-series sentiment tracking",
                  "Custom date range filtering",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-primary font-bold">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/dashboard">
                <Button className="bg-primary hover:bg-primary/90">View Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center">Why We're Different</h2>
          <p className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            FeedbackAI combines the best of manual analysis with the speed of AI to give you unmatched insights
          </p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 font-semibold">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold">FeedbackAI</th>
                  <th className="text-center py-4 px-6 font-semibold">Basic Tools</th>
                  <th className="text-center py-4 px-6 font-semibold">Manual Analysis</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Real-time Analysis", true, false, false],
                  ["AI Chat Interface", true, false, false],
                  ["Sentiment Detection", true, true, false],
                  ["Auto-categorization", true, false, false],
                  ["Collaboration Tools", true, false, false],
                  ["API Access", true, true, true],
                  ["Time to Insights", "Minutes", "Hours", "Days"],
                  ["Cost per Review", "$0.001", "$0.01", "$0.50"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-card/50">
                    <td className="py-4 px-6 font-medium">{row[0]}</td>
                    <td className="text-center py-4 px-6">
                      {typeof row[1] === 'boolean' ? (
                        row[1] ? <span className="text-primary font-bold">✓</span> : <span className="text-muted-foreground">—</span>
                      ) : (
                        <span className="text-primary font-bold">{row[1]}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-6">
                      {typeof row[2] === 'boolean' ? (
                        row[2] ? <span className="text-primary font-bold">✓</span> : <span className="text-muted-foreground">—</span>
                      ) : (
                        <span>{row[2]}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-6">
                      {typeof row[3] === 'boolean' ? (
                        row[3] ? <span className="text-primary font-bold">✓</span> : <span className="text-muted-foreground">—</span>
                      ) : (
                        <span>{row[3]}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-r from-primary/10 to-accent/10 border-t border-border">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to unlock your feedback insights?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of product teams using FeedbackAI to make smarter decisions
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>
      {}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 FeedbackAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
