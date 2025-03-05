# Hempnotyx

A mobile-first web application for legal cannabis dispensaries with inventory management, user accounts, and delivery tracking.

## Features

- Mobile-first responsive design
- Inventory management via admin panel
- COA (Certificate of Analysis) display via barcode scanning
- User accounts with favorites and order history
- Shopping cart and checkout system
- Delivery tracking (similar to DoorDash)
- Real-time order notification system
- In-store "Home Base" dashboard
- Driver portal for delivery management and ID verification

## Mock Data for Testing

This application includes comprehensive mock data to support all testing scenarios outlined in TESTING.md. All Firebase services are mocked to allow for local testing without requiring a real Firebase instance.

### Available Mock User Accounts

Test with the following user accounts (all use password: `password123`):

| Email | Role | Description |
|-------|------|-------------|
| user@example.com | customer | Regular customer with order history |
| admin@example.com | admin | Admin user with full access to admin dashboard |
| driver@example.com | driver | Delivery driver with access to delivery functions |
| homebase@example.com | homebase | Homebase staff with access to inventory management |

### Testing Features

1. **Authentication**: 
   - Sign in with any of the test accounts above
   - Create a new user account with the signup form
   - Test password reset flow (mocked)

2. **Shopping Experience**:
   - Browse products on the home page and product listing page
   - View detailed product information
   - View Certificate of Analysis (COA) for products
   - Add products to cart
   - Complete the checkout process

3. **Admin Functions**:
   - Login as admin@example.com to access the admin dashboard
   - Manage products, inventory, and orders
   - View sales reports and analytics

4. **Driver Functions**:
   - Login as driver@example.com to access the delivery dashboard
   - View assigned deliveries and delivery statuses
   - Access the QR code scanner for deliveries
   - Mark deliveries as complete

5. **Homebase Functions**:
   - Login as homebase@example.com to access the homebase dashboard
   - Process orders and prepare them for delivery
   - Manage inventory levels and locations

Refer to [TESTING.md](TESTING.md) for a comprehensive testing plan covering all routes and application features.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Tech Stack

- Next.js
- React
- TypeScript
- Firebase (Authentication, Firestore, Storage) with mock data for development
- Tailwind CSS
- PWA features for mobile