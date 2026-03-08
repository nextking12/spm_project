// middleware/cors.go
// This file is the equivalent of Spring's CORS configuration.
//
// In Spring Boot, you configure CORS in one of two ways:
//
//   1. Per-controller with @CrossOrigin:
//      @CrossOrigin(origins = "http://localhost:3000")
//      @RestController
//      public class ProjectController { ... }
//
//   2. Globally via WebMvcConfigurer:
//      @Configuration
//      public class WebConfig implements WebMvcConfigurer {
//          @Override
//          public void addCorsMappings(CorsRegistry registry) {
//              registry.addMapping("/**")
//                  .allowedOrigins("http://localhost:3000")
//                  .allowedMethods("GET", "POST", "PUT", "DELETE")
//                  .allowedHeaders("Content-Type");
//          }
//      }
//
// In Go, there is no built-in CORS support. Instead, we write a middleware function
// that wraps the entire router and adds the necessary CORS headers to every response.
package middleware

import "net/http"

// EnableCORS returns a middleware that adds CORS headers to every response.
//
// In Go, middleware is a function that takes an http.Handler and returns a new http.Handler.
// This is a very common pattern — it's like a decorator or wrapper around your existing handler.
//
// The concept is similar to Spring's Filter or HandlerInterceptor:
//
//   Spring Filter chain:  Request -> CorsFilter -> DispatcherServlet -> Controller
//   Go middleware chain:  Request -> EnableCORS  -> ServeMux           -> Handler
//
// The function signature func(http.Handler) http.Handler is Go's standard middleware pattern.
// It means: "give me a handler, and I'll return a new handler that does something extra
// before/after calling the original one."
func EnableCORS(next http.Handler) http.Handler {
	// http.HandlerFunc is an adapter that lets us use a regular function as an http.Handler.
	// This is like implementing the Filter interface in Spring, where doFilter() is the
	// method that processes each request.
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// These header calls are the equivalent of the CorsRegistry configuration in Spring:
		//   .allowedOrigins("*")              -> Access-Control-Allow-Origin: *
		//   .allowedMethods("GET", "POST"...) -> Access-Control-Allow-Methods: GET, POST...
		//   .allowedHeaders("Content-Type")   -> Access-Control-Allow-Headers: Content-Type
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// Handle preflight requests.
		// Browsers send an OPTIONS request before the actual request (called a "preflight")
		// to check if the server allows cross-origin requests.
		//
		// In Spring, the CorsFilter handles this automatically behind the scenes.
		// In Go, we handle it explicitly: if the method is OPTIONS, respond with 204 No Content
		// and return immediately — don't pass the request to the actual handler.
		//
		// 204 No Content is the standard response for preflight requests. It tells the browser:
		// "Yes, this cross-origin request is allowed. Here are the permitted methods and headers."
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		// next.ServeHTTP(w, r) passes the request to the next handler in the chain.
		// This is like calling filterChain.doFilter(request, response) in a Spring Filter —
		// it means "I'm done with my middleware logic, now let the actual handler process this."
		next.ServeHTTP(w, r)
	})
}
