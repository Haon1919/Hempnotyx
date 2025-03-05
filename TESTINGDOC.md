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
| `/` (Home) | Home page loads with featured products | 1. Navigate to root URL<br>2. Verify hero section, featured products (should see "Purple Kush Hemp Flower" and "Full Spectrum CBD Oil 1000mg"), and footer display correctly | ⬜ |
| `/login` | Login form displays properly | 1. Navigate to /login<br>2. Verify form fields and login button display correctly | ⬜ |
| `/signup` | Signup form displays properly | 1. Navigate to /signup<br>2. Verify form fields and signup button display correctly | ⬜ |
| `/products` | Product listing page displays correctly | 1. Navigate to /products<br>2. Verify all products are listed (Purple Kush Hemp Flower, Full Spectrum CBD Oil, CBD Gummies)<br>3. Test filtering and sorting if implemented | ⬜ |
| `/products/hemp-flower-1` | Individual product page shows details | 1. Navigate to /products/hemp-flower-1<br>2. Verify "Purple Kush Hemp Flower" details display: $29.99, 18.5% CBD, 0.2% THC, indica strain | ⬜ |
| `/products/cbd-oil-1` | Product page shows sale price | 1. Navigate to /products/cbd-oil-1<br>2. Verify "Full Spectrum CBD Oil 1000mg" shows regular price ($69.99) and sale price ($59.99) | ⬜ |
| `/products/gummies-1` | Product page shows details | 1. Navigate to /products/gummies-1<br>2. Verify "CBD Gummies 25mg" shows price of $24.99 | ⬜ |
| `/products/hemp-flower-1/coa` | Certificate of Analysis displays | 1. Navigate to /products/hemp-flower-1/coa<br>2. Verify the COA displays correctly with URL '/coa/hemp-flower-1.pdf' | ⬜ |
| `/cart` | Cart shows added items | 1. Add "Full Spectrum CBD Oil 1000mg" to cart<br>2. Navigate to /cart<br>3. Verify cart shows 1 "Full Spectrum CBD Oil 1000mg" at $59.99 | ⬜ |

## Authentication Testing

| Test Case | Expected Behavior | Test Steps | Status |
|-----------|------------------|------------|--------|
| Login Success - Regular User | User is logged in and redirected | 1. Enter email: user@example.com with password<br>2. Submit login form<br>3. Verify redirect to homepage and "Regular User" appears in navbar | ⬜ |
| Login Success - Admin | Admin is logged in with admin rights | 1. Enter email: admin@example.com with password<br>2. Submit login form<br>3. Verify admin-specific navigation options appear | ⬜ |
| Login Success - Driver | Driver is logged in with driver view | 1. Enter email: driver@example.com with password<br>2. Submit login form<br>3. Verify driver-specific navigation options appear | ⬜ |
| Login Success - Homebase | Homebase staff is logged in | 1. Enter email: homebase@example.com with password<br>2. Submit login form<br>3. Verify homebase-specific navigation options appear | ⬜ |
| Login Failure | Error message displays | 1. Enter invalid credentials<br>2. Submit login form<br>3. Verify error message displays | ⬜ |
| Signup Success | Account created and user logged in | 1. Enter valid signup information<br>2. Submit signup form<br>3. Verify account creation and login with "customer" role | ⬜ |
| Logout | User is logged out | 1. Click logout button<br>2. Verify user is logged out and redirected appropriately | ⬜ |

## Protected Route Testing

Test each protected route both when logged in with appropriate permissions and when not authorized.

### Admin Routes

| Route | Expected Behavior | Test Steps | Status |
|-------|------------------|------------|--------|
| `/admin` | Admin dashboard displays for admin users | 1. Login as admin@example.com<br>2. Navigate to /admin<br>3. Verify dashboard displays with ID 'admin123' | ⬜ |
| `/admin` (unauthorized) | Redirects non-admin to home | 1. Login as user@example.com<br>2. Attempt to navigate to /admin<br>3. Verify redirect to homepage | ⬜ |

### Driver Routes

| Route | Expected Behavior | Test Steps | Status |
|-------|------------------|------------|--------|
| `/delivery` | Delivery dashboard displays for drivers | 1. Login as driver@example.com<br>2. Navigate to /delivery<br>3. Verify dashboard displays with active delivery "order2" and completed delivery "order1" | ⬜ |
| `/delivery/scan` | QR scanner loads for drivers | 1. Login as driver@example.com<br>2. Navigate to /delivery/scan<br>3. Verify QR scanner displays and is functional | ⬜ |
| `/delivery` (unauthorized) | Redirects non-drivers to home | 1. Login as user@example.com<br>2. Attempt to navigate to /delivery<br>3. Verify redirect to homepage | ⬜ |

