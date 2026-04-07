import { TrendingUp, Brain, Zap, Shield, MessageSquare, Sparkles } from 'lucide-react';

export const BRANDS = [
    'Acme Inc', 'Linear', 'Raycast', 'Vercel', 'OpenAI', 'Midjourney', 'Anthropic', 'Supabase'
];

export const FEATURES = [
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

export const INTEGRATIONS = [
    'Slack', 'Discord', 'Jira', 'Linear', 'Intercom', 'Zendesk'
];
