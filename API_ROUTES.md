# BBroker API Routes - Complete Specification

## Authentication & Users

### POST /api/auth/register
- Register new user account
- Returns: User object + session token
- BBT Reward: Initial signup bonus

### POST /api/auth/login
- User login
- Returns: Session token

### POST /api/auth/logout
- Logout user

### POST /api/auth/verify-email
- Verify email with code
- BBT Reward: +10 BBT

### POST /api/auth/verify-phone
- Verify phone number
- BBT Reward: +10 BBT

### POST /api/auth/forgot-password
- Request password reset

### POST /api/auth/reset-password
- Reset password with token

### GET /api/users/me
- Get current user profile

### PATCH /api/users/me
- Update user profile
- BBT Reward: Complete profile +50 BBT

### GET /api/users/:id
- Get user by ID (public profile)

### POST /api/users/upload-photo
- Upload profile/cover photo

## Profile Switching

### POST /api/users/switch-profile
- Switch between user/business profile
- Body: { profileType: 'user' | 'business' }

### GET /api/users/profile-status
- Check if user has business profile

## Business Setup & Management

### POST /api/businesses/setup
- Initial business profile setup (6-step wizard)
- Body: All business setup data
- BBT Reward: +420 BBT for completion

### GET /api/businesses/:id
- Get business profile (public)

### PATCH /api/businesses/:id
- Update business profile

### GET /api/businesses/nearby
- Find businesses near location
- Query: lat, lng, radius, category, openNow

### GET /api/businesses/search
- Search businesses
- Query: q, category, location, rating

### POST /api/businesses/:id/follow
- Follow a business
- BBT Reward: +3 BBT

### DELETE /api/businesses/:id/follow
- Unfollow business

### GET /api/businesses/:id/followers
- Get business followers

### GET /api/businesses/:id/analytics
- Get business analytics (owner only)

## Posts & Content

### GET /api/feed
- Get personalized feed
- Query: page, limit, type

### GET /api/feed/public
- Get public landing feed (non-authenticated)

### GET /api/feed/trending
- Get trending content

### POST /api/posts
- Create new post
- BBT Reward: +5 BBT (photo), +10 BBT (video)

### GET /api/posts/:id
- Get post by ID

### PATCH /api/posts/:id
- Update post (owner only)

### DELETE /api/posts/:id
- Delete post (owner only)

### POST /api/posts/:id/like
- Like a post
- BBT Reward: +0.5 BBT

### DELETE /api/posts/:id/like
- Unlike post

### POST /api/posts/:id/save
- Save post to wishlist
- BBT Reward: +1 BBT

### DELETE /api/posts/:id/save
- Unsave post

### POST /api/posts/:id/share
- Share post

### GET /api/posts/:id/comments
- Get post comments

### POST /api/posts/:id/comments
- Comment on post
- BBT Reward: +2 BBT

### POST /api/posts/:id/boost
- Boost post (paid promotion)

## Wishlist & Boards

### GET /api/boards
- Get user's boards

### POST /api/boards
- Create new board

### GET /api/boards/:id
- Get board with items

### PATCH /api/boards/:id
- Update board

### DELETE /api/boards/:id
- Delete board

### POST /api/boards/:id/items
- Add item to board

### DELETE /api/boards/:id/items/:itemId
- Remove item from board

### POST /api/boards/:id/collaborators
- Add collaborator to board

### DELETE /api/boards/:id/collaborators/:userId
- Remove collaborator

## Products & Inventory

### GET /api/products
- List products (filtered)
- Query: businessId, category, inStock

### POST /api/products
- Create product (business only)

### GET /api/products/:id
- Get product details

### PATCH /api/products/:id
- Update product

### DELETE /api/products/:id
- Delete product

### GET /api/products/:id/inventory
- Get inventory status

### PATCH /api/products/:id/inventory
- Update stock quantity

### POST /api/products/:id/variants
- Add product variant

### GET /api/businesses/:id/inventory
- Get business inventory dashboard

### GET /api/businesses/:id/inventory/low-stock
- Get low stock alerts

### POST /api/businesses/:id/inventory/bulk-import
- Bulk import products (CSV)

## Orders & Transactions

### POST /api/orders
- Create new order
- BBT Reward: +10 BBT + 1% of transaction

### GET /api/orders
- Get user's orders
- Query: status, businessId

### GET /api/orders/:id
- Get order details

### PATCH /api/orders/:id/status
- Update order status (business only)

### POST /api/orders/:id/refund
- Request refund

### GET /api/businesses/:id/orders
- Get business orders

## Payments

### POST /api/payments/create-intent
- Create Stripe payment intent

### POST /api/payments/confirm
- Confirm payment

### POST /api/payments/refund
- Process refund

### GET /api/payments/:id
- Get payment details

### GET /api/payments/methods
- Get saved payment methods

### POST /api/payments/methods
- Add payment method

### DELETE /api/payments/methods/:id
- Remove payment method

## Bookings & Appointments

### POST /api/bookings
- Create booking
- BBT Reward: +10 BBT

### GET /api/bookings
- Get user's bookings

### GET /api/bookings/:id
- Get booking details

### PATCH /api/bookings/:id
- Update/reschedule booking

### DELETE /api/bookings/:id
- Cancel booking

### GET /api/businesses/:id/bookings
- Get business bookings

### GET /api/businesses/:id/availability
- Get available time slots
- Query: date, productId

### POST /api/bookings/:id/check-in
- Check in to appointment
- BBT Reward: +15 BBT (no no-show)

## Reviews & Ratings

### POST /api/reviews
- Write review
- BBT Reward: +15 BBT (+5 with photo)

