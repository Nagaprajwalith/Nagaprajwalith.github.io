// All the portfolio's content lives here. Edit this file to update the site.

// ---- Your photo ----
// Put your photo in the `public` folder (e.g. public/me.jpg) and change this to './me.jpg'.
// A tall portrait (about 3:4) with a plain background looks best on the holographic card.
export const PHOTO = './photo-placeholder.svg'

export const PROFILE = {
  name: 'Naga Prajwalith P',
  short: 'Prajwalith',
  role: 'Data Engineer',
  handle: 'Nagaprajwalith',
  location: 'Hyderabad, India',
  email: 'prajwalithp@gmail.com',
  phone: '+91 83740 62657',
  phoneHref: 'tel:+918374062657',
  github: 'https://github.com/Nagaprajwalith',
  linkedin: '', // paste your LinkedIn URL here to show it in the dock and contact section
  resume: './Naga-Prajwalith-P-Resume.pdf',
  summary:
    'Data Engineer at Vanna Infotech, building PySpark and Azure Databricks pipelines that move enterprise data from raw to report-ready. AI & ML graduate at heart.',
}

export const ROTATING_ROLES = [
  'ETL pipelines',
  'lakehouse tables',
  'migration tools',
  'machine learning models',
]

export type Project = {
  title: string
  tagline: string
  description: string
  highlights: string[]
  tech: string[] // keys of TECH below
  link?: string
  gradient: string
  emoji: string
}

export const PROJECTS: Project[] = [
  {
    title: 'Dynamic Pricing',
    tagline: 'Personalised interest rates for fixed deposits and home loans',
    description:
      'A dynamic interest-rate model that uses genetic algorithms to personalise rates from customer profiles and market conditions.',
    highlights: [
      'Gives low-risk customers better rates while protecting profitability',
      'Genetic algorithms search for the best rate under risk constraints',
      'LLM-assisted Flask web app for exploring offers',
    ],
    tech: ['python', 'flask', 'llm', 'javascript', 'html'],
    gradient: 'from-violet-600 via-indigo-600 to-sky-500',
    emoji: '🏦',
  },
  {
    title: 'Crop Intellect',
    tagline: 'Machine-learning crop recommendations for farmers',
    description:
      'A platform that recommends the best crop for a piece of land by analysing soil properties, climate conditions and market demand.',
    highlights: [
      'Supervised models (decision trees and random forests) trained on soil and climate data',
      'Flask backend with a MySQL database, deployed on Render',
      'Helps farmers choose crops for higher yield and profit',
    ],
    tech: ['python', 'scikitlearn', 'flask', 'mysql', 'html'],
    link: 'https://github.com/Nagaprajwalith/CROP-INTELLECT',
    gradient: 'from-emerald-500 via-teal-500 to-amber-400',
    emoji: '🌾',
  },
  {
    title: 'Road Accident Analysis',
    tagline: 'Predicting how severe an accident will be',
    description:
      'A machine-learning model that predicts accident severity from road accident data, to support traffic-safety decisions.',
    highlights: [
      'Exploratory data analysis and feature selection to find the key factors',
      'Random Forest classifier for severity prediction',
      'Interactive Plotly charts of casualty patterns',
    ],
    tech: ['python', 'pandas', 'scikitlearn', 'plotly', 'jupyter'],
    link: 'https://github.com/Nagaprajwalith/Roadaccident_Analysis',
    gradient: 'from-rose-500 via-orange-500 to-amber-400',
    emoji: '🚦',
  },
  {
    title: 'Evidence Chain',
    tagline: 'Tamper-proof criminal evidence management on a blockchain',
    description:
      'A blockchain-based system that keeps forensic evidence tamper-proof, transparent and traceable from collection to courtroom.',
    highlights: [
      'Every hand-off is recorded on a decentralised ledger, so the chain of custody can be audited',
      'Smart contracts restrict access to authorised roles only',
      'Builds trust in evidence used in legal proceedings',
    ],
    tech: ['blockchain', 'smartcontract', 'javascript'],
    gradient: 'from-slate-600 via-blue-700 to-cyan-500',
    emoji: '🔗',
  },
]

export const SKILL_GROUPS = [
  { title: 'Data engineering', items: ['ETL development', 'PySpark', 'Azure Data Factory', 'Azure Databricks', 'Medallion architecture', 'Data modelling', 'Data migration', 'Data validation'] },
  { title: 'Databases & platforms', items: ['MySQL', 'Teradata', 'Databricks SQL', 'Delta Lake'] },
  { title: 'AI & machine learning', items: ['Supervised & unsupervised ML', 'Generative AI', 'LLMs', 'RAG', 'Prompt engineering'] },
  { title: 'Languages', items: ['Python', 'Java', 'SQL', 'Shell scripting (basics)'] },
  { title: 'Cloud & reporting', items: ['Microsoft Azure', 'AWS', 'Power BI'] },
  { title: 'Data security', items: ['DSPM', 'Data classification & scanning', 'Cyera'] },
  { title: 'AI tools I use daily', items: ['GitHub Copilot', 'Claude Code', 'n8n', 'NotebookLM', 'Antigravity'] },
  { title: 'Version control', items: ['Git', 'GitHub'] },
]

