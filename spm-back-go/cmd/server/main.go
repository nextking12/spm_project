package server

import(
	"log"
	"net/http"

	"spm-back-go/internal/config"
	"spm-back-go/internal/database"
	"spm-back-go/internal/user"
	"spm-back-go/pkg/middleware"

	"github.com/gorilla/mux"
)

func main (){
	// Load configuration
	cfg := config.Load()

	// Connect to database
	db, err := database.Connect(cfg.Database)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Create router
	router := mux.NewRouter()

	// Apply global middleware
	router.Use(middleware.LoggingMiddleware)
	router.Use(middleware.CORSMiddleware)

	// API v1 routes
	api := router.PathPrefix("/api/v1").Subrouter()

	// Register domain routes
	user.RegisterRoutes(api, db)
	// project.RegisterRoutes(api, db)  // Future
	// task.RegisterRoutes(api, db)     // Future

	// Health check
	api.HandleFunc("/health", healthCheckHandler).Methods("GET")

	// Start server
	log.Printf("Server starting on %s", cfg.Server.Port)
	log.Fatal(http.ListenAndServe(cfg.Server.Port, router))
}

func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"healthy"}`))

}
