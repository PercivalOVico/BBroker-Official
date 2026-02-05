import { pgTable, text, integer, timestamp, boolean, decimal, jsonb, uuid, varchar, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

// ============================================================================
// ENUMS
// ============================================================================

export const profileTypeEnum = pgEnum('profile_type', ['user', 'business']);
export const accountStatusEnum = pgEnum('account_status', ['active', 'inactive', 'suspended', 'banned']);
export const businessStatusEnum = pgEnum('business_status', ['active', 'inactive', 'pending_verification', 'verified', 'suspended']);
export const targetMarketEnum = pgEnum('target_market', ['neighborhood', 'local', 'regional', 'national', 'global']);
export const postTypeEnum = pgEnum('post_type', ['post', 'video', 'reel', 'story', 'idea_pin', 'article']);
export const messageTypeEnum = pgEnum('message_type', ['text', 'image', 'voice', 'file', 'payment', 'booking']);
export const notificationTypeEnum = pgEnum('notification_type', ['like', 'comment', 'follow', 'booking', 'payment', 'message', 'review', 'system']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed', 'refunded', 'disputed']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'completed', 'cancelled', 'no_show']);
export const tokenTransactionTypeEnum = pgEnum('token_transaction_type', ['earn', 'spend', 'refund', 'gift', 'cash_out']);
export const moderationStatusEnum = pgEnum('moderation_status', ['pending', 'approved', 'rejected', 'flagged']);
export const adminRoleEnum = pgEnum('admin_role', ['super_admin', 'moderator', 'support', 'analytics_viewer', 'financial_admin', 'business_manager']);

// ============================================================================
// CORE USER & BUSINESS TABLES
// ============================================================================

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  fullName: varchar("full_name", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  bio: text("bio"),
  profilePhoto: text("profile_photo"),
  coverPhoto: text("cover_photo"),
  
  // Profile state
  currentProfile: profileTypeEnum("current_profile").notNull().default('user'),
  hasBusinessProfile: boolean("has_business_profile").notNull().default(false),
  
  // Status
  status: accountStatusEnum("status").notNull().default('active'),
  emailVerified: boolean("email_verified").notNull().default(false),
  phoneVerified: boolean("phone_verified").notNull().default(false),
  
  // Preferences
  interests: jsonb("interests").$type<string[]>().default([]),
  location: jsonb("location").$type<{
    latitude?: number;
    longitude?: number;
    city?: string;
    state?: string;
    country?: string;
  }>(),
  
  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
});

export const businesses = pgTable("businesses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  // Basic Info
  businessName: varchar("business_name", { length: 100 }).notNull(),
  description: text("description"),
  logo: text("logo"),
  coverImage: text("cover_image"),
  
  // Location
  location: jsonb("location").notNull().$type<{
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }>(),
  
  // Working Hours
  workingHours: jsonb("working_hours").notNull().$type<{
    monday: { open: boolean; start: string | null; end: string | null };
    tuesday: { open: boolean; start: string | null; end: string | null };
    wednesday: { open: boolean; start: string | null; end: string | null };
    thursday: { open: boolean; start: string | null; end: string | null };
    friday: { open: boolean; start: string | null; end: string | null };
    saturday: { open: boolean; start: string | null; end: string | null };
    sunday: { open: boolean; start: string | null; end: string | null };
    is24x7: boolean;
    isByAppointment: boolean;
  }>(),
  
  // Categories
  mainCategory: varchar("main_category", { length: 50 }).notNull(),
  affiliateCategory1: varchar("affiliate_category_1", { length: 50 }),
  affiliateCategory2: varchar("affiliate_category_2", { length: 50 }),
  affiliateCategory3: varchar("affiliate_category_3", { length: 50 }),
  
  // Target Audience
  targetMarket: targetMarketEnum("target_market").notNull(),
  targetAgeRanges: jsonb("target_age_ranges").$type<string[]>().notNull(),
  
  // Metrics
  rating: decimal("rating", { precision: 3, scale: 2 }).default('0'),
  reviewCount: integer("review_count").notNull().default(0),
  followerCount: integer("follower_count").notNull().default(0),
  viewCount: integer("view_count").notNull().default(0),
  
  // Subscription
  subscriptionTier: varchar("subscription_tier", { length: 20 }).default('free'), // free, pro, elite
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  
  // Status
  status: businessStatusEnum("status").notNull().default('pending_verification'),
  isVerified: boolean("is_verified").notNull().default(false),
  
  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  lastActiveAt: timestamp("last_active_at"),
});