export const CERTIFICATIONS = [
  'AWS Cloud Essentials',
  'Data Security Posture Management (Fundamentals)',
  'Skill Nation Power BI',
  'AI ChatGPT Workshop',
]

export type Job = {
  role: string
  org: string
  client?: string
  kind: 'Full-time' | 'Industry program'
  period: string
  start: string // YYYY-MM, used to show time in role
  end?: string // YYYY-MM; leave out while current
  current?: boolean
  summary: string
  points: string[]
  stack: string[]
  // Problem → what I did → result, shown instead of the bullet points when present
  caseStudy?: { problem: string; did: string; result: string }
}

export const EXPERIENCE: Job[] = [
  {
    role: 'Data Engineer',
    org: 'Vanna Infotech',
    client: 'PepsiCo (Alyptix)',
    kind: 'Full-time',
    period: 'Aug 2025 – now',
    start: '2025-08',
    current: true,
    summary: 'End-to-end ETL on Azure for an enterprise Teradata-to-cloud migration.',
    points: [
      'Design, build and maintain ETL pipelines with PySpark and Azure Data Factory across the Bronze, Silver and Gold layers of a Medallion architecture',
      'Curate raw Bronze ingests into cleansed Silver tables and aggregated Gold tables on Azure Databricks and Delta Lake for reporting teams',
      'Validate data across Teradata and the cloud so downstream reports stay accurate and consistent',
      'Work with cross-functional teams to turn business requirements into scalable data solutions',
    ],
    stack: ['PySpark', 'Azure Data Factory', 'Azure Databricks', 'Delta Lake', 'Teradata', 'SQL'],
  },
  {
    role: 'DSPM Training Program',
    org: 'Sonata Software',
    kind: 'Industry program',
    period: 'Mar 2025 – Jul 2025',
    start: '2025-03',
    end: '2025-07',
    summary: 'Hands-on Data Security Posture Management with Cyera, for selected NGIT students.',
    points: [
      'Used Cyera to discover, classify and monitor sensitive data across simulated cloud environments',
      'Spotted over-exposed data and excessive access permissions, then prioritised fixes by risk',
      'Built a foundation in data governance, access control and cloud data security',
    ],
    stack: ['Cyera', 'DSPM', 'Data classification', 'Access control'],
    caseStudy: {
      problem: 'Sensitive data spreads across cloud environments, and it is hard to see where it lives or who can reach it.',
      did: 'Used Cyera to discover, classify and monitor sensitive data across simulated cloud environments, flagging over-exposed data and excessive access permissions.',
      result: 'Prioritised the fixes by risk, and came away with a foundation in data governance, access control and cloud data security.',
    },
  },
]

// Internal tools built on the job (described generically, no client code)
export const TOOLS_BUILT = [
  {
    title: 'Teradata lineage tracer',
    problem: 'Tracing lineage by hand through complex semantic views took the team days.',
    built: 'A tool that walks the dependencies of tables and views automatically and maps where every column comes from.',
    result: 'Traces up to 50 complex semantic views in one run. Days of manual work, now automated.',
  },
  {
    title: 'DDL converter',
    problem: 'Rewriting Teradata table definitions for Databricks by hand was slow and easy to get wrong.',
    built: 'A converter that translates Teradata DDL scripts into Azure Databricks / Delta Lake schema definitions.',
    result: 'Schema migration runs faster, with consistent type mappings every time.',
  },
]

export const STRENGTHS = ['Adaptive learner', 'Time management', 'Clear communicator', 'Decisive', 'Always curious']

export const EDUCATION = [
  {
    period: '2021 – 2025',
    title: 'B.Tech, Computer Science & Engineering',
    detail: 'Specialisation in AI & ML',
    school: 'Neil Gogte Institute of Technology',
    score: 'CGPA 8.0',
  },
  {
    period: '2021',
    title: 'Intermediate',
    detail: 'Higher secondary education',
    school: 'Narayana Junior College',
    score: '80%',
  },
  {
    period: '2019',
    title: 'Secondary School Certificate',
    detail: 'Class 10',
    school: 'Narayana High School',
    score: 'CGPA 9.2',
  },
]
