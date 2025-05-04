# Merchant Functionality

This document outlines the merchant functionality in the CityPulse platform.

## Overview

The merchant functionality allows businesses to create and manage deals and events on the CityPulse platform. Merchants can:

1. Create a merchant profile
2. Create and manage deals
3. Create and manage events
4. View analytics on their deals and events
5. Process payments for premium listings
6. Generate statements and reports

## Database Schema

The merchant functionality uses the following tables:

- `merchant_profiles`: Stores information about merchant businesses
- `merchant_deals`: Stores deals created by merchants
- `merchant_events`: Stores events created by merchants
- `merchant_payments`: Stores payment information for premium listings
- `merchant_analytics`: Stores analytics data for merchant deals and events

See the `migrations/merchant_tables.sql` file for the complete schema.

## Components

### Merchant Dashboard

The main interface for merchants to manage their account, deals, and events. It includes:

- Overview of active deals and events
- Analytics dashboard
- Deal and event management
- Payment processing
- Statement generation

### Deal Form

A comprehensive form for creating and editing deals. Features include:

- Step-by-step wizard interface
- Media upload (images and videos)
- Premium advertising options
- Pricing tiers
- Scheduling options
- Target audience selection

### Media Uploader

A component for uploading and managing media files for deals and events. Features include:

- Image and video upload
- Preview functionality
- File size validation
- Format validation

### Payment Integration

A component for processing payments for premium listings. Features include:

- Stripe integration
- Multiple payment methods
- Invoice generation
- Subscription management

## User Flow

1. **Merchant Registration**
   - User signs up for a merchant account
   - User completes business profile
   - Admin verifies merchant account (optional)

2. **Deal/Event Creation**
   - Merchant creates a new deal or event
   - Merchant uploads media
   - Merchant selects premium options (optional)
   - Merchant completes payment (if premium)
   - Deal/event is published

3. **Deal/Event Management**
   - Merchant views analytics
   - Merchant edits or deletes deals/events
   - Merchant extends or renews deals/events

4. **Payment and Billing**
   - Merchant views payment history
   - Merchant generates statements
   - Merchant manages subscription

## Implementation Status

- [x] Merchant Dashboard UI
- [x] Deal Form
- [ ] Event Form
- [ ] Media Uploader (partial)
- [ ] Payment Integration (partial)
- [ ] Analytics Dashboard
- [ ] Statement Generator
- [ ] Database Schema
- [ ] API Endpoints
- [ ] Authentication and Authorization

## Future Enhancements

- Mobile app for merchants
- Advanced analytics and reporting
- Integration with POS systems
- Bulk deal/event creation
- Automated marketing campaigns
- Customer relationship management
- Loyalty program integration
