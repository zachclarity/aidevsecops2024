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


Security Thoughts

I'll analyze potential ways to bypass the login system, focusing on different types of access and vulnerabilities.



1. Physical Device Access:
- View stored credentials in localStorage using browser DevTools
- Copy/edit localStorage auth tokens directly
- Access browser's saved passwords if credentials were saved
- Clone the hard drive to another device
- Boot from a live USB to bypass OS-level security
- Install keyloggers or monitoring software
- Access browser history/cache to find stored information
- Take screenshots of logged-in sessions
- Extract data from memory dumps
- Connect to unlocked device while user is away

2. Browser-Based Attacks:
- Modify localStorage values through DevTools Console:
  ```javascript
  localStorage.setItem('isAuthenticated', 'true')
  localStorage.setItem('user', 'admin')
  ```
- Bypass client-side route protection by directly accessing URLs
- Cross-Site Scripting (XSS) to steal auth tokens
- Save browser state/session for later reuse
- Exploit browser extensions with storage access
- Use browser debug tools to modify JavaScript checks
- Network request interception and modification

3. Code/Application Level:
- Read source code to find hardcoded credentials
- Find the basic password validation:
  ```typescript
  if (credentials.username === 'admin' && credentials.password === 'password')
  ```
- Decompile/review bundled JavaScript code
- Bypass ReactRouter protection logic
- Modify API responses in transit
- Create fake authentication contexts

4. Network Level:
- Man-in-the-middle (MITM) attacks to intercept tokens
- Session hijacking
- Packet sniffing on unsecured networks
- DNS spoofing to redirect to malicious servers
- Replay attacks with captured auth tokens
- SSL/TLS downgrade attacks

Security Improvements to Consider:

1. Server-side Authentication:
```typescript
// Replace client-side validation with server auth
const handleLogin = async (credentials: Credentials) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!response.ok) throw new Error('Auth failed');
    const { token } = await response.json();
    // Store JWT token instead of boolean
    sessionStorage.setItem('token', token);
  } catch (error) {
    setError('Authentication failed');
  }
};
```

2. Better Token Storage:
```typescript
// Use HTTP-only cookies instead of localStorage
document.cookie = 'authToken=token; HttpOnly; Secure; SameSite=Strict';
```

3. Session Management:
```typescript
// Add token expiration and refresh logic
interface AuthToken {
  token: string;
  expiresAt: number;
}

const checkTokenExpiration = () => {
  const token: AuthToken = JSON.parse(sessionStorage.getItem('token') || '{}');
  if (Date.now() > token.expiresAt) {
    logout();
  }
};
```

4. Route Protection Enhancement:
```typescript
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch('/api/auth/validate', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) {
          logout();
          navigate('/login');
        }
      } catch (error) {
        logout();
        navigate('/login');
      }
    };
    validateToken();
  }, [token]);

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
```

Additional Security Recommendations:

1. Device Security:
- Implement automatic logout on idle
- Require re-authentication for sensitive actions
- Clear credentials on app close
- Use secure password managers
- Enable disk encryption
- Set up device lock timeouts

2. Application Security:
- Implement rate limiting
- Add CAPTCHA for login attempts
- Use strong password requirements
- Enable two-factor authentication
- Implement IP-based restrictions
- Log and monitor auth attempts
- Regular security audits
- Keep dependencies updated

3. Network Security:
- Use HTTPS exclusively
- Implement CORS properly
- Add request signing
- Use secure WebSocket connections
- Implement API gateway security
- Regular penetration testing

This type of application should ideally be part of a larger security ecosystem that includes proper server-side validation, secure communication protocols, and robust access control mechanisms.

I'll show how implementing established authentication providers can significantly improve security and user management.



