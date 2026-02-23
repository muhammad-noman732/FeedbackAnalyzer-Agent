'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, Brain, CheckCircle2, ChevronRight, MessageSquare, Shield, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { FeatureCard } from '@/components/ui/feature-card';
export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-white selection:text-black">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <FeatureBento />
        <IntegrationSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

import { useNavbarScroll } from '@/hooks/useNavbarScroll';

function Navbar() {
  const scrolled = useNavbarScroll(20);

  return (
    <header className={cn(
      "fixed top-0 z-50 w-full transition-all duration-300 border-b border-white/0",
      scrolled && "bg-black/50 backdrop-blur-xl border-white/5"
    )}>
      <div className="container mx-auto flex h-14 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="h-6 w-6 rounded bg-white text-black flex items-center justify-center">
            <Brain className="h-4 w-4" />
          </div>
          <span className="tracking-tight text-sm">FeedbackAI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#about" className="hover:text-white transition-colors">About</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:block">Log in</Link>
          <Button asChild size="sm" className="bg-white text-black hover:bg-zinc-200 rounded-full h-8 px-4 text-xs font-medium">
            <Link href="/signup">Join Now</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-white/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400 mb-8 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          v2.0 is now available
          <ChevronRight className="h-3 w-3 text-zinc-500" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto max-w-4xl text-5xl md:text-7xl font-semibold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-6"
        >
          Turn feedback into <br />
          <span className="text-white">product strategy.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-xl text-lg text-zinc-400 mb-10 leading-relaxed"
        >
          Stop drowning in scattered reviews. We use AI to categorize, sentiment-check, and prioritize user feedback instantly.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="h-12 rounded-full px-8 text-sm font-medium bg-white text-black hover:bg-zinc-200">
            <Link href="/signup">Sign Up <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 rounded-full px-8 text-sm font-medium border-white/10 bg-transparent text-white hover:bg-white/5">
            <Link href="#features">View Documentation</Link>
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, type: "spring", bounce: 0 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-2 backdrop-blur-md shadow-2xl">
            <div className="rounded-lg overflow-hidden border border-white/5 bg-black relative aspect-[16/9]">
              <img src="/dashboard_analytics_mockup.png" alt="App Interface" className="w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function StatsSection() {
  const brands = ['Acme Inc', 'Linear', 'Raycast', 'Vercel', 'OpenAI', 'Midjourney', 'Anthropic', 'Supabase'];
  return (
    <section className="py-10 bg-black overflow-hidden border-b border-white/5">
      <div className="flex w-full">
        <div className="flex flex-nowrap animate-infinite-scroll gap-16 md:gap-32 px-16">
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <div key={i} className="flex items-center justify-center gap-3 text-zinc-600 uppercase text-xs font-mono tracking-widest whitespace-nowrap hover:text-white transition-colors cursor-default">
              <div className="w-2 h-2 rounded-full bg-current opacity-50" /> {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureBento() {
  const features = [
    {
      title: "Sentiment Analysis",
      desc: "Real-time sentiment tracking across all channels. Detect patterns early.",
      icon: TrendingUp,
      className: ""
    },
    {
      title: "Smart Tagging",
      desc: "Auto-categorization powered by state-of-the-art LLMs.",
      icon: Brain,
      className: ""
    },
    {
      title: "Real-time Alerts",
      desc: "Get notified via Slack for urgent issues instantly.",
      icon: Zap,
      className: ""
    },
    {
      title: "Secure by Design",
      desc: "SOC2 Type II Ready. Encrypted at rest and in transit.",
      icon: Shield,
      className: ""
    },
    {
      title: "Team Collaboration",
      desc: "Comment, tag, and resolve feedback items together.",
      icon: MessageSquare,
      className: ""
    },
    {
      title: "Custom API",
      desc: "Export data to your warehouse or build custom integrations easily.",
      icon: Sparkles,
      className: ""
    }
  ];
  return (
    <section id="features" className="py-32 bg-black">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-6 text-white">Everything you need to <br />understand your users.</h2>
          <p className="text-zinc-400 max-w-lg text-lg">Beautifully designed tools to help you uncover insights from noise.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FeatureCard
              key={i}
              className={f.className}
              feature={{
                title: f.title,
                description: f.desc,
                icon: f.icon
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function IntegrationSection() {
  return (
    <section className="py-24 border-t border-white/5">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold tracking-tight mb-16">Connects with your favorite tools</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {['Slack', 'Discord', 'Jira', 'Linear', 'Intercom', 'Zendesk'].map((tool, i) => (
            <div key={i} className="px-6 py-3 rounded-full border border-white/10 bg-zinc-900/30 text-zinc-300 text-sm hover:border-white/20 hover:bg-zinc-800 transition-all cursor-default">
              {tool}
            </div>
          ))}
          <div className="px-6 py-3 rounded-full border border-dashed border-white/10 text-zinc-500 text-sm">
            + Custom API
          </div>
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      { }
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-500/10 to-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-8">Ready to build better products?</h2>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="rounded-full h-12 px-8 bg-white text-black hover:bg-zinc-200 font-medium">
            <Link href="/signup">Join Now</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-16 bg-black text-sm">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-xs">
          <div className="flex items-center gap-2 font-semibold text-white mb-4">
            <Brain className="h-5 w-5" /> FeedbackAI
          </div>
          <p className="text-zinc-500 leading-relaxed">
            Constructed for modern product teams who care about their users.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
          <div className="flex flex-col gap-3">
            <h4 className="font-medium text-white">Product</h4>
            <Link href="#" className="text-zinc-500 hover:text-white transition-colors">Features</Link>
            <Link href="#" className="text-zinc-500 hover:text-white transition-colors">Changelog</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-medium text-white">Company</h4>
            <Link href="#" className="text-zinc-500 hover:text-white transition-colors">About</Link>
            <Link href="#" className="text-zinc-500 hover:text-white transition-colors">Careers</Link>
            <Link href="#" className="text-zinc-500 hover:text-white transition-colors">Legal</Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-zinc-600 flex justify-between items-center">
        <p>&copy; 2024 FeedbackAI Inc.</p>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-zinc-400">Twitter</Link>
          <Link href="#" className="hover:text-zinc-400">GitHub</Link>
        </div>
      </div>
    </footer>
  )
}
