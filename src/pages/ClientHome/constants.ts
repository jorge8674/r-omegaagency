/* ClientHome constants — plan limits, agent catalog, departments */

export interface PlanLimit {
  posts: number | null;
  msgs: number | null;
  redes: number | null;
  label: string;
  price: string;
}

export const PLAN_LIMITS: Record<string, PlanLimit> = {
  basic:      { posts: 50,  msgs: 250, redes: 5, label: "Plan Básico",   price: "$2,500/mes" },
  pro:        { posts: 150, msgs: 600, redes: 5, label: "Nova Dedicada", price: "$5,000/mes" },
  enterprise: { posts: null, msgs: null, redes: null, label: "Company",  price: "$10,000+/mes" },
};

export interface CatalogAgent {
  code: string;
  name: string;
  dept: string;
  role: string;
  price: number;
  type: string;
}

export const AGENT_CATALOG: CatalogAgent[] = [
  // ATLAS — Marketing
  { code:"ATLAS",  name:"ATLAS",  dept:"Marketing", role:"Director de Marketing",      price:1080, type:"individual_agent" },
  { code:"RAFA",   name:"RAFA",   dept:"Marketing", role:"Copywriter Senior",           price:960,  type:"individual_agent" },
  { code:"MAYA",   name:"MAYA",   dept:"Marketing", role:"Estratega de Contenido",      price:900,  type:"individual_agent" },
  { code:"DUDA",   name:"DUDA",   dept:"Marketing", role:"Social Media Manager",        price:840,  type:"individual_agent" },
  { code:"LOLA",   name:"LOLA",   dept:"Marketing", role:"Analista Competitiva",        price:870,  type:"individual_agent" },
  { code:"LUAN",   name:"LUAN",   dept:"Marketing", role:"Director de Paid Media",      price:960,  type:"individual_agent" },
  { code:"DANI",   name:"DANI",   dept:"Marketing", role:"Investigadora de Tendencias", price:810,  type:"individual_agent" },
  { code:"SARA",   name:"SARA",   dept:"Marketing", role:"Agente de Pre-Ventas",        price:810,  type:"individual_agent" },
  { code:"MALU",   name:"MALU",   dept:"Marketing", role:"Gestora de Alianzas",         price:780,  type:"individual_agent" },
  // LUNA — Tech & Product
  { code:"LUNA",       name:"LUNA",       dept:"Tech & Product", role:"Directora de Tecnología",  price:1080, type:"individual_agent" },
  { code:"ARCH",       name:"ARCH",       dept:"Tech & Product", role:"Guardián de Arquitectura", price:900,  type:"individual_agent" },
  { code:"PIXEL",      name:"PIXEL",      dept:"Tech & Product", role:"Agente de Bug Triage",     price:840,  type:"individual_agent" },
  { code:"PULSE-TECH", name:"PULSE-TECH", dept:"Tech & Product", role:"Analista de Producto",     price:870,  type:"individual_agent" },
  { code:"SCRIBE",     name:"SCRIBE",     dept:"Tech & Product", role:"Agente de Documentación",  price:750,  type:"individual_agent" },
  { code:"SHIELD",     name:"SHIELD",     dept:"Tech & Product", role:"Agente de QA",             price:840,  type:"individual_agent" },
  // REX — Operations
  { code:"REX",        name:"REX",        dept:"Operations", role:"Director de Operaciones", price:1080, type:"individual_agent" },
  { code:"ANCHOR",     name:"ANCHOR",     dept:"Operations", role:"Agente de Retención",     price:840,  type:"individual_agent" },
  { code:"ECHO",       name:"ECHO",       dept:"Operations", role:"Soporte al Cliente L1",   price:750,  type:"individual_agent" },
  { code:"MIRROR-OPS", name:"MIRROR-OPS", dept:"Operations", role:"Optimizador de Procesos", price:840,  type:"individual_agent" },
  { code:"ONYX",       name:"ONYX",       dept:"Operations", role:"Agente de Onboarding",    price:810,  type:"individual_agent" },
  { code:"RESELL-OPS", name:"RESELL-OPS", dept:"Operations", role:"Soporte a Resellers",     price:780,  type:"individual_agent" },
  // VERA — Finance
  { code:"VERA",       name:"VERA",       dept:"Finance", role:"Directora de Finanzas",        price:1080, type:"individual_agent" },
  { code:"GUARD",      name:"GUARD",      dept:"Finance", role:"Agente de Alertas Billing",    price:780,  type:"individual_agent" },
  { code:"LEDGER-FIN", name:"LEDGER-FIN", dept:"Finance", role:"Rastreador de Revenue",        price:870,  type:"individual_agent" },
  { code:"REPORT",     name:"REPORT",     dept:"Finance", role:"Analista Financiero",          price:840,  type:"individual_agent" },
  { code:"SCOPE",      name:"SCOPE",      dept:"Finance", role:"Analista de Churn Financiero", price:840,  type:"individual_agent" },
  // KIRA — Community
  { code:"KIRA",      name:"KIRA",      dept:"Community", role:"Directora de Comunidad",   price:1080, type:"individual_agent" },
  { code:"CONSTRUCT", name:"CONSTRUCT", dept:"Community", role:"Vertical Construcción",    price:900,  type:"individual_agent" },
  { code:"ESTATE",    name:"ESTATE",    dept:"Community", role:"Vertical Real Estate",     price:900,  type:"individual_agent" },
  { code:"HAVEN",     name:"HAVEN",     dept:"Community", role:"Community Manager Activo", price:810,  type:"individual_agent" },
  { code:"NURTURE",   name:"NURTURE",   dept:"Community", role:"Agente de Nurturing",      price:810,  type:"individual_agent" },
  { code:"REVIEW",    name:"REVIEW",    dept:"Community", role:"Agente de Reputación",     price:840,  type:"individual_agent" },
  // ORACLE — Futures
  { code:"ORACLE",     name:"ORACLE",     dept:"Futures", role:"Director de Futuros",           price:1080, type:"individual_agent" },
  { code:"MIRROR-FUT", name:"MIRROR-FUT", dept:"Futures", role:"Analista de Futuros Comp.",     price:900,  type:"individual_agent" },
  { code:"NEXUS",      name:"NEXUS",      dept:"Futures", role:"Sintetizador de Oportunidades", price:930,  type:"individual_agent" },
  { code:"SCOUT",      name:"SCOUT",      dept:"Futures", role:"Cazador de Tendencias",         price:870,  type:"individual_agent" },
  { code:"VEGA",       name:"VEGA",       dept:"Futures", role:"Antropóloga de Mercado",        price:900,  type:"individual_agent" },
  // SOPHIA — People
  { code:"SOPHIA",     name:"SOPHIA",     dept:"People", role:"Directora de Personas",   price:1080, type:"individual_agent" },
  { code:"LEDGER-HR",  name:"LEDGER-HR",  dept:"People", role:"Operaciones de RRHH",     price:780,  type:"individual_agent" },
  { code:"PROMETHEUS", name:"PROMETHEUS", dept:"People", role:"Agente de Performance",   price:840,  type:"individual_agent" },
  { code:"PULSE",      name:"PULSE",      dept:"People", role:"Agente de Cultura",       price:780,  type:"individual_agent" },
  { code:"RECRUIT",    name:"RECRUIT",    dept:"People", role:"Agente de Reclutamiento", price:810,  type:"individual_agent" },
  { code:"TRAINER",    name:"TRAINER",    dept:"People", role:"Agente de Desarrollo",    price:780,  type:"individual_agent" },
  // SENTINEL — Security
  { code:"SENTINEL",     name:"SENTINEL",     dept:"Security", role:"Director de Seguridad",     price:1320, type:"individual_agent" },
  { code:"ARCH-SCAN",    name:"ARCH-SCAN",    dept:"Security", role:"Validador de Arquitectura", price:960,  type:"individual_agent" },
  { code:"AUTO-HEALER",  name:"AUTO-HEALER",  dept:"Security", role:"Agente Auto-Sanación",      price:1020, type:"individual_agent" },
  { code:"COMPLIANCE",   name:"COMPLIANCE",   dept:"Security", role:"Agente de Compliance",      price:930,  type:"individual_agent" },
  { code:"DB-GUARDIAN",  name:"DB-GUARDIAN",  dept:"Security", role:"Guardián de Base de Datos", price:930,  type:"individual_agent" },
  { code:"DEBT-HUNTER",  name:"DEBT-HUNTER",  dept:"Security", role:"Cazador de Deuda Técnica",  price:840,  type:"individual_agent" },
  { code:"DEP-WATCH",    name:"DEP-WATCH",    dept:"Security", role:"Monitor de Dependencias",   price:870,  type:"individual_agent" },
  { code:"FORTRESS",     name:"FORTRESS",     dept:"Security", role:"Agente de Hardening",       price:960,  type:"individual_agent" },
  { code:"MIGRATION-VAL",name:"MIGRATION-VAL",dept:"Security", role:"Validador de Migraciones",  price:900,  type:"individual_agent" },
  { code:"PULSE-MON",    name:"PULSE-MON",    dept:"Security", role:"Monitor de Uptime",         price:900,  type:"individual_agent" },
  { code:"SENT-BRAIN",   name:"SENT-BRAIN",   dept:"Security", role:"Inteligencia de Seguridad", price:1020, type:"individual_agent" },
  { code:"SPEED-ANZ",    name:"SPEED-ANZ",    dept:"Security", role:"Profiler de Performance",   price:870,  type:"individual_agent" },
  { code:"VAULT",        name:"VAULT",        dept:"Security", role:"Guardián de Credenciales",  price:960,  type:"individual_agent" },
];