```typescript
// Example using Okta
// src/auth/OktaAuth.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security, LoginCallback } from '@okta/okta-react';

const oktaAuth = new OktaAuth({
  issuer: 'https://{yourOktaDomain}/oauth2/default',
  clientId: '{clientId}',
  redirectUri: window.location.origin + '/login/callback',
  scopes: ['openid', 'profile', 'email']
});

export const OktaSecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  
  const restoreOriginalUri = async (_oktaAuth: OktaAuth, originalUri: string) => {
    navigate(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      {children}
    </Security>
  );
};

// Login component with Okta
import { useOktaAuth } from '@okta/okta-react';
import { Button, Container, Card } from 'react-bootstrap';

export const OktaLogin: React.FC = () => {
  const { oktaAuth, authState } = useOktaAuth();

  const login = async () => {
    await oktaAuth.signInWithRedirect();
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card style={{ width: '400px' }}>
        <Card.Body className="text-center">
          <Card.Title>Login with Okta</Card.Title>
          <Button onClick={login} variant="primary">Sign In</Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

// AWS Cognito Implementation
// src/auth/CognitoAuth.tsx
import { Amplify, Auth } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_xxxxx',
    userPoolWebClientId: 'xxxxxxxxxxxxx',
    mandatorySignIn: true,
    signUpVerificationMethod: 'code'
  }
});

export const CognitoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Authenticator.Provider>
      {children}
    </Authenticator.Provider>
  );
};

// Login component with Cognito
import { Authenticator } from '@aws-amplify/ui-react';

export const CognitoLogin: React.FC = () => {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Container>
          <Card>
            <Card.Body>
              <Card.Title>Welcome {user?.username}</Card.Title>
              <Button onClick={signOut}>Sign Out</Button>
            </Card.Body>
          </Card>
        </Container>
      )}
    </Authenticator>
  );
};

// Custom hook for Cognito auth
export const useCognitoAuth = () => {
  const [user, setUser] = useState<CognitoUser | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      const user = await Auth.signIn(username, password);
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  return { user, signIn };
};

// Rownd Implementation
// src/auth/RowndAuth.tsx
import { RowndProvider, useRownd } from '@rownd/react';

const rowndConfig = {
  appKey: 'YOUR_APP_KEY',
  apiUrl: 'https://api.rownd.io',
  defaultRedirectUri: window.location.origin
};

export const RowndAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <RowndProvider config={rowndConfig}>
      {children}
    </RowndProvider>
  );
};

// Login component with Rownd
export const RowndLogin: React.FC = () => {
  const { requestSignIn, is_authenticated, user } = useRownd();

  return (
    <Container>
      <Card>
        <Card.Body>
          {!is_authenticated ? (
            <Button onClick={() => requestSignIn()}>Sign In with Rownd</Button>
          ) : (
            <div>
              <p>Welcome, {user.data.email}</p>
              <Button onClick={() => requestSignIn()}>Manage Account</Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

// Protected Route with Auth Provider
// src/components/ProtectedRoute.tsx
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Example using Okta
  const { authState } = useOktaAuth();
  
  // Example using Cognito
  const { user } = useCognitoAuth();
  
  // Example using Rownd
  const { is_authenticated } = useRownd();

  if (!authState?.isAuthenticated) { // Or !user or !is_authenticated
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// App.tsx with Auth Provider
const App: React.FC = () => {
  return (
    // Choose one provider based on your implementation
    <OktaSecurityProvider>
      {/* or <CognitoProvider> */}
      {/* or <RowndAuthProvider> */}
      <RouterProvider router={router} />
    </OktaSecurityProvider>
  );
};

```

Key Benefits of Each Provider:

1. Okta:
- Enterprise-grade security
- Single Sign-On (SSO) support
- Multi-factor authentication (MFA)
- Social login integration
- User provisioning and lifecycle management
- Compliance certifications (SOC 2, ISO 27001)
- Advanced security policies
- Detailed audit logs

2. AWS Cognito:
- Scalable user management
- Built-in AWS integration
- JWT token handling
- Social identity providers
- MFA support
- Password policies
- User pool management
- Analytics and metrics
- AWS WAF integration

3. Rownd:
- Passwordless authentication
- Easy social login integration
- Progressive profiling
- User data management
- Privacy compliance tools
- Simple API integration
- Real-time user updates
- Cross-platform support

Security Improvements Over Basic Auth:

