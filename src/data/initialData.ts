import { AdoptionApplication, ShelterVisit, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'user-maria-01',
  name: 'María Gómez',
  email: 'maria.gomez@ejemplo.com',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  phone: '+593 99 123 4567',
  location: 'Quito, Ecuador',
  isVerified: true,
  savedFavorites: ['pet-1', 'pet-2'],
  likedPets: ['pet-1', 'pet-2', 'pet-6'],
  passedPets: [],
  totalDonations: 45.0,
};

export const INITIAL_APPLICATIONS: AdoptionApplication[] = [
  {
    id: 'app-001',
    petId: 'pet-1',
    petName: 'Luna',
    petImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    petBreed: 'Mestiza (Labrador Mix)',
    submittedDate: '24 Ago 2026',
    currentStage: 'entrevista',
    applicantName: 'María Gómez',
    email: 'maria.gomez@ejemplo.com',
    phone: '+593 99 123 4567',
    address: 'Av. República de El Salvador y Shyris, Depto 402, Quito',
    housingType: 'Departamento',
    hasYard: false,
    hasOtherPets: false,
    previousExperience: 'Tuve un Golden Retriever durante 10 años en casa de mis padres.',
    adoptionReason: 'Busco una compañera leal para compartir caminatas diarias y darle un hogar lleno de amor y cuidados veterinarios.',
    acceptedTerms: true,
    aiReviewScore: 94,
    aiReviewFeedback: 'Excelente perfil. Tu experiencia previa y compromiso con paseos diarios son perfectos para el nivel de energía de Luna.',
    timelineHistory: [
      {
        stage: 'enviada',
        title: 'Solicitud enviada',
        description: 'Formulario completado y recibido por el equipo de Huellas Felices.',
        date: '24 Ago 2026, 10:30',
        completed: true,
      },
      {
        stage: 'en_revision',
        title: 'En revisión por el refugio',
        description: 'El comité de adopciones evaluó tu perfil y aprobó la etapa inicial.',
        date: '26 Ago 2026, 14:15',
        completed: true,
      },
      {
        stage: 'entrevista',
        title: 'Entrevista virtual / telefónica',
        description: 'Coordinando fecha para conocer más sobre tu rutina y resolver preguntas mutuas.',
        date: '28 Ago 2026, 09:00',
        completed: false,
        current: true,
      },
      {
        stage: 'visita_domiciliaria',
        title: 'Visita domiciliaria o verificación',
        description: 'Validación del entorno y espacio seguro para la mascota.',
        date: 'Pendiente',
        completed: false,
      },
      {
        stage: 'aprobada',
        title: '¡Aprobada y entrega!',
        description: 'Firma de contrato de adopción y bienvenida de Luna a su nuevo hogar.',
        date: 'Pendiente',
        completed: false,
      },
    ],
  },
];

export const INITIAL_VISITS: ShelterVisit[] = [
  {
    id: 'visit-001',
    petId: 'pet-1',
    petName: 'Luna',
    petImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    shelterName: 'Refugio Huellas Felices - Sede Norte',
    date: '31 Ago 2026',
    time: '11:00 AM',
    visitorName: 'María Gómez',
    phone: '+593 99 123 4567',
    visitorCount: 2,
    comments: 'Iré con mi pareja para convivir 45 minutos con Luna.',
    status: 'Confirmada',
    passCode: 'HF-9482',
  },
];

export const AI_QUICK_PROMPTS = [
  { label: '🐶 Perros para departamento', query: 'perros tranquilos y medianos ideales para vivir en departamento' },
  { label: '🐱 Gatos sociables con niños', query: 'gatos cariñosos y pacientes que se lleven bien con niños' },
  { label: '⚡ Mascotas activas para running', query: 'perros de energía alta para hacer ejercicio al aire libre' },
  { label: '📋 Requisitos de adopción', query: '¿Cuáles son los requisitos y pasos para adoptar en Huellas Felices?' },
];