### GET /api/reviews
- Get reviews
- Query: businessId, userId

### GET /api/reviews/:id
- Get review details

### PATCH /api/reviews/:id
- Update review (author only)

### DELETE /api/reviews/:id
- Delete review

### POST /api/reviews/:id/respond
- Business responds to review

### POST /api/reviews/:id/vote
- Vote review helpful/not
- Body: { isHelpful: boolean }

## Messaging

### GET /api/conversations
- Get user's conversations

### POST /api/conversations
- Start new conversation

### GET /api/conversations/:id
- Get conversation with messages

### POST /api/conversations/:id/messages
- Send message

### PATCH /api/messages/:id/read
- Mark message as read

### POST /api/messages/:id/payment
- Send payment in chat

## Notifications

### GET /api/notifications
- Get notifications
- Query: unreadOnly, type

### PATCH /api/notifications/:id/read
- Mark as read

### PATCH /api/notifications/read-all
- Mark all as read

### GET /api/notifications/preferences
- Get notification preferences

### PATCH /api/notifications/preferences
- Update preferences

## BBT Token System

### GET /api/wallet
- Get wallet balance & stats

### GET /api/wallet/transactions
- Get transaction history
- Query: type, page, limit

### POST /api/wallet/cash-out
- Cash out BBT to USD
- Minimum: 100 BBT

### POST /api/wallet/redeem
- Redeem BBT for credits

### POST /api/wallet/gift
- Gift BBT to another user

### GET /api/wallet/earnings-breakdown
- Get monthly earnings breakdown

### GET /api/creator-fund/eligibility
- Check creator fund eligibility

### GET /api/creator-fund/earnings
- Get creator fund earnings

## Search

### GET /api/search
- Global search
- Query: q, type (business, product, user, post), filters

### GET /api/search/suggestions
- Get autocomplete suggestions

### GET /api/search/trending
- Get trending searches

### POST /api/search/visual
- Visual search (upload image)
- Body: FormData with image

## Map & Location

### GET /api/map/businesses
- Get businesses for map view
- Query: bounds (ne, sw), category, openNow

### GET /api/map/heatmap
- Get trending businesses heatmap

### POST /api/map/check-in
- Check in at location
- BBT Reward: +10 BBT

## Campaigns & Advertising

### POST /api/campaigns
- Create ad campaign (business only)

### GET /api/campaigns
- Get business campaigns

### GET /api/campaigns/:id
- Get campaign details & analytics

### PATCH /api/campaigns/:id
- Update campaign

### DELETE /api/campaigns/:id
- Delete campaign

### POST /api/campaigns/:id/pause
- Pause campaign

### POST /api/campaigns/:id/resume
- Resume campaign

## Analytics

### GET /api/analytics/business/:id/overview
- Business overview dashboard

### GET /api/analytics/business/:id/revenue
- Revenue analytics

### GET /api/analytics/business/:id/customers
- Customer analytics

### GET /api/analytics/business/:id/content
- Content performance

### GET /api/analytics/business/:id/export
- Export analytics report (PDF/CSV)

### GET /api/analytics/user/activity
- User activity analytics

## Settings

### GET /api/settings
- Get user settings

### PATCH /api/settings
- Update settings

### PATCH /api/settings/privacy
- Update privacy settings

### PATCH /api/settings/notifications
- Update notification preferences

### POST /api/settings/deactivate
- Deactivate account

### DELETE /api/settings/delete-account
- Permanent account deletion

## Admin Endpoints (Separate Auth)

### POST /api/admin/auth/login
- Admin login

### GET /api/admin/dashboard
- Admin overview stats

### GET /api/admin/users
- List/search users

### GET /api/admin/businesses
- List/search businesses

### PATCH /api/admin/users/:id/status
- Update user status (suspend, ban)

### PATCH /api/admin/businesses/:id/verify
- Verify business

### GET /api/admin/flagged-content
- Get flagged content queue

### POST /api/admin/flagged-content/:id/action
- Take moderation action

### GET /api/admin/support-tickets
- Get support tickets

### PATCH /api/admin/support-tickets/:id
- Update ticket

### POST /api/admin/support-tickets/:id/messages
- Reply to ticket

### GET /api/admin/analytics
- Platform-wide analytics

### POST /api/admin/announcements
- Send platform announcement

## WebSocket Events (Real-time)

### Connection
- ws://api.bbroker.com/ws
- Auth: Send token on connect

### Events to Emit:
- `message:send` - Send chat message
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing
- `notification:read` - Mark notification read

### Events to Listen:
- `message:received` - New message
- `notification:new` - New notification
- `booking:updated` - Booking status changed
- `payment:completed` - Payment processed
- `typing:indicator` - Someone typing
- `user:online` - User came online
- `user:offline` - User went offline

## File Upload

### POST /api/upload/image
- Upload image
- Returns: { url, thumbnail }

### POST /api/upload/video
- Upload video
- Returns: { url, thumbnail, duration }

### POST /api/upload/file
- Upload generic file
- Returns: { url, filename, size }

## Webhooks (External Services)

### POST /webhooks/stripe
- Stripe payment webhooks

### POST /webhooks/sendgrid
- Email delivery status

### POST /webhooks/twilio
- SMS delivery status

## Health & Status

### GET /health
- API health check

### GET /status
- Detailed system status

---

## Rate Limiting

- Authenticated: 1000 req/hour
- Unauthenticated: 100 req/hour
- Admin: 5000 req/hour
- Uploads: 50 req/hour

## Response Format

### Success
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [...]
  }
}
```

## Authentication
- Header: `Authorization: Bearer <token>`
- Session-based for web
- JWT for mobile apps