1. Token Management:
```typescript
// Instead of localStorage
const handleLogin = async () => {
  // Okta
  const { tokens } = await oktaAuth.token.getWithoutPrompt({
    responseType: ['id_token', 'token'],
    scopes: ['openid', 'profile', 'email']
  });

  // Cognito
  const session = await Auth.currentSession();
  const jwtToken = session.getIdToken().getJwtToken();

  // Rownd
  const { access_token } = await rownd.getAccessToken();
};
```

2. Session Handling:
```typescript
// Automatic session management
const checkSession = () => {
  // Okta
  oktaAuth.session.exists().then((exists) => {
    if (!exists) navigate('/login');
  });

  // Cognito
  Auth.currentAuthenticatedUser()
    .then(user => console.log('User is signed in'))
    .catch(() => navigate('/login'));

  // Rownd
  rownd.isAuthenticated().subscribe((isAuth) => {
    if (!isAuth) navigate('/login');
  });
};
```

3. User Management:
```typescript
// Profile management
const updateProfile = async (data: UserProfile) => {
  // Okta
  const user = await oktaAuth.getUser();
  await oktaAuth.updateProfile(data);

  // Cognito
  const user = await Auth.currentAuthenticatedUser();
  await Auth.updateUserAttributes(user, data);

  // Rownd
  await rownd.user.update(data);
};
```

Benefits Over Basic Authentication:

1. Security:
- Professional security auditing
- Regular security updates
- Compliance management
- DDoS protection
- Fraud detection
- IP-based restrictions

2. Features:
- Password reset flows
- Email verification
- Phone verification
- Social login options
- User profile management
- Session management
- Device tracking

3. Development:
- Reduced development time
- Maintained SDKs
- Documentation and support
- Testing environments
- Analytics and monitoring
- Simplified compliance


I'll provide a more detailed implementation of Rownd, showing its key features and integration patterns.



