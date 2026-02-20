"use client"

import { useState, useMemo } from "react"
import { format, parseISO } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { Search, Calendar, ArrowUpDown, ChevronUp, ChevronDown, DollarSign, Pencil, X, Check } from "lucide-react"
import type { Project } from "@/lib/data"
import { STATUS_OPTIONS, formatCurrency } from "@/lib/data"
import { Progress } from "@/components/ui/progress"

function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "MMM d, yyyy")
  } catch {
    return dateStr
  }
}

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr)
  const now = new Date()
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function DateCell({ dateStr, label }: { dateStr: string; label: string }) {
  const days = getDaysUntil(dateStr)
  const isSoon = days >= 0 && days <= 30

  return (
    <div className="flex flex-col">
      <span className="text-sm">{formatDate(dateStr)}</span>
      <span
        className={`text-xs ${
          isSoon
            ? "text-chart-5"
            : "text-muted-foreground"
        }`}
      >
        {days === 0
          ? `${label} today`
          : days > 0
            ? `${days}d until ${label}`
            : formatDate(dateStr)}
      </span>
    </div>
  )
}

type SortKey = "name" | "status" | "startDate" | "neaDate" | "pfhoDate"
type SortDir = "asc" | "desc"

interface ProjectTableProps {
  projects: Project[]
  onUpdateProject: (project: Project) => void
}

