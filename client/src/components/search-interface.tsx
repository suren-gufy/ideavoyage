import { useState } from "react"
import { Search, Filter, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function SearchInterface() {
  const [query, setQuery] = useState("")
  const [subreddits, setSubreddits] = useState<string[]>([])
  const [newSubreddit, setNewSubreddit] = useState("")
  const [timeRange, setTimeRange] = useState("week")
  const [isSearching, setIsSearching] = useState(false)

  // todo: remove mock functionality - popular subreddits
  const popularSubreddits = [
    "entrepreneur", "startups", "SaaS", "webdev", "marketing", 
    "productivity", "personalfinance", "investing", "technology"
  ]

  const handleAddSubreddit = () => {
    if (newSubreddit.trim() && !subreddits.includes(newSubreddit.trim())) {
      setSubreddits([...subreddits, newSubreddit.trim()])
      setNewSubreddit("")
    }
  }

  const handleRemoveSubreddit = (subreddit: string) => {
    setSubreddits(subreddits.filter(s => s !== subreddit))
  }

  const handleSearch = () => {
    if (!query.trim()) return
    
    setIsSearching(true)
    console.log('Search triggered', { query, subreddits, timeRange })
    
    // todo: remove mock functionality - simulate search
    setTimeout(() => {
      setIsSearching(false)
    }, 2000)
  }

  const handleQuickAdd = (subreddit: string) => {
    if (!subreddits.includes(subreddit)) {
      setSubreddits([...subreddits, subreddit])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Reddit Discussions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Topic or Keywords</label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. 'budgeting apps', 'productivity tools', 'meal planning'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              data-testid="input-search-query"
              className="flex-1"
            />
            <Button 
              onClick={handleSearch}
              disabled={!query.trim() || isSearching}
              data-testid="button-search"
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Target Subreddits</label>
            <Button variant="ghost" size="sm" data-testid="button-filters">
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Add subreddit (without r/)"
              value={newSubreddit}
              onChange={(e) => setNewSubreddit(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddSubreddit()}
              data-testid="input-subreddit"
              className="flex-1"
            />
            <Button 
              onClick={handleAddSubreddit}
              size="icon"
              variant="outline"
              data-testid="button-add-subreddit"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {subreddits.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {subreddits.map((subreddit) => (
                <Badge
                  key={subreddit}
                  variant="secondary"
                  className="cursor-pointer hover-elevate"
                  onClick={() => handleRemoveSubreddit(subreddit)}
                  data-testid={`badge-subreddit-${subreddit}`}
                >
                  r/{subreddit} ×
                </Badge>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Popular subreddits:</p>
            <div className="flex flex-wrap gap-2">
              {popularSubreddits.map((subreddit) => (
                <Badge
                  key={subreddit}
                  variant="outline"
                  className="cursor-pointer hover-elevate"
                  onClick={() => handleQuickAdd(subreddit)}
                  data-testid={`badge-popular-${subreddit}`}
                >
                  r/{subreddit}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <label className="text-sm font-medium">Time Range</label>
          <div className="flex gap-2">
            {["day", "week", "month", "year", "all"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
                data-testid={`button-timerange-${range}`}
              >
                {range === "all" ? "All Time" : `Past ${range}`}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}