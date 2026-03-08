// handlers/project_handler.go
// This file is the equivalent of a @RestController in Spring Boot.
// It receives HTTP requests, parses input, calls the repository, and writes HTTP responses.
package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/nextking12/spm-project-back-go/models"
	"github.com/nextking12/spm-project-back-go/repository"
)

// ProjectHandler holds dependencies for handling project-related requests.
// Think of this as your @RestController class with an @Autowired repository field.
type ProjectHandler struct {
	repo *repository.ProjectRepository
}

// NewProjectHandler creates a new handler with its dependencies injected.
// This is the Go equivalent of Spring's constructor injection:
//
//	@RestController
//	public class ProjectController {
//	    private final ProjectRepository repo;
//	    public ProjectController(ProjectRepository repo) { this.repo = repo; }
//	}
func NewProjectHandler(repo *repository.ProjectRepository) *ProjectHandler {
	return &ProjectHandler{repo: repo}
}

// GetAll handles GET /projects
// Spring equivalent: @GetMapping("/projects") public List<Project> getAll()
//
// In Go, every handler function has the same signature: (w http.ResponseWriter, r *http.Request)
//   - w is what you write the response to (status code, headers, body)
//   - r is the incoming request (method, URL, headers, body)
func (h *ProjectHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	projects, err := h.repo.FindAll()
	// In Go, errors are returned as values (not thrown like exceptions).
	// You check err != nil after every call that can fail.
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return // always return after writing an error response
	}
	writeJSON(w, http.StatusOK, projects)
}

// GetByID handles GET /projects/{id}
// Spring equivalent: @GetMapping("/projects/{id}") public ResponseEntity<Project> getById(@PathVariable Long id)
func (h *ProjectHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	// r.PathValue("id") extracts the {id} from the URL path.
	// Go's standard library returns it as a string, so we must parse it to int64 ourselves.
	// In Spring this is automatic with @PathVariable Long id.
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	project, err := h.repo.FindByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// In Spring, Optional.empty() triggers a 404 via .orElseThrow().
	// In Go, we return a nil pointer from the repo when nothing is found.
	if project == nil {
		http.Error(w, "project not found", http.StatusNotFound)
		return
	}
	writeJSON(w, http.StatusOK, project)
}

// Create handles POST /projects
// Spring equivalent: @PostMapping("/projects") public ResponseEntity<Project> create(@Valid @RequestBody Project project)
func (h *ProjectHandler) Create(w http.ResponseWriter, r *http.Request) {
	var project models.Project

	// json.NewDecoder(r.Body).Decode() is Go's version of @RequestBody.
	// It reads the JSON from the request body and populates the struct fields
	// using the `json:"..."` tags defined on the Project struct.
	if err := json.NewDecoder(r.Body).Decode(&project); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	// project.Validate() is Go's version of @Valid.
	// Spring throws a MethodArgumentNotValidException automatically;
	// in Go we call Validate() explicitly and check the error.
	if err := project.Validate(); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Save inserts because project.ID is 0 (see repo logic).
	if err := h.repo.Save(&project); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// 201 Created — like ResponseEntity.status(HttpStatus.CREATED).body(project)
	writeJSON(w, http.StatusCreated, project)
}

// Update handles PUT /projects/{id}
// Spring equivalent: @PutMapping("/projects/{id}") public ResponseEntity<Project> update(@PathVariable Long id, @Valid @RequestBody Project project)
func (h *ProjectHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	// First check if the project exists (like findById().orElseThrow() in Spring)
	existing, err := h.repo.FindByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if existing == nil {
		http.Error(w, "project not found", http.StatusNotFound)
		return
	}

	// Decode the updated fields from the request body
	var project models.Project
	if err := json.NewDecoder(r.Body).Decode(&project); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	// Set the ID from the URL path so the repo knows to UPDATE (not INSERT).
	// This prevents the client from changing the ID via the request body.
	project.ID = id

	if err := project.Validate(); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Save updates because project.ID is non-zero (see repo logic).
	if err := h.repo.Save(&project); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSON(w, http.StatusOK, project)
}

// Delete handles DELETE /projects/{id}
// Spring equivalent: @DeleteMapping("/projects/{id}") public ResponseEntity<Void> delete(@PathVariable Long id)
func (h *ProjectHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	if err := h.repo.DeleteByID(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// 204 No Content — like ResponseEntity.noContent().build()
	// We don't write a body, just the status code.
	w.WriteHeader(http.StatusNoContent)
}

// writeJSON is a helper that serializes data to JSON and writes it to the response.
// Spring does this automatically with Jackson when you return an object from a controller method.
// In Go, we have to do it manually:
//  1. Set the Content-Type header (Spring does this via @RestController + Jackson)
//  2. Set the HTTP status code
//  3. Encode the data as JSON into the response body
func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}
