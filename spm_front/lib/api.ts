  const BASE_URL = "http://localhost:8080"

  export async function getProjects(): Promise<Project[]> {
    const res = await fetch(`${BASE_URL}/projects`)
    if (!res.ok) throw new Error("Failed to fetch projects")
    return res.json()
  }

  export async function updateProject(id: number, project: Project): Promise<Project> {
    const res = await fetch(`${BASE_URL}/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    })
    if (!res.ok) throw new Error("Failed to update project")
    return res.json()
  }
