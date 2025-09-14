# TechCraft Solutions - Dashboard Application

*Next.js application with modern UI components and deployment-ready configuration*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)

## Overview

A comprehensive dashboard application built with Next.js 15, featuring:
- Modern UI with Tailwind CSS and Radix UI components
- Framer Motion animations
- Three.js 3D graphics integration
- Authentication system
- Responsive design
- TypeScript support

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **3D Graphics**: Three.js, React Three Fiber
- **State Management**: Zustand
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (protected)/       # Protected routes
│   ├── (public)/          # Public routes
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── common/           # Common components
│   ├── forms/            # Form components
│   ├── layouts/          # Layout components
│   └── ui/               # UI components
├── hooks/                # Custom hooks
├── lib/                  # Utilities and configurations
└── types/                # TypeScript type definitions
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd techsol
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL="http://localhost:5000/api"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Database
DATABASE_URL="your-database-connection-string"

# OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Deployment

### Vercel Deployment

1. **Connect to Vercel**
   - Import your repository to Vercel
   - Vercel will automatically detect Next.js settings

2. **Configure Environment Variables**
   - Add all required environment variables in Vercel dashboard
   - Set `NODE_ENV=production`

3. **Deploy**
   - Push changes to main branch
   - Vercel will automatically deploy

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run preview` - Build and preview locally

## Features

- **Dashboard**: Comprehensive project management interface
- **Authentication**: Secure login/signup system
- **Projects**: Project tracking and management
- **Chat**: Real-time messaging system
- **Documents**: File upload and management
- **Clients**: Client relationship management
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Theme switching capability

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary.

## Support

For support and questions, please contact the development team.
