// config/database.go
// This file is the equivalent of your application.properties / application.yml database configuration
// and Spring Boot's auto-configured DataSource bean.
//
// In Spring Boot, you just set a few properties and Spring creates the DataSource for you:
//
//   spring.datasource.url=jdbc:postgresql://localhost:5432/spm_project
//   spring.datasource.username=postgres
//   spring.datasource.password=postgres
//
// In Go, we create the database connection ourselves and pass it around manually
// (this is called "dependency injection by hand" — no framework magic).
package config


import (
	"log"
	"os"

	"github.com/jmoiron/sqlx"
	// This blank import registers the PostgreSQL driver with database/sql.
	// It's like adding the postgresql dependency to pom.xml — Spring Boot auto-detects
	// the driver class, but in Go we need this import so the "postgres" driver name
	// is available when we call sqlx.Connect("postgres", ...).
	//
	// The underscore (_) means "import for side effects only" — we don't call any
	// functions from this package directly; its init() function registers the driver.
	_ "github.com/lib/pq"
)

// ConnectDB creates and returns a database connection pool.
//
// In Spring Boot, the framework creates a DataSource bean automatically from your
// application.properties. That DataSource is a connection pool (usually HikariCP)
// that Spring injects wherever you need it (@Autowired DataSource).
//
// In Go, sqlx.Connect() does two things:
//  1. Opens a connection pool (like HikariCP) — this is the *sqlx.DB object
//  2. Pings the database to verify the connection works
//
// The returned *sqlx.DB is safe for concurrent use and manages its own pool of
// connections internally, just like HikariCP does behind the scenes in Spring.
func ConnectDB() *sqlx.DB {
	// os.Getenv() is Go's way of reading environment variables.
	// This is similar to using ${DATABASE_URL} in application.properties,
	// or Spring's @Value("${DATABASE_URL}") annotation.
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		// Default connection string for local development.
		// This is like the default values in application.properties.
		// The format is a PostgreSQL connection string (libpq-style key=value pairs).
		dsn = "host=localhost port=5432 user=postgres password=postgres dbname=spm_project sslmode=disable"
	}

	// sqlx.Connect("postgres", dsn) is the Go equivalent of:
	//   DataSource dataSource = new HikariDataSource(config);
	//
	// "postgres" tells database/sql which driver to use (registered by the blank import above).
	// sqlx wraps the standard database/sql package and adds features like struct scanning
	// (mapping rows to structs using `db:"..."` tags), which is similar to what Spring's
	// JdbcTemplate or JPA does with @Column annotations.
	db, err := sqlx.Connect("postgres", dsn)
	if err != nil {
		// log.Fatalf prints the error and exits the program immediately.
		// This is similar to Spring Boot failing to start when it can't connect to the database —
		// the application refuses to run without a working database connection.
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("Database connected")
	return db
}
