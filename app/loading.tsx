import { Loader2, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <section className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
      <div className="flex flex-col items-center gap-4">
        {/* Animated loader with backdrop */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
          <div className="relative flex items-center justify-center w-12 h-12 rounded-full border border-border bg-background/50 backdrop-blur-sm">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        </div>
        
        {/* Loading text */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-3 w-3 text-primary animate-pulse" />
          <span>Loading...</span>
        </div>
      </div>
    </section>
  );
}