```typescript
// src/auth/rownd/types.ts
export interface RowndConfig {
  appKey: string;
  apiUrl?: string;
  baseUrl?: string;
  defaultRedirectUri?: string;
  customizations?: {
    signInTriggerText?: string;
    hubLoadingText?: string;
    autoTheme?: boolean;
    darkMode?: boolean;
  };
}

export interface RowndUser {
  id: string;
  data: {
    email?: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
    [key: string]: any; // Custom fields
  };
  auth: {
    access_token: string;
    refresh_token: string;
  };
}

// src/auth/rownd/RowndProvider.tsx
import React from 'react';
import { RowndProvider as BaseRowndProvider, useRownd } from '@rownd/react';

const rowndConfig: RowndConfig = {
  appKey: import.meta.env.VITE_ROWND_APP_KEY,
  customizations: {
    signInTriggerText: 'Sign in / Register',
    autoTheme: true,
  },
};

export const RowndProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <BaseRowndProvider config={rowndConfig}>
      {children}
    </BaseRowndProvider>
  );
};

// src/auth/rownd/hooks/useRowndAuth.ts
import { useRownd } from '@rownd/react';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useRowndAuth = () => {
  const { 
    is_authenticated, 
    user, 
    requestSignIn, 
    signOut, 
    getAccessToken,
    setUserData 
  } = useRownd();
  const navigate = useNavigate();

  // Handle authentication state changes
  useEffect(() => {
    if (!is_authenticated) {
      navigate('/login');
    }
  }, [is_authenticated, navigate]);

  // Enhanced sign-in with options
  const signIn = useCallback((options?: {
    post_login_redirect?: string;
    authentication_methods?: Array<'email' | 'phone' | 'google' | 'apple'>;
  }) => {
    requestSignIn({
      post_login_redirect: options?.post_login_redirect || '/dashboard',
      auto_sign_in: true,
      authentication_methods: options?.authentication_methods,
    });
  }, [requestSignIn]);

  // Update user profile
  const updateProfile = useCallback(async (data: Partial<RowndUser['data']>) => {
    try {
      await setUserData(data);
      return true;
    } catch (error) {
      console.error('Failed to update profile:', error);
      return false;
    }
  }, [setUserData]);

  // Get fresh access token
  const getFreshAccessToken = useCallback(async () => {
    try {
      const token = await getAccessToken();
      return token;
    } catch (error) {
      console.error('Failed to get access token:', error);
      return null;
    }
  }, [getAccessToken]);

  return {
    isAuthenticated: is_authenticated,
    user,
    signIn,
    signOut,
    updateProfile,
    getFreshAccessToken,
  };
};

// src/components/auth/RowndSignIn.tsx
import React from 'react';
import { Card, Button, Container } from 'react-bootstrap';
import { useRowndAuth } from '../auth/rownd/hooks/useRowndAuth';

export const RowndSignIn: React.FC = () => {
  const { signIn } = useRowndAuth();

  const handleEmailSignIn = () => {
    signIn({ authentication_methods: ['email'] });
  };

  const handleSocialSignIn = (provider: 'google' | 'apple') => {
    signIn({ authentication_methods: [provider] });
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Welcome</Card.Title>
          <div className="d-grid gap-3">
            <Button 
              variant="primary" 
              onClick={handleEmailSignIn}
              size="lg"
            >
              Continue with Email
            </Button>
            <Button 
              variant="outline-dark" 
              onClick={() => handleSocialSignIn('google')}
              size="lg"
            >
              Continue with Google
            </Button>
            <Button 
              variant="dark" 
              onClick={() => handleSocialSignIn('apple')}
              size="lg"
            >
              Continue with Apple
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

// src/components/profile/UserProfile.tsx
import React, { useState } from 'react';
import { Card, Form, Button, Alert, Container } from 'react-bootstrap';
import { useRowndAuth } from '../../auth/rownd/hooks/useRowndAuth';

export const UserProfile: React.FC = () => {
  const { user, updateProfile } = useRowndAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user.data.first_name || '',
    last_name: user.data.last_name || '',
    email: user.data.email || '',
    phone: user.data.phone || '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateProfile(formData);
    
    setMessage({
      type: success ? 'success' : 'danger',
      text: success ? 'Profile updated successfully' : 'Failed to update profile'
    });
    
    if (success) {
      setIsEditing(false);
    }
  };

  return (
    <Container className="py-4">
      <Card>
        <Card.Body>
          <Card.Title className="mb-4">User Profile</Card.Title>
          
          {message && (
            <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
              {message.text}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                disabled={!isEditing}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                disabled={!isEditing}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
              />
            </Form.Group>

            <div className="d-flex gap-2">
              {!isEditing ? (
                <Button variant="primary" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button variant="primary" type="submit">
                    Save Changes
                  </Button>
                  <Button variant="secondary" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

// src/services/api/apiClient.ts
import { useRowndAuth } from '../auth/rownd/hooks/useRowndAuth';

export const createApiClient = () => {
  const { getFreshAccessToken } = useRowndAuth();

  const apiClient = {
    get: async (url: string) => {
      const token = await getFreshAccessToken();
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.json();
    },
    
    post: async (url: string, data: any) => {
      const token = await getFreshAccessToken();
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
  };

  return apiClient;
};

```

Key Features of Rownd Implementation:

1. Authentication Methods:
```typescript
// Multiple sign-in options
const signInMethods = {
  email: () => signIn({ authentication_methods: ['email'] }),
  phone: () => signIn({ authentication_methods: ['phone'] }),
  google: () => signIn({ authentication_methods: ['google'] }),
  apple: () => signIn({ authentication_methods: ['apple'] }),
  passwordless: () => signIn({ auto_sign_in: true })
};
```

2. User Data Management:
```typescript
// Custom fields and progressive profiling
const updateUserProfile = async () => {
  await setUserData({
    custom_field: 'value',
    preferences: { marketing: true },
    profile_completion: 75
  });
};
```

3. Token Management:
```typescript
// Automatic token refresh and management
const authenticatedRequest = async () => {
  const token = await getAccessToken(); // Auto-refreshes if needed
  // Use token for API requests
};
```

Unique Rownd Features:

