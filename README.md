# CityPulse South Africa - Deals & Events Platform

A modern React application for discovering deals and events across South Africa, powered by AI assistance.

## Features

- 🛒 **Deals Discovery**: Find the best grocery and retail deals
- 🎉 **Events Listing**: Discover local events and activities
- 🤖 **AI Assistant (PulsePal)**: Get personalized recommendations
- 🔐 **User Authentication**: Secure user accounts with Supabase
- 📱 **Responsive Design**: Works on all devices
- 🎤 **Voice Controls**: Speech-to-text and text-to-speech capabilities

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Backend**: Supabase (Database, Auth, Storage)
- **AI**: Google Gemini API
- **Deployment**: Vercel
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn or npm
- Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Mokete-tech/pulse-sa-deals-ai.git
cd pulse-sa-deals-ai
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Gemini API key to `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

5. Start the development server:
```bash
yarn dev
```

The app will be available at `http://localhost:8080`

## Deployment to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Mokete-tech/pulse-sa-deals-ai)

### Manual Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Set environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`: Your Gemini API key

### Environment Variables

Set these in your Vercel project settings:

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI features | Yes |
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

## API Routes

- `POST /api/chat` - AI chat endpoint (server-side Gemini API calls)

## Project Structure

```
src/
├── components/          # React components
│   ├── ai/             # AI assistant components
│   ├── auth/           # Authentication components
│   ├── home/           # Homepage components
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── integrations/       # Third-party integrations
├── lib/                # Utility functions
├── pages/              # Page components
└── types/              # TypeScript type definitions

api/
└── chat.ts            # Vercel API route for AI chat

public/                # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@citypulse.co.za or create an issue on GitHub.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/5df435b7-064b-4b80-a54c-9275459d56cb) and start prompting.

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

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/5df435b7-064b-4b80-a54c-9275459d56cb) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
