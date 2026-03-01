// repository/project_repo.go
package repository

import (
    "database/sql"
    "github.com/jmoiron/sqlx"
    "github.com/nextking12/spm-project-back-go/models"
)

// ProjectRepository handles database operations for projects
type ProjectRepository struct {
    db *sqlx.DB
}

// NewProjectRepository creates a new repository (constructor injection)
func NewProjectRepository(db *sqlx.DB) *ProjectRepository {
    return &ProjectRepository{db: db}
}

// FindAll returns all projects
func (r *ProjectRepository) FindAll() ([]models.Project, error) {
    var projects []models.Project
    err := r.db.Select(&projects, "SELECT * FROM projects")
    return projects, err
}

// FindByID returns a project by ID (Optional in Spring = pointer + error in Go)
func (r *ProjectRepository) FindByID(id int64) (*models.Project, error) {
    var project models.Project
    err := r.db.Get(&project, "SELECT * FROM projects WHERE id = $1", id)
    if err == sql.ErrNoRows {
        return nil, nil // Not found, like Optional.empty()
    }
    return &project, err
}

// FindByName returns a project by name
func (r *ProjectRepository) FindByName(name string) (*models.Project, error) {
    var project models.Project
    err := r.db.Get(&project, "SELECT * FROM projects WHERE name = $1", name)
    if err == sql.ErrNoRows {
        return nil, nil
    }
    return &project, err
}

// FindByStatus returns a project by status
func (r *ProjectRepository) FindByStatus(status string) (*models.Project, error) {
    var project models.Project
    err := r.db.Get(&project, "SELECT * FROM projects WHERE status = $1", status)
    if err == sql.ErrNoRows {
        return nil, nil
    }
    return &project, err
}

// Save creates or updates a project
func (r *ProjectRepository) Save(p *models.Project) error {
    if p.ID == 0 {
        // INSERT - new project
        query := `INSERT INTO projects (name, description, status, start_date, nea_date, pfho_date, finances) 
                  VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`
        return r.db.QueryRow(query, p.Name, p.Description, p.Status, p.StartDate, p.NeaDate, p.PfhoDate, p.Finances).Scan(&p.ID)
    }
    // UPDATE - existing project
    query := `UPDATE projects SET name=$1, description=$2, status=$3, start_date=$4, nea_date=$5, pfho_date=$6, finances=$7 WHERE id=$8`
    _, err := r.db.Exec(query, p.Name, p.Description, p.Status, p.StartDate, p.NeaDate, p.PfhoDate, p.Finances, p.ID)
    return err
}

// DeleteByID removes a project
func (r *ProjectRepository) DeleteByID(id int64) error {
    _, err := r.db.Exec("DELETE FROM projects WHERE id = $1", id)
    return err
}