### Homebase Routes

| Route | Expected Behavior | Test Steps | Status |
|-------|------------------|------------|--------|
| `/homebase` | Homebase dashboard displays for staff | 1. Login as homebase@example.com<br>2. Navigate to /homebase<br>3. Verify dashboard shows orders processed: "order1" and "order2" | ⬜ |
| `/homebase` (unauthorized) | Redirects unauthorized users to home | 1. Login as user@example.com<br>2. Attempt to navigate to /homebase<br>3. Verify redirect to homepage | ⬜ |

## Navigation Testing

| Test Case | Expected Behavior | Test Steps | Status |
|-----------|------------------|------------|--------|
| Header links | All header links navigate correctly | 1. Click each navigation link in header<br>2. Verify correct page loads | ⬜ |
| Footer links | All footer links navigate correctly | 1. Click each link in footer<br>2. Verify correct page loads | ⬜ |
| Role-based nav - Regular User | Navigation shows customer links | 1. Login as user@example.com<br>2. Verify navigation shows cart and orders, but no admin/delivery/homebase links | ⬜ |
| Role-based nav - Admin | Navigation shows admin links | 1. Login as admin@example.com<br>2. Verify navigation shows admin dashboard link | ⬜ |
| Role-based nav - Driver | Navigation shows driver links | 1. Login as driver@example.com<br>2. Verify navigation shows delivery dashboard and scan links | ⬜ |
| Role-based nav - Homebase | Navigation shows homebase links | 1. Login as homebase@example.com<br>2. Verify navigation shows homebase dashboard link | ⬜ |
| Mobile menu | Menu works on mobile viewports | 1. Resize to mobile viewport<br>2. Open mobile menu<br>3. Verify all links work | ⬜ |

## Style Consistency Testing

| Test Case | Expected Behavior | Test Steps | Status |
|-----------|------------------|------------|--------|
| Header consistency | Header appears on all pages with consistent styling | Navigate to each page and verify header appears with consistent branding | ⬜ |
| Footer consistency | Footer appears on all pages with consistent styling | Navigate to each page and verify footer appears with consistent information | ⬜ |
| Typography | Font styles are consistent | Verify heading and body text styles are consistent across all pages | ⬜ |
| Color scheme | Brand colors used consistently | Verify color usage follows brand guidelines across all pages | ⬜ |
| Responsive design | Pages adapt to different screen sizes | Test each page at mobile, tablet, and desktop viewports | ⬜ |

## Cart and Order Testing

| Test Case | Expected Behavior | Test Steps | Status |
|-----------|------------------|------------|--------|
| View cart | Cart displays correctly | 1. Login as user@example.com<br>2. Navigate to /cart<br>3. Verify cart shows product(s) with correct prices | ⬜ |
| Add to cart | Item is added to cart | 1. Navigate to /products/cbd-oil-1<br>2. Add "Full Spectrum CBD Oil 1000mg" to cart<br>3. Verify cart shows the product with sale price $59.99 | ⬜ |
| Update quantity | Cart updates quantity | 1. In cart, update "Full Spectrum CBD Oil 1000mg" quantity to 2<br>2. Verify subtotal updates to $119.98 | ⬜ |
| Remove from cart | Item is removed | 1. Remove an item from cart<br>2. Verify item is removed and total updates | ⬜ |
| View order history | Shows past orders | 1. Login as user@example.com<br>2. Navigate to order history<br>3. Verify orders "order1" and "order3" appear | ⬜ |
| Order detail | Order details display | 1. View details for "order1"<br>2. Verify it shows 2× "Purple Kush Hemp Flower" ($29.99) and 1× "Full Spectrum CBD Oil 1000mg" ($59.99)<br>3. Total should be $119.97 | ⬜ |

## Testing Notes

- Mark each test as ✅ (Pass), ❌ (Fail), or ⬜ (Not Tested)
- For failures, document the issue with screenshots and specific steps to reproduce
- Retest failed items after fixes are implemented
- Test credentials: user@example.com, admin@example.com, driver@example.com, homebase@example.com (passwords as configured in your environment)