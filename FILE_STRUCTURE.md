# BBroker - Complete File Structure

## Missing Components & Pages to Build

### 📁 client/src/pages/ (User Mode)

#### ✅ Already Exist:
- Feed.tsx
- LandingFeed.tsx  
- Wishlist.tsx
- Favorites.tsx
- Inbox.tsx
- MapDiscovery.tsx
- BusinessDetail.tsx
- ProductDetail.tsx
- Profile.tsx
- Wallet.tsx
- Login.tsx

#### 🔨 Need to Create:

**1. SettingsPage.tsx**
```
Purpose: User/business settings
Sections:
- Account settings (email, password, phone)
- Privacy settings
- Notification preferences
- Payment methods
- Language & region
- Accessibility
- Profile Switch button (to business)
- Logout
- Deactivate/Delete account
```

**2. NotificationsPage.tsx**
```
Purpose: Notification feed
Features:
- All notifications list
- Filter by type (likes, comments, follows, bookings, etc.)
- Mark as read/unread
- Clear all
- Group by date
```

**3. BookingsPage.tsx**
```
Purpose: User's bookings
Tabs:
- Upcoming
- Past
- Cancelled
Features:
- Booking cards with details
- Reschedule button
- Cancel button
- Add to calendar
- Message business
- Write review (after completion)
```

**4. OrdersPage.tsx**
```
Purpose: Purchase history
Features:
- Order list
- Order details
- Track order
- Reorder button
- Request refund
- Download receipt
```

**5. SearchResultsPage.tsx**
```
Purpose: Search results display
Features:
- Grid/list view toggle
- Filters sidebar (category, price, rating, distance)
- Sort options
- Load more
- Save search
```

**6. BoardDetailPage.tsx**
```
Purpose: Individual wishlist board
Features:
- Board header (name, cover, edit)
- Items in masonry grid
- Reorder items (drag & drop)
- Add items
- Share board
- Board settings
- Collaborators list
```

**7. OnboardingFlow.tsx**
```
Purpose: Post-registration onboarding
Steps:
- Welcome screen
- Profile setup (photo, bio)
- Interest selection (taste profile quiz)
- Location permission
- Notification permission
- Follow suggested businesses
- Tutorial walkthrough (optional)
```

**8. DiscoverPage.tsx**
```
Purpose: Content discovery (Pinterest Explore style)
Sections:
- Hero carousel (featured)
- Categories grid
- Trending now
- Curated collections
- Based on your activity
- Seasonal/holiday content
```

---

### 📁 client/src/pages/business/ (Business Mode)

#### ✅ Already Exist:
- BusinessDashboard.tsx
- BusinessFeed.tsx
- BusinessCustomers.tsx

#### 🔨 Need to Create:

**9. BusinessInventoryPage.tsx**
```
Purpose: Product/service inventory management
Features:
- Product/service list (table/grid)
- Add new product/service modal
- Edit product
- Stock tracking
- Low stock alerts
- Bulk import (CSV)
- Categories
- Variants
- Search & filters
```

**10. BusinessBookingsPage.tsx**
```
Purpose: Appointment management
Features:
- Calendar view
- List view
- Booking cards
- Confirm/decline
- Reschedule
- Customer info
- No-show tracking
- Recurring appointments
- Availability settings
```

**11. BusinessAnalyticsPage.tsx**
```
Purpose: Business insights
Sections:
- Overview dashboard
- Revenue analytics
- Customer analytics
- Content performance
- Traffic sources
- Peak hours
- Conversion funnel
- Export reports
```

**12. BusinessReviewsPage.tsx**
```
Purpose: Review management
Features:
- All reviews list
- Filter (rating, date, responded)
- Quick response templates
- Reply to review
- Flag inappropriate
- Sentiment analysis
- Review statistics
```

**13. BusinessCampaignsPage.tsx**
```
Purpose: Marketing campaigns
Features:
- Campaign list
- Create campaign wizard
- Campaign types (boost, sponsored, featured)
- Audience targeting
- Budget & schedule
- Performance metrics
- Pause/resume/delete
```

**14. BusinessSettingsPage.tsx**
```
Purpose: Business configuration
Sections:
- Business info (edit profile)
- Location & hours
- Categories
- Target audience
- Payment methods
- Subscription tier
- Team members
- Notifications
- Profile Switch button (to user)
```

**15. BusinessSetupWizard.tsx**
```
Purpose: First-time business setup (6 steps)
Steps (Modal windows):
1. Business name
2. Description
3. Location (Google Maps)
4. Working hours
5. Categories (main + 3 affiliates)
6. Target market & age
Completion: Redirect to dashboard + BBT reward
```

**16. TeamManagementPage.tsx**
```
Purpose: Manage team members
Features:
- Team list
- Invite member
- Assign roles/permissions
- Remove member
- Activity log
```

---

### 📁 client/src/components/ (Shared Components)

