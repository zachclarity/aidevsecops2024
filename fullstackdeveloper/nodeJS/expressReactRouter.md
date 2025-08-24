# Express and React Router

## **Imports and Setup**
- The file imports various libraries needed for a web server: Express for the server framework, React Router for handling routes, security tools (helmet, cors), logging (morgan), and session management
- It checks if the app is running in development mode for different behaviors between development and production

## **TypeScript Type Declarations**
- Defines custom types to add extra properties to the server's request/response objects
- Adds `cspNonce` (a security token), user information, and context-getting functions to various parts of the system
- This ensures TypeScript knows about these custom properties when coding

## **Basic Express Configuration**
- Creates the Express app instance
- Enables JSON parsing for incoming requests
- Validates that text is properly encoded (UTF-8)
- Disables the "x-powered-by" header for security (hides that it's using Express)
- Enables compression to make responses smaller and faster

## **Request Logging with Morgan**
- Creates a custom colored status code display (red for errors, yellow for client errors, cyan for redirects, green for success)
- Sets up request logging that shows: HTTP method (GET, POST, etc), URL path, status code, response size, and response time
- Each request gets a nicely formatted, color-coded log entry

## **Security Configuration with Helmet**
- Sets Content Security Policy (CSP) rules to prevent cross-site scripting attacks
- Only allows scripts from the same origin or with a special nonce token
- Blocks the site from being embedded in iframes (prevents clickjacking)
- Enables various security headers like XSS protection and strict transport security
- Allows WebSocket connections for development hot-reloading

## **CORS and Cookie Setup**
- Enables Cross-Origin Resource Sharing (CORS) to allow requests from different domains
- Sets up cookie parsing to read browser cookies

## **Async Context Storage**
- Creates a storage system that keeps track of data throughout an async request
- Each request gets its own isolated storage with: unique request ID, user ID, session ID, start time, and CSP nonce
- Provides a `getContext()` function to retrieve this data anywhere in the request lifecycle

## **Authentication Middleware**
- For every request (except login, register, and manifest pages):
  - Checks if the user has a valid session cookie
  - If no valid session exists, redirects to Keycloak (an authentication service) login page
  - If valid session exists, stores the user and session info in the async context
- The redirect URL is built dynamically based on environment (development vs production)

## **Request ID Header Middleware**
- Adds CORS headers to allow requests from any origin
- Attaches a unique X-Request-Id header to every response for tracking and debugging

## **React Router Handler**
- Sets up the main request handler that processes all routes defined in the React app
- Passes context data (CSP nonce, Express request object, user info) to the React application
- This connects the Express backend with the React frontend routing

**In Summary:** This file sets up a secure, well-logged Express server with authentication via Keycloak, security headers, request tracking, and integration with a React Router application. It ensures users are logged in before accessing most pages and provides a clean way to pass server-side data to the React app.
