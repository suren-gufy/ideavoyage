import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Brain, Activity } from "lucide-react"
import type { ICP } from "@shared/schema"

interface ICPDisplayProps {
  icp: ICP
}

export function ICPDisplay({ icp }: ICPDisplayProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3" data-testid="icp-section">
      {/* Demographics */}
      <Card className="hover-elevate" data-testid="icp-demographics">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Demographics</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <span className="text-sm font-medium text-muted-foreground">Age Range</span>
            <p className="text-sm" data-testid="icp-age-range">{icp.demographics.age_range}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Gender</span>
            <p className="text-sm" data-testid="icp-gender">{icp.demographics.gender}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Income Level</span>
            <p className="text-sm" data-testid="icp-income">{icp.demographics.income_level}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Education</span>
            <p className="text-sm" data-testid="icp-education">{icp.demographics.education}</p>
          </div>
        </CardContent>
      </Card>

      {/* Psychographics */}
      <Card className="hover-elevate" data-testid="icp-psychographics">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Psychographics</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <span className="text-sm font-medium text-muted-foreground">Interests</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {icp.psychographics.interests.map((interest, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs"
                  data-testid={`icp-interest-${index}`}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Values</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {icp.psychographics.values.map((value, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs"
                  data-testid={`icp-value-${index}`}
                >
                  {value}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Lifestyle</span>
            <p className="text-sm" data-testid="icp-lifestyle">{icp.psychographics.lifestyle}</p>
          </div>
        </CardContent>
      </Card>

      {/* Behavioral */}
      <Card className="hover-elevate" data-testid="icp-behavioral">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Behavioral</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <span className="text-sm font-medium text-muted-foreground">Pain Points</span>
            <div className="space-y-1 mt-1">
              {icp.behavioral.pain_points.map((painPoint, index) => (
                <p 
                  key={index} 
                  className="text-xs text-muted-foreground"
                  data-testid={`icp-pain-point-${index}`}
                >
                  • {painPoint}
                </p>
              ))}
            </div>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Preferred Channels</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {icp.behavioral.preferred_channels.map((channel, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs"
                  data-testid={`icp-channel-${index}`}
                >
                  {channel}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Buying Behavior</span>
            <p className="text-sm" data-testid="icp-buying-behavior">{icp.behavioral.buying_behavior}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}