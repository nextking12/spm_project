"use client"

import { useState } from "react"
import { StatCards } from "@/components/stat-cards"
import { ProjectTable } from "@/components/project-table"
import { StatusChart } from "@/components/status-chart"
import { UpcomingDeadlines } from "@/components/upcoming-deadlines"
import { projects as initialProjects, type Project } from "@/lib/data"
import { FolderKanban } from "lucide-react"

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)

  function handleUpdateProject(updated: Project) {
    setProjects((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <FolderKanban className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-none tracking-tight text-balance">
              Project Tracker
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Manage and monitor project milestones
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <StatCards projects={projects} />

          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <StatusChart projects={projects} />
            </div>
            <div className="lg:col-span-3">
              <UpcomingDeadlines projects={projects} />
            </div>
          </div>

          <ProjectTable projects={projects} onUpdateProject={handleUpdateProject} />
        </div>
      </main>
    </div>
  )
}
