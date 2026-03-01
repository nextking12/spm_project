// models/project.go
package models

import (
    "github.com/go-playground/validator/v10"
)

var validate = validator.New()

type Project struct {
    ID          int64  `json:"id" db:"id"`
    Name        string `json:"name" db:"name" validate:"required,max=100"`
    Description string `json:"description" db:"description"`
    Status      string `json:"status" db:"status"`
    StartDate   string `json:"startDate" db:"start_date"`
    NeaDate     string `json:"neaDate" db:"nea_date"`
    PfhoDate    string `json:"pfhoDate" db:"pfho_date"`
    Finances    int    `json:"finances" db:"finances"`
}

// Validate checks all struct tag rules
func (p *Project) Validate() error {
    return validate.Struct(p)
}