#### ✅ Already Exist:
- BottomNav.tsx
- BusinessBottomNav.tsx
- Header.tsx
- LoginModal.tsx
- CommentModal.tsx
- FeedDetailModal.tsx
- FollowListModal.tsx
- MasonryFeed.tsx
- WelcomeScreen.tsx
- ui/ (shadcn components)

#### 🔨 Need to Create:

**17. ProfileSwitchModal.tsx**
```
Purpose: Switch between user/business profile
UI:
- Two cards (User, Business)
- Active/Inactive indicators
- Tap to switch
- If first time business → trigger setup wizard
```

**18. BookingModal.tsx**
```
Purpose: Create booking
Steps:
- Select service
- Choose date/time (calendar)
- Add notes
- Confirm & pay
```

**19. ProductAddEditModal.tsx**
```
Purpose: Add/edit product
Fields:
- Name, description, category
- Price, compare price
- Stock quantity
- Images (multiple upload)
- Variants (size, color)
- Visibility
```

**20. CampaignWizard.tsx**
```
Purpose: Create marketing campaign
Steps:
1. Campaign type
2. Select content
3. Audience targeting
4. Budget & schedule
5. Review & launch
```

**21. SearchBar.tsx**
```
Purpose: Global search component
Features:
- Autocomplete
- Recent searches
- Trending searches
- Visual search button
- Voice search button
- Advanced filters
```

**22. NotificationBell.tsx**
```
Purpose: Notification indicator
Features:
- Badge with count
- Dropdown preview
- Mark as read
- See all button
```

**23. MapView.tsx**
```
Purpose: Interactive map component
Features:
- Google Maps integration
- Business pins
- Clustering
- Pin tap → preview card
- Filters
- Heat map toggle
- Current location
```

**24. PostCreator.tsx**
```
Purpose: Create new post
Features:
- Text editor
- Image/video upload (multiple)
- Hashtag suggestions
- Mention suggestions
- Location tagging
- Product tagging (business)
- Privacy settings
- Schedule post
```

**25. CheckoutFlow.tsx**
```
Purpose: Purchase flow
Steps:
- Cart review
- Shipping/pickup info
- Payment method
- Order confirmation
```

**26. FilterSidebar.tsx**
```
Purpose: Search/discovery filters
Filters:
- Category
- Price range
- Rating
- Distance
- Open now
- Features
- Sort by
```

**27. ReviewCard.tsx**
```
Purpose: Display review
Features:
- Author info
- Rating stars
- Review text
- Photos
- Date
- Helpful votes
- Business response
- Report button
```

**28. BusinessCard.tsx**
```
Purpose: Business preview card
Features:
- Logo, cover image
- Name, category
- Rating & reviews
- Distance
- Open/Closed status
- Save button
- Quick actions
```

**29. ProductCard.tsx**
```
Purpose: Product preview card
Features:
- Image
- Name, price
- Rating
- Business link
- Add to cart
- Save to wishlist
```

**30. Analytics Dashboard Components**
```
- RevenueChart.tsx
- CustomerChart.tsx
- EngagementChart.tsx
- MetricCard.tsx
- DateRangePicker.tsx
```

**31. CalendarView.tsx**
```
Purpose: Booking calendar
Features:
- Month/week/day view
- Time slots
- Booked/available indicators
- Drag to create booking
- Click to view details
```

**32. ChatBubble.tsx**
```
Purpose: Chat message component
Types:
- Text message
- Image message
- Voice message
- Payment message
- Booking message
- Read receipts
```

**33. OnboardingStep.tsx**
```
Purpose: Reusable onboarding step
Features:
- Progress indicator
- Title, description
- Skip button
- Next/Back buttons
- Completion animation
```

**34. PaymentMethodCard.tsx**
```
Purpose: Saved payment method display
Features:
- Card brand icon
- Last 4 digits
- Expiry date
- Default indicator
- Edit/Delete
```

**35. BBTBalanceWidget.tsx**
```
Purpose: Token balance display
Features:
- Current balance
- Recent earnings
- Quick actions (cash out, redeem)
- Mini transaction list
```

---

### 📁 client/src/hooks/

#### ✅ Already Exist:
- use-auth.ts
- use-businesses.ts
- use-feed.ts
- use-location.ts
- use-mobile.tsx
- use-products.ts
- use-toast.ts
- useTheme.tsx

#### 🔨 Need to Create:

**36. use-profile-switch.ts**
```
Purpose: Handle profile switching logic
Functions:
- switchProfile()
- getCurrentProfile()
- hasBusinessProfile()
```

**37. use-wallet.ts**
```
Purpose: BBT wallet operations
Functions:
- getBalance()
- getTransactions()
- cashOut()
- redeem()
- giftTokens()
```

**38. use-bookings.ts**
```
Purpose: Booking operations
Functions:
- createBooking()
- getBookings()
- cancelBooking()
- rescheduleBooking()
```

**39. use-reviews.ts**
```
Purpose: Review operations
Functions:
- createReview()
- getReviews()
- voteHelpful()
- respondToReview()
```

**40. use-notifications.ts**
```
Purpose: Notification management
Functions:
- getNotifications()
- markAsRead()
- getUnreadCount()
- subscribe() // WebSocket
```

