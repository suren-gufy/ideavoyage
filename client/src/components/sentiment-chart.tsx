import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export function SentimentChart() {
  // todo: remove mock functionality - sentiment data
  const sentimentData = [
    { name: "Positive", value: 45, color: "hsl(var(--chart-2))" },
    { name: "Neutral", value: 35, color: "hsl(var(--chart-3))" },
    { name: "Negative", value: 20, color: "hsl(var(--destructive))" },
  ]

  const timelineData = [
    { time: "Jan", positive: 42, negative: 18, neutral: 40 },
    { time: "Feb", positive: 48, negative: 15, neutral: 37 },
    { time: "Mar", positive: 45, negative: 20, neutral: 35 },
    { time: "Apr", positive: 52, negative: 12, neutral: 36 },
    { time: "May", positive: 46, negative: 19, neutral: 35 },
    { time: "Jun", positive: 49, negative: 16, neutral: 35 },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-popover-border rounded-md p-3 shadow-md">
          <p className="font-medium">{`${label}: ${payload[0].value}%`}</p>
        </div>
      )
    }
    return null
  }

  const renderSentimentIcon = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-chart-2" />
      case "negative":
        return <TrendingDown className="h-4 w-4 text-destructive" />
      default:
        return <Minus className="h-4 w-4 text-chart-3" />
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {sentimentData.map((item) => (
              <div 
                key={item.name} 
                className="flex items-center gap-2"
                data-testid={`sentiment-${item.name.toLowerCase()}`}
              >
                {renderSentimentIcon(item.name)}
                <span className="text-sm">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sentiment Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="timeline" data-testid="tab-timeline">Timeline</TabsTrigger>
              <TabsTrigger value="breakdown" data-testid="tab-breakdown">Breakdown</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline">
              <div className="h-[250px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="positive" stackId="a" fill="hsl(var(--chart-2))" />
                    <Bar dataKey="neutral" stackId="a" fill="hsl(var(--chart-3))" />
                    <Bar dataKey="negative" stackId="a" fill="hsl(var(--destructive))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="breakdown">
              <div className="space-y-4 mt-4">
                {sentimentData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {renderSentimentIcon(item.name)}
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{item.value}%</div>
                      <div className="text-sm text-muted-foreground">
                        {Math.floor((item.value / 100) * 2847)} posts
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}