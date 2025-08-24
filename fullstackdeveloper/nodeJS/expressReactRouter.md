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

# Enhancements


## **Key Best Practices & Enhancements Implemented:**

### **1. Environment Configuration**
- **Added**: Environment variable validation at startup
- **Added**: Constants for all configuration values
- **Enhancement**: Fail fast if required environment variables are missing

### **2. Error Handling**
- **Added**: Custom AppError class for operational errors
- **Added**: Global error handler middleware
- **Added**: Async handler wrapper to catch promise rejections
- **Added**: Uncaught exception and unhandled rejection handlers
- **Enhancement**: Different error responses for development vs production

### **3. Security Enhancements**
- **Added**: Rate limiting for API endpoints and strict limits for auth endpoints
- **Added**: NoSQL injection sanitization with `express-mongo-sanitize`
- **Added**: Signed cookies with a secret
- **Added**: More comprehensive CSP directives
- **Added**: Session timeout mechanism (30 minutes)
- **Added**: CORS origin validation with whitelist
- **Enhancement**: Better security headers configuration

### **4. Logging Improvements**
- **Added**: Structured logging with Pino for production
- **Added**: Request ID tracking throughout the request lifecycle
- **Added**: Log redaction for sensitive data (authorization, cookies)
- **Added**: Different log levels based on response status
- **Enhancement**: Separate logging strategies for development and production

### **5. Performance Optimizations**
- **Added**: Response time tracking header
- **Added**: Request size limits (10mb)
- **Added**: Health check endpoint for monitoring
- **Added**: Memory usage tracking
- **Enhancement**: Cache CORS preflight responses for 24 hours

### **6. Session Management**
- **Added**: Session activity tracking and timeout
- **Added**: Return URL storage for post-login redirect
- **Added**: Secure cookie settings for production
- **Enhancement**: Better session validation and refresh

### **7. Operational Excellence**
- **Added**: Graceful shutdown handling
- **Added**: Health check endpoint with detailed metrics
- **Added**: 404 handler for undefined routes
- **Added**: Client IP tracking for audit trails
- **Enhancement**: Server startup logging with environment details

### **8. Code Organization**
- **Added**: Clear section separators and comments
- **Added**: Type-safe error handling
- **Added**: Modular middleware organization
- **Enhancement**: Better separation of concerns

### **9. Authentication Flow**
- **Added**: Public paths configuration
- **Added**: Return URL preservation for better UX
- **Added**: Scope parameter for OIDC
- **Enhancement**: More robust Keycloak integration

### **10. Development Experience**
- **Added**: Colored response time in development logs
- **Added**: Stack traces in development error responses
- **Added**: Pretty logging for development
- **Enhancement**: Skip rate limiting for health checks

## **Additional Recommendations:**

### **Consider Adding:**
1. **API versioning**: Add `/v1/` prefix to API routes
2. **Request validation**: Use libraries like `joi` or `zod` for input validation
3. **API documentation**: Integrate Swagger/OpenAPI
4. **Metrics collection**: Add Prometheus metrics endpoint
5. **Distributed tracing**: Integrate with OpenTelemetry
6. **Cache headers**: Add appropriate cache control headers
7. **Database connection pooling**: If using a database
8. **Circuit breaker**: For external service calls
9. **Feature flags**: For gradual rollouts
10. **Audit logging**: For compliance requirements

### **Security Additions to Consider:**
1. **API key authentication**: For service-to-service communication
2. **Request signing**: For webhook endpoints
3. **IP whitelisting**: For admin endpoints
4. **Two-factor authentication**: Enhanced security
5. **Refresh token rotation**: For better token security

This enhanced version provides a production-ready Express server with comprehensive security, monitoring, and operational features while maintaining clean, maintainable code.

