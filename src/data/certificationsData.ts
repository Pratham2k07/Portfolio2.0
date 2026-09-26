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
  position?: [number, number, number];
  rotationY?: number;
}

export const CERTIFICATIONS_DATA: CertificationItem[] = [
  {
    id: 'google-cybersecurity-foundations',
    title: 'Foundations of Cybersecurity',
    issuer: 'Google / Coursera',
    date: 'Jun 30, 2026',
    credentialId: '3HKAPSN0NUU3',
    verificationUrl: 'https://coursera.org/verify/3HKAPSN0NUU3',
    description:
      'Official certification authorized by Google and offered through Coursera. Demonstrates comprehensive mastery of foundational cybersecurity principles, the CIA triad, threat identification, Linux shell security operations, SQL query defenses, and incident response mitigation protocols.',
    badge: 'GOOGLE CYBERSECURITY',
    accentColor: '#38bdf8',
    skills: ['Cybersecurity Foundations', 'Threat Modeling', 'Linux Ops', 'SQL Security', 'CIA Triad'],
    image: '/certificates/google-foundations-cybersecurity.jpeg',
  },
  {
    id: 'google-play-it-safe-security-risks',
    title: 'Play It Safe: Manage Security Risks',
    issuer: 'Google / Coursera',
    date: 'Aug 19, 2026',
    credentialId: 'TBF2NMHCUJWC',
    verificationUrl: 'https://coursera.org/verify/TBF2NMHCUJWC',
    description:
      'Official certification authorized by Google and offered through Coursera. Demonstrates professional competencies in enterprise risk management, SIEM tools, network defense audits, vulnerability assessment workflows, and corporate incident response.',
    badge: 'RISK MANAGEMENT',
    accentColor: '#00f0ff',
    skills: ['Risk Assessment', 'SIEM & SOC', 'Vulnerability Audits', 'Network Defense', 'Incident Handling'],
    image: '/certificates/google-play-it-safe-security-risks.jpeg',
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
  },
];
