export interface ProjectFinances {
  budget: number
  spent: number
  committed: number
}

export interface Project {
  id: number
  name: string
  description: string
  status: string
  startDate: string
  neaDate: string
  pfhoDate: string
  finances: ProjectFinances
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`
  }
  return `$${value.toLocaleString()}`
}

export const STATUS_OPTIONS = [
  "Planning",
  "In Progress",
  "On Hold",
  "Completed",
  "Cancelled",
] as const

export const projects: Project[] = [
  {
    id: 1,
    name: "Highway Bridge Rehabilitation",
    description: "Structural rehabilitation of the I-95 overpass bridge including deck replacement and seismic retrofitting",
    status: "In Progress",
    startDate: "2025-01-15",
    neaDate: "2025-06-30",
    pfhoDate: "2025-12-15",
    finances: { budget: 4_500_000, spent: 1_800_000, committed: 2_100_000 },
  },
  {
    id: 2,
    name: "Downtown Water Main Upgrade",
    description: "Replace aging cast iron water mains with ductile iron pipes in the downtown commercial district",
    status: "Planning",
    startDate: "2025-03-01",
    neaDate: "2025-09-15",
    pfhoDate: "2026-03-01",
    finances: { budget: 2_200_000, spent: 120_000, committed: 350_000 },
  },
  {
    id: 3,
    name: "Airport Terminal Expansion",
    description: "Phase 2 terminal expansion including new concourse and passenger boarding bridges",
    status: "In Progress",
    startDate: "2024-08-20",
    neaDate: "2025-04-10",
    pfhoDate: "2026-08-20",
    finances: { budget: 85_000_000, spent: 42_000_000, committed: 30_000_000 },
  },
  {
    id: 4,
    name: "Solar Farm Installation",
    description: "100 MW solar photovoltaic farm installation on state owned land parcels",
    status: "Completed",
    startDate: "2024-02-01",
    neaDate: "2024-08-15",
    pfhoDate: "2025-01-30",
    finances: { budget: 12_000_000, spent: 11_500_000, committed: 500_000 },
  },
  {
    id: 5,
    name: "School District HVAC Modernization",
    description: "HVAC system replacement and indoor air quality improvements across 12 school buildings",
    status: "Cancelled",
    startDate: "2025-05-01",
    neaDate: "2025-11-30",
    pfhoDate: "2026-06-15",
    finances: { budget: 8_400_000, spent: 250_000, committed: 0 },
  },
]
