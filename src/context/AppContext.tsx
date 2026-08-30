import React, { createContext, useContext, useState, useEffect } from 'react';
import { Pet, FilterCriteria, AdoptionApplication, ShelterVisit, UserProfile, AppScreen, ApplicationStage } from '../types';
import { MOCK_PETS } from '../data/mockPets';
import { INITIAL_USER, INITIAL_APPLICATIONS, INITIAL_VISITS } from '../data/initialData';
import confetti from 'canvas-confetti';

interface AppContextType {
  pets: Pet[];
  user: UserProfile;
  applications: AdoptionApplication[];
  visits: ShelterVisit[];
  currentScreen: AppScreen;
  previousScreen: AppScreen;
  activePet: Pet | null;
  activeApplication: AdoptionApplication | null;
  activeFilter: FilterCriteria;
  filterModalOpen: boolean;
  aiAssistantOpen: boolean;
  aiRecommenderOpen: boolean;
  isDeviceFrame: boolean;
  toastMessage: string | null;
  navigateTo: (screen: AppScreen, pet?: Pet | null, application?: AdoptionApplication | null) => void;
  goBack: () => void;
  toggleFavorite: (petId: string) => void;
  likePet: (petId: string) => void;
  passPet: (petId: string) => void;
  resetSwipes: () => void;
  setFilter: (filters: Partial<FilterCriteria>) => void;
  resetFilters: () => void;
  setFilterModalOpen: (open: boolean) => void;
  setAiAssistantOpen: (open: boolean) => void;
  setAiRecommenderOpen: (open: boolean) => void;
  setIsDeviceFrame: (val: boolean) => void;
  addVisit: (visit: Omit<ShelterVisit, 'id' | 'passCode' | 'status'>) => ShelterVisit;
  addApplication: (appData: Omit<AdoptionApplication, 'id' | 'submittedDate' | 'currentStage' | 'timelineHistory'>) => AdoptionApplication;
  updateApplicationStage: (appId: string, stage: ApplicationStage) => void;
  makeDonation: (amount: number) => void;
  showToast: (msg: string) => void;
  loginUser: (email: string) => void;
  logoutUser: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pets] = useState<Pet[]>(MOCK_PETS);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [applications, setApplications] = useState<AdoptionApplication[]>(INITIAL_APPLICATIONS);
  const [visits, setVisits] = useState<ShelterVisit[]>(INITIAL_VISITS);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [previousScreen, setPreviousScreen] = useState<AppScreen>('home');
  const [activePet, setActivePet] = useState<Pet | null>(MOCK_PETS[0]);
  const [activeApplication, setActiveApplication] = useState<AdoptionApplication | null>(INITIAL_APPLICATIONS[0]);
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState<boolean>(false);
  const [aiRecommenderOpen, setAiRecommenderOpen] = useState<boolean>(false);
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [activeFilter, setActiveFilter] = useState<FilterCriteria>({
    species: 'Todos',
    ageGroup: 'Todos',
    size: 'Todos',
    energyLevel: 'Todos',
    gender: 'Todos',
    vaccinated: null,
    goodWithKids: null,
    goodWithPets: null,
    searchQuery: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const navigateTo = (screen: AppScreen, pet?: Pet | null, application?: AdoptionApplication | null) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
    if (pet !== undefined) setActivePet(pet);
    if (application !== undefined) setActiveApplication(application);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (currentScreen === 'splash' || currentScreen === 'auth') return;
    if (['pet_detail', 'schedule_visit', 'adoption_form', 'application_status'].includes(currentScreen)) {
      setCurrentScreen(previousScreen || 'home');
    } else {
      setCurrentScreen('home');
    }
  };

  const toggleFavorite = (petId: string) => {
    setUser((prev) => {
      const isFav = prev.savedFavorites.includes(petId);
      const updatedFavs = isFav
        ? prev.savedFavorites.filter((id) => id !== petId)
        : [...prev.savedFavorites, petId];
      
      const pet = pets.find((p) => p.id === petId);
      if (!isFav && pet) {
        showToast(`❤️ ¡${pet.name} añadido a tus favoritos!`);
      } else if (pet) {
        showToast(`Eliminado de favoritos`);
      }
      return { ...prev, savedFavorites: updatedFavs };
    });
  };

  const likePet = (petId: string) => {
    setUser((prev) => {
      const alreadyLiked = prev.likedPets.includes(petId);
      const isFav = prev.savedFavorites.includes(petId);
      const newFavs = isFav ? prev.savedFavorites : [...prev.savedFavorites, petId];
      return {
        ...prev,
        likedPets: alreadyLiked ? prev.likedPets : [...prev.likedPets, petId],
        savedFavorites: newFavs,
      };
    });

    const pet = pets.find((p) => p.id === petId);
    if (pet) {
      // Trigger festive confetti
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4CAF50', '#81C784', '#FFD54F', '#FF7043'],
      });
      showToast(`✨ ¡Guardaste a ${pet.name}! Disponible en Favoritos`);
    }
  };

  const passPet = (petId: string) => {
    setUser((prev) => ({
      ...prev,
      passedPets: prev.passedPets.includes(petId) ? prev.passedPets : [...prev.passedPets, petId],
    }));
  };

  const resetSwipes = () => {
    setUser((prev) => ({
      ...prev,
      passedPets: [],
    }));
    showToast('🔄 Explorador reiniciado');
  };

  const setFilter = (filters: Partial<FilterCriteria>) => {
    setActiveFilter((prev) => ({ ...prev, ...filters }));
  };

  const resetFilters = () => {
    setActiveFilter({
      species: 'Todos',
      ageGroup: 'Todos',
      size: 'Todos',
      energyLevel: 'Todos',
      gender: 'Todos',
      vaccinated: null,
      goodWithKids: null,
      goodWithPets: null,
      searchQuery: '',
    });
    showToast('Filtros restablecidos');
  };

  const addVisit = (visitData: Omit<ShelterVisit, 'id' | 'passCode' | 'status'>): ShelterVisit => {
    const randomPass = 'HF-' + Math.floor(1000 + Math.random() * 9000);
    const newVisit: ShelterVisit = {
      ...visitData,
      id: `visit-${Date.now()}`,
      status: 'Confirmada',
      passCode: randomPass,
    };
    setVisits((prev) => [newVisit, ...prev]);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#4CAF50', '#81C784', '#64B5F6'],
    });
    showToast(`📅 ¡Visita agendada para el ${visitData.date} a las ${visitData.time}!`);
    return newVisit;
  };

  const addApplication = (
    appData: Omit<AdoptionApplication, 'id' | 'submittedDate' | 'currentStage' | 'timelineHistory'>
  ): AdoptionApplication => {
    const newApp: AdoptionApplication = {
      ...appData,
      id: `app-${Date.now()}`,
      submittedDate: new Date().toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' }),
      currentStage: 'enviada',
      timelineHistory: [
        {
          stage: 'enviada',
          title: 'Solicitud enviada',
          description: 'Tu formulario de preadopción fue registrado exitosamente.',
          date: 'Hoy, ' + new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
          completed: true,
          current: true,
        },
        {
          stage: 'en_revision',
          title: 'En revisión por el refugio',
          description: 'El equipo voluntario revisará la compatibilidad con el hogar.',
          date: '1-2 días hábiles',
          completed: false,
        },
        {
          stage: 'entrevista',
          title: 'Entrevista virtual o presencial',
          description: 'Conversación para aclarar detalles y resolver preguntas.',
          date: 'Pendiente',
          completed: false,
        },
        {
          stage: 'visita_domiciliaria',
          title: 'Visita domiciliaria',
          description: 'Verificación del entorno seguro para la mascota.',
          date: 'Pendiente',
          completed: false,
        },
        {
          stage: 'aprobada',
          title: '¡Aprobada y entrega oficial!',
          description: 'Firma de compromiso de adopción y entrega de cartilla médica.',
          date: 'Pendiente',
          completed: false,
        },
      ],
    };

    setApplications((prev) => [newApp, ...prev]);
    setActiveApplication(newApp);

    confetti({
      particleCount: 65,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#4CAF50', '#81C784', '#FFCA28', '#26A69A'],
    });

    showToast(`🏡 ¡Solicitud para ${appData.petName} enviada con éxito!`);
    return newApp;
  };

  const updateApplicationStage = (appId: string, stage: ApplicationStage) => {
    const stageOrder: ApplicationStage[] = ['enviada', 'en_revision', 'entrevista', 'visita_domiciliaria', 'aprobada'];
    const targetIdx = stageOrder.indexOf(stage);

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const updatedTimeline = app.timelineHistory.map((item) => {
          const itemIdx = stageOrder.indexOf(item.stage);
          return {
            ...item,
            completed: itemIdx < targetIdx,
            current: itemIdx === targetIdx,
            date: itemIdx <= targetIdx ? 'Completado' : item.date,
          };
        });
        return {
          ...app,
          currentStage: stage,
          timelineHistory: updatedTimeline,
        };
      })
    );
    showToast(`Estado de solicitud actualizado a: ${stage.replace('_', ' ')}`);
  };

  const makeDonation = (amount: number) => {
    setUser((prev) => ({
      ...prev,
      totalDonations: prev.totalDonations + amount,
    }));
    confetti({
      particleCount: 50,
      spread: 60,
      colors: ['#4CAF50', '#FFD54F'],
    });
    showToast(`💚 ¡Gracias por tu donación de $${amount.toFixed(2)} al refugio!`);
  };

  const loginUser = (email: string) => {
    setUser((prev) => ({
      ...prev,
      email,
      name: email.split('@')[0] ? email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1) : 'María Gómez',
    }));
    navigateTo('home');
    showToast('👋 ¡Bienvenida de vuelta a Huellas Felices!');
  };

  const logoutUser = () => {
    navigateTo('splash');
    showToast('Sesión cerrada');
  };

  return (
    <AppContext.Provider
      value={{
        pets,
        user,
        applications,
        visits,
        currentScreen,
        previousScreen,
        activePet,
        activeApplication,
        activeFilter,
        filterModalOpen,
        aiAssistantOpen,
        aiRecommenderOpen,
        isDeviceFrame,
        toastMessage,
        navigateTo,
        goBack,
        toggleFavorite,
        likePet,
        passPet,
        resetSwipes,
        setFilter,
        resetFilters,
        setFilterModalOpen,
        setAiAssistantOpen,
        setAiRecommenderOpen,
        setIsDeviceFrame,
        addVisit,
        addApplication,
        updateApplicationStage,
        makeDonation,
        showToast,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
