// ============================================================================
// API ENDPOINTS & CONSTANTS
// ============================================================================

/**
 * All API endpoint URLs
 * Centralized for easy maintenance and type safety
 */
export const API_ENDPOINTS = {
  // ============================================================================
  // AUTHENTICATION
  // ============================================================================
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    VERIFY_EMAIL: '/api/auth/verify-email',
    VERIFY_PHONE: '/api/auth/verify-phone',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    ME: '/api/users/me',
  },

  // ============================================================================
  // USERS
  // ============================================================================
  USERS: {
    ME: '/api/users/me',
    PROFILE_STATUS: '/api/users/profile-status',
    SWITCH_PROFILE: '/api/users/switch-profile',
    UPDATE: '/api/users/me',
    UPLOAD_PHOTO: '/api/users/upload-photo',
    BY_ID: (id: string) => `/api/users/${id}`,
  },

  // ============================================================================
  // BUSINESSES
  // ============================================================================
  BUSINESSES: {
    SETUP: '/api/businesses/setup',
    LIST: '/api/businesses',
    NEARBY: '/api/businesses/nearby',
    SEARCH: '/api/businesses/search',
    BY_ID: (id: string) => `/api/businesses/${id}`,
    UPDATE: (id: string) => `/api/businesses/${id}`,
    FOLLOW: (id: string) => `/api/businesses/${id}/follow`,
    UNFOLLOW: (id: string) => `/api/businesses/${id}/follow`,
    FOLLOWERS: (id: string) => `/api/businesses/${id}/followers`,
    ANALYTICS: (id: string) => `/api/businesses/${id}/analytics`,
    INVENTORY: (id: string) => `/api/businesses/${id}/inventory`,
    ORDERS: (id: string) => `/api/businesses/${id}/orders`,
    BOOKINGS: (id: string) => `/api/businesses/${id}/bookings`,
    AVAILABILITY: (id: string) => `/api/businesses/${id}/availability`,
  },

  // ============================================================================
  // FEED & POSTS
  // ============================================================================
  FEED: {
    MAIN: '/api/feed',
    PUBLIC: '/api/feed/public',
    TRENDING: '/api/feed/trending',
  },

  POSTS: {
    LIST: '/api/posts',
    CREATE: '/api/posts',
    BY_ID: (id: string) => `/api/posts/${id}`,
    UPDATE: (id: string) => `/api/posts/${id}`,
    DELETE: (id: string) => `/api/posts/${id}`,
    LIKE: (id: string) => `/api/posts/${id}/like`,
    UNLIKE: (id: string) => `/api/posts/${id}/like`,
    SAVE: (id: string) => `/api/posts/${id}/save`,
    UNSAVE: (id: string) => `/api/posts/${id}/save`,
    SHARE: (id: string) => `/api/posts/${id}/share`,
    COMMENTS: (id: string) => `/api/posts/${id}/comments`,
    BOOST: (id: string) => `/api/posts/${id}/boost`,
  },

  // ============================================================================
  // WISHLIST & BOARDS
  // ============================================================================
  BOARDS: {
    LIST: '/api/boards',
    CREATE: '/api/boards',
    BY_ID: (id: string) => `/api/boards/${id}`,
    UPDATE: (id: string) => `/api/boards/${id}`,
    DELETE: (id: string) => `/api/boards/${id}`,
    ADD_ITEM: (id: string) => `/api/boards/${id}/items`,
    REMOVE_ITEM: (boardId: string, itemId: string) => `/api/boards/${boardId}/items/${itemId}`,
    ADD_COLLABORATOR: (id: string) => `/api/boards/${id}/collaborators`,
    REMOVE_COLLABORATOR: (boardId: string, userId: string) => `/api/boards/${boardId}/collaborators/${userId}`,
  },

  // ============================================================================
  // PRODUCTS & INVENTORY
  // ============================================================================
  PRODUCTS: {
    LIST: '/api/products',
    CREATE: '/api/products',
    BY_ID: (id: string) => `/api/products/${id}`,
    UPDATE: (id: string) => `/api/products/${id}`,
    DELETE: (id: string) => `/api/products/${id}`,
    INVENTORY: (id: string) => `/api/products/${id}/inventory`,
    VARIANTS: (id: string) => `/api/products/${id}/variants`,
  },

  // ============================================================================
  // ORDERS & TRANSACTIONS
  // ============================================================================
  ORDERS: {
    LIST: '/api/orders',
    CREATE: '/api/orders',
    BY_ID: (id: string) => `/api/orders/${id}`,
    UPDATE_STATUS: (id: string) => `/api/orders/${id}/status`,
    REFUND: (id: string) => `/api/orders/${id}/refund`,
  },

  // ============================================================================
  // PAYMENTS
  // ============================================================================
  PAYMENTS: {
    CREATE_INTENT: '/api/payments/create-intent',
    CONFIRM: '/api/payments/confirm',
    REFUND: '/api/payments/refund',
    BY_ID: (id: string) => `/api/payments/${id}`,
    METHODS: '/api/payments/methods',
    ADD_METHOD: '/api/payments/methods',
    REMOVE_METHOD: (id: string) => `/api/payments/methods/${id}`,
  },

  // ============================================================================
  // BOOKINGS
  // ============================================================================
  BOOKINGS: {
    LIST: '/api/bookings',
    CREATE: '/api/bookings',
    BY_ID: (id: string) => `/api/bookings/${id}`,
    UPDATE: (id: string) => `/api/bookings/${id}`,
    CANCEL: (id: string) => `/api/bookings/${id}`,
    CHECK_IN: (id: string) => `/api/bookings/${id}/check-in`,
  },

  // ============================================================================
  // REVIEWS
  // ============================================================================
  REVIEWS: {
    LIST: '/api/reviews',
    CREATE: '/api/reviews',
    BY_ID: (id: string) => `/api/reviews/${id}`,
    UPDATE: (id: string) => `/api/reviews/${id}`,
    DELETE: (id: string) => `/api/reviews/${id}`,
    RESPOND: (id: string) => `/api/reviews/${id}/respond`,
    VOTE: (id: string) => `/api/reviews/${id}/vote`,
  },

  // ============================================================================
  // MESSAGING
  // ============================================================================
  MESSAGES: {
    CONVERSATIONS: '/api/conversations',
    CREATE_CONVERSATION: '/api/conversations',
    BY_ID: (id: string) => `/api/conversations/${id}`,
    SEND: (id: string) => `/api/conversations/${id}/messages`,
    MARK_READ: (id: string) => `/api/messages/${id}/read`,
    SEND_PAYMENT: (id: string) => `/api/messages/${id}/payment`,
  },

  // ============================================================================
  // NOTIFICATIONS
  // ============================================================================
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    MARK_READ: (id: string) => `/api/notifications/${id}/read`,
    MARK_ALL_READ: '/api/notifications/read-all',
    PREFERENCES: '/api/notifications/preferences',
    UPDATE_PREFERENCES: '/api/notifications/preferences',
  },

  // ============================================================================
  // BBT WALLET
  // ============================================================================
  WALLET: {
    BALANCE: '/api/wallet',
    TRANSACTIONS: '/api/wallet/transactions',
    CASH_OUT: '/api/wallet/cash-out',
    REDEEM: '/api/wallet/redeem',
    GIFT: '/api/wallet/gift',
    EARNINGS: '/api/wallet/earnings-breakdown',
  },

  CREATOR_FUND: {
    ELIGIBILITY: '/api/creator-fund/eligibility',
    EARNINGS: '/api/creator-fund/earnings',
  },

  // ============================================================================
  // SEARCH
  // ============================================================================
  SEARCH: {
    GLOBAL: '/api/search',
    SUGGESTIONS: '/api/search/suggestions',
    TRENDING: '/api/search/trending',
    VISUAL: '/api/search/visual',
  },

  // ============================================================================
  // MAP & LOCATION
  // ============================================================================
  MAP: {
    BUSINESSES: '/api/map/businesses',
    HEATMAP: '/api/map/heatmap',
    CHECK_IN: '/api/map/check-in',
  },

  // ============================================================================
  // CAMPAIGNS
  // ============================================================================
  CAMPAIGNS: {
    LIST: '/api/campaigns',
    CREATE: '/api/campaigns',
    BY_ID: (id: string) => `/api/campaigns/${id}`,
    UPDATE: (id: string) => `/api/campaigns/${id}`,
    DELETE: (id: string) => `/api/campaigns/${id}`,
    PAUSE: (id: string) => `/api/campaigns/${id}/pause`,
    RESUME: (id: string) => `/api/campaigns/${id}/resume`,
  },

  // ============================================================================
  // ANALYTICS
  // ============================================================================
  ANALYTICS: {
    OVERVIEW: (businessId: string) => `/api/analytics/business/${businessId}/overview`,
    REVENUE: (businessId: string) => `/api/analytics/business/${businessId}/revenue`,
    CUSTOMERS: (businessId: string) => `/api/analytics/business/${businessId}/customers`,
    CONTENT: (businessId: string) => `/api/analytics/business/${businessId}/content`,
    EXPORT: (businessId: string) => `/api/analytics/business/${businessId}/export`,
  },

  // ============================================================================
  // SETTINGS
  // ============================================================================
  SETTINGS: {
    GET: '/api/settings',
    UPDATE: '/api/settings',
    PRIVACY: '/api/settings/privacy',
    NOTIFICATIONS: '/api/settings/notifications',
    DEACTIVATE: '/api/settings/deactivate',
    DELETE: '/api/settings/delete-account',
  },

  // ============================================================================
  // FILE UPLOADS
  // ============================================================================
  UPLOAD: {
    IMAGE: '/api/upload/image',
    VIDEO: '/api/upload/video',
    FILE: '/api/upload/file',
  },
} as const;

