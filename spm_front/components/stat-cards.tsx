import { Card, CardContent } from "@/components/ui/card"
import {
  FolderKanban,
  Clock,
  CheckCircle2,
  PauseCircle,
  AlertCircle,
  DollarSign,
} from "lucide-react"
import type { Project } from "@/lib/data"
import { formatCurrency } from "@/lib/data"

interface StatCardsProps {
  projects: Project[]
}

export function StatCards({ projects }: StatCardsProps) {
  const total = projects.length
  const inProgress = projects.filter((p) => p.status === "In Progress").length
  const completed = projects.filter((p) => p.status === "Completed").length
  const onHold = projects.filter((p) => p.status === "On Hold").length
  const upcoming = projects.filter((p) => {
    const neaDate = new Date(p.neaDate)
    const now = new Date()
    const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    return neaDate <= thirtyDays && neaDate >= now && p.status !== "Completed" && p.status !== "Cancelled"
  }).length
  const totalBudget = projects.reduce((sum, p) => sum + p.finances.budget, 0)
  const totalSpent = projects.reduce((sum, p) => sum + p.finances.spent, 0)

  const stats = [
    {
      label: "Total Projects",
      value: total,
      icon: FolderKanban,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: Clock,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      label: "On Hold",
      value: onHold,
      icon: PauseCircle,
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
    },
    {
      label: "NEA Due Soon",
      value: upcoming,
      icon: AlertCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      label: "Total Budget",
      value: formatCurrency(totalBudget),
      icon: DollarSign,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      label: "Total Spent",
      value: formatCurrency(totalSpent),
      icon: DollarSign,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
      {stats.map((stat) => (
        <Card key={stat.label} className="gap-0 py-4">
          <CardContent className="flex items-center gap-3">
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`size-5 ${stat.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold leading-none tracking-tight">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
