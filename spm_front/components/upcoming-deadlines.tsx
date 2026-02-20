"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { Calendar } from "lucide-react"
import { format, parseISO, differenceInDays } from "date-fns"
import type { Project } from "@/lib/data"
import { useMemo } from "react"

interface UpcomingDeadlinesProps {
  projects: Project[]
}

export function UpcomingDeadlines({ projects }: UpcomingDeadlinesProps) {
  const deadlines = useMemo(() => {
    const now = new Date()
    const items: { project: Project; type: "NEA" | "PFHO"; date: Date; daysLeft: number }[] = []

    projects
      .filter((p) => p.status !== "Completed" && p.status !== "Cancelled")
      .forEach((p) => {
        const neaDate = parseISO(p.neaDate)
        const pfhoDate = parseISO(p.pfhoDate)

        const neaDays = differenceInDays(neaDate, now)
        if (neaDays >= 0) {
          items.push({ project: p, type: "NEA", date: neaDate, daysLeft: neaDays })
        }

        const pfhoDays = differenceInDays(pfhoDate, now)
        if (pfhoDays >= 0) {
          items.push({ project: p, type: "PFHO", date: pfhoDate, daysLeft: pfhoDays })
        }
      })

    return items.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 6)
  }, [projects])

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {deadlines.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No upcoming deadlines
          </p>
        ) : (
          deadlines.map((item, i) => (
            <div
              key={`${item.project.id}-${item.type}-${i}`}
              className="flex items-center gap-3 rounded-lg border bg-secondary/30 p-3"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <Calendar className="size-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.project.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.type} &middot; {format(item.date, "MMM d, yyyy")}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <span
                  className={`text-sm font-semibold ${
                    item.daysLeft <= 14
                      ? "text-chart-5"
                      : "text-foreground"
                  }`}
                >
                  {item.daysLeft === 0
                    ? "Today"
                    : `${item.daysLeft}d left`}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
