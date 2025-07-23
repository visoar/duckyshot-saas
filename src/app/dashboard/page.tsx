import React, { Suspense } from "react";
import { DashboardPageWrapper } from "./_components/dashboard-page-wrapper";
import { createMetadata } from "@/lib/metadata";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Palette,
  Heart,
  Sparkles,
  Zap,
  ImageIcon,
  Camera,
  Star,
  Images,
  CreditCard,
  Settings,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/permissions";
import { UserCreditsService } from "@/lib/database/ai";
import { AIArtworkService } from "@/lib/database/ai";

export const metadata = createMetadata({
  title: "Dashboard",
  description: "AI Pet Artwork Studio - Create amazing art from your pet photos",
});

async function DashboardStats({ userId }: { userId: string }) {
  const [userCredits, artworkStats] = await Promise.all([
    UserCreditsService.getUserCredits(userId),
    AIArtworkService.getUserArtworkStats(userId),
  ]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
          <Zap className="text-primary h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userCredits.remainingCredits}</div>
          <p className="text-muted-foreground text-xs">
            {userCredits.usedCredits} credits used total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Artworks Created</CardTitle>
          <ImageIcon className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{artworkStats.totalArtworks}</div>
          <p className="text-muted-foreground text-xs">
            {artworkStats.publicArtworks} public artworks
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Favorite Styles</CardTitle>
          <Palette className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{artworkStats.favoriteStyles.length}</div>
          <p className="text-muted-foreground text-xs">
            Most used: {artworkStats.favoriteStyles[0] || 'None yet'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gallery Likes</CardTitle>
          <Heart className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{artworkStats.totalLikes}</div>
          <p className="text-muted-foreground text-xs">
            {artworkStats.recentLikes} likes this week
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }

  return (
    <DashboardPageWrapper 
      title="AI Pet Studio" 
      description="Transform your pet photos into stunning artwork with AI-powered art generation"
    >
      {/* Welcome Section */}
      <div className="from-primary/5 via-primary/10 to-primary/5 relative overflow-hidden rounded-lg border bg-gradient-to-r p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.03),transparent_50%)]" />
        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="text-primary h-5 w-5" />
            <Badge variant="secondary" className="text-xs">
              Welcome Back
            </Badge>
          </div>
          <h1 className="text-foreground mb-2 text-2xl font-bold">
            Ready to create amazing pet art? 🎨
          </h1>
          <p className="text-muted-foreground mb-4">
            Transform your pet photos into stunning artwork with AI. Choose from 15+ artistic styles
            and bring your furry friends to life in ways you&apos;ve never imagined.
          </p>
          <div className="flex gap-3">
            <Button asChild size="sm" className="gap-2">
              <Link href="/ai-studio">
                <Camera className="h-4 w-4" />
                Create Artwork
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link href="/gallery">
                <Images className="h-4 w-4" />
                Browse Gallery
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <Suspense fallback={
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-24" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 mb-2" />
                <div className="h-3 bg-muted rounded w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      }>
        <DashboardStats userId={user.id} />
      </Suspense>

      {/* Admin Panel Access - Only for admin users */}
      {(user.role === "admin" || user.role === "super_admin") && (
        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <Shield className="h-5 w-5" />
              Admin Panel
            </CardTitle>
            <CardDescription>
              Manage platform settings, users, and monitor system performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link href="/dashboard/admin">
                  <Settings className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link href="/dashboard/admin/users">
                  <Shield className="h-4 w-4" />
                  User Management
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="text-primary h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Get started with creating your first AI pet artwork
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button asChild variant="outline" className="justify-start gap-2">
                <Link href="/ai-studio">
                  <Camera className="h-4 w-4" />
                  Upload Pet Photo
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start gap-2">
                <Link href="/ai-studio">
                  <Palette className="h-4 w-4" />
                  Explore Art Styles
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start gap-2">
                <Link href="/artworks">
                  <ImageIcon className="h-4 w-4" />
                  My Artworks
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start gap-2">
                <Link href="/dashboard/settings">
                  <CreditCard className="h-4 w-4" />
                  Buy More Credits
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="text-primary h-5 w-5" />
              Featured Styles
            </CardTitle>
            <CardDescription>Popular art styles this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-8 w-8 rounded-full flex items-center justify-center">
                  🎨
                </div>
                <div className="flex-1">
                  <span className="font-medium">Oil Painting</span>
                  <p className="text-muted-foreground text-xs">Classic artistic style</p>
                </div>
                <Badge variant="secondary">Popular</Badge>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-8 w-8 rounded-full flex items-center justify-center">
                  🌸
                </div>
                <div className="flex-1">
                  <span className="font-medium">Anime Style</span>
                  <p className="text-muted-foreground text-xs">Japanese animation inspired</p>
                </div>
                <Badge variant="secondary">Trending</Badge>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-8 w-8 rounded-full flex items-center justify-center">
                  🎭
                </div>
                <div className="flex-1">
                  <span className="font-medium">Van Gogh</span>
                  <p className="text-muted-foreground text-xs">Post-impressionist masterpiece</p>
                </div>
                <Badge variant="secondary">Classic</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageWrapper>
  );
}
