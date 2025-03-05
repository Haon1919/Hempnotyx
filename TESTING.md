# Hempnotyx Route Testing Plan

This document outlines the testing plan for verifying all routes in the Hempnotyx application are working properly.

## Prerequisites

Before executing this testing plan, ensure:

1. The application is running in a development or staging environment
2. Test accounts with the following roles are available:
   - Regular user
   - Admin user
   - Driver
   - Homebase staff

## Public Routes Testing

| Route | Expected Behavior | Test Steps | Status |
|-------|------------------|------------|--------|
| `/` (Home) | Home page loads with featured products | 1. Navigate to root URL<br>2. Verify hero section, featured products, and footer display correctly | ⬜ |
| `/login` | Login form displays properly | 1. Navigate to /login<br>2. Verify form fields and login button display correctly | ⬜ |
| `/signup` | Signup form displays properly | 1. Navigate to /signup<br>2. Verify form fields and signup button display correctly | ⬜ |
| `/products` | Product listing page displays correctly | 1. Navigate to /products<br>2. Verify products are listed<br>3. Test filtering and sorting if implemented | ⬜ |
| `/products/[id]` | Individual product page shows details | 1. Click on a product from the products page<br>2. Verify product details, images, and add to cart button display correctly | ⬜ |
| `/products/[id]/coa` | Certificate of Analysis displays | 1. Navigate to a product's COA page<br>2. Verify the certificate displays correctly | ⬜ |
| `/cart` | Cart shows added items | 1. Add products to cart<br>2. Navigate to /cart<br>3. Verify items, quantities, and checkout button display correctly | ⬜ |

## Authentication Testing

| Test Case | Expected Behavior | Test Steps | Status |
|-----------|------------------|------------|--------|
| Login Success | User is logged in and redirected | 1. Enter valid credentials<br>2. Submit login form<br>3. Verify redirect to homepage or intended page | ⬜ |
| Login Failure | Error message displays | 1. Enter invalid credentials<br>2. Submit login form<br>3. Verify error message displays | ⬜ |
| Signup Success | Account created and user logged in | 1. Enter valid signup information<br>2. Submit signup form<br>3. Verify account creation and login | ⬜ |
| Logout | User is logged out | 1. Click logout button<br>2. Verify user is logged out and redirected appropriately | ⬜ |

## Protected Route Testing

Test each protected route both when logged in with appropriate permissions and when not authorized.

### Admin Routes

| Route | Expected Behavior | Test Steps | Status |
|-------|------------------|------------|--------|
| `/admin` | Admin dashboard displays for admin users | 1. Login as admin<br>2. Navigate to /admin<br>3. Verify dashboard displays | ⬜ |
| `/admin` (unauthorized) | Redirects non-admin to home | 1. Login as regular user<br>2. Attempt to navigate to /admin<br>3. Verify redirect to homepage | ⬜ |

### Driver Routes

| Route | Expected Behavior | Test Steps | Status |
|-------|------------------|------------|--------|
| `/delivery` | Delivery dashboard displays for drivers | 1. Login as driver<br>2. Navigate to /delivery<br>3. Verify dashboard displays | ⬜ |
| `/delivery/scan` | QR scanner loads for drivers | 1. Login as driver<br>2. Navigate to /delivery/scan<br>3. Verify QR scanner displays | ⬜ |
| `/delivery` (unauthorized) | Redirects non-drivers to home | 1. Login as regular user<br>2. Attempt to navigate to /delivery<br>3. Verify redirect to homepage | ⬜ |

### Homebase Routes

| Route | Expected Behavior | Test Steps | Status |
|-------|------------------|------------|--------|
| `/homebase` | Homebase dashboard displays for staff | 1. Login as homebase staff<br>2. Navigate to /homebase<br>3. Verify dashboard displays | ⬜ |
| `/homebase` (unauthorized) | Redirects unauthorized users to home | 1. Login as regular user<br>2. Attempt to navigate to /homebase<br>3. Verify redirect to homepage | ⬜ |

## Navigation Testing

| Test Case | Expected Behavior | Test Steps | Status |
|-----------|------------------|------------|--------|
| Header links | All header links navigate correctly | 1. Click each navigation link in header<br>2. Verify correct page loads | ⬜ |
| Footer links | All footer links navigate correctly | 1. Click each link in footer<br>2. Verify correct page loads | ⬜ |
| Role-based nav | Navigation shows appropriate links based on user role | 1. Login as different user types<br>2. Verify navigation displays appropriate links for each role | ⬜ |
| Mobile menu | Menu works on mobile viewports | 1. Resize to mobile viewport<br>2. Open mobile menu<br>3. Verify all links work | ⬜ |

## Style Consistency Testing

| Test Case | Expected Behavior | Test Steps | Status |
|-----------|------------------|------------|--------|
| Header consistency | Header appears on all pages with consistent styling | Navigate to each page and verify header appears with consistent branding | ⬜ |
| Footer consistency | Footer appears on all pages with consistent styling | Navigate to each page and verify footer appears with consistent information | ⬜ |
| Typography | Font styles are consistent | Verify heading and body text styles are consistent across all pages | ⬜ |
| Color scheme | Brand colors used consistently | Verify color usage follows brand guidelines across all pages | ⬜ |
| Responsive design | Pages adapt to different screen sizes | Test each page at mobile, tablet, and desktop viewports | ⬜ |

## Testing Notes

- Mark each test as ✅ (Pass), ❌ (Fail), or ⬜ (Not Tested)
- For failures, document the issue with screenshots and specific steps to reproduce
- Retest failed items after fixes are implemented