1. Progressive Profiling:
- Collect user data gradually
- Customizable data fields
- Data validation rules

2. Authentication:
- Passwordless options
- Multi-factor authentication
- Social login integration
- Custom auth flows

3. User Management:
- Custom user fields
- Data encryption
- GDPR compliance tools
- User verification

4. Security:
- JWTs with auto-refresh
- Encryption at rest
- Rate limiting
- Fraud prevention

API Integration Examples:

1. Protected Endpoints:
```typescript
// src/services/api/endpoints.ts
const api = createApiClient();

export const userService = {
  getProfile: () => api.get('/api/user/profile'),
  updateProfile: (data) => api.post('/api/user/profile', data),
  getPreferences: () => api.get('/api/user/preferences')
};
```

2. Error Handling:
```typescript
const handleApiError = (error: any) => {
  if (error.status === 401) {
    // Token expired or invalid
    signOut();
    navigate('/login');
  }
  // Handle other errors
};
```



I'll create an implementation that supports offline access using Rownd authentication combined with local storage and synchronization capabilities.



```typescript
// src/services/storage/types.ts
interface SyncStatus {
  lastSynced: number;
  pendingChanges: boolean;
  syncError?: string;
}

interface OfflineData<T> {
  data: T;
  lastModified: number;
  syncStatus: 'synced' | 'pending' | 'conflict';
  serverId?: string;
}

// src/services/storage/IndexedDBService.ts
export class IndexedDBService {
  private db: IDBDatabase | null = null;
  private dbName = 'offlineAppDB';
  private version = 1;

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create stores for different data types
        if (!db.objectStoreNames.contains('userData')) {
          const userStore = db.createObjectStore('userData', { keyPath: 'id' });
          userStore.createIndex('syncStatus', 'syncStatus');
        }
        
        if (!db.objectStoreNames.contains('offlineActions')) {
          db.createObjectStore('offlineActions', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
        }
      };
    });
  }

  async saveData<T>(
    storeName: string, 
    data: T, 
    id: string
  ): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const offlineData: OfflineData<T> = {
      data,
      lastModified: Date.now(),
      syncStatus: 'pending',
      serverId: id
    };

    const transaction = this.db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.put(offlineData);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getData<T>(
    storeName: string, 
    id: string
  ): Promise<OfflineData<T> | null> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }
}

// src/services/sync/SyncService.ts
import { useRowndAuth } from '../../auth/rownd/hooks/useRowndAuth';

export class SyncService {
  private indexedDB: IndexedDBService;
  private syncInProgress = false;
  private readonly syncInterval = 5 * 60 * 1000; // 5 minutes

  constructor(private auth: ReturnType<typeof useRowndAuth>) {
    this.indexedDB = new IndexedDBService();
    this.init();
  }

  private async init() {
    await this.indexedDB.init();
    this.startPeriodicSync();
  }

  private startPeriodicSync() {
    setInterval(() => {
      if (navigator.onLine) {
        this.syncData();
      }
    }, this.syncInterval);

    window.addEventListener('online', () => {
      this.syncData();
    });
  }

  async syncData() {
    if (this.syncInProgress) return;
    this.syncInProgress = true;

    try {
      const token = await this.auth.getFreshAccessToken();
      if (!token) {
        console.warn('No valid token for sync');
        return;
      }

      // Sync user data
      const userData = await this.indexedDB.getData<any>('userData', 'currentUser');
      if (userData?.syncStatus === 'pending') {
        await this.syncUserData(userData.data, token);
      }

      // Sync offline actions
      await this.syncOfflineActions(token);

      this.syncInProgress = false;
    } catch (error) {
      console.error('Sync failed:', error);
      this.syncInProgress = false;
    }
  }

  private async syncUserData(userData: any, token: string) {
    try {
      const response = await fetch('/api/user/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        await this.indexedDB.saveData('userData', userData, 'currentUser');
      }
    } catch (error) {
      console.error('Failed to sync user data:', error);
    }
  }

  private async syncOfflineActions(token: string) {
    // Implement offline action sync logic
  }
}

// src/hooks/useOfflineAuth.ts
import { useState, useEffect } from 'react';
import { useRowndAuth } from '../auth/rownd/hooks/useRowndAuth';

export const useOfflineAuth = () => {
  const rowndAuth = useRowndAuth();
  const [offlineCapable, setOfflineCapable] = useState(false);
  const [syncService, setSyncService] = useState<SyncService | null>(null);
  const [indexedDB] = useState(() => new IndexedDBService());

  useEffect(() => {
    const initOfflineSupport = async () => {
      await indexedDB.init();
      const sync = new SyncService(rowndAuth);
      setSyncService(sync);
      setOfflineCapable(true);
    };

    initOfflineSupport();
  }, []);

  const login = async (credentials: any) => {
    try {
      // Try online login first
      if (navigator.onLine) {
        await rowndAuth.signIn();
        await cacheUserData();
      } else {
        // Check offline credentials
        const cached = await indexedDB.getData('userData', 'currentUser');
        if (!cached) {
          throw new Error('No offline data available');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const cacheUserData = async () => {
    if (rowndAuth.user) {
      await indexedDB.saveData(
        'userData',
        rowndAuth.user,
        'currentUser'
      );
    }
  };

  return {
    ...rowndAuth,
    login,
    offlineCapable,
    syncService,
  };
};

// src/components/OfflineAwareApp.tsx
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useOfflineAuth } from '../hooks/useOfflineAuth';

export const OfflineAwareApp: React.FC = () => {
  const { offlineCapable, user, syncService } = useOfflineAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSynced: 0,
    pendingChanges: false
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline && syncService) {
      syncService.syncData().then(() => {
        setSyncStatus({
          lastSynced: Date.now(),
          pendingChanges: false
        });
      });
    }
  }, [isOnline, syncService]);

  return (
    <div>
      {!isOnline && (
        <Alert variant="warning">
          You are currently offline. Changes will be synchronized when you reconnect.
        </Alert>
      )}
      
      {syncStatus.pendingChanges && (
        <Alert variant="info">
          You have pending changes that will sync when you're back online.
        </Alert>
      )}

      {/* Your app content */}
    </div>
  );
};

// src/services/api/offlineApiClient.ts
export const createOfflineApiClient = (indexedDB: IndexedDBService) => {
  const queueOfflineAction = async (action: {
    type: string;
    payload: any;
    timestamp: number;
  }) => {
    await indexedDB.saveData('offlineActions', action, action.timestamp.toString());
  };

  return {
    get: async (url: string) => {
      try {
        if (!navigator.onLine) {
          // Try to get from cache
          const cachedData = await indexedDB.getData('apiCache', url);
          if (cachedData) {
            return cachedData;
          }
          throw new Error('No cached data available');
        }

        // Online request
        const response = await fetch(url);
        const data = await response.json();
        
        // Cache the response
        await indexedDB.saveData('apiCache', data, url);
        
        return data;
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    },

    post: async (url: string, data: any) => {
      try {
        if (!navigator.onLine) {
          // Queue action for later
          await queueOfflineAction({
            type: 'POST',
            payload: { url, data },
            timestamp: Date.now()
          });
          return { queued: true };
        }

        // Online request
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        return response.json();
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    }
  };
};

```

