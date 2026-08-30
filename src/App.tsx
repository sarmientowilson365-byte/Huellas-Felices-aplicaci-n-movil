import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './components/screens/SplashScreen';
import { AuthScreen } from './components/screens/AuthScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { ExploreScreen } from './components/screens/ExploreScreen';
import { PetDetailScreen } from './components/screens/PetDetailScreen';
import { ScheduleVisitScreen } from './components/screens/ScheduleVisitScreen';
import { AdoptionFormScreen } from './components/screens/AdoptionFormScreen';
import { ApplicationStatusScreen } from './components/screens/ApplicationStatusScreen';
import { FavoritesScreen } from './components/screens/FavoritesScreen';
import { VisitsScreen } from './components/screens/VisitsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';

import { BottomNav } from './components/layout/BottomNav';
import { FilterModal } from './components/modals/FilterModal';
import { AiAssistantModal } from './components/modals/AiAssistantModal';
import { AiRecommenderModal } from './components/modals/AiRecommenderModal';

const MainNavigator: React.FC = () => {
  const { currentScreen, toastMessage } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'auth':
        return <AuthScreen />;
      case 'home':
        return <HomeScreen />;
      case 'explore':
        return <ExploreScreen />;
      case 'pet_detail':
        return <PetDetailScreen />;
      case 'schedule_visit':
        return <ScheduleVisitScreen />;
      case 'adoption_form':
        return <AdoptionFormScreen />;
      case 'application_status':
        return <ApplicationStatusScreen />;
      case 'favorites':
        return <FavoritesScreen />;
      case 'visits':
        return <VisitsScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const showBottomNav = !['splash', 'auth'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center sm:py-6 sm:px-4 font-sans selection:bg-[#81C784] selection:text-[#263238]">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[780px] sm:h-[840px] sm:max-h-[92vh] bg-[#F8FAFC] sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col relative sm:border-[8px] sm:border-slate-800">
        {/* Dynamic Island / Status bar placeholder on larger screens */}
        <div className="hidden sm:flex items-center justify-between px-6 pt-3 pb-1 bg-transparent text-[11px] font-semibold text-slate-500 z-30 select-none">
          <span>9:41</span>
          <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5 text-slate-500">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Screen Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative flex flex-col">
          {renderScreen()}
        </main>

        {/* Persistent Bottom Nav */}
        {showBottomNav && <BottomNav />}

        {/* Modals */}
        <FilterModal />
        <AiAssistantModal />
        <AiRecommenderModal />

        {/* Global Toast Banner */}
        {toastMessage && (
          <div
            id="global-toast"
            className="fixed sm:absolute bottom-20 left-4 right-4 sm:left-6 sm:right-6 bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-xl z-50 text-xs font-medium border border-white/10 flex items-center justify-between animate-fade-in backdrop-blur-md"
          >
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainNavigator />
    </AppProvider>
  );
}
