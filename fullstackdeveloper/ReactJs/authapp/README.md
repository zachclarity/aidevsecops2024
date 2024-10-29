 authentication using localStorage and React Router. The app includes:

Authentication features:

Login page with username/password validation
Protected route wrapper component
Secure page that's only accessible when authenticated
Logout functionality


Components:

Home: Landing page with navigation links
Login: Authentication form
SecurePage: Protected content
ProtectedRoute: HOC for route protection


Key features:

Uses shadcn/ui components for a polished look
Responsive design with Tailwind CSS
Basic error handling
Persistent authentication state using localStorage
Clean routing with React Router



To test the app, use these credentials:

Username: admin
Password: password

Important security notes:

This is a basic implementation for demonstration purposes
In a production app, you should:

Use HTTPS
Implement proper password hashing
Use secure session management
Add CSRF protection
Consider using HTTP-only cookies instead of localStorage