// ============================================================================
// SOCIAL FEATURES
// ============================================================================

export const follows = pgTable("follows", {
  id: uuid("id").primaryKey().defaultRandom(),
  followerId: uuid("follower_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  followingId: uuid("following_id").notNull(), // Can be user or business ID
  followingType: varchar("following_type", { length: 10 }).notNull(), // 'user' or 'business'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  authorId: uuid("author_id").notNull(), // Can be user or business
  authorType: varchar("author_type", { length: 10 }).notNull(), // 'user' or 'business'
  
  type: postTypeEnum("type").notNull().default('post'),
  content: text("content"),
  media: jsonb("media").$type<Array<{
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  }>>(),
  
  // Metadata
  hashtags: jsonb("hashtags").$type<string[]>().default([]),
  mentions: jsonb("mentions").$type<string[]>().default([]),
  location: jsonb("location").$type<{
    latitude?: number;
    longitude?: number;
    placeName?: string;
  }>(),
  
  // Tagged items
  taggedProducts: jsonb("tagged_products").$type<string[]>().default([]),
  taggedBusinesses: jsonb("tagged_businesses").$type<string[]>().default([]),
  
  // Metrics
  likeCount: integer("like_count").notNull().default(0),
  commentCount: integer("comment_count").notNull().default(0),
  shareCount: integer("share_count").notNull().default(0),
  saveCount: integer("save_count").notNull().default(0),
  viewCount: integer("view_count").notNull().default(0),
  
  // Moderation
  moderationStatus: moderationStatusEnum("moderation_status").notNull().default('approved'),
  flagCount: integer("flag_count").notNull().default(0),
  
  // Story/Reel specific
  expiresAt: timestamp("expires_at"), // For stories (24 hours)
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: 'cascade' }),
  authorId: uuid("author_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  parentCommentId: uuid("parent_comment_id"), // For nested comments
  
  content: text("content").notNull(),
  likeCount: integer("like_count").notNull().default(0),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const likes = pgTable("likes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  targetId: uuid("target_id").notNull(), // Can be post, comment, etc.
  targetType: varchar("target_type", { length: 20 }).notNull(), // 'post', 'comment'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const shares = pgTable("shares", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: 'cascade' }),
  platform: varchar("platform", { length: 20 }), // 'internal', 'facebook', 'twitter', etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================================
// WISHLIST / BOARDS (Pinterest-style)
// ============================================================================

export const boards = pgTable("boards", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  coverImage: text("cover_image"),
  isPrivate: boolean("is_private").notNull().default(false),
  isDefault: boolean("is_default").notNull().default(false), // Main wishlist board
  itemCount: integer("item_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const boardItems = pgTable("board_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  boardId: uuid("board_id").notNull().references(() => boards.id, { onDelete: 'cascade' }),
  itemId: uuid("item_id").notNull(), // Can be business, product, post
  itemType: varchar("item_type", { length: 20 }).notNull(), // 'business', 'product', 'post'
  notes: text("notes"),
  position: integer("position").notNull().default(0), // For ordering
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const boardCollaborators = pgTable("board_collaborators", {
  id: uuid("id").primaryKey().defaultRandom(),
  boardId: uuid("board_id").notNull().references(() => boards.id, { onDelete: 'cascade' }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  canEdit: boolean("can_edit").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================================
// MESSAGING
// ============================================================================

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  participant1Id: uuid("participant_1_id").notNull(),
  participant1Type: varchar("participant_1_type", { length: 10 }).notNull(),
  participant2Id: uuid("participant_2_id").notNull(),
  participant2Type: varchar("participant_2_type", { length: 10 }).notNull(),
  lastMessageAt: timestamp("last_message_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id").notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  senderId: uuid("sender_id").notNull(),
  senderType: varchar("sender_type", { length: 10 }).notNull(),
  
  type: messageTypeEnum("type").notNull().default('text'),
  content: text("content"),
  media: jsonb("media").$type<{
    type: 'image' | 'voice' | 'file';
    url: string;
    filename?: string;
    size?: number;
  }>(),
  
  // Payment/Booking related
  paymentId: uuid("payment_id"),
  bookingId: uuid("booking_id"),
  
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messageReads = pgTable("message_reads", {
  id: uuid("id").primaryKey().defaultRandom(),
  messageId: uuid("message_id").notNull().references(() => messages.id, { onDelete: 'cascade' }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  readAt: timestamp("read_at").notNull().defaultNow(),
});

// ============================================================================
// PRODUCTS & INVENTORY
// ============================================================================

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }),
  
  type: varchar("type", { length: 20 }).notNull(), // 'product' or 'service'
  
  // Pricing
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }), // Original price (for sales)
  
  // Inventory (for products)
  sku: varchar("sku", { length: 100 }),
  stockQuantity: integer("stock_quantity").default(0),
  lowStockThreshold: integer("low_stock_threshold").default(5),
  trackInventory: boolean("track_inventory").notNull().default(true),
  
  // Service specific
  duration: integer("duration"), // in minutes
  capacityPerSlot: integer("capacity_per_slot").default(1),
  
  // Media
  images: jsonb("images").$type<string[]>().default([]),
  
  // Visibility
  isActive: boolean("is_active").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  
  // Metrics
  viewCount: integer("view_count").notNull().default(0),
  saveCount: integer("save_count").notNull().default(0),
  salesCount: integer("sales_count").notNull().default(0),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productVariants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: 'cascade' }),
  name: varchar("name", { length: 100 }).notNull(), // e.g., "Large Red"
  sku: varchar("sku", { length: 100 }),
  price: decimal("price", { precision: 10, scale: 2 }),
  stockQuantity: integer("stock_quantity").default(0),
  attributes: jsonb("attributes").$type<{
    size?: string;
    color?: string;
    material?: string;
  }>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================================
// TRANSACTIONS & PAYMENTS
// ============================================================================

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  userId: uuid("user_id").notNull().references(() => users.id),
  businessId: uuid("business_id").notNull().references(() => businesses.id),
  
  // Totals
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull().default('0'),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  
  status: paymentStatusEnum("status").notNull().default('pending'),
  
  // Fulfillment
  fulfillmentMethod: varchar("fulfillment_method", { length: 20 }), // 'pickup', 'delivery', 'in_person'
  notes: text("notes"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: uuid("product_id").notNull().references(() => products.id),
  variantId: uuid("variant_id").references(() => productVariants.id),
  
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id),
  userId: uuid("user_id").notNull().references(() => users.id),
  businessId: uuid("business_id").references(() => businesses.id),
  
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default('USD'),
  
  status: paymentStatusEnum("status").notNull().default('pending'),
  
  // Payment provider info
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  paymentMethod: varchar("payment_method", { length: 50 }), // 'card', 'bbt_tokens', 'bank'
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const refunds = pgTable("refunds", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id),
  paymentId: uuid("payment_id").notNull().references(() => payments.id),
  
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  reason: text("reason"),
  
  status: varchar("status", { length: 20 }).notNull().default('pending'),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  processedAt: timestamp("processed_at"),
});

// ============================================================================
// BOOKINGS & APPOINTMENTS
// ============================================================================

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingNumber: varchar("booking_number", { length: 50 }).notNull().unique(),
  
  userId: uuid("user_id").notNull().references(() => users.id),
  businessId: uuid("business_id").notNull().references(() => businesses.id),
  productId: uuid("product_id").notNull().references(() => products.id), // The service
  
  // Schedule
  scheduledDate: timestamp("scheduled_date").notNull(),
  duration: integer("duration").notNull(), // minutes
  
  // Details
  customerName: varchar("customer_name", { length: 100 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 20 }),
  notes: text("notes"),
  
  // Payment
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  depositPaid: decimal("deposit_paid", { precision: 10, scale: 2 }).default('0'),
  paymentId: uuid("payment_id").references(() => payments.id),
  
  status: bookingStatusEnum("status").notNull().default('pending'),
  
  // Reminders
  reminderSent: boolean("reminder_sent").notNull().default(false),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  cancelledAt: timestamp("cancelled_at"),
});