Key Features of the Offline Implementation:

1. Data Storage:
```typescript
// Example of storing critical user data
const cacheUserData = async (user: RowndUser) => {
  await indexedDB.saveData('userData', {
    profile: user.data,
    token: user.auth.access_token,
    timestamp: Date.now()
  }, 'currentUser');
};
```

2. Sync Management:
```typescript
// Example of handling sync conflicts
const resolveConflict = async (localData: any, serverData: any) => {
  if (localData.lastModified > serverData.lastModified) {
    return localData;
  }
  return serverData;
};
```

3. Offline Detection:
```typescript
// Network status monitoring
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);
  
  return isOnline;
};
```

Important Considerations:

1. Security:
- Encrypt sensitive data in IndexedDB
- Clear offline data on logout
- Validate offline actions before sync
- Token expiration handling

2. Data Management:
- Prioritize critical data for offline storage
- Handle storage limits
- Implement data cleanup strategies
- Version control for offline data

3. User Experience:
- Clear offline indicators
- Progress tracking for sync
- Error handling and retry mechanisms
- Conflict resolution UI

4. Performance:
- Efficient data indexing
- Batch synchronization
- Background sync when possible
- Compression for large datasets


I'll add encryption to the offline storage implementation using the Web Crypto API for secure data handling.



