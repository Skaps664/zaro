# Admin Dashboard Setup

## 1) Environment variables

Add these variables to your .env:

- ADMIN_DASHBOARD_KEY=your-secure-admin-key
- SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
- SUPABASE_ASSET_BUCKET=zaru-assets (optional, defaults to zaru-assets)

Existing public variables should already be set:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

## 2) Run Supabase SQL

Run both SQL files in Supabase SQL editor:

- supabase/orders-schema.sql
- supabase/admin-schema.sql

This creates:

- admin_products
- site_settings
- customer_orders

## 3) Open admin

Go to /admin and enter ADMIN_DASHBOARD_KEY.

## 4) What you can manage

- Add/Edit/Delete products
- Upload up to 4 product images and set video URL
- Choose hero products for home section
- Upload hero image and two homepage banner images
- Update home and products page text
- Update all products page title and description
- View all orders and update:
  - order status
  - payment status
  - tracking info

## 5) Order data flow

Checkout still forwards to Google Sheets integration and now also saves to customer_orders for admin operations.