```
import { createRequestHandler } from '@react-router/express';
import chalk from 'chalk';
import express from 'express';
import cookieParser from 'cookie-parser';
import { destroySession, getSession } from '@services/session.server';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import { v4 as uuidv4 } from 'uuid';
import { AsyncLocalStorage } from 'node:async_hooks';
import { utf8Validator } from './middleware/utf8Validator';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { pinoHttp } from 'pino-http';
import pino from 'pino';

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================
const DEVELOPMENT = process.env.NODE_ENV === 'development';
const PRODUCTION = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;
const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8080';
const KEYCLOAK_REALM = process.env.VITE_KEYCLOAK_REALM || 'VIP';
const KEYCLOAK_CLIENT_ID = process.env.VITE_KEYCLOAK_CLIENT_ID || 'VIP-client';

// Validate required environment variables
const requiredEnvVars = ['NODE_ENV'];
if (PRODUCTION) {
  requiredEnvVars.push('KEYCLOAK_URL', 'VITE_KEYCLOAK_REALM', 'VITE_KEYCLOAK_CLIENT_ID');
}

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// ============================================================================
// TYPE DECLARATIONS
// ============================================================================
declare module 'virtual:react-router/server-build' {
  export interface AppLoadContext {
    VALUE_FROM_EXPRESS: string;
    cspNonce: string;
    expressRequest: express.Request;
    user: { id: string; token: string } | null;
    requestId: string;
    clientIp: string;
  }
}

declare module 'react-router' {
  export interface AppLoadContext {
    cspNonce: string;
    user: { id: string; token: string } | null;
    requestId: string;
  }
}

declare module 'express-serve-static-core' {
  namespace Express {
    export interface Request {
      getContext: () => AsyncStore;
      id: string;
      startTime: number;
    }
    export interface Locals {
      cspNonce: string;
    }
  }
}

declare module 'node:http' {
  interface ServerResponse {
    locals: { cspNonce: string };
  }
}

// ============================================================================
// ASYNC CONTEXT MANAGEMENT
// ============================================================================
type AsyncStore = {
  requestId: string;
  userId: undefined | string;
  sessionId: undefined | string;
  startTime: Date;
  cspNonce: string;
  clientIp: string;
};

const asyncLocalStorage = new AsyncLocalStorage<AsyncStore>();

export function getContext(): AsyncStore {
  const store = asyncLocalStorage.getStore();
  if (!store) {
    throw new Error('Not in an async context');
  }
  return store;
}

// ============================================================================
// ERROR HANDLERS
// ============================================================================
class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler
const errorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
  const { statusCode = 500, message = 'Internal Server Error' } = err;
  
  // Log error
  const logger = getLogger();
  if (statusCode >= 500) {
    logger.error({
      err,
      requestId: req.id,
      url: req.url,
      method: req.method,
      ip: req.ip
    }, 'Server error');
  }

  // Don't leak error details in production
  const errorMessage = PRODUCTION && statusCode === 500 
    ? 'Internal Server Error' 
    : message;

  res.status(statusCode).json({
    error: {
      message: errorMessage,
      requestId: req.id,
      ...(DEVELOPMENT && { stack: err.stack })
    }
  });
};

// Async error wrapper
const asyncHandler = (fn: express.RequestHandler): express.RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// ============================================================================
// LOGGING SETUP
// ============================================================================
const getLogger = () => {
  if (PRODUCTION) {
    return pino({
      level: process.env.LOG_LEVEL || 'info',
      formatters: {
        level: (label) => ({ level: label })
      },
      redact: ['req.headers.authorization', 'req.headers.cookie'],
      serializers: {
        req: (req) => ({
          id: req.id,
          method: req.method,
          url: req.url,
          query: req.query,
          params: req.params
        }),
        res: (res) => ({
          statusCode: res.statusCode
        })
      }
    });
  }
  
  // Development logger with pretty printing
  return pino({
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: 'pid,hostname',
        translateTime: 'SYS:standard'
      }
    }
  });
};

// ============================================================================
// EXPRESS APP INITIALIZATION
// ============================================================================
export const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Basic middleware
app.disable('x-powered-by');
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(utf8Validator);
app.use(cookieParser(process.env.COOKIE_SECRET)); // Add signed cookies

// Security: Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// ============================================================================
// RATE LIMITING
// ============================================================================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  }
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Strict limit for auth endpoints
  skipSuccessfulRequests: true
});

app.use('/api/', limiter);
app.use('/login', strictLimiter);
app.use('/register', strictLimiter);

// ============================================================================
// REQUEST LOGGING
// ============================================================================
if (PRODUCTION) {
  // Production: Use structured logging with Pino
  app.use(pinoHttp({
    logger: getLogger(),
    genReqId: () => uuidv4(),
    customLogLevel: (req, res, err) => {
      if (res.statusCode >= 400 && res.statusCode < 500) return 'warn';
      if (res.statusCode >= 500 || err) return 'error';
      return 'info';
    },
    customSuccessMessage: (req, res) => {
      return `${req.method} ${req.url} ${res.statusCode}`;
    },
    customErrorMessage: (req, res, err) => {
      return `${req.method} ${req.url} ${res.statusCode} - ${err.message}`;
    }
  }));
} else {
  // Development: Use Morgan with colors
  morgan.token('statusColorized', (req, res) => {
    const status = res.statusCode;
    if (status >= 500) return chalk.red(status);
    if (status >= 400) return chalk.yellow(status);
    if (status >= 300) return chalk.cyan(status);
    return chalk.green(status);
  });

  morgan.token('response-time-colored', (req, res) => {
    const time = parseFloat(morgan['response-time'](req, res) || '0');
    if (time > 1000) return chalk.red(`${time}ms`);
    if (time > 500) return chalk.yellow(`${time}ms`);
    return chalk.green(`${time}ms`);
  });

  app.use(
    morgan((tokens, req, res) => {
      return [
        chalk.blue(tokens.method(req, res)),
        chalk.green(tokens.url(req, res)),
        tokens.statusColorized(req, res),
        tokens.res(req, res, 'content-length') || '-',
        '-',
        tokens['response-time-colored'](req, res)
      ].join(' ');
    })
  );
}

// ============================================================================
// SECURITY HEADERS
// ============================================================================
app.use((req, res, next) => {
  // Generate CSP nonce for each request
  res.locals.cspNonce = Buffer.from(uuidv4()).toString('base64');
  next();
});

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
        scriptSrc: [
          "'self'",
          ...(DEVELOPMENT ? ["'unsafe-inline'", 'ws://localhost:*'] : []),
          (req, res) => `'nonce-${res.locals.cspNonce}'`
        ],
        styleSrc: ["'self'", "'unsafe-inline'"], // Consider using nonces for styles too
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: [
          "'self'",
          ...(DEVELOPMENT ? ['ws://localhost:*', 'http://localhost:8080'] : []),
          'https://auth.int.daas.teambespin.us'
        ],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
        upgradeInsecureRequests: PRODUCTION ? [] : undefined
      }
    },
    crossOriginEmbedderPolicy: !DEVELOPMENT,
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: false,
    referrerPolicy: { policy: 'same-origin' },
    xssFilter: true
  })
);

// ============================================================================
// CORS CONFIGURATION
// ============================================================================
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin && DEVELOPMENT) return callback(null, true);
    
    if (origin && allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new AppError('Not allowed by CORS', 403));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400 // Cache preflight for 24 hours
};

app.use(cors(corsOptions));

// ============================================================================
// HEALTH CHECK ENDPOINT
// ============================================================================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    memory: process.memoryUsage()
  });
});

// ============================================================================
// REQUEST CONTEXT MIDDLEWARE
// ============================================================================
app.use(asyncHandler(async (req, res, next) => {
  const requestId = uuidv4();
  req.id = requestId;
  req.startTime = Date.now();
  
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  
  const store: AsyncStore = {
    requestId,
    userId: undefined,
    sessionId: undefined,
    startTime: new Date(),
    cspNonce: res.locals.cspNonce,
    clientIp
  };

  asyncLocalStorage.run(store, () => {
    req.getContext = () => getContext();
    res.setHeader('X-Request-Id', requestId);
    next();
  });
}));

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================
const PUBLIC_PATHS = ['/login', '/register', '/health', '/manifest.json', '/favicon.ico'];

const isPublicPath = (path: string): boolean => {
  return PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath));
};

app.use(asyncHandler(async (req, res, next) => {
  // Skip authentication for public paths
  if (isPublicPath(req.path)) {
    return next();
  }

  try {
    const session = await getSession(req.headers.cookie);
    const user = session.get('user');
    const sessionId = session.get('sessionId');

    if (!user || !sessionId) {
      // Build Keycloak login URL
      const protocol = PRODUCTION ? 'https://' : 'http://';
      const host = req.get('host');
      const redirectUri = `${protocol}${host}/login`;
      
      const keycloakLoginUrl = new URL(`${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth`);
      keycloakLoginUrl.searchParams.set('client_id', KEYCLOAK_CLIENT_ID);
      keycloakLoginUrl.searchParams.set('redirect_uri', redirectUri);
      keycloakLoginUrl.searchParams.set('response_type', 'code');
      keycloakLoginUrl.searchParams.set('scope', 'openid profile email');
      
      // Store the original URL to redirect back after login
      if (req.method === 'GET') {
        session.set('returnTo', req.originalUrl);
        res.cookie('auth_session', await session.commit(), {
          httpOnly: true,
          secure: PRODUCTION,
          sameSite: 'lax',
          maxAge: 60 * 5 // 5 minutes to complete login
        });
      }
      
      return res.redirect(keycloakLoginUrl.toString());
    }

    // Update context with user information
    const store = getContext();
    store.userId = user;
    store.sessionId = sessionId;
    
    // Refresh session activity
    session.set('lastActivity', Date.now());
    
    next();
  } catch (error) {
    const logger = getLogger();
    logger.error({ error, requestId: req.id }, 'Authentication error');
    return res.status(500).json({ error: 'Authentication failed' });
  }
}));

// ============================================================================
// SESSION TIMEOUT MIDDLEWARE
// ============================================================================
app.use(asyncHandler(async (req, res, next) => {
  if (isPublicPath(req.path)) {
    return next();
  }

  const session = await getSession(req.headers.cookie);
  const lastActivity = session.get('lastActivity');
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  if (lastActivity && Date.now() - lastActivity > SESSION_TIMEOUT) {
    await destroySession(res, session);
    return res.status(401).json({ error: 'Session expired' });
  }

  next();
}));

// ============================================================================
// RESPONSE TIME HEADER
// ============================================================================
app.use((req, res, next) => {
  res.on('finish', () => {
    const responseTime = Date.now() - req.startTime;
    res.setHeader('X-Response-Time', `${responseTime}ms`);
  });
  next();
});

// ============================================================================
// REACT ROUTER HANDLER
// ============================================================================
app.use(
  createRequestHandler({
    build: await import('virtual:react-router/server-build'),
    mode: process.env.NODE_ENV,
    getLoadContext(request, res) {
      const context = request.getContext();
      const clientIp = request.ip || request.socket.remoteAddress || 'unknown';
      
      return {
        cspNonce: context.cspNonce,
        expressRequest: request,
        user: context.userId
          ? { id: context.userId, token: context.sessionId as string }
          : null,
        requestId: context.requestId,
        clientIp
      };
    }
  })
);

// ============================================================================
// 404 HANDLER
// ============================================================================
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Resource not found',
      path: req.path,
      requestId: req.id
    }
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================
app.use(errorHandler);

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================
const gracefulShutdown = async (signal: string) => {
  const logger = getLogger();
  logger.info(`${signal} received, starting graceful shutdown`);
  
  // Stop accepting new connections
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });

  // Force close after 30 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// ============================================================================
// SERVER STARTUP
// ============================================================================
const server = app.listen(PORT, () => {
  const logger = getLogger();
  logger.info({
    message: 'Server started',
    port: PORT,
    environment: process.env.NODE_ENV,
    nodeVersion: process.version
  });
});

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  const logger = getLogger();
  logger.fatal({ error }, 'Uncaught exception');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  const logger = getLogger();
  logger.fatal({ reason, promise }, 'Unhandled rejection');
  process.exit(1);
});

export default app;
```