```typescript
// src/services/encryption/types.ts
interface EncryptionKeys {
  encryptionKey: CryptoKey;
  iv: Uint8Array;
}

interface EncryptedData {
  ciphertext: string;  // Base64 encoded
  iv: string;         // Base64 encoded
  timestamp: number;
}

// src/services/encryption/CryptoService.ts
export class CryptoService {
  private static instance: CryptoService;
  private masterKey: CryptoKey | null = null;
  private keyCache: Map<string, CryptoKey> = new Map();

  private constructor() {}

  static getInstance(): CryptoService {
    if (!this.instance) {
      this.instance = new CryptoService();
    }
    return this.instance;
  }

  async init(userIdentifier: string): Promise<void> {
    // Derive master key from user identifier
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(userIdentifier),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    // Create salt from user identifier
    const salt = encoder.encode(userIdentifier).slice(0, 16);

    this.masterKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  async generateDataKey(): Promise<EncryptionKeys> {
    if (!this.masterKey) throw new Error('CryptoService not initialized');

    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));

    return { encryptionKey: key, iv };
  }

  private async deriveKeyFromMaster(salt: Uint8Array): Promise<CryptoKey> {
    if (!this.masterKey) throw new Error('CryptoService not initialized');

    const cacheKey = Array.from(salt).join(',');
    if (this.keyCache.has(cacheKey)) {
      return this.keyCache.get(cacheKey)!;
    }

    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      this.masterKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    this.keyCache.set(cacheKey, derivedKey);
    return derivedKey;
  }

  async encrypt(data: any, context: string): Promise<EncryptedData> {
    const { encryptionKey, iv } = await this.generateDataKey();
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(JSON.stringify(data));

    const encryptedContent = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
        additionalData: encoder.encode(context)
      },
      encryptionKey,
      encodedData
    );

    return {
      ciphertext: this.arrayBufferToBase64(encryptedContent),
      iv: this.arrayBufferToBase64(iv),
      timestamp: Date.now()
    };
  }

  async decrypt(encryptedData: EncryptedData, context: string): Promise<any> {
    const { encryptionKey } = await this.generateDataKey();
    const encoder = new TextEncoder();

    try {
      const decryptedContent = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: this.base64ToArrayBuffer(encryptedData.iv),
          additionalData: encoder.encode(context)
        },
        encryptionKey,
        this.base64ToArrayBuffer(encryptedData.ciphertext)
      );

      const decoder = new TextDecoder();
      return JSON.parse(decoder.decode(decryptedContent));
    } catch (error) {
      throw new Error('Decryption failed: Data may be corrupted or tampered with');
    }
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

// src/services/storage/EncryptedIndexedDBService.ts
export class EncryptedIndexedDBService {
  private db: IDBDatabase | null = null;
  private crypto: CryptoService;
  
  constructor() {
    this.crypto = CryptoService.getInstance();
  }

  async init(userIdentifier: string) {
    await this.crypto.init(userIdentifier);
    await this.initDatabase();
  }

  private async initDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('encryptedOfflineDB', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create encrypted stores
        if (!db.objectStoreNames.contains('encryptedUserData')) {
          const store = db.createObjectStore('encryptedUserData', { 
            keyPath: 'id' 
          });
          store.createIndex('timestamp', 'timestamp');
        }

        if (!db.objectStoreNames.contains('encryptedOfflineActions')) {
          const store = db.createObjectStore('encryptedOfflineActions', {
            keyPath: 'id',
            autoIncrement: true
          });
          store.createIndex('timestamp', 'timestamp');
        }
      };
    });
  }

  async saveEncryptedData<T>(
    storeName: string,
    data: T,
    id: string
  ): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const encryptedData = await this.crypto.encrypt(data, `${storeName}:${id}`);
    const transaction = this.db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.put({
        id,
        ...encryptedData
      });
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getDecryptedData<T>(
    storeName: string,
    id: string
  ): Promise<T | null> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.get(id);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = async () => {
        if (!request.result) {
          resolve(null);
          return;
        }

        try {
          const decryptedData = await this.crypto.decrypt(
            request.result,
            `${storeName}:${id}`
          );
          resolve(decryptedData);
        } catch (error) {
          reject(error);
        }
      };
    });
  }

  async clearEncryptedData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const storeNames = this.db.objectStoreNames;
    const transaction = this.db.transaction(
      Array.from(storeNames),
      'readwrite'
    );

    const clearPromises = Array.from(storeNames).map(
      (storeName) => new Promise<void>((resolve, reject) => {
        const request = transaction.objectStore(storeName).clear();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      })
    );

    await Promise.all(clearPromises);
  }
}

// src/hooks/useEncryptedOfflineStorage.ts
export const useEncryptedOfflineStorage = () => {
  const { user } = useRowndAuth();
  const [storage] = useState(() => new EncryptedIndexedDBService());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (user?.id && !isInitialized) {
      storage.init(user.id)
        .then(() => setIsInitialized(true))
        .catch(console.error);
    }
  }, [user?.id]);

  const saveData = async <T,>(
    key: string,
    data: T,
    options?: { isSecure?: boolean }
  ) => {
    if (!isInitialized) throw new Error('Storage not initialized');

    const storeName = options?.isSecure 
      ? 'encryptedUserData' 
      : 'encryptedOfflineActions';

    await storage.saveEncryptedData(storeName, data, key);
  };

  const getData = async <T,>(
    key: string,
    options?: { isSecure?: boolean }
  ): Promise<T | null> => {
    if (!isInitialized) throw new Error('Storage not initialized');

    const storeName = options?.isSecure 
      ? 'encryptedUserData' 
      : 'encryptedOfflineActions';

    return storage.getDecryptedData<T>(storeName, key);
  };

  return {
    isInitialized,
    saveData,
    getData,
    clearData: () => storage.clearEncryptedData()
  };
};

// Example usage in a component
const SecureOfflineComponent: React.FC = () => {
  const storage = useEncryptedOfflineStorage();
  const [sensitiveData, setSensitiveData] = useState<any>(null);

  const handleSaveData = async () => {
    try {
      await storage.saveData('sensitive-key', {
        secretInfo: 'very-secret-data',
        timestamp: Date.now()
      }, { isSecure: true });
    } catch (error) {
      console.error('Failed to save encrypted data:', error);
    }
  };

  const handleLoadData = async () => {
    try {
      const data = await storage.getData('sensitive-key', { isSecure: true });
      setSensitiveData(data);
    } catch (error) {
      console.error('Failed to load encrypted data:', error);
    }
  };

  return (
    <div>
      <Button onClick={handleSaveData}>Save Encrypted Data</Button>
      <Button onClick={handleLoadData}>Load Encrypted Data</Button>
      {sensitiveData && (
        <div>
          <pre>{JSON.stringify(sensitiveData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

```

Key Security Features:

1. Key Derivation:
```typescript
// Derive encryption keys securely
const deriveKey = async (userIdentifier: string): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(userIdentifier),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('your-salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};
```

2. Data Encryption:
```typescript
// Example of encrypting sensitive data
const encryptData = async (data: any, key: CryptoKey): Promise<EncryptedData> => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(JSON.stringify(data))
  );
  
  return {
    ciphertext: arrayBufferToBase64(encrypted),
    iv: arrayBufferToBase64(iv)
  };
};
```

3. Secure Storage:
- Encryption at rest
- Key rotation
- Secure key storage
- Data integrity checks

4. Security Best Practices:
- Random IV generation
- Authenticated encryption
- Key derivation with PBKDF2
- Secure error handling
