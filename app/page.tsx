import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Presentation, Eye, Settings, Text, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Slide Presentation
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Create beautiful, interactive slide presentations directly in your browser and data save localStorage
          </p>
        </div>

        {/* Donation Button */}
        <div className="flex justify-center">
          <Card className="hover:shadow-lg transition-shadow border-primary/50">
            <CardContent className="pt-2 cursor-pointer">
              <a
                href="https://kreate.gg/mohabrorilhuda"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-primary hover:text-primary/80 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <div>
                  <div className="font-semibold">Support This Project</div>
                  <div className="text-sm text-muted-foreground">Buy me a coffee</div>
                </div>
              </a>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Admin Dashboard
              </CardTitle>
              <CardDescription>
                Create and manage your slides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/login">
                <Button className="w-full cursor-pointer" size="lg">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login to Admin
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                View Slides
              </CardTitle>
              <CardDescription>
                Watch your presentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/s/1">
                <Button variant="outline" className="w-full cursor-pointer" size="lg">
                  Open Slide Viewer
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Presentation className="w-5 h-5" />
                Presenter Mode
              </CardTitle>
              <CardDescription>
                Present with notes and timer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/presenter">
                <Button variant="outline" className="w-full cursor-pointer" size="lg">
                  Open Presenter View
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Text className="w-5 h-5" />
                Teleprompter Tool
              </CardTitle>
              <CardDescription>
                teleprompter with presentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/teleprompter">
                <Button variant="outline" className="w-full cursor-pointer" size="lg">
                  Open Teleprompter View
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Parafrase AI
              </CardTitle>
              <CardDescription>
                Parafrase teks dengan Google Gemini AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/parafrase">
                <Button variant="outline" className="w-full cursor-pointer" size="lg">
                  Open Parafrase Tool
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Documentation
              </CardTitle>
              <CardDescription>
                Learn how to use the app
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a href="https://github.com/abrorilhuda/presentasion" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full cursor-pointer" size="lg">
                  View on GitHub
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Built with Next.js, React, and TypeScript by <a href="https://github.com/abrorilhuda" className="underline hover:text-foreground" target="_blank" rel="noopener noreferrer">abrordc</a></p>
        </div>
      </div>
    </main>
  );
}
