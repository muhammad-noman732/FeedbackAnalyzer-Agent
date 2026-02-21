"use client";
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Brain,
} from "lucide-react";
import Link from 'next/link';
import { useAuthAnimation } from "@/hooks/useAuthAnimation";
import { useLoginForm } from "@/hooks/useLoginForm";

export default function LoginCardSection() {

  const canvasRef = useAuthAnimation();
  const { register, handleSubmit, errors, onSubmit, isLoading, error } = useLoginForm();
  const [showPassword, setShowPassword] = useState(false);


  return (
    <section className="min-h-screen bg-black text-zinc-50 overflow-y-auto overflow-x-hidden relative flex flex-col pt-24 pb-12">
      <style>{`
        .accent-lines{position:absolute;inset:0;pointer-events:none;opacity:.7}
        .hline,.vline{position:absolute;background:#27272a;will-change:transform,opacity}
        .hline{left:0;right:0;height:1px;transform:scaleX(0);transform-origin:50% 50%;animation:drawX .8s cubic-bezier(.22,.61,.36,1) forwards}
        .vline{top:0;bottom:0;width:1px;transform:scaleY(0);transform-origin:50% 0%;animation:drawY .9s cubic-bezier(.22,.61,.36,1) forwards}
        .hline:nth-child(1){top:18%;animation-delay:.12s}
        .hline:nth-child(2){top:50%;animation-delay:.22s}
        .hline:nth-child(3){top:82%;animation-delay:.32s}
        .vline:nth-child(4){left:22%;animation-delay:.42s}
        .vline:nth-child(5){left:50%;animation-delay:.54s}
        .vline:nth-child(6){left:78%;animation-delay:.66s}
        .hline::after,.vline::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(250,250,250,.24),transparent);opacity:0;animation:shimmer .9s ease-out forwards}
        .hline:nth-child(1)::after{animation-delay:.12s}
        .hline:nth-child(2)::after{animation-delay:.22s}
        .hline:nth-child(3)::after{animation-delay:.32s}
        .vline:nth-child(4)::after{animation-delay:.42s}
        .vline:nth-child(5)::after{animation-delay:.54s}
        .vline:nth-child(6)::after{animation-delay:.66s}
        @keyframes drawX{0%{transform:scaleX(0);opacity:0}60%{opacity:.95}100%{transform:scaleX(1);opacity:.7}}
        @keyframes drawY{0%{transform:scaleY(0);opacity:0}60%{opacity:.95}100%{transform:scaleY(1);opacity:.7}}
        @keyframes shimmer{0%{opacity:0}35%{opacity:.25}100%{opacity:0}}
        .card-animate {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.8s cubic-bezier(.22,.61,.36,1) 0.4s forwards;
        }
        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      { }
      <div className="fixed inset-0 pointer-events-none [background:radial-gradient(80%_60%_at_50%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
      { }
      <div className="accent-lines fixed">
        <div className="hline" />
        <div className="hline" />
        <div className="hline" />
        <div className="vline" />
        <div className="vline" />
        <div className="vline" />
      </div>
      { }
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full opacity-50 mix-blend-screen pointer-events-none"
      />
      { }
      <header className="fixed left-0 right-0 top-0 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/50 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-white text-black flex items-center justify-center">
            <Brain className="h-4 w-4" />
          </div>
          <span className="font-semibold tracking-tight text-sm text-white">FeedbackAI</span>
        </Link>
      </header>
      { }
      <div className="flex-1 w-full flex items-center justify-center px-4 relative z-10">
        <Card className="card-animate w-full max-w-sm border-white/10 bg-zinc-900/40 backdrop-blur-md supports-[backdrop-filter]:bg-zinc-900/30 my-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-white">Welcome back</CardTitle>
            <CardDescription className="text-zinc-400">
              Sign in to your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="grid gap-5">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-zinc-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    className="pl-10 bg-zinc-950/50 border-white/10 text-zinc-50 placeholder:text-zinc-600 focus-visible:ring-white/20"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-zinc-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className="pl-10 pr-10 bg-zinc-950/50 border-white/10 text-zinc-50 placeholder:text-zinc-600 focus-visible:ring-white/20"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-zinc-400 hover:text-zinc-200"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400">{errors.password.message}</p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 rounded-lg bg-white text-black hover:bg-zinc-200 font-medium disabled:opacity-50 mt-2"
              >
                {isLoading ? "Signing in..." : "Continue"}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex items-center justify-center text-sm text-zinc-400">
            Don&apos;t have an account?
            <Link className="ml-1 text-white hover:underline" href="/signup">
              Create one
            </Link>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