export function ProjectTable({ projects, onUpdateProject }: ProjectTableProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortKey, setSortKey] = useState<SortKey>("startDate")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const filtered = useMemo(() => {
    let result = projects

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter)
    }

    result = [...result].sort((a, b) => {
      let cmp = 0
      if (sortKey === "name") {
        cmp = a.name.localeCompare(b.name)
      } else if (sortKey === "status") {
        cmp = a.status.localeCompare(b.status)
      } else {
        cmp = a[sortKey].localeCompare(b[sortKey])
      }
      return sortDir === "asc" ? cmp : -cmp
    })

    return result
  }, [projects, search, statusFilter, sortKey, sortDir])

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  function handleOpenProject(project: Project) {
    setSelectedProject(project)
    setIsEditing(false)
  }

  function handleCloseDialog() {
    setSelectedProject(null)
    setIsEditing(false)
  }

  function SortIcon({ column }: { column: SortKey }) {
    if (sortKey !== column) {
      return <ArrowUpDown className="ml-1 inline size-3.5 text-muted-foreground/50" />
    }
    return sortDir === "asc" ? (
      <ChevronUp className="ml-1 inline size-3.5 text-primary" />
    ) : (
      <ChevronDown className="ml-1 inline size-3.5 text-primary" />
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-lg">All Projects</CardTitle>
              <CardDescription>
                {filtered.length} of {projects.length} projects
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 sm:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center font-medium"
                    type="button"
                  >
                    Project
                    <SortIcon column="name" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center font-medium"
                    type="button"
                  >
                    Status
                    <SortIcon column="status" />
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <button
                    onClick={() => handleSort("startDate")}
                    className="flex items-center font-medium"
                    type="button"
                  >
                    Start Date
                    <SortIcon column="startDate" />
                  </button>
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  <button
                    onClick={() => handleSort("neaDate")}
                    className="flex items-center font-medium"
                    type="button"
                  >
                    NEA Date
                    <SortIcon column="neaDate" />
                  </button>
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  <button
                    onClick={() => handleSort("pfhoDate")}
                    className="flex items-center font-medium"
                    type="button"
                  >
                    PFHO Date
                    <SortIcon column="pfhoDate" />
                  </button>
                </TableHead>
                <TableHead className="hidden xl:table-cell">
                  <span className="font-medium">Finances</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No projects found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((project) => (
                  <TableRow
                    key={project.id}
                    className="cursor-pointer"
                    onClick={() => handleOpenProject(project)}
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{project.name}</span>
                        <span className="line-clamp-1 max-w-xs text-xs text-muted-foreground">
                          {project.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={project.status} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm">{formatDate(project.startDate)}</span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <DateCell dateStr={project.neaDate} label="NEA" />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <DateCell dateStr={project.pfhoDate} label="PFHO" />
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <FinanceCell finances={project.finances} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedProject} onOpenChange={handleCloseDialog}>
        {selectedProject && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-xl">{selectedProject.name}</DialogTitle>
                  <DialogDescription>{selectedProject.description}</DialogDescription>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="shrink-0"
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </Button>
                )}
              </div>
            </DialogHeader>
            {isEditing ? (
              <ProjectEditForm
                project={selectedProject}
                onSave={(updated) => {
                  onUpdateProject(updated)
                  setSelectedProject(updated)
                  setIsEditing(false)
                }}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <ProjectViewDetails project={selectedProject} />
            )}
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}

/* ─── View Mode ─── */

function ProjectViewDetails({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-5 pt-2">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Status:</span>
        <StatusBadge status={project.status} />
      </div>

      <FinanceDetails finances={project.finances} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DateCard label="Start Date" date={project.startDate} />
        <DateCard label="NEA Date" date={project.neaDate} />
        <DateCard label="PFHO Date" date={project.pfhoDate} />
      </div>

      <ProjectTimeline project={project} />

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="secondary" className="text-xs">
          ID: {project.id}
        </Badge>
      </div>
    </div>
  )
}

/* ─── Edit Mode ─── */

function ProjectEditForm({
  project,
  onSave,
  onCancel,
}: {
  project: Project
  onSave: (project: Project) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    name: project.name,
    description: project.description,
    status: project.status,
    startDate: project.startDate,
    neaDate: project.neaDate,
    pfhoDate: project.pfhoDate,
    budget: project.finances.budget,
    spent: project.finances.spent,
    committed: project.finances.committed,
  })

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      ...project,
      name: form.name,
      description: form.description,
      status: form.status,
      startDate: form.startDate,
      neaDate: form.neaDate,
      pfhoDate: form.pfhoDate,
      finances: {
        budget: Number(form.budget),
        spent: Number(form.spent),
        committed: Number(form.committed),
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="edit-name" className="text-xs font-medium text-muted-foreground">
          Project Name
        </label>
        <Input
          id="edit-name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="edit-description" className="text-xs font-medium text-muted-foreground">
          Description
        </label>
        <textarea
          id="edit-description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
          className="flex w-full rounded-md border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="edit-status" className="text-xs font-medium text-muted-foreground">
          Status
        </label>
        <Select value={form.status} onValueChange={(v) => handleChange("status", v)}>
          <SelectTrigger id="edit-status" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="edit-start" className="text-xs font-medium text-muted-foreground">
            Start Date
          </label>
          <Input
            id="edit-start"
            type="date"
            value={form.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="edit-nea" className="text-xs font-medium text-muted-foreground">
            NEA Date
          </label>
          <Input
            id="edit-nea"
            type="date"
            value={form.neaDate}
            onChange={(e) => handleChange("neaDate", e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="edit-pfho" className="text-xs font-medium text-muted-foreground">
            PFHO Date
          </label>
          <Input
            id="edit-pfho"
            type="date"
            value={form.pfhoDate}
            onChange={(e) => handleChange("pfhoDate", e.target.value)}
            required
          />
        </div>
      </div>

      <fieldset className="flex flex-col gap-3 rounded-lg border bg-secondary/30 p-3">
        <legend className="flex items-center gap-1.5 px-1 text-xs font-medium text-muted-foreground">
          <DollarSign className="size-3.5" /> Finances
        </legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-budget" className="text-xs text-muted-foreground">
              Budget
            </label>
            <Input
              id="edit-budget"
              type="number"
              min={0}
              step={1000}
              value={form.budget}
              onChange={(e) => handleChange("budget", Number(e.target.value))}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-spent" className="text-xs text-muted-foreground">
              Spent
            </label>
            <Input
              id="edit-spent"
              type="number"
              min={0}
              step={1000}
              value={form.spent}
              onChange={(e) => handleChange("spent", Number(e.target.value))}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-committed" className="text-xs text-muted-foreground">
              Committed
            </label>
            <Input
              id="edit-committed"
              type="number"
              min={0}
              step={1000}
              value={form.committed}
              onChange={(e) => handleChange("committed", Number(e.target.value))}
              required
            />
          </div>
        </div>
      </fieldset>

      <div className="flex items-center justify-end gap-2 border-t pt-4">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          <X className="size-3.5" />
          Cancel
        </Button>
        <Button type="submit" size="sm">
          <Check className="size-3.5" />
          Save Changes
        </Button>
      </div>
    </form>
  )
}

/* ─── Shared sub-components ─── */

function DateCard({ label, date }: { label: string; date: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-secondary/50 p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        <Calendar className="size-3.5 text-primary" />
        <span className="text-sm font-medium">{formatDate(date)}</span>
      </div>
    </div>
  )
}

function FinanceCell({ finances }: { finances: Project["finances"] }) {
  const spentPercent = Math.round((finances.spent / finances.budget) * 100)
  const remaining = finances.budget - finances.spent - finances.committed

  return (
    <div className="flex flex-col gap-1.5 min-w-[140px]">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {formatCurrency(finances.spent)} of {formatCurrency(finances.budget)}
        </span>
        <span className="font-medium">{spentPercent}%</span>
      </div>
      <Progress value={spentPercent} className="h-1.5" />
      <span className={`text-xs ${remaining < 0 ? "text-destructive" : "text-muted-foreground"}`}>
        {remaining < 0
          ? `${formatCurrency(Math.abs(remaining))} over budget`
          : `${formatCurrency(remaining)} remaining`}
      </span>
    </div>
  )
}

function FinanceDetails({ finances }: { finances: Project["finances"] }) {
  const spentPercent = Math.round((finances.spent / finances.budget) * 100)
  const committedPercent = Math.round((finances.committed / finances.budget) * 100)
  const remaining = finances.budget - finances.spent - finances.committed

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-secondary/30 p-3">
      <div className="flex items-center gap-2">
        <DollarSign className="size-4 text-primary" />
        <span className="text-sm font-medium">Finances</span>
        <span className="ml-auto text-sm font-semibold">{formatCurrency(finances.budget)}</span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="bg-chart-1"
          style={{ width: `${spentPercent}%` }}
          title={`Spent: ${formatCurrency(finances.spent)}`}
        />
        <div
          className="bg-chart-3"
          style={{ width: `${committedPercent}%` }}
          title={`Committed: ${formatCurrency(finances.committed)}`}
        />
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-chart-1" />
            <span className="text-muted-foreground">Spent</span>
          </div>
          <span className="font-medium">{formatCurrency(finances.spent)}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-chart-3" />
            <span className="text-muted-foreground">Committed</span>
          </div>
          <span className="font-medium">{formatCurrency(finances.committed)}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-secondary" />
            <span className="text-muted-foreground">Remaining</span>
          </div>
          <span className={`font-medium ${remaining < 0 ? "text-destructive" : ""}`}>
            {formatCurrency(Math.abs(remaining))}
          </span>
        </div>
      </div>
    </div>
  )
}

function ProjectTimeline({ project }: { project: Project }) {
  const start = new Date(project.startDate).getTime()
  const end = new Date(project.pfhoDate).getTime()
  const nea = new Date(project.neaDate).getTime()
  const now = Date.now()

  const totalDuration = end - start
  const neaPercent = Math.min(100, Math.max(0, ((nea - start) / totalDuration) * 100))
  const progressPercent =
    project.status === "Completed"
      ? 100
      : project.status === "Cancelled"
        ? 0
        : Math.min(100, Math.max(0, ((now - start) / totalDuration) * 100))

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Project Timeline</span>
        <span>{Math.round(progressPercent)}% elapsed</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all"
          style={{ width: `${progressPercent}%` }}
        />
        <div
          className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-chart-5 bg-background"
          style={{ left: `${neaPercent}%` }}
          title="NEA Date"
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatDate(project.startDate)}</span>
        <span className="text-chart-5">NEA</span>
        <span>{formatDate(project.pfhoDate)}</span>
      </div>
    </div>
  )
}
