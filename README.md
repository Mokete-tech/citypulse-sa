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
- User authentication with Supabase
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

### Environment Setup

Create a `.env` file in the root directory with your Supabase credentials:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/6a99d823-6a8f-4ade-8f70-d3e58bf79358) and click on Share -> Publish.

Alternatively, you can build the project with `npm run build` and deploy the `dist` directory to any static hosting service.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
