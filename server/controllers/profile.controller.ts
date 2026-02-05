import type { Request, Response } from 'express';
import { db } from '../db';
import { users, businesses, wallets, tokenTransactions } from '../../shared/schema';
import { eq } from 'drizzle-orm';

// ============================================================================
// PROFILE CONTROLLER - Handles profile switching and business setup
// ============================================================================

export class ProfileController {
  
  // ============================================================================
  // GET PROFILE STATUS
  // ============================================================================
  
  /**
   * Get current profile status (user or business mode)
   * GET /api/users/profile-status
   */
  static async getProfileStatus(req: Request, res: Response) {
    try {
      // Get userId from authenticated user (middleware) or query param (dev fallback)
      const userId = req.user?.id || (req.query.userId as string);
      
      if (!userId) {
        return res.status(401).json({ 
          error: 'Unauthorized',
          message: 'User not authenticated' 
        });
      }
      
      // Get user from database
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      
      if (!user) {
        return res.status(404).json({ 
          error: 'Not Found',
          message: 'User not found' 
        });
      }
      
      // If user has business profile, fetch it
      let businessProfile = null;
      if (user.hasBusinessProfile) {
        const [business] = await db
          .select()
          .from(businesses)
          .where(eq(businesses.userId, userId))
          .limit(1);
        businessProfile = business || null;
      }
      
      // Return profile status
      return res.json({
        currentProfile: user.currentProfile,
        hasBusinessProfile: user.hasBusinessProfile,
        businessProfile: businessProfile,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          profilePhoto: user.profilePhoto,
        }
      });
      
    } catch (error) {
      console.error('Get profile status error:', error);
      return res.status(500).json({ 
        error: 'Internal Server Error',
        message: 'Failed to get profile status' 
      });
    }
  }
  
  // ============================================================================
  // SWITCH PROFILE
  // ============================================================================
  
  /**
   * Switch between user and business profile
   * POST /api/users/switch-profile
   * Body: { profileType: 'user' | 'business' }
   */
  static async switchProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id || (req.query.userId as string);
      const { profileType } = req.body;
      
      if (!userId) {
        return res.status(401).json({ 
          error: 'Unauthorized',
          message: 'User not authenticated' 
        });
      }
      
      // Validate profileType
      if (!profileType || !['user', 'business'].includes(profileType)) {
        return res.status(400).json({ 
          error: 'Bad Request',
          message: 'Invalid profile type. Must be "user" or "business"' 
        });
      }
      
      // Get user from database
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      
      if (!user) {
        return res.status(404).json({ 
          error: 'Not Found',
          message: 'User not found' 
        });
      }
      
      // Check if switching to business but no business profile exists
      if (profileType === 'business' && !user.hasBusinessProfile) {
        return res.status(400).json({ 
          error: 'No Business Profile',
          message: 'No business profile found. Please complete business setup first.',
          needsSetup: true 
        });
      }
      
      // Update current profile
      await db
        .update(users)
        .set({ 
          currentProfile: profileType as 'user' | 'business',
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));
      
      // If switching to business, update business lastActiveAt
      if (profileType === 'business') {
        await db
          .update(businesses)
          .set({ lastActiveAt: new Date() })
          .where(eq(businesses.userId, userId));
      }
      
      return res.json({ 
        success: true, 
        currentProfile: profileType,
        message: `Switched to ${profileType} profile`
      });
      
    } catch (error) {
      console.error('Switch profile error:', error);
      return res.status(500).json({ 
        error: 'Internal Server Error',
        message: 'Failed to switch profile' 
      });
    }
  }
  
  // ============================================================================
  // CREATE BUSINESS PROFILE (Business Setup Wizard)
  // ============================================================================
  
  /**
   * Create business profile (6-step wizard completion)
   * POST /api/businesses/setup
   * Body: { businessName, description, location, workingHours, mainCategory, 
   *         affiliateCategory1-3, targetMarket, targetAgeRanges }
   */
  static async createBusinessProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id || (req.query.userId as string);
      
      if (!userId) {
        return res.status(401).json({ 
          error: 'Unauthorized',
          message: 'User not authenticated' 
        });
      }
      
      const {
        businessName,
        description,
        location,
        workingHours,
        mainCategory,
        affiliateCategory1,
        affiliateCategory2,
        affiliateCategory3,
        targetMarket,
        targetAgeRanges
      } = req.body;
      
      // Validate required fields
      if (!businessName || !description || !location || !workingHours || 
          !mainCategory || !targetMarket || !targetAgeRanges) {
        return res.status(400).json({ 
          error: 'Bad Request',
          message: 'Missing required fields',
          required: [
            'businessName', 'description', 'location', 'workingHours',
            'mainCategory', 'targetMarket', 'targetAgeRanges'
          ]
        });
      }
      
      // Validate location structure
      if (!location.latitude || !location.longitude || !location.address) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid location data. Must include latitude, longitude, and address'
        });
      }
      
      // Check if business profile already exists
      const [existing] = await db
        .select()
        .from(businesses)
        .where(eq(businesses.userId, userId))
        .limit(1);
      
      if (existing) {
        return res.status(400).json({ 
          error: 'Conflict',
          message: 'Business profile already exists for this user' 
        });
      }
      
      // Create business profile
      const [newBusiness] = await db
        .insert(businesses)
        .values({
          userId,
          businessName,
          description,
          location,
          workingHours,
          mainCategory,
          affiliateCategory1: affiliateCategory1 || null,
          affiliateCategory2: affiliateCategory2 || null,
          affiliateCategory3: affiliateCategory3 || null,
          targetMarket,
          targetAgeRanges,
          status: 'pending_verification',
          rating: '0',
          reviewCount: 0,
          followerCount: 0,
          viewCount: 0,
          isVerified: false,
        })
        .returning();
      
      // Update user to mark has business profile
      await db
        .update(users)
        .set({ 
          hasBusinessProfile: true,
          currentProfile: 'business',
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));
      
      // Award BBT tokens for setup completion (420 BBT)
      const tokensAwarded = 420;
      await this.awardTokens(
        userId, 
        tokensAwarded, 
        'Business profile setup completed'
      );
      
      return res.status(201).json({ 
        success: true, 
        business: newBusiness,
        bbtAwarded: tokensAwarded,
        message: 'Business profile created successfully'
      });
      
    } catch (error) {
      console.error('Create business profile error:', error);
      return res.status(500).json({ 
        error: 'Internal Server Error',
        message: 'Failed to create business profile' 
      });
    }
  }
  
  // ============================================================================
  // HELPER METHODS
  // ============================================================================
  
  /**
   * Award BBT tokens to a user
   * This will be expanded in the wallet system session
   */
  private static async awardTokens(
    userId: string, 
    amount: number, 
    description: string
  ): Promise<void> {
    try {
      // Get or create wallet
      let [wallet] = await db
        .select()
        .from(wallets)
        .where(eq(wallets.userId, userId))
        .limit(1);
      
      // If no wallet exists, create one
      if (!wallet) {
        [wallet] = await db
          .insert(wallets)
          .values({
            userId,
            balance: '0',
            lifetimeEarned: '0',
            lifetimeSpent: '0',
            lifetimeCashedOut: '0',
          })
          .returning();
      }
      
      // Calculate new balance
      const currentBalance = parseFloat(wallet.balance);
      const newBalance = currentBalance + amount;
      const currentLifetimeEarned = parseFloat(wallet.lifetimeEarned);
      const newLifetimeEarned = currentLifetimeEarned + amount;
      
      // Update wallet balance
      await db
        .update(wallets)
        .set({
          balance: newBalance.toString(),
          lifetimeEarned: newLifetimeEarned.toString(),
          updatedAt: new Date()
        })
        .where(eq(wallets.userId, userId));
      
      // Create transaction record
      await db
        .insert(tokenTransactions)
        .values({
          walletId: wallet.id,
          type: 'earn',
          amount: amount.toString(),
          description,
          metadata: {
            action: 'business_setup',
            relatedType: 'business_profile'
          },
          balanceAfter: newBalance.toString(),
        });
      
      console.log(`✅ Awarded ${amount} BBT to user ${userId}: ${description}`);
      
    } catch (error) {
      console.error('Award tokens error:', error);
      // Don't throw - we don't want to fail the main operation if token award fails
      // In production, you might want to queue this for retry
    }
  }
}
