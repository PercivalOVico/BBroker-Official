import { users, businesses, products, posts, comments, savedComments, type User, type Business, type Product, type Post, type Comment, type SavedComment, type FeedItem, type InsertUser } from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Businesses
  getBusinesses(): Promise<Business[]>;
  getBusiness(id: number): Promise<Business | undefined>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;

  // Feed
  getFeed(): Promise<FeedItem[]>;

  // Comments
  getComments(feedItemId: string): Promise<Comment[]>;
  addComment(feedItemId: string, username: string, text: string, parentCommentId?: number): Promise<Comment>;
  likeComment(commentId: number): Promise<void>;
  unlikeComment(commentId: number): Promise<void>;
  saveComment(commentId: number): Promise<void>;
  unsaveComment(commentId: number): Promise<void>;
  isCommentSaved(commentId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private businesses: Map<number, Business>;
  private products: Map<number, Product>;
  private posts: Map<number, Post>;
  private commentsList: Comment[];
  private savedCommentsList: Set<number>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.businesses = new Map();
    this.products = new Map();
    this.posts = new Map();
    this.commentsList = [];
    this.savedCommentsList = new Set();
    this.currentId = 1;

    this.seedMockData();
  }

  private seedMockData() {
    // Seed Businesses
    const businessData = [
      { name: "TechFlow Digital", category: "Marketing", description: "Premier digital marketing agency helping brands grow.", imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=60", lat: 40.7128, lng: -74.0060, address: "123 Tech Blvd, NY" },
      { name: "Urban Coffee Co.", category: "Food & Beverage", description: "Artisanal coffee roasters and cafe.", imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=60", lat: 40.7138, lng: -74.0070, address: "45 Bean St, NY" },
      { name: "Green Earth Landscaping", category: "Services", description: "Sustainable landscaping for modern homes.", imageUrl: "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=800&q=60", lat: 40.7118, lng: -74.0050, address: "78 Garden Rd, NY" },
      { name: "Pixel Perfect Design", category: "Design", description: "UI/UX design studio for startups.", imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=60", lat: 40.7148, lng: -74.0080, address: "90 Creative Way, NY" },
      { name: "Global Logistics", category: "Transport", description: "Efficient shipping and supply chain solutions.", imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=60", lat: 40.7108, lng: -74.0040, address: "100 Shipping Ln, NY" },
    ];

    businessData.forEach((b, i) => {
      const id = this.currentId++;
      this.businesses.set(id, { ...b, id, latitude: b.lat, longitude: b.lng, rating: 4.5, reviewCount: 10 + i * 5 });
    });

    // Seed Products
    const productData = [
      { businessId: 1, title: "SEO Audit Package", description: "Comprehensive SEO analysis for your website.", price: 29900, category: "Service", imageUrl: "https://images.unsplash.com/photo-1572044162444-ad6021194360?auto=format&fit=crop&w=800&q=60" },
      { businessId: 2, title: "Signature Espresso Blend", description: "1kg bag of our finest dark roast.", price: 3500, category: "Goods", imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=60" },
      { businessId: 4, title: "Logo Design", description: "Professional logo design with 3 revisions.", price: 15000, category: "Service", imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799314346d?auto=format&fit=crop&w=800&q=60" },
    ];

    productData.forEach((p) => {
      const id = this.currentId++;
      this.products.set(id, { ...p, id });
    });

    // Seed Posts
    const postData = [
      { businessId: 1, title: "5 Tips for Better Marketing", content: "Marketing is evolving. Here are 5 tips to stay ahead...", imageUrl: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=800&q=60", type: "update", likes: 42 },
      { businessId: 2, title: "Summer Sale!", content: "Get 50% off all cold brews this weekend.", imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b5c7355c?auto=format&fit=crop&w=800&q=60", type: "campaign", likes: 128 },
      { businessId: 3, title: "Our New Office", content: "We moved to a new location! Come say hi.", imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=60", type: "update", likes: 89 },
    ];

    postData.forEach((p) => {
      const id = this.currentId++;
      this.posts.set(id, { ...p, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getBusinesses(): Promise<Business[]> {
    return Array.from(this.businesses.values());
  }

  async getBusiness(id: number): Promise<Business | undefined> {
    return this.businesses.get(id);
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getFeed(): Promise<FeedItem[]> {
    const feed: FeedItem[] = [];
    
    this.businesses.forEach(b => feed.push({ type: 'business', data: b }));
    this.products.forEach(p => feed.push({ type: 'product', data: p }));
    this.posts.forEach(p => feed.push({ type: 'post', data: p }));

    // Shuffle feed
    return feed.sort(() => Math.random() - 0.5);
  }

  async getComments(feedItemId: string): Promise<Comment[]> {
    return this.commentsList.filter(c => c.feedItemId === feedItemId && !c.parentCommentId);
  }

  async addComment(feedItemId: string, username: string, text: string, parentCommentId?: number): Promise<Comment> {
    const id = this.currentId++;
    const comment: Comment = {
      id,
      feedItemId,
      userId: 1,
      username,
      text,
      likes: 0,
      parentCommentId,
    };
    this.commentsList.push(comment);
    return comment;
  }

  async likeComment(commentId: number): Promise<void> {
    const comment = this.commentsList.find(c => c.id === commentId);
    if (comment) comment.likes++;
  }

  async unlikeComment(commentId: number): Promise<void> {
    const comment = this.commentsList.find(c => c.id === commentId);
    if (comment && comment.likes > 0) comment.likes--;
  }

  async saveComment(commentId: number): Promise<void> {
    this.savedCommentsList.add(commentId);
  }

  async unsaveComment(commentId: number): Promise<void> {
    this.savedCommentsList.delete(commentId);
  }

  async isCommentSaved(commentId: number): Promise<boolean> {
    return this.savedCommentsList.has(commentId);
  }
}

export const storage = new MemStorage();
