import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// Users (Mock for now)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  userRole: text("user_role").default("user"), // 'user', 'administrator', 'shadow'
  profileType: text("profile_type").default("user"), // 'user' or 'business'
});

// Businesses
export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  address: text("address").notNull(),
  rating: doublePrecision("rating").default(0),
  reviewCount: integer("review_count").default(0),
  ownerId: integer("owner_id"), // Reference to user who owns this business
});

// Products/Services (Marketplace)
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
});

// Posts (Marketing Campaigns / Brand Awareness)
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  likes: integer("likes").default(0),
  type: text("type").notNull(),
});

// Comments (for Feed Items)
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  feedItemId: text("feed_item_id").notNull(),
  userId: integer("user_id").default(1),
  username: text("username").notNull(),
  text: text("text").notNull(),
  likes: integer("likes").default(0),
  parentCommentId: integer("parent_comment_id"),
});

// Saved Comments
export const savedComments = pgTable("saved_comments", {
  id: serial("id").primaryKey(),
  commentId: integer("comment_id").notNull(),
  userId: integer("user_id").default(1),
});

// === SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertBusinessSchema = createInsertSchema(businesses).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertPostSchema = createInsertSchema(posts).omit({ id: true });
export const insertCommentSchema = createInsertSchema(comments).omit({ id: true });

// === EXPLICIT TYPES ===

export type User = typeof users.$inferSelect;
export type Business = typeof businesses.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type SavedComment = typeof savedComments.$inferSelect;

export type UserRole = 'user' | 'administrator' | 'shadow';
export type ProfileType = 'user' | 'business';

// Combined Feed Item for Masonry Layout
export type FeedItem = 
  | { type: 'business'; data: Business }
  | { type: 'product'; data: Product }
  | { type: 'post'; data: Post };

// API Types
export type LoginRequest = { username: string };
export type LocationQuery = { lat: number; lng: number; radius?: number };

export type SearchParams = { 
  query?: string; 
  category?: string; 
  lat?: number; 
  lng?: number 
};
