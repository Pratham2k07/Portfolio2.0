export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  verificationUrl?: string;
  description: string;
  badge: string;
  accentColor: string;
  skills?: string[];
  image?: string;
  position: [number, number, number];
  rotationY: number;
}

export const CERTIFICATIONS_DATA: CertificationItem[] = [
  {
    id: 'google-cybersecurity',
    title: 'Google Cybersecurity Foundations',
    issuer: 'Google / Coursera',
    date: '2026',
    credentialId: 'COURSERA-GCS-2026-FND',
    description:
      'Professional certification covering core security models, threat landscape analysis, network defense architecture, Linux commands, SQL querying, and incident response mitigation protocols.',
    badge: 'CYBERSECURITY',
    accentColor: '#38bdf8',
    skills: ['Network Security', 'Linux', 'SQL', 'Threat Detection', 'Incident Response'],
    position: [-13.5, 9.5, -346],
    rotationY: 0.35,
  },
  {
    id: 'fullstack-web-architecture',
    title: 'Full-Stack Modern Web Architecture',
    issuer: 'Meta / Open Courseware',
    date: '2025',
    description:
      'Comprehensive study and mastery of modern responsive client-server architectures, asynchronous state synchronization, WebSockets, and performance-optimized rendering engines.',
    badge: 'WEB ARCHITECTURE',
    accentColor: '#10b981',
    skills: ['React 19', 'TypeScript', 'Node.js', 'State Machines', 'REST & WebSockets'],
    position: [13.5, 9.5, -346],
    rotationY: -0.35,
  },
  {
    id: 'dsa-algorithmic-problem-solving',
    title: 'Data Structures & Algorithmic Problem Solving',
    issuer: 'LeetCode / Hackerrank',
    date: '2025',
    description:
      'Rigorous algorithmic competency in data structures, graph theory, dynamic programming, sorting optimization, memory management, and computational complexity analysis in C and C++.',
    badge: 'ALGORITHMS & DS',
    accentColor: '#f59e0b',
    skills: ['Data Structures', 'C / C++', 'Dynamic Programming', 'Graph Theory', 'Algorithms'],
    position: [-13.5, 9.5, -368],
    rotationY: 0.35,
  },
  {
    id: 'cloud-infrastructure-devops',
    title: 'Cloud Infrastructure & Scalable Systems',
    issuer: 'Amazon Web Services / Cloud Guild',
    date: '2025',
    description:
      'Foundational architectures for containerized deployments, cloud storage buckets, CI/CD automated build pipelines, DNS routing, and distributed edge services.',
    badge: 'CLOUD SYSTEMS',
    accentColor: '#a855f7',
    skills: ['Cloud Architecture', 'CI/CD Pipelines', 'Linux Systems', 'Docker', 'Vercel / AWS'],
    position: [13.5, 9.5, -368],
    rotationY: -0.35,
  },
  {
    id: 'threejs-webgl-creative-tech',
    title: 'Interactive 3D WebGL & Shader Engineering',
    issuer: 'Three.js Journey & Creative Tech Guild',
    date: '2026',
    description:
      'Advanced real-time computer graphics engineering covering PBR materials, custom GLSL vertex/fragment shaders, post-processing pipelines, GPU instancing, and physics flight mechanics.',
    badge: '3D GRAPHICS & GLSL',
    accentColor: '#ec4899',
    skills: ['Three.js', 'GLSL Shaders', 'React Three Fiber', 'Post-Processing', 'Web Audio API'],
    position: [0, 9.5, -384],
    rotationY: 0,
  },
];
