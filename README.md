# CityPulse South Africa

A platform for discovering local deals and events across South Africa.

## Project Overview

CityPulse South Africa is a web application that connects users with local deals and events. The platform allows merchants to advertise their promotions and events to a targeted local audience.

**URL**: https://lovable.dev/projects/6a99d823-6a8f-4ade-8f70-d3e58bf79358

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/6a99d823-6a8f-4ade-8f70-d3e58bf79358) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Features

### User Features
- Browse deals and events by location and category
- User authentication with email, phone, and social login
- Share deals and events to social media platforms
- Contact form with validation
- Responsive design for mobile and desktop

### Merchant Features
- Comprehensive merchant dashboard for managing promotions
- Analytics dashboard with engagement metrics
- Payment processing with Stripe
- Financial statement generation
- Media upload for images and videos (up to 50MB, 2-minute duration)
- Email notifications via MailerSend
- SMS notifications via Twilio

### Technical Features
- Secure authentication with Supabase
- Stripe payment integration
- Error handling and loading states
- Fallback data for offline development
- Comprehensive test suite

## Tech Stack

This project is built with:

### Frontend
- **Framework**: React, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **State Management**: React Query
- **Form Validation**: React Hook Form, Zod
- **Charts & Visualization**: Recharts

### Backend & Services
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Functions**: Supabase Edge Functions
- **Payments**: Stripe
- **Email**: MailerSend
- **SMS**: Twilio

### DevOps & Testing
- **Testing**: Vitest, Testing Library
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions
- **Environment Management**: Custom deployment scripts

## Development

### Available Scripts

#### Development
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build

#### Testing
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report

#### Deployment
- `npm run deploy` - Check environment variables and build the project
- `npm run deploy:vercel` - Deploy to Vercel
- `npm run deploy:check` - Check if all required environment variables are set

### Environment Setup

Create a `.env` file in the root directory with all required credentials:

```
# Supabase Configuration
VITE_SUPABASE_URL=https://qghojdkspxhyjeurxagx.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51IRNxfHieGkyNl5wOGvmEAtaXxZ6VHEPmHcXuwfsfOPTt0umFFEY9QpsJMXo4IAo0uzl0R66CpaJFRKCaXo0k5DZ00uGSXCeCN
STRIPE_SECRET_KEY=your-stripe-secret-key

# MailerSend Configuration
MAILERSEND_API_KEY=MS_ckXYQU@test-q3enl6kk0z042vwr.mlsender.net
MAILERSEND_FROM_EMAIL=noreply@citypulse-sa.com
MAILERSEND_FROM_NAME=CityPulse South Africa
MAILERSEND_DOMAIN=test-q3enl6kk0z042vwr.mlsender.net

# Twilio Configuration
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_VERIFY_SERVICE_SID=your-twilio-verify-service-sid
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Application Configuration
VITE_APP_NAME=CityPulse South Africa
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:5173
```

You can run the environment check script to ensure all variables are set:
```sh
npm run deploy:check
```

## How can I deploy this project?

### Automated Deployment with Vercel

The easiest way to deploy this project is with Vercel:

1. **Prepare for deployment**:
   ```sh
   npm run deploy
   ```
   This script will check if all required environment variables are set and build the project.

2. **Deploy to Vercel**:
   ```sh
   npm run deploy:vercel
   ```
   This will deploy the project to Vercel with all the necessary environment variables.

### Manual Deployment

You can also deploy the project manually:

1. **Build the project**:
   ```sh
   npm run build
   ```

2. **Set up environment variables**:
   Make sure all required environment variables are set in your hosting provider:
   - Supabase credentials
   - Stripe API keys
   - MailerSend credentials
   - Twilio credentials
   - Application configuration

3. **Deploy the `dist` directory** to any static hosting service like Vercel, Netlify, or GitHub Pages.

### Environment Variables

The following environment variables are required for deployment:

```
# Supabase Configuration
VITE_SUPABASE_URL=https://qghojdkspxhyjeurxagx.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51IRNxfHieGkyNl5wOGvmEAtaXxZ6VHEPmHcXuwfsfOPTt0umFFEY9QpsJMXo4IAo0uzl0R66CpaJFRKCaXo0k5DZ00uGSXCeCN
STRIPE_SECRET_KEY=your-stripe-secret-key

# MailerSend Configuration
MAILERSEND_API_KEY=MS_ckXYQU@test-q3enl6kk0z042vwr.mlsender.net
MAILERSEND_FROM_EMAIL=noreply@citypulse-sa.com
MAILERSEND_FROM_NAME=CityPulse South Africa
MAILERSEND_DOMAIN=test-q3enl6kk0z042vwr.mlsender.net

# Twilio Configuration
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_VERIFY_SERVICE_SID=your-twilio-verify-service-sid
TWILIO_PHONE_NUMBER=your-twilio-phone-number
```

### Vercel Deployment

To deploy to Vercel:

1. **Install the Vercel CLI**:
   ```sh
   npm install -g vercel
   ```

2. **Log in to Vercel**:
   ```sh
   vercel login
   ```

3. **Set up environment variables**:
   ```sh
   vercel env add VITE_SUPABASE_ANON_KEY --secret
   vercel env add STRIPE_SECRET_KEY --secret
   vercel env add TWILIO_AUTH_TOKEN --secret
   vercel env add TWILIO_VERIFY_SERVICE_SID --secret
   ```

4. **Deploy to Vercel**:
   ```sh
   vercel --prod
   ```

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
