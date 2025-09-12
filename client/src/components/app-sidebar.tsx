import { BarChart3, Search, TrendingUp, MessageSquare, Lightbulb, History } from "lucide-react"
import { Link, useLocation } from "wouter"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

// Menu items
const items = [
  {
    title: "Search",
    url: "/",
    icon: Search,
    description: "Search Reddit topics"
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    description: "View sentiment analysis"
  },
  {
    title: "Trends",
    url: "/trends", 
    icon: TrendingUp,
    description: "Discover trending topics"
  },
  {
    title: "Pain Points",
    url: "/pain-points",
    icon: MessageSquare,
    description: "Analyze user problems"
  },
  {
    title: "App Ideas",
    url: "/ideas",
    icon: Lightbulb,
    description: "Generated solutions"
  },
  {
    title: "History",
    url: "/history",
    icon: History,
    description: "Past searches"
  },
]

export function AppSidebar() {
  const [location] = useLocation()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Idea Validator</h2>
            <p className="text-xs text-muted-foreground">Reddit Research Tool</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase()}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="text-xs text-muted-foreground">
          <p>Powered by AI</p>
          <p>Real-time Reddit analysis</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}