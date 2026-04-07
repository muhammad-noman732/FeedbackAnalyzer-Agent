import { TrendingUp, MessageSquare, Lightbulb } from 'lucide-react';

export const SIDEBAR_ITEMS = [
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'chat', label: 'Chat & Upload', icon: MessageSquare },
    { id: 'insights', label: 'Strategic Roadmap', icon: Lightbulb },
] as const;
