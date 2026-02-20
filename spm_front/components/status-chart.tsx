"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Project } from "@/lib/data"
import { useMemo } from "react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

const STATUS_COLORS: Record<string, string> = {
  "Planning": "oklch(0.65 0.19 240)",
  "In Progress": "oklch(0.70 0.17 160)",
  "Completed": "oklch(0.75 0.15 80)",
  "On Hold": "oklch(0.65 0.22 30)",
  "Cancelled": "oklch(0.55 0.2 27)",
}

interface StatusChartProps {
  projects: Project[]
}

export function StatusChart({ projects }: StatusChartProps) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {}
    projects.forEach((p) => {
      counts[p.status] = (counts[p.status] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [projects])

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Status Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center gap-4 md:flex-row">
        <div className="h-48 w-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={STATUS_COLORS[entry.name] || "#666"}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.17 0.005 260)",
                  border: "1px solid oklch(0.25 0.005 260)",
                  borderRadius: "8px",
                  color: "oklch(0.95 0 0)",
                  fontSize: "13px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-2">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <span
                className="size-3 rounded-full"
                style={{ backgroundColor: STATUS_COLORS[entry.name] || "#666" }}
              />
              <span className="text-sm text-muted-foreground">{entry.name}</span>
              <span className="ml-auto text-sm font-semibold">{entry.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
