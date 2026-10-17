import {
  ArrowRightLeft, BrainCircuit, KeyRound, ChartColumnBig, Database, Factory, FileSearch, Layers, ListChecks, MessageSquareCode,
  Network, NotebookPen, Orbit, Radar, ScanSearch, ShieldCheck, Sparkles, Triangle, Workflow, type LucideIcon,
} from 'lucide-react'
import { TECH } from '@/tech'
import { cn } from '@/lib/utils'

// Every skill chip gets an icon: a real logo (Devicon / Simple Icons) when one exists,
// otherwise a drawn icon in a colour that fits the tool.
type Entry = { tech: string } | { Icon: LucideIcon; color: string }

const MAP: Record<string, Entry> = {
  // Data engineering
  'ETL development': { Icon: Workflow, color: '#14b8a6' },
  PySpark: { tech: 'spark' },
  'Azure Data Factory': { Icon: Factory, color: '#0078d4' },
  'Azure Databricks': { tech: 'databricks' },
  'Medallion architecture': { Icon: Layers, color: '#eab308' },
  'Data modelling': { Icon: Network, color: '#8b5cf6' },
  'Data migration': { Icon: ArrowRightLeft, color: '#0ea5e9' },
  'Data validation': { Icon: ListChecks, color: '#10b981' },
  // Databases & platforms
  MySQL: { tech: 'mysql' },
  Teradata: { tech: 'teradata' },
  'Databricks SQL': { tech: 'databricks' },
  'Delta Lake': { Icon: Triangle, color: '#00add4' },
  // AI & ML
  'Supervised & unsupervised ML': { Icon: BrainCircuit, color: '#8b5cf6' },
  'Generative AI': { Icon: Sparkles, color: '#d946ef' },
  LLMs: { tech: 'llm' },
  RAG: { Icon: FileSearch, color: '#0ea5e9' },
  'Prompt engineering': { Icon: MessageSquareCode, color: '#14b8a6' },
  // Languages
  Python: { tech: 'python' },
  Java: { tech: 'java' },
  SQL: { Icon: Database, color: '#0ea5e9' },
  'Shell scripting (basics)': { tech: 'bash' },
  // Cloud & reporting
  'Microsoft Azure': { tech: 'azure' },
  AWS: { tech: 'aws' },
  'Power BI': { Icon: ChartColumnBig, color: '#e5b80b' },
  // Data security
  DSPM: { Icon: ShieldCheck, color: '#10b981' },
  'Data classification & scanning': { Icon: ScanSearch, color: '#f43f5e' },
  Cyera: { Icon: Radar, color: '#6366f1' },
  // AI tools
  'GitHub Copilot': { tech: 'copilot' },
  'Claude Code': { tech: 'claude' },
  n8n: { tech: 'n8n' },
  NotebookLM: { Icon: NotebookPen, color: '#4285f4' },
  Antigravity: { Icon: Orbit, color: '#8b5cf6' },
  'Data classification': { Icon: ScanSearch, color: '#f43f5e' },
  'Access control': { Icon: KeyRound, color: '#f59e0b' },
  // Version control
  Git: { tech: 'git' },
  GitHub: { tech: 'github' },
}

export function SkillIcon({ name, className }: { name: string; className?: string }) {
  const e = MAP[name]
  if (!e) return null
  if ('tech' in e) {
    const t = TECH[e.tech]
    return <img src={t.src} alt="" loading="lazy" className={cn('h-4 w-4 shrink-0', t.invert && 'dark:invert', t.brighten && 'dark:brightness-[2.4]', className)} />
  }
  const { Icon, color } = e
  return <Icon aria-hidden className={cn('h-4 w-4 shrink-0', className)} style={{ color }} strokeWidth={2.2} />
}
