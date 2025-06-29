import React, { createContext, useState, useContext } from 'react';

// Create the language context
export const LanguageContext = createContext();

// Available languages and translations
export const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'mc', name: 'Kreol Morisien' }
];

// Create the translations object that will be used across the application
export const translations = {
  en: {
    // NavBar
    home: 'Home',
    categories: 'Categories',
    jobs: 'Jobs',
    services: 'Services',
    about: 'About',
    contact: 'Contact',
    login: 'Login',
    register: 'Register',
    profile: 'Profile',
    dashboard: 'Dashboard',
    logout: 'Logout',
    notifications: 'Notifications',
    bookings: 'Bookings',
    faq: 'FAQ',
    
    // Footer
    footerDescription: 'We connect homeowners with trusted professionals to handle all your home maintenance, repair, and improvement needs.',
    companyInfo: 'Company',
    resources: 'Resources',
    aboutUs: 'About Us',
    myAccount: 'My Account',
    helpCenter: 'Help Center',
    serviceGuarantee: 'Service Guarantee',
    contactUs: 'Contact Us',
    forProfessionals: 'For Professionals',
    joinOurNetwork: 'Join Our Network',
    proResources: 'Pro Resources',
    successStories: 'Success Stories',
    contactInfo: 'Contact Info',
    copyright: '©',
    allRightsReserved: 'All rights reserved.',
    
    // Notifications
    viewAll: 'View All',
    noNotifications: 'No notifications',
    showingNotifications: 'Showing',
    of: 'of',
    markAllAsRead: 'Mark all as read',
    
    // About Page
    aboutTitle: 'About HomeServices',
    aboutSubtitle: 'Connecting homeowners with reliable professionals for all their home maintenance, repair, and improvement needs since 2015.',
    ourStory: 'Our Story',
    storyP1: 'HomeServices was founded in 2015 with a simple mission: to make home maintenance and improvement easier, more reliable, and more accessible for homeowners.',
    storyP2: 'Our founder, Sarah Johnson, experienced firsthand the challenges of finding trustworthy service providers during her home renovation. She envisioned a platform that would connect homeowners with qualified professionals for all their home service needs.',
    storyP3: 'Today, HomeServices has grown into one of the leading home service platforms, serving over 500,000 homeowners and 25,000+ service providers nationwide. We continue to innovate and improve our services, always keeping our core mission in mind.',
    ourMission: 'Our Mission',
    missionText: 'To transform home maintenance by connecting homeowners with skilled professionals, making home care accessible, reliable, and hassle-free.',
    ourVision: 'Our Vision',
    visionText: 'To become the most trusted platform for home services, where every homeowner can find the perfect professional for any home-related need, and where service providers can grow their businesses with quality clients.',
    ourImpact: 'Our Impact',
    metrics: {
      happyHomeowners: 'Happy Homeowners',
      serviceProviders: 'Service Providers',
      servicesCompleted: 'Services Completed',
      satisfactionRate: 'Satisfaction Rate'
    },
    coreValues: 'Our Core Values',
    coreValuesSubtitle: 'These principles guide our decisions and define our company culture',
    values: {
      customerSatisfaction: {
        title: 'Customer Satisfaction',
        description: 'We prioritize the needs of homeowners, ensuring they receive exceptional service and support for all their home maintenance needs.'
      },
      innovation: {
        title: 'Innovation',
        description: 'We continuously seek better ways to connect homeowners with service professionals through technology and creative solutions.'
      },
      trustSafety: {
        title: 'Trust & Safety',
        description: 'We thoroughly vet our service providers and prioritize the safety and security of our users\' homes and personal information.'
      },
      qualityCraftsmanship: {
        title: 'Quality Craftsmanship',
        description: 'We\'re committed to connecting homeowners with professionals who deliver exceptional workmanship and attention to detail.'
      }
    },
    meetTeam: 'Meet Our Team',
    teamSubtitle: 'The passionate individuals behind HomeServices dedicated to improving your home maintenance experience',
    joinCommunity: 'Join Our Growing Community',
    joinText: 'Whether you\'re a homeowner looking for reliable service professionals or a skilled provider looking to grow your business, HomeServices is here to help you succeed.',
    createAccount: 'Create Account',
    contactUs: 'Contact Us',
    
    // Common buttons and actions
    searchButton: 'Search',
    applyButton: 'Apply',
    submitButton: 'Submit',
    cancelButton: 'Cancel',
    saveButton: 'Save',
    editButton: 'Edit',
    deleteButton: 'Delete',
    viewButton: 'View',
    bookNow: 'Book Now',
    learnMore: 'Learn More',
    
    // Language selector
    languageSelector: 'Select Language'
  },
  es: {
    // NavBar
    home: 'Inicio',
    categories: 'Categorías',
    jobs: 'Trabajos',
    services: 'Servicios',
    about: 'Nosotros',
    contact: 'Contacto',
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    profile: 'Perfil',
    dashboard: 'Panel',
    logout: 'Cerrar Sesión',
    notifications: 'Notificaciones',
    bookings: 'Reservas',
    faq: 'Preguntas Frecuentes',
    
    // Footer
    footerDescription: 'Conectamos a propietarios con profesionales de confianza para atender todas sus necesidades de mantenimiento, reparación y mejora del hogar.',
    companyInfo: 'Empresa',
    resources: 'Recursos',
    aboutUs: 'Sobre Nosotros',
    myAccount: 'Mi Cuenta',
    helpCenter: 'Centro de Ayuda',
    serviceGuarantee: 'Garantía de Servicio',
    contactUs: 'Contáctenos',
    forProfessionals: 'Para Profesionales',
    joinOurNetwork: 'Únase a Nuestra Red',
    proResources: 'Recursos para Profesionales',
    successStories: 'Historias de Éxito',
    contactInfo: 'Información de Contacto',
    copyright: '©',
    allRightsReserved: 'Todos los derechos reservados.',
    
    // Notifications
    viewAll: 'Ver Todo',
    noNotifications: 'No hay notificaciones',
    showingNotifications: 'Mostrando',
    of: 'de',
    markAllAsRead: 'Marcar todo como leído',
    
    // About Page
    aboutTitle: 'Acerca de HomeServices',
    aboutSubtitle: 'Conectando propietarios con profesionales confiables para todas sus necesidades de mantenimiento, reparación y mejora del hogar desde 2015.',
    ourStory: 'Nuestra Historia',
    storyP1: 'HomeServices se fundó en 2015 con una misión simple: hacer que el mantenimiento y la mejora del hogar sean más fáciles, más confiables y más accesibles para los propietarios.',
    storyP2: 'Nuestra fundadora, Sarah Johnson, experimentó de primera mano los desafíos de encontrar proveedores de servicios confiables durante la renovación de su hogar. Ella imaginó una plataforma que conectaría a los propietarios con profesionales calificados para todas sus necesidades de servicios para el hogar.',
    storyP3: 'Hoy, HomeServices se ha convertido en una de las principales plataformas de servicios para el hogar, atendiendo a más de 500,000 propietarios y más de 25,000 proveedores de servicios en todo el país. Continuamos innovando y mejorando nuestros servicios, siempre teniendo en cuenta nuestra misión principal.',
    ourMission: 'Nuestra Misión',
    missionText: 'Transformar el mantenimiento del hogar conectando a los propietarios con profesionales calificados, haciendo que el cuidado del hogar sea accesible, confiable y sin complicaciones.',
    ourVision: 'Nuestra Visión',
    visionText: 'Convertirse en la plataforma más confiable para servicios del hogar, donde cada propietario pueda encontrar al profesional perfecto para cualquier necesidad relacionada con el hogar, y donde los proveedores de servicios puedan hacer crecer sus negocios con clientes de calidad.',
    ourImpact: 'Nuestro Impacto',
    metrics: {
      happyHomeowners: 'Propietarios Satisfechos',
      serviceProviders: 'Proveedores de Servicios',
      servicesCompleted: 'Servicios Completados',
      satisfactionRate: 'Tasa de Satisfacción'
    },
    coreValues: 'Nuestros Valores Fundamentales',
    coreValuesSubtitle: 'Estos principios guían nuestras decisiones y definen nuestra cultura empresarial',
    values: {
      customerSatisfaction: {
        title: 'Satisfacción del Cliente',
        description: 'Priorizamos las necesidades de los propietarios, asegurando que reciban un servicio y soporte excepcionales para todas sus necesidades de mantenimiento del hogar.'
      },
      innovation: {
        title: 'Innovación',
        description: 'Buscamos continuamente mejores formas de conectar a los propietarios con profesionales de servicios a través de la tecnología y soluciones creativas.'
      },
      trustSafety: {
        title: 'Confianza y Seguridad',
        description: 'Evaluamos minuciosamente a nuestros proveedores de servicios y priorizamos la seguridad de los hogares y la información personal de nuestros usuarios.'
      },
      qualityCraftsmanship: {
        title: 'Artesanía de Calidad',
        description: 'Estamos comprometidos a conectar a los propietarios con profesionales que brinden una artesanía excepcional y atención al detalle.'
      }
    },
    meetTeam: 'Conoce a Nuestro Equipo',
    teamSubtitle: 'Las personas apasionadas detrás de HomeServices dedicadas a mejorar tu experiencia de mantenimiento del hogar',
    joinCommunity: 'Únete a Nuestra Comunidad en Crecimiento',
    joinText: 'Ya sea que seas un propietario en busca de profesionales de servicios confiables o un proveedor calificado que busca hacer crecer tu negocio, HomeServices está aquí para ayudarte a tener éxito.',
    createAccount: 'Crear Cuenta',
    contactUs: 'Contáctanos',
    
    // Common buttons and actions
    searchButton: 'Buscar',
    applyButton: 'Aplicar',
    submitButton: 'Enviar',
    cancelButton: 'Cancelar',
    saveButton: 'Guardar',
    editButton: 'Editar',
    deleteButton: 'Eliminar',
    viewButton: 'Ver',
    bookNow: 'Reservar Ahora',
    learnMore: 'Saber Más',
    
    // Language selector
    languageSelector: 'Seleccionar Idioma'
  },
  fr: {
    // NavBar
    home: 'Accueil',
    categories: 'Catégories',
    jobs: 'Emplois',
    services: 'Services',
    about: 'À Propos',
    contact: 'Contact',
    login: 'Connexion',
    register: 'S\'inscrire',
    profile: 'Profil',
    dashboard: 'Tableau de Bord',
    logout: 'Déconnexion',
    notifications: 'Notifications',
    bookings: 'Réservations',
    faq: 'FAQ',
    
    // Footer
    footerDescription: 'Nous mettons en relation les propriétaires avec des professionnels de confiance pour gérer tous vos besoins d\'entretien, de réparation et d\'amélioration de votre maison.',
    companyInfo: 'Entreprise',
    resources: 'Ressources',
    aboutUs: 'À Propos de Nous',
    myAccount: 'Mon Compte',
    helpCenter: 'Centre d\'Aide',
    serviceGuarantee: 'Garantie de Service',
    contactUs: 'Contactez-Nous',
    forProfessionals: 'Pour les Professionnels',
    joinOurNetwork: 'Rejoignez Notre Réseau',
    proResources: 'Ressources Pro',
    successStories: 'Histoires de Réussite',
    contactInfo: 'Coordonnées',
    copyright: '©',
    allRightsReserved: 'Tous droits réservés.',
    
    // Notifications
    viewAll: 'Voir Tout',
    noNotifications: 'Pas de notifications',
    showingNotifications: 'Affichage de',
    of: 'sur',
    markAllAsRead: 'Marquer tout comme lu',
    
    // About Page
    aboutTitle: 'À propos de HomeServices',
    aboutSubtitle: 'Mettre en relation les propriétaires avec des professionnels fiables pour tous leurs besoins d\'entretien, de réparation et d\'amélioration de leur domicile depuis 2015.',
    ourStory: 'Notre Histoire',
    storyP1: 'HomeServices a été fondée en 2015 avec une mission simple : rendre l\'entretien et l\'amélioration de la maison plus faciles, plus fiables et plus accessibles pour les propriétaires.',
    storyP2: 'Notre fondatrice, Sarah Johnson, a connu personnellement les défis de trouver des prestataires de services fiables lors de la rénovation de sa maison. Elle a imaginé une plateforme qui mettrait en relation les propriétaires avec des professionnels qualifiés pour tous leurs besoins en services à domicile.',
    storyP3: 'Aujourd\'hui, HomeServices est devenue l\'une des principales plateformes de services à domicile, servant plus de 500 000 propriétaires et plus de 25 000 prestataires de services à l\'échelle nationale. Nous continuons à innover et à améliorer nos services, en gardant toujours à l\'esprit notre mission principale.',
    ourMission: 'Notre Mission',
    missionText: 'Transformer l\'entretien de la maison en mettant en relation les propriétaires avec des professionnels qualifiés, rendant l\'entretien de la maison accessible, fiable et sans tracas.',
    ourVision: 'Notre Vision',
    visionText: 'Devenir la plateforme la plus fiable pour les services à domicile, où chaque propriétaire peut trouver le professionnel parfait pour tout besoin lié à la maison, et où les prestataires de services peuvent développer leurs activités avec des clients de qualité.',
    ourImpact: 'Notre Impact',
    metrics: {
      happyHomeowners: 'Propriétaires Satisfaits',
      serviceProviders: 'Prestataires de Services',
      servicesCompleted: 'Services Complétés',
      satisfactionRate: 'Taux de Satisfaction'
    },
    coreValues: 'Nos Valeurs Fondamentales',
    coreValuesSubtitle: 'Ces principes guident nos décisions et définissent notre culture d\'entreprise',
    values: {
      customerSatisfaction: {
        title: 'Satisfaction du Client',
        description: 'Nous donnons la priorité aux besoins des propriétaires, en veillant à ce qu\'ils reçoivent un service et un soutien exceptionnels pour tous leurs besoins d\'entretien de la maison.'
      },
      innovation: {
        title: 'Innovation',
        description: 'Nous recherchons continuellement de meilleures façons de mettre en relation les propriétaires avec des professionnels des services grâce à la technologie et à des solutions créatives.'
      },
      trustSafety: {
        title: 'Confiance et Sécurité',
        description: 'Nous évaluons minutieusement nos prestataires de services et donnons la priorité à la sécurité des maisons de nos utilisateurs et à la protection de leurs informations personnelles.'
      },
      qualityCraftsmanship: {
        title: 'Qualité Artisanale',
        description: 'Nous nous engageons à mettre en relation les propriétaires avec des professionnels qui fournissent un travail exceptionnel et une attention aux détails.'
      }
    },
    meetTeam: 'Rencontrez Notre Équipe',
    teamSubtitle: 'Les personnes passionnées derrière HomeServices dédiées à améliorer votre expérience d\'entretien de maison',
    joinCommunity: 'Rejoignez Notre Communauté Grandissante',
    joinText: 'Que vous soyez un propriétaire à la recherche de professionnels de services fiables ou un prestataire qualifié cherchant à développer votre entreprise, HomeServices est là pour vous aider à réussir.',
    createAccount: 'Créer un Compte',
    contactUs: 'Contactez-nous',
    
    // Common buttons and actions
    searchButton: 'Rechercher',
    applyButton: 'Appliquer',
    submitButton: 'Soumettre',
    cancelButton: 'Annuler',
    saveButton: 'Enregistrer',
    editButton: 'Modifier',
    deleteButton: 'Supprimer',
    viewButton: 'Voir',
    bookNow: 'Réserver Maintenant',
    learnMore: 'En Savoir Plus',
    
    // Language selector
    languageSelector: 'Sélectionner la Langue'
  },
  mc: {
    // NavBar
    home: 'Lakaz',
    categories: 'Kategori',
    jobs: 'Travay',
    services: 'Servis',
    about: 'Lor Nou',
    contact: 'Kontak',
    login: 'Konekte',
    register: 'Enskrir',
    profile: 'Profil',
    dashboard: 'Tablodbor',
    logout: 'Dekonekte',
    notifications: 'Notifikasion',
    bookings: 'Rezervasion',
    faq: 'Kestyon Frekan',
    
    // Footer
    footerDescription: 'Nou konekte proprieter lakaz avek profesionel konfians pou okip tou ou bezwin lantretien, reparasion ek ameliorasion lakaz.',
    companyInfo: 'Konpani',
    resources: 'Resours',
    aboutUs: 'Lor Nou',
    myAccount: 'Mo Kont',
    helpCenter: 'Sant Led',
    serviceGuarantee: 'Garanti Servis',
    contactUs: 'Kontak Nou',
    forProfessionals: 'Pou Profesionel',
    joinOurNetwork: 'Zwenn Nou Rezo',
    proResources: 'Resours Pro',
    successStories: 'Zistwar Sikse',
    contactInfo: 'Info Kontak',
    copyright: '©',
    allRightsReserved: 'Tou drwa rezerve.',
    
    // Notifications
    viewAll: 'Get Tou',
    noNotifications: 'Péna notifikasion',
    showingNotifications: 'Afisé',
    of: 'depi',
    markAllAsRead: 'Mark tou kouma lir',
    
    // About Page
    aboutTitle: 'Lor HomeServices',
    aboutSubtitle: 'Konekte propriéter lakaz ek profesionel konfians pou tou bezwin lantretien, reparasion ek ameliorasion lakaz depi 2015.',
    ourStory: 'Nou Zistwar',
    storyP1: 'HomeServices finn kréé an 2015 ek enn misyon sinp: rann lantretien ek ameliorasion lakaz pli fasil, pli fyab, ek pli aksesib pou propriéter lakaz.',
    storyP2: 'Nou fondatris, Sarah Johnson, finn fer lexperyans an premye min difikilte pou trouv profesionel servis konfians pandan renovasion so lakaz. Li finn mazinn enn platform ki ti pou konekt propriéter lakaz ek profesionel kalifye pou tou zot bezwin servis lakaz.',
    storyP3: 'Zordi, HomeServices finn vinn enn parmi bann pli gran platform servis lakaz, ki servi plis ki 500,000 propriéter ek plis ki 25,000 furniser servis partou dan péi. Nou kontinye inovev ek amelyor nou servis, touletan gardé nou misyon prensipal dan lespri.',
    ourMission: 'Nou Misyon',
    missionText: 'Transform lantretien lakaz par konekte propriéter ek profesionel kalifye, fer lantretien lakaz aksesib, konfyab, ek san traka.',
    ourVision: 'Nou Vizyon',
    visionText: 'Vinn platform servis lakaz pli konfyab, kot sak propriéter kapav trouv profesionel ideal pou nenpot bezwin relye ek lakaz, ek kot furniser servis kapav fer zot biznes grandi ek klian kalite.',
    ourImpact: 'Nou Linpak',
    metrics: {
      happyHomeowners: 'Propriéter Satisfe',
      serviceProviders: 'Furniser Servis',
      servicesCompleted: 'Servis Konplete',
      satisfactionRate: 'To Satisfaksion'
    },
    coreValues: 'Nou Bann Valer Prensipal',
    coreValuesSubtitle: 'Sa bann prinsip la gid nou desizion ek defini nou kiltir konpani',
    values: {
      customerSatisfaction: {
        title: 'Satisfaksion Klian',
        description: 'Nou privilézie bezwin propriéter lakaz, asire ki zot resevwar servis ek sipor exepsionel pou tou zot bezwin lantretien lakaz.'
      },
      innovation: {
        title: 'Inovasion',
        description: 'Nou touletan rod bann meyer fason pou konekt propriéter lakaz ek profesionel servis atraver teknolozi ek solision kreativ.'
      },
      trustSafety: {
        title: 'Konfians ek Sekirite',
        description: 'Nou fer verifikasion aprofonfdi lor nou furniser servis ek privilézie sekirite ek proteksion informasion personel nou bann itilizater.'
      },
      qualityCraftsmanship: {
        title: 'Kalite Travay',
        description: 'Nou angaze pou konekt propriéter lakaz ek profesionel ki livre travay exepsionel ek latansion a detay.'
      }
    },
    meetTeam: 'Zwenn Nou Lekip',
    teamSubtitle: 'Bann dimounn pasione deryer HomeServices ki devwe pou amelyor ou lexperyans lantretien lakaz',
    joinCommunity: 'Zwenn Nou Kominate ki pe Grandi',
    joinText: 'Ki ou enn propriéter lakaz ki pe rod profesionel servis konfyab oubye enn furniser kalifye ki pe rod devlop ou biznis, HomeServices la pou ed ou reysi.',
    createAccount: 'Kre enn Kont',
    contactUs: 'Kontak Nou',
    
    // Common buttons and actions
    searchButton: 'Serye',
    applyButton: 'Aplike',
    submitButton: 'Soumet',
    cancelButton: 'Anile',
    saveButton: 'Sauvgarde',
    editButton: 'Modifie',
    deleteButton: 'Siprime',
    viewButton: 'Gete',
    bookNow: 'Rezerve Aster',
    learnMore: 'Aprann Plis',
    
    // Language selector
    languageSelector: 'Seleksion Langaz'
  }
};

// Create a custom hook for easier access to the language context
export const useLanguage = () => useContext(LanguageContext);

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  
  // Get translations for the current language
  const t = translations[language];
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;