export const bookingSlots = pgTable("booking_slots", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id),
  productId: uuid("product_id").references(() => products.id), // Optional: specific service
  
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  capacity: integer("capacity").notNull().default(1),
  bookedCount: integer("booked_count").notNull().default(0),
  
  isAvailable: boolean("is_available").notNull().default(true),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================================
// REVIEWS & RATINGS
// ============================================================================

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  businessId: uuid("business_id").notNull().references(() => businesses.id),
  orderId: uuid("order_id").references(() => orders.id),
  bookingId: uuid("booking_id").references(() => bookings.id),
  
  rating: integer("rating").notNull(), // 1-5
  title: varchar("title", { length: 200 }),
  content: text("content").notNull(),
  photos: jsonb("photos").$type<string[]>().default([]),
  
  // Helpfulness
  helpfulCount: integer("helpful_count").notNull().default(0),
  notHelpfulCount: integer("not_helpful_count").notNull().default(0),
  
  // Response from business
  businessResponse: text("business_response"),
  businessRespondedAt: timestamp("business_responded_at"),
  
  // Moderation
  moderationStatus: moderationStatusEnum("moderation_status").notNull().default('approved'),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const reviewVotes = pgTable("review_votes", {
  id: uuid("id").primaryKey().defaultRandom(),
  reviewId: uuid("review_id").notNull().references(() => reviews.id, { onDelete: 'cascade' }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  isHelpful: boolean("is_helpful").notNull(), // true = helpful, false = not helpful
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================================
// BBT TOKEN SYSTEM
// ============================================================================

export const wallets = pgTable("wallets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  
  balance: decimal("balance", { precision: 15, scale: 2 }).notNull().default('0'),
  
  lifetimeEarned: decimal("lifetime_earned", { precision: 15, scale: 2 }).notNull().default('0'),
  lifetimeSpent: decimal("lifetime_spent", { precision: 15, scale: 2 }).notNull().default('0'),
  lifetimeCashedOut: decimal("lifetime_cashed_out", { precision: 15, scale: 2 }).notNull().default('0'),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const tokenTransactions = pgTable("token_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  walletId: uuid("wallet_id").notNull().references(() => wallets.id, { onDelete: 'cascade' }),
  
  type: tokenTransactionTypeEnum("type").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  
  description: text("description").notNull(),
  metadata: jsonb("metadata").$type<{
    action?: string; // 'post_created', 'review_written', 'booking_completed', etc.
    relatedId?: string;
    relatedType?: string;
  }>(),
  
  balanceAfter: decimal("balance_after", { precision: 15, scale: 2 }).notNull(),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const creatorFundPayouts = pgTable("creator_fund_payouts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  
  month: varchar("month", { length: 7 }).notNull(), // e.g., "2026-01"
  
  // Metrics
  totalViews: integer("total_views").notNull(),
  totalEngagements: integer("total_engagements").notNull(),
  totalSaves: integer("total_saves").notNull(),
  
  // Earnings
  baseEarnings: decimal("base_earnings", { precision: 10, scale: 2 }).notNull(),
  bonusEarnings: decimal("bonus_earnings", { precision: 10, scale: 2 }).notNull().default('0'),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).notNull(),
  
  // Payment
  paidAt: timestamp("paid_at"),
  paymentMethod: varchar("payment_method", { length: 20 }),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  type: notificationTypeEnum("type").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  
  // Links
  actionUrl: varchar("action_url", { length: 500 }),
  relatedId: uuid("related_id"),
  relatedType: varchar("related_type", { length: 20 }),
  
  // Actor (who triggered the notification)
  actorId: uuid("actor_id"),
  actorType: varchar("actor_type", { length: 10 }),
  actorName: varchar("actor_name", { length: 100 }),
  actorPhoto: text("actor_photo"),
  
  isRead: boolean("is_read").notNull().default(false),
  readAt: timestamp("read_at"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notificationPreferences = pgTable("notification_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  
  // Channels
  emailEnabled: boolean("email_enabled").notNull().default(true),
  pushEnabled: boolean("push_enabled").notNull().default(true),
  smsEnabled: boolean("sms_enabled").notNull().default(false),
  
  // Types
  likesEnabled: boolean("likes_enabled").notNull().default(true),
  commentsEnabled: boolean("comments_enabled").notNull().default(true),
  followsEnabled: boolean("follows_enabled").notNull().default(true),
  bookingsEnabled: boolean("bookings_enabled").notNull().default(true),
  paymentsEnabled: boolean("payments_enabled").notNull().default(true),
  messagesEnabled: boolean("messages_enabled").notNull().default(true),
  reviewsEnabled: boolean("reviews_enabled").notNull().default(true),
  marketingEnabled: boolean("marketing_enabled").notNull().default(false),
  
  // Quiet hours
  quietHoursStart: varchar("quiet_hours_start", { length: 5 }), // e.g., "22:00"
  quietHoursEnd: varchar("quiet_hours_end", { length: 5 }), // e.g., "08:00"
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================================
// CAMPAIGNS & ADS
// ============================================================================

export const campaigns = pgTable("campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  
  name: varchar("name", { length: 200 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'post_boost', 'sponsored', 'featured_placement'
  
  // Targeting
  targetAudience: jsonb("target_audience").$type<{
    ageRanges?: string[];
    categories?: string[];
    location?: { radius: number; latitude: number; longitude: number };
  }>(),
  
  // Budget
  budgetAmount: decimal("budget_amount", { precision: 10, scale: 2 }).notNull(),
  budgetType: varchar("budget_type", { length: 20 }).notNull(), // 'bbt_tokens', 'usd'
  spentAmount: decimal("spent_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  
  // Schedule
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  
  // Metrics
  impressions: integer("impressions").notNull().default(0),
  clicks: integer("clicks").notNull().default(0),
  conversions: integer("conversions").notNull().default(0),
  
  status: varchar("status", { length: 20 }).notNull().default('active'), // active, paused, completed
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const boostedPosts = pgTable("boosted_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: 'cascade' }),
  campaignId: uuid("campaign_id").notNull().references(() => campaigns.id, { onDelete: 'cascade' }),
  
  // Same metrics as campaign but per post
  impressions: integer("impressions").notNull().default(0),
  clicks: integer("clicks").notNull().default(0),
  engagement: integer("engagement").notNull().default(0),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================================
// ANALYTICS & TRACKING
// ============================================================================

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  sessionId: varchar("session_id", { length: 100 }),
  
  eventType: varchar("event_type", { length: 50 }).notNull(), // 'page_view', 'click', 'search', etc.
  eventName: varchar("event_name", { length: 100 }).notNull(),
  
  properties: jsonb("properties").$type<Record<string, any>>(),
  
  // Device info
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address", { length: 45 }),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const businessAnalytics = pgTable("business_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  date: timestamp("date").notNull(),
  
  // Engagement
  profileViews: integer("profile_views").notNull().default(0),
  postViews: integer("post_views").notNull().default(0),
  postLikes: integer("post_likes").notNull().default(0),
  postComments: integer("post_comments").notNull().default(0),
  postSaves: integer("post_saves").notNull().default(0),
  
  // Followers
  newFollowers: integer("new_followers").notNull().default(0),
  unfollowers: integer("unfollowers").notNull().default(0),
  
  // Business
  bookings: integer("bookings").notNull().default(0),
  orders: integer("orders").notNull().default(0),
  revenue: decimal("revenue", { precision: 10, scale: 2 }).notNull().default('0'),
  
  // Reviews
  newReviews: integer("new_reviews").notNull().default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================================
// ADMIN & MODERATION
// ============================================================================

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  
  role: adminRoleEnum("role").notNull(),
  
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const flaggedContent = pgTable("flagged_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  contentId: uuid("content_id").notNull(),
  contentType: varchar("content_type", { length: 20 }).notNull(), // 'post', 'comment', 'review', 'business'
  
  reportedBy: uuid("reported_by").notNull().references(() => users.id),
  reason: varchar("reason", { length: 50 }).notNull(),
  description: text("description"),
  
  status: varchar("status", { length: 20 }).notNull().default('pending'), // pending, reviewed, actioned, dismissed
  
  reviewedBy: uuid("reviewed_by").references(() => adminUsers.id),
  reviewedAt: timestamp("reviewed_at"),
  actionTaken: text("action_taken"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const moderationActions = pgTable("moderation_actions", {
  id: uuid("id").primaryKey().defaultRandom(),
  targetId: uuid("target_id").notNull(), // User, business, or content ID
  targetType: varchar("target_type", { length: 20 }).notNull(),
  
  action: varchar("action", { length: 50 }).notNull(), // 'warn', 'suspend', 'ban', 'remove_content'
  reason: text("reason").notNull(),
  duration: integer("duration"), // For suspensions (in days)
  
  performedBy: uuid("performed_by").notNull().references(() => adminUsers.id),
  
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const supportTickets = pgTable("support_tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  ticketNumber: varchar("ticket_number", { length: 20 }).notNull().unique(),
  
  userId: uuid("user_id").references(() => users.id),
  email: varchar("email", { length: 255 }).notNull(),
  
  subject: varchar("subject", { length: 200 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  priority: varchar("priority", { length: 20 }).notNull().default('medium'),
  
  status: varchar("status", { length: 20 }).notNull().default('open'), // open, in_progress, resolved, closed
  
  assignedTo: uuid("assigned_to").references(() => adminUsers.id),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const supportTicketMessages = pgTable("support_ticket_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  ticketId: uuid("ticket_id").notNull().references(() => supportTickets.id, { onDelete: 'cascade' }),
  
  senderId: uuid("sender_id").notNull(), // Can be user or admin
  senderType: varchar("sender_type", { length: 10 }).notNull(), // 'user' or 'admin'
  
  content: text("content").notNull(),
  attachments: jsonb("attachments").$type<string[]>(),
  
  isInternal: boolean("is_internal").notNull().default(false), // Internal admin notes
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============================================================================
// RELATIONS (for Drizzle ORM query builder)
// ============================================================================

export const usersRelations = relations(users, ({ one, many }) => ({
  business: one(businesses, {
    fields: [users.id],
    references: [businesses.userId],
  }),
  wallet: one(wallets, {
    fields: [users.id],
    references: [wallets.userId],
  }),
  posts: many(posts),
  reviews: many(reviews),
  bookings: many(bookings),
  boards: many(boards),
  notifications: many(notifications),
}));

export const businessesRelations = relations(businesses, ({ one, many }) => ({
  user: one(users, {
    fields: [businesses.userId],
    references: [users.id],
  }),
  products: many(products),
  posts: many(posts),
  reviews: many(reviews),
  bookings: many(bookings),
  campaigns: many(campaigns),
}));

// ... (add more relations as needed)

// ============================================================================
// INSERT SCHEMAS (for validation with Zod)
// ============================================================================

export const insertUserSchema = createInsertSchema(users);
export const insertBusinessSchema = createInsertSchema(businesses);
export const insertProductSchema = createInsertSchema(products);
export const insertPostSchema = createInsertSchema(posts);
export const insertBookingSchema = createInsertSchema(bookings);
export const insertReviewSchema = createInsertSchema(reviews);
export const insertOrderSchema = createInsertSchema(orders);
export const insertBoardSchema = createInsertSchema(boards);
export const insertMessageSchema = createInsertSchema(messages);
export const insertNotificationSchema = createInsertSchema(notifications);
export const insertCampaignSchema = createInsertSchema(campaigns);
