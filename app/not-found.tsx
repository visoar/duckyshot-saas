import { Home, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "next-view-transitions";
import { Button } from "@/components/ui/button";
import { BackgroundPattern } from "@/components/ui/background-pattern";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      <BackgroundPattern />
      
      <div className="relative mx-auto max-w-2xl px-6 text-center">
        {/* Status Badge */}
        <div className="mb-8 inline-flex items-center rounded-full border border-border bg-background/50 px-3 py-1 text-sm backdrop-blur-sm">
          <Sparkles className="mr-2 h-3 w-3 text-primary" />
          <span className="text-muted-foreground">Error 404</span>
        </div>

        {/* Large 404 Display */}
        <div className="mb-6">
          <h1 className="text-8xl sm:text-9xl font-bold tracking-tight text-primary/20 select-none">
            404
          </h1>
        </div>

        {/* Main Message */}
        <div className="space-y-4 mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. 
            Let&apos;s get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="min-w-[160px]">
            <Link href="/dashboard" prefetch={true}>
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="min-w-[160px]">
            <Link href="/" prefetch={true}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-12 text-sm text-muted-foreground">
          <p>Need help? <Link href="/contact" className="text-primary hover:underline">Contact our support team</Link></p>
        </div>
      </div>
    </main>
  );
}
