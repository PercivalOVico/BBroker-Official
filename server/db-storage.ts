import { db } from './db';
import { 
  users, 
  businesses, 
  products, 
  posts, 
  comments, 
  savedComments, 
  type User, 
  type Business, 
  type Product, 
  type Post, 
  type Comment, 
  type SavedComment, 
  type FeedItem, 
  type InsertUser 
} from '@shared/schema';
import { eq, and } from 'drizzle-orm';

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Businesses
  getBusinesses(): Promise<Business[]>;
  getBusiness(id: string): Promise<Business | undefined>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;

  // Feed
  getFeed(): Promise<FeedItem[]>;

  // Comments
  getComments(feedItemId: string): Promise<Comment[]>;
  addComment(feedItemId: string, userId: string, username: string, text: string, parentCommentId?: string): Promise<Comment>;
  likeComment(commentId: string): Promise<void>;
  unlikeComment(commentId: string): Promise<void>;
  saveComment(commentId: string, userId: string): Promise<void>;
  unsaveComment(commentId: string, userId: string): Promise<void>;
  isCommentSaved(commentId: string, userId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // ============================================================================
  // USERS
  // ============================================================================

  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);
      
      return user;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db
        .insert(users)
        .values({
          username: insertUser.username,
          email: insertUser.email || `${insertUser.username}@bbroker.app`,
          password: insertUser.password || 'temp_password', // Will be hashed in production
          fullName: insertUser.fullName || insertUser.username,
          phone: insertUser.phone || null,
          bio: insertUser.bio || 'Digital Enthusiast',
          profilePhoto: insertUser.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${insertUser.username}`,
          coverPhoto: insertUser.coverPhoto || null,
          currentProfile: 'user',
          hasBusinessProfile: false,
          status: 'active',
          emailVerified: false,
          phoneVerified: false,
          interests: [],
          location: null,
          preferences: {},
        })
        .returning();
      
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  // ============================================================================
  // BUSINESSES
  // ============================================================================

  async getBusinesses(): Promise<Business[]> {
    try {
      const businessList = await db
        .select()
        .from(businesses)
        .limit(50);
      
      return businessList;
    } catch (error) {
      console.error('Error getting businesses:', error);
      return [];
    }
  }

  async getBusiness(id: string): Promise<Business | undefined> {
    try {
      const [business] = await db
        .select()
        .from(businesses)
        .where(eq(businesses.id, id))
        .limit(1);
      
      return business;
    } catch (error) {
      console.error('Error getting business:', error);
      return undefined;
    }
  }

  // ============================================================================
  // PRODUCTS
  // ============================================================================

  async getProducts(): Promise<Product[]> {
    try {
      const productList = await db
        .select()
        .from(products)
        .limit(50);
      
      return productList;
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  }

  async getProduct(id: string): Promise<Product | undefined> {
    try {
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, id))
        .limit(1);
      
      return product;
    } catch (error) {
      console.error('Error getting product:', error);
      return undefined;
    }
  }

  // ============================================================================
  // FEED
  // ============================================================================

  async getFeed(): Promise<FeedItem[]> {
    try {
      const feed: FeedItem[] = [];

      // Get businesses
      const businessList = await this.getBusinesses();
      businessList.forEach(b => feed.push({ type: 'business', data: b }));

      // Get products
      const productList = await this.getProducts();
      productList.forEach(p => feed.push({ type: 'product', data: p }));

      // Get posts
      const postList = await db
        .select()
        .from(posts)
        .limit(50);
      
      postList.forEach(p => feed.push({ type: 'post', data: p }));

      // Shuffle feed
      return feed.sort(() => Math.random() - 0.5);
    } catch (error) {
      console.error('Error getting feed:', error);
      return [];
    }
  }

  // ============================================================================
  // COMMENTS
  // ============================================================================

  async getComments(feedItemId: string): Promise<Comment[]> {
    try {
      const commentList = await db
        .select()
        .from(comments)
        .where(eq(comments.postId, feedItemId))
        .limit(100);
      
      return commentList;
    } catch (error) {
      console.error('Error getting comments:', error);
      return [];
    }
  }

  async addComment(
    feedItemId: string,
    userId: string,
    username: string,
    text: string,
    parentCommentId?: string
  ): Promise<Comment> {
    try {
      const [comment] = await db
        .insert(comments)
        .values({
          postId: feedItemId,
          userId: userId,
          content: text,
          parentId: parentCommentId || null,
          likeCount: 0,
        })
        .returning();
      
      return comment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw new Error('Failed to add comment');
    }
  }

  async likeComment(commentId: string): Promise<void> {
    try {
      // In production, this would check if user already liked and use commentLikes table
      await db
        .update(comments)
        .set({ likeCount: db.$increment(comments.likeCount, 1) })
        .where(eq(comments.id, commentId));
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  }

  async unlikeComment(commentId: string): Promise<void> {
    try {
      await db
        .update(comments)
        .set({ likeCount: db.$decrement(comments.likeCount, 1) })
        .where(eq(comments.id, commentId));
    } catch (error) {
      console.error('Error unliking comment:', error);
    }
  }

  async saveComment(commentId: string, userId: string): Promise<void> {
    try {
      await db
        .insert(savedComments)
        .values({
          userId: userId,
          commentId: commentId,
        })
        .onConflictDoNothing();
    } catch (error) {
      console.error('Error saving comment:', error);
    }
  }

  async unsaveComment(commentId: string, userId: string): Promise<void> {
    try {
      await db
        .delete(savedComments)
        .where(
          and(
            eq(savedComments.userId, userId),
            eq(savedComments.commentId, commentId)
          )
        );
    } catch (error) {
      console.error('Error unsaving comment:', error);
    }
  }

  async isCommentSaved(commentId: string, userId: string): Promise<boolean> {
    try {
      const [saved] = await db
        .select()
        .from(savedComments)
        .where(
          and(
            eq(savedComments.userId, userId),
            eq(savedComments.commentId, commentId)
          )
        )
        .limit(1);
      
      return !!saved;
    } catch (error) {
      console.error('Error checking if comment is saved:', error);
      return false;
    }
  }
}

// Export singleton instance
export const storage = new DatabaseStorage();
