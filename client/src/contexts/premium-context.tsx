/// <reference types="vite/client" />
import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface PremiumContextType {
  isPremium: boolean;
  isDevelopment: boolean;
  upgradeToPremium: () => void;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (show: boolean) => void;
  setDevPremiumOverride: (forceNonPremium: boolean) => void;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  // Environment-based premium access - true for development, false for production
  const isDevelopment = import.meta.env.MODE === 'development';
  const [isPremium, setIsPremium] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { toast } = useToast();

  const upgradeToPremium = () => {
    console.log('📦 upgradeToPremium called!', { isDevelopment, currentIsPremium: isPremium });
    
    // Only allow upgrade in development mode
    if (!isDevelopment) {
      console.warn('Premium upgrade blocked in production - requires payment flow');
      setShowUpgradeModal(false);
      return;
    }
    
    console.log('💾 Setting premium access...');
    // For development - instant premium access without payment
    setIsPremium(true);
    setShowUpgradeModal(false);
    localStorage.setItem('premium_access', 'true');
    console.log('✅ Premium access granted!', { newPremiumStatus: true });
    
    // Show success notification
    toast({
      title: '🚀 Premium Activated!',
      description: 'You now have access to all premium features. Scroll down to see your unlocked content.',
      duration: 5000
    });
  };

  const setDevPremiumOverride = (forceNonPremium: boolean) => {
    localStorage.setItem('force_non_premium', forceNonPremium.toString());
    // Recalculate premium status
    const premiumAccess = localStorage.getItem('premium_access');
    const forceNonPremiumFlag = localStorage.getItem('force_non_premium') === 'true';
    
    if (forceNonPremiumFlag) {
      setIsPremium(false);
    } else if (isDevelopment || premiumAccess === 'true') {
      setIsPremium(true);
    } else {
      setIsPremium(false);
    }
  };

  // Fetch premium status from server in production
  const { data: serverPremiumStatus } = useQuery({
    queryKey: ['premium-status'],
    queryFn: async () => {
      const response = await fetch('/api/premium-status');
      if (!response.ok) throw new Error('Failed to fetch premium status');
      return response.json();
    },
    enabled: !isDevelopment,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    console.log('🔍 Premium Context - isDevelopment:', isDevelopment);
    console.log('🔍 Premium Context - import.meta.env.MODE:', import.meta.env.MODE);
    console.log('🔍 Premium Context - serverPremiumStatus:', serverPremiumStatus);
    
    if (isDevelopment) {
      // In development, grant premium access automatically for easier testing
      const forceNonPremium = localStorage.getItem('force_non_premium') === 'true';
      console.log('🔍 Premium Context - forceNonPremium:', forceNonPremium);
      
      if (forceNonPremium) {
        console.log('❌ Premium Context - Force non-premium flag set');
        setIsPremium(false);
      } else {
        console.log('✅ Premium Context - Auto-granting premium in development');
        setIsPremium(true); // Auto-grant premium in development
        localStorage.setItem('premium_access', 'true');
      }
    } else {
      // In production, trust server response only
      console.log('🏭 Premium Context - In production mode, using server response');
      if (serverPremiumStatus) {
        setIsPremium(serverPremiumStatus.isPremium || false);
      }
    }
  }, [isDevelopment, serverPremiumStatus]);

  return (
    <PremiumContext.Provider value={{
      isPremium,
      isDevelopment,
      upgradeToPremium,
      showUpgradeModal,
      setShowUpgradeModal,
      setDevPremiumOverride
    }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
}