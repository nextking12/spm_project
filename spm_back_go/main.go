// main.go
// This file is the equivalent of your Spring Boot Application class — the entry point
// that wires everything together and starts the server.
//
// In Spring Boot:
//   @SpringBootApplication
//   public class SpmProjectApplication {
//       public static void main(String[] args) {
//           SpringApplication.run(SpmProjectApplication.class, args);
//       }
//   }
//
// Spring Boot does a LOT behind the scenes: component scanning, auto-configuration,
// dependency injection, embedded Tomcat startup, etc.
// In Go, we do all of this explicitly in about 20 lines.
package main

import (
	"log"
	"net/http"

	"github.com/nextking12/spm-project-back-go/config"
	"github.com/nextking12/spm-project-back-go/handlers"
	"github.com/nextking12/spm-project-back-go/middleware"
	"github.com/nextking12/spm-project-back-go/repository"
)

func main() {
	// ----- Step 1: Connect to the database -----
	// In Spring, this happens automatically via auto-configuration.
	// Here we call our ConnectDB() function to create the connection pool.
	db := config.ConnectDB()
	// defer db.Close() ensures the database connections are cleaned up when main() exits.
	// This is like a @PreDestroy method or implementing DisposableBean in Spring —
	// it runs cleanup logic when the application shuts down.
	defer db.Close()

	// ----- Step 2: Wire up dependencies (manual dependency injection) -----
	// In Spring, the framework scans for @Component/@Repository/@Service/@Controller classes
	// and automatically injects dependencies via @Autowired or constructor injection.
	//
	// In Go, we do this by hand — creating each dependency and passing it to the next layer:
	//   Database -> Repository -> Handler
	//
	// This is actually a pattern called "constructor injection" — the same thing Spring does,
	// just without the framework magic. Many Go developers prefer this because the dependency
	// graph is explicit and easy to follow.
	repo := repository.NewProjectRepository(db)    // like @Repository being created with DataSource
	handler := handlers.NewProjectHandler(repo)     // like @RestController being created with @Autowired repo

	// ----- Step 3: Set up routes -----
	// http.NewServeMux() creates a router — similar to Spring's DispatcherServlet
	// that maps incoming HTTP requests to the right controller method.
	//
	// In Spring, you use annotations on methods:
	//   @GetMapping("/projects")       -> mux.HandleFunc("GET /projects", ...)
	//   @GetMapping("/projects/{id}")  -> mux.HandleFunc("GET /projects/{id}", ...)
	//   @PostMapping("/projects")      -> mux.HandleFunc("POST /projects", ...)
	//
	// Go 1.22+ supports method + pattern syntax ("GET /projects/{id}"), which makes
	// this look very similar to Spring's @RequestMapping annotations.
	mux := http.NewServeMux()
	mux.HandleFunc("GET /projects", handler.GetAll)
	mux.HandleFunc("GET /projects/{id}", handler.GetByID)
	mux.HandleFunc("POST /projects", handler.Create)
	mux.HandleFunc("PUT /projects/{id}", handler.Update)
	mux.HandleFunc("DELETE /projects/{id}", handler.Delete)

	// ----- Step 4: Apply middleware -----
	// In Spring, filters/interceptors are registered globally via @Configuration classes
	// or the FilterRegistrationBean. They wrap around every request automatically.
	//
	// In Go, middleware wraps the router. The request flows through each middleware layer
	// before reaching the handler, like Russian nesting dolls:
	//   Request -> CORS middleware -> ServeMux -> Handler
	//
	// middleware.EnableCORS(mux) takes our router and returns a new handler
	// that adds CORS headers before passing the request to the router.
	wrappedMux := middleware.EnableCORS(mux)

	// ----- Step 5: Start the server -----
	// In Spring Boot, the embedded Tomcat server starts automatically on port 8080
	// (configurable via server.port in application.properties).
	//
	// In Go, http.ListenAndServe() starts the HTTP server.
	//   - ":8080" means listen on all interfaces, port 8080
	//   - wrappedMux is our router with CORS middleware applied
	//
	// log.Fatal() wraps this call so that if the server fails to start
	// (e.g., port already in use), it prints the error and exits.
	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", wrappedMux))
}
