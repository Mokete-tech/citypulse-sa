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

- Browse deals and events by location and category
- Merchant dashboard for managing promotions
- User authentication with Supabase (Email, Phone, Google, Facebook)
- Phone authentication with SMS verification
- Password reset functionality with branded emails
- Social login with Google and Facebook
- Social sharing for deals and events (Facebook, X, LinkedIn, WhatsApp)
- Sharing analytics dashboard for merchants
- User reactions system for deals and events
- Contact form with validation
- Responsive design for mobile and desktop
- Error handling and loading states
- Fallback data for offline development

## Tech Stack

This project is built with:

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **State Management**: React Query
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Form Validation**: React Hook Form, Zod
- **Testing**: Vitest, Testing Library

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run setup:reactions` - Set up the reactions system in Supabase
- `npm run setup:reactions:ts` - Set up the reactions system using TypeScript
- `npm run setup:twilio` - Configure Twilio for SMS authentication
- `npm run setup:shares` - Add sharing analytics columns to database
- `npm run test:reactions` - Test the reactions system functionality
- `npm run test:twilio` - Test Twilio SMS integration

### Environment Setup

Create a `.env` file in the root directory with your Supabase credentials:
```
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Required for setup scripts

# Twilio Configuration (for SMS authentication)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
TWILIO_MESSAGE_SERVICE_SID=your-twilio-messaging-service-sid

# Email Configuration (required for password reset and notifications)
# Option 1: SendGrid (if using SendGrid)
VITE_SENDGRID_API_KEY=your-sendgrid-api-key
VITE_SENDGRID_FROM_EMAIL=noreply@yourdomain.com
VITE_SENDGRID_FROM_NAME=Your App Name

# Option 2: SMTP Configuration (if using MailerSend or other SMTP provider)
SMTP_HOST=smtp.mailersend.net
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_ADMIN_EMAIL=admin@yourdomain.com
SMTP_SENDER_NAME=Your App Name

# Other Configuration
VITE_APP_NAME=CityPulse South Africa
VITE_APP_ENV=development
```

#### Development Fallbacks

The application includes development fallbacks for Supabase credentials when running in development mode. This allows you to run the application locally without setting up environment variables, but it's not suitable for production use.

When using development fallbacks:
- A warning will be displayed in the UI
- Console warnings will be logged
- The application will use mock data for certain features

For production deployment, always ensure all required environment variables are properly set.

### OAuth Setup

The application supports social login with Google and Facebook. To set up these OAuth providers:

1. Create OAuth applications in the Google Cloud Console and Facebook Developer Console
2. Configure the OAuth providers in your Supabase project
3. Update your environment variables with the OAuth credentials

For detailed instructions, see the [OAuth Setup Guide](docs/oauth-setup.md).

You can also use the provided script to automate the setup:

```bash
# Set up environment variables in .env file
SUPABASE_URL=https://your-project-url.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# Run the setup script
node scripts/setup-oauth-providers.js
```

### Reactions System Setup

The application includes a reactions system that allows users to interact with deals and events. To set up the reactions system:

1. Ensure you have the `SUPABASE_SERVICE_ROLE_KEY` in your `.env` file
2. Run the setup script:

```bash
# JavaScript version
npm run setup:reactions

# TypeScript version
npm run setup:reactions:ts
```

For detailed information about the reactions system, see the [Reactions System Documentation](docs/reactions-system.md).

### Phone Authentication Setup

The application supports phone authentication using Twilio for SMS verification. To set up phone authentication:

1. Create a Twilio account and get your Account SID and Auth Token
2. Get a Twilio phone number or create a Messaging Service
3. Add the Twilio credentials to your `.env` file
4. Run the setup script:

```bash
npm run setup:twilio
```

For detailed instructions, see the [Twilio Setup Guide](docs/twilio-setup-guide.md).

You can test the Twilio integration with:

```bash
npm run test:twilio +1234567890  # Replace with a real phone number
```

### Social Sharing Setup

The application includes social sharing features that allow users to share deals and events on various platforms. To set up the social sharing analytics:

1. Ensure you have the `SUPABASE_SERVICE_ROLE_KEY` in your `.env` file
2. Run the setup script:

```bash
npm run setup:shares
```

This will add the necessary database columns to track sharing metrics.

For information on how merchants can leverage social sharing, see the [Social Sharing Guide](docs/social-sharing-guide.md).

### SMTP Configuration for Email Delivery

The application requires SMTP configuration for sending password reset emails and other transactional emails. To set up SMTP:

1. Choose an email provider (Mailgun, SMTP2GO, Amazon SES, Brevo, etc.)
2. Get your SMTP credentials from your provider
3. Add the SMTP credentials to your `.env` file
4. Run the setup script:

```bash
npm run setup:smtp
```

For detailed instructions and provider recommendations, see the [SMTP Setup Guide](docs/smtp-setup-guide.md).

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/6a99d823-6a8f-4ade-8f70-d3e58bf79358) and click on Share -> Publish.

Alternatively, you can build the project with `npm run build` and deploy the `dist` directory to any static hosting service.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
