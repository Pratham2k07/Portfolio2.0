export interface TechItem {
  id: string;
  name: string;
  category: 'LANGUAGES' | 'FRONTEND' | 'BACKEND / DATA' | '3D / GRAPHICS' | 'TOOLS' | 'AI / DEV';
  roleTag: string;
  description: string;
  accentColor: string;
  badge?: string;
}

export interface TechCategoryGroup {
  id: string;
  title: string;
  code: string;
  subtitle: string;
  accentColor: string;
  technologies: TechItem[];
}

export const TECH_CATEGORIES_DATA: TechCategoryGroup[] = [
  {
    id: 'languages',
    title: 'LANGUAGES',
    code: 'LNG-01',
    subtitle: 'CORE SYNTAX & COMPUTATIONAL LOGIC',
    accentColor: '#38bdf8', // Electric Cyan
    technologies: [
      {
        id: 'c',
        name: 'C',
        category: 'LANGUAGES',
        roleTag: 'LOW-LEVEL LOGIC / MEMORY ARCHITECTURE',
        description: 'Procedural fundamentals, pointer arithmetic, memory allocation, and algorithmic foundations.',
        accentColor: '#38bdf8',
        badge: 'SYS',
      },
      {
        id: 'cpp',
        name: 'C++',
        category: 'LANGUAGES',
        roleTag: 'SYSTEMS / DSA / UNIVERSITY COURSEWORK',
        description: 'Object-oriented structures, STL collections, computational complexity, and algorithmic optimization.',
        accentColor: '#38bdf8',
        badge: 'OOP',
      },
      {
        id: 'python',
        name: 'Python',
        category: 'LANGUAGES',
        roleTag: 'AUTOMATION / AI / DEVELOPMENT',
        description: 'Desktop voice assistant (Jarvis-AI), task automation scripting, and API integrations.',
        accentColor: '#38bdf8',
        badge: 'AUTO',
      },
      {
        id: 'javascript',
        name: 'JavaScript',
        category: 'LANGUAGES',
        roleTag: 'DYNAMIC WEB RUNTIME / ES6+ ENGINES',
        description: 'Client-side event loops, asynchronous DOM manipulation, canvas APIs, and web logic.',
        accentColor: '#38bdf8',
        badge: 'WEB',
      },
      {
        id: 'typescript',
        name: 'TypeScript',
        category: 'LANGUAGES',
        roleTag: 'WEB APPLICATION DEVELOPMENT',
        description: 'Type-safe interface contracts, scalable web apps, and full-stack React architectures.',
        accentColor: '#38bdf8',
        badge: 'TYPED',
      },
      {
        id: 'html',
        name: 'HTML',
        category: 'LANGUAGES',
        roleTag: 'SEMANTIC WEB ARCHITECTURE',
        description: 'Semantic markup hierarchy, DOM structuring, accessibility, and modern HTML5 standards.',
        accentColor: '#38bdf8',
        badge: 'DOM',
      },
      {
        id: 'css',
        name: 'CSS',
        category: 'LANGUAGES',
        roleTag: 'RESPONSIVE STYLING & KEYFRAME MOTION',
        description: 'Flexbox, CSS Grid layouts, custom design tokens, and smooth hardware-accelerated transitions.',
        accentColor: '#38bdf8',
        badge: 'STYLE',
      },
      {
        id: 'json',
        name: 'JSON',
        category: 'LANGUAGES',
        roleTag: 'DATA SERIALIZATION & PAYLOADS',
        description: 'Structured data interchange, API payload modeling, configuration schemas, and state persistence.',
        accentColor: '#38bdf8',
        badge: 'DATA',
      },
      {
        id: 'sql',
        name: 'SQL',
        category: 'LANGUAGES',
        roleTag: 'RELATIONAL QUERIES & DATA INTEGRITY',
        description: 'Relational schema design, complex joins, indexing, and transit database management (dbms).',
        accentColor: '#38bdf8',
        badge: 'RDBMS',
      },
    ],
  },
  {
    id: 'frontend',
    title: 'FRONTEND',
    code: 'FNT-02',
    subtitle: 'REACTIVE INTERFACES & CLIENT PLATFORMS',
    accentColor: '#60a5fa', // Sky Blue
    technologies: [
      {
        id: 'react',
        name: 'React',
        category: 'FRONTEND',
        roleTag: 'COMPONENT STATE & REACTIVE UIs',
        description: 'Declarative component trees, custom hooks, virtual DOM reconcilers, and performant web apps.',
        accentColor: '#60a5fa',
        badge: 'UI',
      },
      {
        id: 'nextjs',
        name: 'Next.js',
        category: 'FRONTEND',
        roleTag: 'SERVER-SIDE RENDERING & APIS',
        description: 'SSR/SSG hybrid rendering pipelines, file-system routing, and production full-stack apps.',
        accentColor: '#60a5fa',
        badge: 'SSR',
      },
      {
        id: 'react-native',
        name: 'React Native',
        category: 'FRONTEND',
        roleTag: 'CROSS-PLATFORM MOBILE INTERFACES',
        description: 'Native mobile UI components, bridge communication, touch gesture handlers, and responsive layouts.',
        accentColor: '#60a5fa',
        badge: 'MOBILE',
      },
      {
        id: 'expo',
        name: 'Expo',
        category: 'FRONTEND',
        roleTag: 'MOBILE TOOLCHAIN & RUNTIME',
        description: 'Managed mobile app workflows, rapid device testing, native hardware APIs, and client builds.',
        accentColor: '#60a5fa',
        badge: 'TOOL',
      },
      {
        id: 'tailwindcss',
        name: 'Tailwind CSS',
        category: 'FRONTEND',
        roleTag: 'UTILITY-FIRST DESIGN SYSTEMS',
        description: 'Atomic utility styling, custom typography/color tokens, and responsive layout breakpoints.',
        accentColor: '#60a5fa',
        badge: 'CSS',
      },
    ],
  },
  {
    id: 'backend',
    title: 'BACKEND / DATA',
    code: 'BKD-03',
    subtitle: 'SERVER RUNTIMES & RELATIONAL STORAGE',
    accentColor: '#10b981', // Emerald
    technologies: [
      {
        id: 'nodejs',
        name: 'Node.js',
        category: 'BACKEND / DATA',
        roleTag: 'SERVER RUNTIME & ASYNC I/O',
        description: 'Non-blocking event loop runtime, Express microservices, REST API endpoints, and server sockets.',
        accentColor: '#10b981',
        badge: 'SRV',
      },
      {
        id: 'supabase',
        name: 'Supabase',
        category: 'BACKEND / DATA',
        roleTag: 'POSTGRESQL & REALTIME CLOUD BACKEND',
        description: 'Managed relational cloud databases, real-time table subscriptions, auth, and row-level security.',
        accentColor: '#10b981',
        badge: 'CLOUD',
      },
      {
        id: 'mysql',
        name: 'MySQL',
        category: 'BACKEND / DATA',
        roleTag: 'RELATIONAL DBMS & ACID TRANSACTIONS',
        description: 'Structured relational data modeling, query optimization, foreign key constraints, and indexing.',
        accentColor: '#10b981',
        badge: 'DB',
      },
    ],
  },
  {
    id: 'graphics',
    title: '3D / GRAPHICS',
    code: 'GFX-04',
    subtitle: 'REAL-TIME SHADERS & SPATIAL WORLDS',
    accentColor: '#ec4899', // Neon Magenta / Orchid
    technologies: [
      {
        id: 'webgl',
        name: 'WebGL',
        category: '3D / GRAPHICS',
        roleTag: 'GPU RASTERIZATION & GRAPHICS PIPELINE',
        description: 'Hardware-accelerated 2D/3D graphics rendering in the browser without third-party plugins.',
        accentColor: '#ec4899',
        badge: 'GPU',
      },
      {
        id: 'threejs',
        name: 'Three.js',
        category: '3D / GRAPHICS',
        roleTag: 'REAL-TIME 3D / WEBGL',
        description: '3D scene graph orchestration, camera projections, custom GLSL shaders, lights, and PBR materials.',
        accentColor: '#ec4899',
        badge: '3D',
      },
      {
        id: 'r3f',
        name: 'React Three Fiber',
        category: '3D / GRAPHICS',
        roleTag: 'DECLARATIVE 3D SCENE RECONCILER',
        description: 'Component-based Three.js lifecycle management, procedural animation hooks, and 3D viewports.',
        accentColor: '#ec4899',
        badge: 'R3F',
      },
      {
        id: 'blender',
        name: 'Blender',
        category: '3D / GRAPHICS',
        roleTag: '3D MODELING & GEOMETRY WORKFLOWS',
        description: 'Polygonal hard-surface modeling, mesh topology optimization, UV unwrapping, and asset prep.',
        accentColor: '#ec4899',
        badge: 'MESH',
      },
    ],
  },
  {
    id: 'tools',
    title: 'TOOLS',
    code: 'TLS-05',
    subtitle: 'VERSION CONTROL & WORKFLOW TOOLCHAIN',
    accentColor: '#f59e0b', // Cyber Amber
    technologies: [
      {
        id: 'git',
        name: 'Git',
        category: 'TOOLS',
        roleTag: 'DISTRIBUTED VERSION CONTROL',
        description: 'Commit graphs, branching workflows, cherry-picking, stash mechanics, and repository state.',
        accentColor: '#f59e0b',
        badge: 'VCS',
      },
      {
        id: 'github',
        name: 'GitHub',
        category: 'TOOLS',
        roleTag: 'COLLABORATION & OPEN SOURCE ARCHIVE',
        description: 'Remote code hosting, pull request code reviews, issue tracking, and automated deployment actions.',
        accentColor: '#f59e0b',
        badge: 'HUB',
      },
      {
        id: 'vscode',
        name: 'VS Code',
        category: 'TOOLS',
        roleTag: 'DEVELOPMENT ENVIRONMENT & DEBUGGING',
        description: 'TypeScript language server integration, debugger tooling, linting configurations, and workflows.',
        accentColor: '#f59e0b',
        badge: 'IDE',
      },
    ],
  },
  {
    id: 'ai-dev',
    title: 'AI / DEVELOPMENT',
    code: 'AID-06',
    subtitle: 'INTELLIGENT RUNTIMES & AUTOMATION',
    accentColor: '#a855f7', // Electric Violet
    technologies: [
      {
        id: 'groq',
        name: 'Groq',
        category: 'AI / DEV',
        roleTag: 'ULTRA-FAST LPU INFERENCE ENGINE',
        description: 'Language Processing Unit acceleration for real-time, low-latency LLM streaming and reasoning.',
        accentColor: '#a855f7',
        badge: 'LPU',
      },
      {
        id: 'ai-integrations',
        name: 'AI Integrations',
        category: 'AI / DEV',
        roleTag: 'AUTOMATION & INTELLIGENT WORKFLOWS',
        description: 'Voice recognition/synthesis (Jarvis-AI), OpenAI API completions, prompt engineering, and agentic workflows.',
        accentColor: '#a855f7',
        badge: 'AGNT',
      },
    ],
  },
];

export const ALL_TECHNOLOGIES: TechItem[] = TECH_CATEGORIES_DATA.flatMap((cat) => cat.technologies);