**41. use-search.ts**
```
Purpose: Search functionality
Functions:
- search()
- getSuggestions()
- getTrending()
- visualSearch()
```

**42. use-messaging.ts**
```
Purpose: Chat/messaging
Functions:
- getConversations()
- sendMessage()
- markAsRead()
- subscribeToMessages() // WebSocket
```

**43. use-payments.ts**
```
Purpose: Payment operations
Functions:
- createPaymentIntent()
- confirmPayment()
- getPaymentMethods()
- requestRefund()
```

**44. use-analytics.ts**
```
Purpose: Analytics data (business)
Functions:
- getOverview()
- getRevenue()
- getCustomerData()
- exportReport()
```

**45. use-inventory.ts**
```
Purpose: Inventory management (business)
Functions:
- getProducts()
- updateStock()
- getLowStockAlerts()
- bulkImport()
```

---

### 📁 client/src/lib/

#### ✅ Already Exist:
- queryClient.ts
- utils.ts

#### 🔨 Need to Create:

**46. api.ts**
```
Purpose: API client wrapper
Features:
- Axios/fetch wrapper
- Request interceptor (auth token)
- Response interceptor (error handling)
- Retry logic
- Cancel requests
```

**47. websocket.ts**
```
Purpose: WebSocket connection manager
Features:
- Connect/disconnect
- Subscribe to events
- Emit events
- Reconnection logic
- Heartbeat
```

**48. storage.ts**
```
Purpose: Local storage wrapper
Features:
- Get/set/remove
- Encrypted storage for sensitive data
- Clear all
- Storage events
```

**49. geo.ts**
```
Purpose: Geolocation utilities
Functions:
- getCurrentPosition()
- calculateDistance()
- geocode()
- reverseGeocode()
```

**50. tokens.ts**
```
Purpose: BBT token calculations
Functions:
- calculateEarnings()
- formatTokenAmount()
- convertToUSD()
- validateTransaction()
```

**51. validation.ts**
```
Purpose: Form validation schemas
Features:
- Zod schemas for all forms
- Custom validators
- Error messages
```

**52. constants.ts**
```
Purpose: App constants
Data:
- Category list
- Age ranges
- Target markets
- Token rates
- File upload limits
- API endpoints
```

**53. analytics.ts**
```
Purpose: Analytics tracking
Features:
- Track page view
- Track event
- Track conversion
- User properties
```

---

### 📁 server/

#### ✅ Already Exist:
- index.ts
- routes.ts
- db.ts
- storage.ts
- vite.ts
- static.ts

#### 🔨 Need to Create:

**54. server/auth/**.ts
```
- passport-config.ts (strategies)
- jwt.ts (token generation)
- permissions.ts (RBAC)
- oauth.ts (Google, Apple, Facebook)
```

**55. server/middleware/**
```
- authenticate.ts
- authorize.ts
- validate.ts (request validation)
- rate-limit.ts
- error-handler.ts
- logger.ts
```

**56. server/services/**
```
- email.service.ts (SendGrid)
- sms.service.ts (Twilio)
- payment.service.ts (Stripe)
- storage.service.ts (S3)
- notification.service.ts
- analytics.service.ts
- search.service.ts (Algolia/Elasticsearch)
```

**57. server/websocket/**
```
- index.ts (Socket.io setup)
- handlers.ts (event handlers)
- rooms.ts (chat rooms)
```

**58. server/jobs/**
```
- index.ts (Bull queue setup)
- email-jobs.ts
- notification-jobs.ts
- analytics-jobs.ts
- token-payout-jobs.ts
- cleanup-jobs.ts
```

**59. server/controllers/**
```
Split routes.ts into:
- auth.controller.ts
- user.controller.ts
- business.controller.ts
- post.controller.ts
- booking.controller.ts
- payment.controller.ts
- review.controller.ts
- message.controller.ts
- wallet.controller.ts
- admin.controller.ts
... (one per major feature)
```

**60. server/utils/**
```
- crypto.ts (encryption)
- date.ts (date helpers)
- image.ts (image processing)
- video.ts (video processing)
- geocoding.ts
```

---

## Implementation Priority

### Phase 1: Foundation (Week 1-2)
✅ Complete database schema
✅ API route structure
□ Authentication system
□ File upload (S3)
□ Basic API endpoints

### Phase 2: Core Features (Week 3-4)
□ Profile switching
□ Business setup wizard
□ BBT wallet system
□ Basic payment integration
□ Booking system

### Phase 3: User Experience (Week 5-6)
□ Feed algorithm
□ Search functionality
□ Messaging system
□ Notifications
□ Reviews

### Phase 4: Business Tools (Week 7-8)
□ Inventory management
□ Analytics dashboard
□ Campaign builder
□ Review management

### Phase 5: Polish (Week 9-10)
□ Real-time features (WebSocket)
□ Push notifications
□ Performance optimization
□ Bug fixes
□ Testing

---

This completes the file structure blueprint. Each component/page has a clear purpose and feature set defined.
