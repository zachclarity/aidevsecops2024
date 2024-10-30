// src/types/auth.ts
export interface User {
    logout: () => {};
    login: (username: string) => {};
    isAuthenticated: boolean;
    username: string;
  }
  
  export type UserRole = 'admin' | 'user' | 'guest';
  
  export interface UserPreferences {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
  }
  
  export interface LoginCredentials {
    username: string;
    password: string;
    rememberMe?: boolean;
  }
  
  export interface AuthResponse {
    user: User;
    tokens: AuthTokens;
  }
  
  export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }
  
  // src/types/storage.ts
  export interface StorageItem<T> {
    id: string;
    data: T;
    metadata: StorageMetadata;
    encryption: EncryptionMetadata;
  }
  
  export interface StorageMetadata {
    created: number;
    modified: number;
    version: number;
    synced: boolean;
    syncedAt?: number;
    checksum: string;
  }
  
  export interface EncryptionMetadata {
    algorithm: EncryptionAlgorithm;
    keyId: string;
    iv: string; // Base64 encoded initialization vector
    authTag?: string; // For authenticated encryption
  }
  
  export type EncryptionAlgorithm = 'AES-GCM' | 'AES-CBC';
  
  export interface StorageOptions {
    encrypted?: boolean;
    compress?: boolean;
    expireIn?: number;
    priority?: 'high' | 'normal' | 'low';
  }
  
  // src/types/crypto.ts
  export interface CryptoKeys {
    encryptionKey: CryptoKey;
    signingKey?: CryptoKey;
    keyId: string;
    created: number;
    expires?: number;
  }
  
  export interface EncryptedData {
    ciphertext: string; // Base64 encoded
    iv: string; // Base64 encoded
    authTag?: string; // For AES-GCM
    algorithm: EncryptionAlgorithm;
    keyId: string;
    metadata: EncryptionMetadata;
  }
  
  export interface KeyDerivationParams {
    salt: Uint8Array;
    iterations: number;
    hash: 'SHA-256' | 'SHA-384' | 'SHA-512';
  }
  
  // src/types/sync.ts
  export interface SyncState {
    lastSync: number;
    status: SyncStatus;
    pendingChanges: number;
    error?: SyncError;
  }
  
  export type SyncStatus = 
    | 'idle' 
    | 'syncing' 
    | 'failed' 
    | 'completed' 
    | 'conflict';
  
  export interface SyncError {
    code: string;
    message: string;
    timestamp: number;
    retryCount: number;
  }
  
  export interface SyncOperation<T> {
    id: string;
    type: SyncOperationType;
    data: T;
    timestamp: number;
    status: SyncOperationStatus;
    retryCount: number;
  }
  
  export type SyncOperationType = 'create' | 'update' | 'delete';
  
  export type SyncOperationStatus = 'pending' | 'completed' | 'failed' | 'conflict';
  
  // src/types/offline.ts
  export interface OfflineState {
    isOnline: boolean;
    lastOnline: number;
    syncPending: boolean;
    storageQuota: StorageQuota;
  }
  
  export interface StorageQuota {
    usage: number;
    quota: number;
    available: number;
  }
  
  export interface OfflineAction<T> {
    id: string;
    type: OfflineActionType;
    data: T;
    priority: OfflineActionPriority;
    created: number;
    expires?: number;
    retryPolicy: RetryPolicy;
  }
  
  export type OfflineActionType = 
    | 'data-sync' 
    | 'auth-refresh' 
    | 'profile-update'
    | 'cache-cleanup';
  
  export type OfflineActionPriority = 'critical' | 'high' | 'normal' | 'low';
  
  export interface RetryPolicy {
    maxAttempts: number;
    backoffType: 'linear' | 'exponential';
    backoffInterval: number;
    timeout: number;
  }
  
  // src/types/api.ts
  export interface ApiRequestConfig {
    url: string;
    method: HttpMethod;
    headers?: Record<string, string>;
    data?: unknown;
    timeout?: number;
    retry?: RetryPolicy;
    offlineSupport?: boolean;
  }
  
  export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  
  export interface ApiResponse<T> {
    data: T;
    status: number;
    headers: Record<string, string>;
    cached?: boolean;
    timestamp: number;
  }
  
  // src/types/events.ts
  export interface AppEvent<T = unknown> {
    type: AppEventType;
    payload: T;
    timestamp: number;
    source: EventSource;
  }
  
  export type AppEventType =
    | 'auth:login'
    | 'auth:logout'
    | 'auth:refresh'
    | 'sync:started'
    | 'sync:completed'
    | 'sync:failed'
    | 'storage:quota-exceeded'
    | 'storage:cleanup-required'
    | 'offline:available'
    | 'offline:unavailable';
  
  export type EventSource = 'user' | 'system' | 'network' | 'storage';
  
  // src/types/errors.ts
  export interface AppError {
    code: ErrorCode;
    message: string;
    details?: unknown;
    timestamp: number;
    handled: boolean;
  }
  
  export type ErrorCode =
    | 'AUTH_FAILED'
    | 'NETWORK_ERROR'
    | 'STORAGE_ERROR'
    | 'CRYPTO_ERROR'
    | 'SYNC_ERROR'
    | 'QUOTA_EXCEEDED'
    | 'INVALID_STATE';
  
  // Type Guards
  /*
  export const isUser = (obj: unknown): obj is User => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'id' in obj &&
      'roles' in obj &&
      Array.isArray((obj as User).roles)
    );
  };
  
  export const isEncryptedData = (obj: unknown): obj is EncryptedData => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'ciphertext' in obj &&
      'iv' in obj &&
      'algorithm' in obj
    );
  };
  
  // Utility Types
  export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
  };
  
  export type Immutable<T> = {
    readonly [P in keyof T]: T[P] extends object ? Immutable<T[P]> : T[P];
  };
  
  // Hook Types
  export interface UseAuthResult {
    user: User | null;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;
  }
  
  export interface UseOfflineStorageResult<T> {
    data: T | null;
    saveData: (data: T) => Promise<void>;
    loadData: () => Promise<T | null>;
    clearData: () => Promise<void>;
    syncStatus: SyncState;
  }
  
  export interface UseCryptoResult {
    encrypt: <T>(data: T) => Promise<EncryptedData>;
    decrypt: <T>(data: EncryptedData) => Promise<T>;
    generateKey: () => Promise<CryptoKeys>;
    rotateKeys: () => Promise<void>;
  }
    */