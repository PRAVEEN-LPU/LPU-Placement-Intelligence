import * as THREE from 'three';

// 3D zigzag ascending mountain highway coordinates
export const ROAD_POINTS = [
  new THREE.Vector3(-7.5, 0.4, 13.0),   // Start Point
  new THREE.Vector3(-6.0, 0.6, 10.5),   // Approach
  new THREE.Vector3(-3.2, 1.3, 7.2),    // Milestone 1 (Build Fundamentals)
  new THREE.Vector3(0.5, 2.0, 5.5),     // Turn 1 right
  new THREE.Vector3(4.2, 2.9, 3.2),     // Turn 1 apex
  new THREE.Vector3(4.8, 3.5, 0.5),     // Milestone 2 (Build Projects)
  new THREE.Vector3(2.5, 4.1, -1.8),    // Turn 2 left
  new THREE.Vector3(-1.0, 4.7, -3.2),   // Sweeping bend
  new THREE.Vector3(-3.8, 5.3, -5.2),   // Milestone 3 (Internship & Experience)
  new THREE.Vector3(-4.2, 5.9, -7.5),   // Turn 3 right
  new THREE.Vector3(-1.2, 6.6, -9.0),   // S-curve center
  new THREE.Vector3(3.5, 7.3, -10.5),   // Milestone 4 (GATE 2027 Preparation)
  new THREE.Vector3(4.6, 7.9, -12.5),   // Turn 4 left
  new THREE.Vector3(1.5, 8.6, -14.2),   // Mountain ridge
  new THREE.Vector3(-1.8, 9.2, -15.8),  // Milestone 5 (PSU / IIT / IISc / Govt Job)
  new THREE.Vector3(0.2, 9.8, -17.5),   // Final ascent
  new THREE.Vector3(3.2, 10.8, -19.5),  // Milestone 6 (Goal Summit Peak)
];

// Create smooth CatmullRomCurve3
export const roadCurve = new THREE.CatmullRomCurve3(ROAD_POINTS, false, 'catmullrom', 0.4);

// Milestone definitions matching the reference image and requirements
export const MILESTONES_DATA = [
  {
    id: 1,
    title: 'Build Fundamentals',
    subtitle: '(DSA, OS, DBMS)',
    icon: 'book',
    badgeColor: '#38bdf8', // Neon Sky Blue
    glowColor: '#0284c7',
    t: 0.14, // Progress along curve (0.0 to 1.0)
    category: 'Computer Science Core',
    target: 'CGPA ≥ 7.50 & 0 Backlogs',
    whyItMatters:
      'Mastery of core Data Structures, Algorithms, Operating Systems, and DBMS forms the bedrock of every technical interview round.',
    actionPlan: [
      'Arrays, HashMaps, Two Pointers, and Linked Lists problem sets.',
      'Core OS processes, threading, deadlocks, and virtual memory.',
      'SQL joins, normalization, indexing, and transactions (ACID).',
    ],
    resource: 'GeeksforGeeks & LeetCode Core Track',
  },
  {
    id: 2,
    title: 'Build Projects',
    subtitle: '(AI/ML, Web, App)',
    icon: 'code',
    badgeColor: '#2dd4bf', // Neon Teal / Cyan
    glowColor: '#0f766e',
    t: 0.32,
    category: 'Hands-on Engineering',
    target: '≥ 2 Production Projects with Live Demos',
    whyItMatters:
      'Production-grade full-stack and ML applications with clean Git commits prove real-world engineering problem solving.',
    actionPlan: [
      'Build end-to-end full-stack app with React, FastAPI/Node, and PostgreSQL.',
      'Train & deploy an ML microservice with automated CI/CD pipeline.',
      'Document architecture with system diagrams and clean README.',
    ],
    resource: 'GitHub Student Developer Pack & Vercel',
  },
  {
    id: 3,
    title: 'Internship & Experience',
    subtitle: '(Industry Practice)',
    icon: 'trending-up',
    badgeColor: '#f59e0b', // Neon Amber / Gold
    glowColor: '#b45309',
    t: 0.50,
    category: 'Industry Exposure',
    target: '≥ 1 Verified Internship or Open Source Contrib',
    whyItMatters:
      'Demonstrates teamwork in production environments, agile sprints, code reviews, and cross-functional communication.',
    actionPlan: [
      'Apply to curated campus drive internships and startup incubators.',
      'Contribute pull requests to recognized open-source repositories.',
      'Quantify achievements using metrics (e.g. reduced latency by 35%).',
    ],
    resource: 'Wellfound, LinkedIn & Internshala',
  },
  {
    id: 4,
    title: 'GATE 2027 Preparation',
    subtitle: '(Aptitude & Speed Reasoning)',
    icon: 'target',
    badgeColor: '#a855f7', // Neon Purple
    glowColor: '#7e22ce',
    t: 0.68,
    category: 'Higher Studies & Competitive Screening',
    target: 'Aptitude & Quantitative Score ≥ 70%',
    whyItMatters:
      'Rigorous quantitative drills develop rapid cognitive speed and analytical acuity required for tier-1 entrance tests.',
    actionPlan: [
      'Timed daily sectional drills in discrete math, TOC, and algorithms.',
      'Practice previous 10-year GATE papers under real exam timing.',
      'Master mental math shortcuts for numerical answer type (NAT) questions.',
    ],
    resource: 'Made Easy & IndiaBIX Drills',
  },
  {
    id: 5,
    title: 'PSU / IIT / IISc / Govt Job',
    subtitle: '(DSP / PCS / Super-Dream)',
    icon: 'briefcase',
    badgeColor: '#fb923c', // Warm Bronze / Orange
    glowColor: '#c2410c',
    t: 0.85,
    category: 'Elite Institutional Roles',
    target: 'Communication & Technical Mastery ≥ 75%',
    whyItMatters:
      'Unlocks elite PSU recruitments (ISRO, DRDO, ONGC, IOCL) and premier institutional placements with 12 to 24+ LPA packages.',
    actionPlan: [
      'Structure behavioral and technical interviews using the STAR framework.',
      'Prepare comprehensive technical domain dossier and thesis highlights.',
      'Participate in simulated faculty mock interview panels.',
    ],
    resource: 'LPU Placement Cell & Testbook Mock Tests',
  },
  {
    id: 6,
    title: 'Goal',
    subtitle: '(Campus Dream Placement)',
    icon: 'trophy',
    badgeColor: '#eab308', // Radiant Golden Summit
    glowColor: '#ca8a04',
    t: 1.0,
    category: 'Summit Achievement',
    target: 'Top-Tier Dream Campus Offer (12–24+ LPA)',
    whyItMatters:
      'The ultimate destination: verified recruitment readiness, zero backlog friction, and outstanding package offer.',
    actionPlan: [
      'Celebrate milestone clearance with faculty mentors!',
      'Negotiate offer terms and finalize joining schedule.',
      'Transition seamlessly into professional engineering career.',
    ],
    resource: 'LPU Placement Portal & Alumni Network',
  },
];
