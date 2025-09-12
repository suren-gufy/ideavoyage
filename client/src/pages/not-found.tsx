import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or may have been moved.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 justify-center">
            <Button asChild data-testid="button-home">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" asChild data-testid="button-search">
              <Link href="/">
                <Search className="h-4 w-4 mr-2" />
                Start Search
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