// ============================================================================
// OTHER CONSTANTS
// ============================================================================

/**
 * API response status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Query keys for React Query
 * Centralized for consistency
 */
export const QUERY_KEYS = {
  // Auth
  CURRENT_USER: ['user', 'me'],
  PROFILE_STATUS: ['user', 'profile-status'],

  // Feed
  FEED: ['feed'],
  PUBLIC_FEED: ['feed', 'public'],
  TRENDING_FEED: ['feed', 'trending'],

  // Businesses
  BUSINESSES: ['businesses'],
  BUSINESS: (id: string) => ['business', id],
  NEARBY_BUSINESSES: ['businesses', 'nearby'],

  // Posts
  POSTS: ['posts'],
  POST: (id: string) => ['post', id],
  POST_COMMENTS: (id: string) => ['post', id, 'comments'],

  // Boards
  BOARDS: ['boards'],
  BOARD: (id: string) => ['board', id],

  // Products
  PRODUCTS: ['products'],
  PRODUCT: (id: string) => ['product', id],

  // Orders
  ORDERS: ['orders'],
  ORDER: (id: string) => ['order', id],

  // Bookings
  BOOKINGS: ['bookings'],
  BOOKING: (id: string) => ['booking', id],

  // Reviews
  REVIEWS: ['reviews'],
  REVIEW: (id: string) => ['review', id],

  // Messages
  CONVERSATIONS: ['conversations'],
  CONVERSATION: (id: string) => ['conversation', id],

  // Notifications
  NOTIFICATIONS: ['notifications'],

  // Wallet
  WALLET: ['wallet'],
  WALLET_TRANSACTIONS: ['wallet', 'transactions'],

  // Analytics
  ANALYTICS: (businessId: string) => ['analytics', businessId],
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_PREFERENCES: 'userPreferences',
  THEME: 'theme',
  REDIRECT_AFTER_LOGIN: 'redirectAfterLogin',
} as const;

/**
 * App configuration
 */
export const APP_CONFIG = {
  APP_NAME: 'BBroker',
  DEFAULT_PAGE_SIZE: 20,
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
  REQUEST_TIMEOUT: 30000, // 30 seconds
} as const;
