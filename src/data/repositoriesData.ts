export interface RepositoryProject {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  readme: string;
  techStack: string[];
  githubUrl: string;
  accentColor: string;
  roofPosition: [number, number, number];
  buildingFootprint: [number, number, number];
}

export const REPOSITORIES_DATA: RepositoryProject[] = [
  {
    id: 'jarvis-ai',
    name: 'Jarvis-AI',
    category: 'AI Voice Assistant',
    tagline: 'Intelligent desktop assistant inspired by J.A.R.V.I.S. with voice commands and task automation',
    description:
      'An intelligent desktop AI assistant inspired by J.A.R.V.I.S. from Marvel Studios. Built to automate daily tasks, interact through voice commands, and act as a personal productivity companion.',
    readme:
      'A modular Python desktop AI assistant for Windows.\n\n### Key Features\n- Wake-word activation ("Jarvis" or "Hey Jarvis")\n- Voice input (SpeechRecognition STT) & Voice output (pyttsx3 TTS)\n- OpenAI API connection for intelligent conversational reasoning\n- Automated Windows workflows: launches apps, searches Google/YouTube, queries time/date\n- Modular codebase architecture with safety confirmations for sensitive system actions.',
    techStack: ['Python', 'OpenAI API', 'SpeechRecognition', 'pyttsx3', 'Windows API'],
    githubUrl: 'https://github.com/Pratham2k07/Jarvis-AI',
    accentColor: '#38bdf8',
    roofPosition: [-15.0, 23.92, -81.75],
    buildingFootprint: [10.0, 23.92, 13.5],
  },
  {
    id: 'portfolio-website',
    name: 'Portfolio-website',
    category: 'Interactive 3D WebGL',
    tagline: 'Personal portfolio website built using React, Vite, and Three.js with interactive 3D elements',
    description:
      'Personal portfolio website built using React, Vite, and Three.js. Showcases my projects, skills, and interactive 3D elements.',
    readme:
      'An open-source interactive 3D portfolio website engineered with React 19, Vite, and Three.js / React Three Fiber.\n\n### Architecture Highlights\n- Unified 3D WebGL viewport running at 60 FPS\n- Real-time kinematic flight controller with aerodynamic banking and altitude control\n- Custom PBR material shaders with high dynamic range emissive neon and bloom\n- Procedural spatial audio synthesis and seamless scene transitions.',
    techStack: ['React 19', 'Three.js', 'React Three Fiber', 'Vite', 'TypeScript', 'GLSL'],
    githubUrl: 'https://github.com/Pratham2k07/Portfolio-website',
    accentColor: '#c084fc',
    roofPosition: [43.5, 52.23, -140.0],
    buildingFootprint: [16.0, 52.23, 16.0],
  },
  {
    id: 'dbms',
    name: 'dbms (JKLU Shuttle)',
    category: 'Transit Management & DBMS',
    tagline: 'Campus transit tracking & relational database architecture for JKLU university transit',
    description:
      'Official-style digital transit service for JK Lakshmipat University. Features campus mobility tracking, real-time bus telemetry, schedule management, and relational DBMS architecture.',
    readme:
      'A mobile-first university shuttle tracking system engineered specifically for students, faculty, and shuttle drivers of JK Lakshmipat University (JKLU) in Jaipur, Rajasthan.\n\n### Capabilities\n- Real-time GPS bus location tracking and route mapping\n- Relational DBMS schema managing drivers, buses, trips, and passenger timetables\n- Clean editorial UI designed for fast mobile transit queries on campus.',
    techStack: ['TypeScript', 'Node.js', 'SQL / DBMS', 'Leaflet', 'TailwindCSS', 'Express'],
    githubUrl: 'https://github.com/Pratham2k07/dbms',
    accentColor: '#fbbf24',
    roofPosition: [-47.5, 83.57, -105.0],
    buildingFootprint: [10.0, 83.57, 10.0],
  },
  {
    id: 'code-connect',
    name: 'code-connect',
    category: 'Collaborative Dev Platform',
    tagline: 'Real-time collaborative developer platform with live synchronization and networking',
    description:
      'A collaborative coding platform enabling live code synchronization, peer programming, and developer networking built with modern web architecture.',
    readme:
      'Modern full-stack collaborative developer environment featuring instant live synchronization, modular component architecture, and low-latency communication.\n\n### Features\n- Live peer code sharing and real-time state synchronization\n- Fast React + Vite frontend with responsive developer utility suites\n- Modular backend service for developer session routing.',
    techStack: ['React', 'Vite', 'WebSockets', 'JavaScript', 'Node.js', 'CSS Modules'],
    githubUrl: 'https://github.com/Pratham2k07/code-connect',
    accentColor: '#10b981',
    roofPosition: [53.0, 38.67, -118.5],
    buildingFootprint: [10.0, 38.67, 10.0],
  },
  {
    id: 'guess-game',
    name: 'Guess-Game',
    category: 'Algorithmic Game Logic',
    tagline: 'Multiplayer number guessing game with difficulty levels translated from C to JavaScript',
    description:
      'A web-based implementation of a classic multiplayer number guessing game, featuring difficulty levels, attempt tracking, time tracking, and real-time feedback. The project demonstrates logic translation from C programming to an interactive frontend application using JavaScript.',
    readme:
      'A web-based interactive implementation of a classic multiplayer number guessing game.\n\n### Technical Highlights\n- Direct logic translation from procedural C to an asynchronous JavaScript state machine\n- Configurable difficulty modes, attempt counter, and time benchmark tracking\n- Instant responsive feedback and clean UI styling.',
    techStack: ['JavaScript', 'HTML5', 'CSS3', 'Algorithmic State', 'C Translation'],
    githubUrl: 'https://github.com/Pratham2k07/Guess-Game',
    accentColor: '#f43f5e',
    roofPosition: [54.0, 38.79, -244.25],
    buildingFootprint: [10.0, 38.79, 10.0],
  },
  {
    id: 'shribalaji-handlooms',
    name: 'ShriBalaji-Handlooms',
    category: 'E-Commerce & Digital Catalog',
    tagline: 'Responsive digital storefront and catalog showcase for traditional textiles and fabrics',
    description:
      'A responsive digital storefront and catalog showcase for traditional handlooms and textiles, featuring product showcases and modern UI.',
    readme:
      'A dedicated web storefront and catalog showcase for traditional textiles, fabrics, and handloom goods.\n\n### Architecture\n- High-resolution textile gallery with responsive image optimization\n- Structured catalog filtering by fabric category, weave type, and season\n- Mobile-optimized browsing experience with fast client-side performance.',
    techStack: ['JavaScript', 'HTML5', 'CSS3', 'Responsive UI', 'E-Commerce UX'],
    githubUrl: 'https://github.com/Pratham2k07/ShriBalaji-Handlooms',
    accentColor: '#ec4899',
    roofPosition: [46.25, 52.78, -155.5],
    buildingFootprint: [13.5, 52.78, 18.0],
  },
  {
    id: 'pet-care',
    name: 'Pet-care-',
    category: 'Healthcare & Management',
    tagline: 'Modern pet healthcare, veterinary appointment, and wellness tracking platform',
    description:
      'Comprehensive veterinary and pet wellness web platform providing pet profiles, vaccination schedules, appointment booking, and pet health diagnostics.',
    readme:
      'Modern pet care and veterinary management application.\n\n### Key Features\n- Pet profile management with medical records and vaccination timelines\n- Interactive appointment scheduling with local veterinary clinics\n- Nutrition guides and emergency response hotlines\n- Responsive TypeScript and Tailwind UI.',
    techStack: ['TypeScript', 'React', 'TailwindCSS', 'Vite', 'Node.js'],
    githubUrl: 'https://github.com/Pratham2k07/Pet-care-',
    accentColor: '#34d399',
    roofPosition: [-50.0, 89.65, -165.25],
    buildingFootprint: [15.0, 89.65, 10.0],
  },
  {
    id: 'inamigos-foundation',
    name: 'InAmigos-Foundation-',
    category: 'Community & NGO Platform',
    tagline: 'Digital platform for social initiatives, community welfare, and volunteer outreach',
    description:
      'Official web platform for the InAmigos Foundation, driving youth empowerment, social drives, donation collection, and non-profit volunteer coordination.',
    readme:
      'A community outreach and social welfare web application.\n\n### Highlights\n- Volunteer onboarding and campaign registration workflows\n- Transparent donation tracking and community initiative showcases\n- Event galleries and press updates celebrating volunteer impact.',
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Grid', 'WebForms'],
    githubUrl: 'https://github.com/Pratham2k07/InAmigos-Foundation-',
    accentColor: '#f97316',
    roofPosition: [43.75, 23.62, -190.75],
    buildingFootprint: [19.5, 23.62, 16.5],
  },
  {
    id: 'aarambh-26',
    name: 'aarambh-26',
    category: 'Campus Event Portal',
    tagline: 'Annual college orientation & fest portal with event schedules and registration',
    description:
      'Event management and participant registration portal for Aarambh, coordinating campus competitions, schedules, and live announcements.',
    readme:
      'University festival event portal engineered for high-volume student registrations.\n\n### Capabilities\n- Multi-track event schedules and interactive stage maps\n- Team registration system with QR badge pass validation\n- Live scoreboard and countdown widgets.',
    techStack: ['TypeScript', 'Next.js', 'TailwindCSS', 'Node.js', 'Vercel'],
    githubUrl: 'https://github.com/Pratham2k07/aarambh-26',
    accentColor: '#a855f7',
    roofPosition: [-27.0, 47.0, -233.0],
    buildingFootprint: [10.0, 47.0, 12.0],
  },
  {
    id: 'sabrang-26',
    name: 'Sabrang-26',
    category: 'Cultural Festival Platform',
    tagline: 'Flagship annual cultural festival website with ticket passes and artist lineups',
    description:
      'Flagship web application for Sabrang, the annual cultural festival of JKLU, showcasing celebrity performances, cultural events, and festival ticketing.',
    readme:
      'Full-featured cultural festival web experience.\n\n### Features\n- Dynamic artist showcase and musical lineup spotlights\n- Interactive pass booking and campus access verification\n- Real-time event notifications and photo gallery feeds.',
    techStack: ['TypeScript', 'React', 'TailwindCSS', 'Vite', 'Framer Motion'],
    githubUrl: 'https://github.com/Pratham2k07/Sabrang-26',
    accentColor: '#06b6d4',
    roofPosition: [-39.5, 77.16, -135.5],
    buildingFootprint: [11.0, 77.16, 11.0],
  },
];
