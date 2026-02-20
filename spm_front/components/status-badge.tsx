import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusConfig: Record<string, { className: string; dot: string }> = {
  "Planning": {
    className: "border-primary/30 bg-primary/10 text-primary",
    dot: "bg-primary",
  },
  "In Progress": {
    className: "border-chart-2/30 bg-chart-2/10 text-chart-2",
    dot: "bg-chart-2",
  },
  "Completed": {
    className: "border-chart-3/30 bg-chart-3/10 text-chart-3",
    dot: "bg-chart-3",
  },
  "On Hold": {
    className: "border-chart-5/30 bg-chart-5/10 text-chart-5",
    dot: "bg-chart-5",
  },
  "Cancelled": {
    className: "border-destructive/30 bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
}

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? {
    className: "border-muted-foreground/30 bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  }

  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium", config.className)}>
      <span className={cn("size-1.5 rounded-full", config.dot)} />
      {status}
    </Badge>
  )
}
