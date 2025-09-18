import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { PremiumProvider } from "@/contexts/premium-context";
import { UpgradeModal } from "@/components/upgrade-modal";
import Dashboard from "@/pages/dashboard";
import Results from "@/pages/results";
import PremiumResults from "@/pages/premium-results";
import Analytics from "@/pages/analytics";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/results" component={Results} />
      <Route path="/premium-results" component={PremiumResults} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/trends" component={Dashboard} />
      <Route path="/pain-points" component={Dashboard} />
      <Route path="/ideas" component={Dashboard} />
      <Route path="/history" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <PremiumProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-background">
              <main className="p-6 max-w-6xl mx-auto w-full">
                <Router />
              </main>
            </div>
            <UpgradeModal />
            <Toaster />
          </TooltipProvider>
        </PremiumProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;