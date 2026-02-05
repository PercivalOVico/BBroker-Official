import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./db-storage"; // Use database storage instead of memory
import { api } from "@shared/routes";
import { z } from "zod";
import { ProfileController } from "./controllers/profile.controller";
import { optionalAuthMiddleware } from "./middleware/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ============================================================================
  // PROFILE SWITCHING ROUTES (Protected with optional auth for dev)
  // ============================================================================
  
  // Get profile status (user or business mode)
  // Uses optionalAuthMiddleware for dev (allows ?userId param)
  // In production, change to authMiddleware (requires authentication)
  app.get('/api/users/profile-status', optionalAuthMiddleware, ProfileController.getProfileStatus);
  
  // Switch between user and business profile
  app.post('/api/users/switch-profile', optionalAuthMiddleware, ProfileController.switchProfile);
  
  // Create business profile (setup wizard)
  app.post('/api/businesses/setup', optionalAuthMiddleware, ProfileController.createBusinessProfile);

  // ============================================================================
  // EXISTING ROUTES
  // ============================================================================

  // Feed
  app.get(api.feed.list.path, async (req, res) => {
    // In a real app, we'd filter by lat/lng here
    const feed = await storage.getFeed();
    res.json(feed);
  });

  // Businesses
  app.get(api.businesses.list.path, async (req, res) => {
    const businesses = await storage.getBusinesses();
    res.json(businesses);
  });

  app.get(api.businesses.get.path, async (req, res) => {
    const id = req.params.id; // UUID string, not integer
    const business = await storage.getBusiness(id);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }
    res.json(business);
  });

  // Products
  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const id = req.params.id; // UUID string, not integer
    const product = await storage.getProduct(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  // Mock Auth
  app.post(api.auth.login.path, async (req, res) => {
    const { username } = req.body;
    let user = await storage.getUserByUsername(username);
    
    if (!user) {
      user = await storage.createUser({
        username,
        email: `${username}@bbroker.app`, // Auto-generate email
        password: 'temp_password', // Will be hashed in production
        fullName: username, // Use fullName, not displayName
        profilePhoto: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        bio: "Digital Enthusiast",
      });
    }
    
    res.json(user);
  });

  return httpServer;
}