export interface Department {
  code: string;
  name: string;
  director: string;
  totalPrice: number;
}

export const DEPARTMENTS: Department[] = [
  { code:"atlas_marketing",   name:"ATLAS — Marketing",     director:"ATLAS",    totalPrice:8010  },
  { code:"luna_tech",         name:"LUNA — Tech & Product",  director:"LUNA",     totalPrice:5280  },
  { code:"rex_operations",    name:"REX — Operations",       director:"REX",      totalPrice:5100  },
  { code:"vera_finance",      name:"VERA — Finance",         director:"VERA",     totalPrice:4410  },
  { code:"kira_community",    name:"KIRA — Community",       director:"KIRA",     totalPrice:5340  },
  { code:"oracle_futures",    name:"ORACLE — Futures",       director:"ORACLE",   totalPrice:4680  },
  { code:"sophia_people",     name:"SOPHIA — People",        director:"SOPHIA",   totalPrice:5070  },
  { code:"sentinel_security", name:"SENTINEL — Security",    director:"SENTINEL", totalPrice:12480 },
];

export const DEPT_FILTER_TABS = [
  "Todos", "Marketing", "Tech & Product", "Operations",
  "Finance", "Community", "Futures", "People", "Security",
];

export const PLAN_BADGE_STYLE: Record<string, string> = {
  basic: "bg-muted text-muted-foreground",
  pro: "bg-chart-3/20 text-chart-3",
  enterprise: "bg-primary/20 text-primary",
};
