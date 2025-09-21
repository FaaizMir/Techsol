# TechCraft Solutions - Client Dashboard

*A modern, comprehensive client dashboard for project management and communication*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 📋 Overview

TechCraft Solutions Client Dashboard is a modern web application designed for clients to manage their projects, track progress, communicate with the agency team, and monitor spending. Built with Next.js 15 and featuring a sleek, responsive design inspired by platforms like Upwork and Fiverr.

### 🎯 Key Features

- **📊 Client Dashboard**: Comprehensive overview of projects, spending, and progress
- **📁 Project Management**: Track project status, timelines, and milestones
- **💬 Team Communication**: Real-time messaging with agency staff
- **📄 Document Management**: Upload, share, and manage project documents
- **⏰ Project Timelines**: Visual timeline tracking for project milestones
- **💰 Spending Analytics**: Monitor total project spending and budgets
- **🔐 Secure Authentication**: JWT-based authentication system
- **📱 Responsive Design**: Optimized for desktop and mobile devices
- **🎨 Modern UI**: Beautiful animations and dark theme

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (shadcn/ui)
- **Animations**: Framer Motion
- **State Management**: Zustand with persistence
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios

### Backend Integration
- **API**: RESTful API with JWT authentication
- **Real-time**: Socket.io for live messaging
- **File Upload**: Multer for document management

### Development & Deployment
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Deployment**: Vercel
- **Version Control**: Git

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes (login/signup)
│   ├── (protected)/              # Protected client dashboard routes
│   │   └── dashboard/           # Main dashboard page
│   └── (public)/                # Public routes (about, contact, etc.)
├── components/                   # Reusable UI components
│   ├── common/                  # Common components (ProtectedRoute, etc.)
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── DashboardOverview.tsx    # Main dashboard overview
│   │   ├── ProjectsSection.tsx      # Projects management
│   │   ├── ChatSection.tsx          # Messaging interface
│   │   ├── DocumentsSection.tsx     # Document management
│   │   ├── ProjectTimeline.tsx      # Timeline visualization
│   │   └── AnalyticsCharts.tsx      # Charts and analytics
│   ├── forms/                   # Form components
│   ├── layouts/                 # Layout components
│   ├── onboarding/              # Project onboarding flow
│   ├── providers/               # Context providers
│   └── ui/                      # Base UI components (buttons, inputs, etc.)
├── hooks/                       # Custom React hooks
│   ├── use-auth.ts              # Authentication hooks
│   ├── use-dashboard.ts         # Dashboard data hooks
│   ├── use-onboarding.ts        # Project onboarding hooks
│   ├── use-chat.ts              # Chat/messaging hooks
│   ├── use-clients.ts           # Client management hooks
│   ├── use-documents.ts         # Document management hooks
│   └── use-profile.ts           # Profile management hooks
├── lib/                         # Utilities and configurations
│   ├── api.ts                   # API client and endpoints
│   ├── constants.ts             # Application constants
│   ├── socket.ts                # WebSocket client
│   ├── stores/                  # Zustand stores
│   │   ├── auth-store.ts        # Authentication state
│   │   └── onboarding-store.ts  # Onboarding state
│   └── utils.ts                 # Utility functions
└── types/                       # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git

### Installation

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

   Create a `.env.local` file in the root directory:

   ```bash
   # API Configuration
   NEXT_PUBLIC_API_BASE_URL="http://localhost:5000/api"

   # Authentication
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-here"

   # Optional: OAuth providers
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### For Clients

1. **Sign Up/Login**: Create an account or log in to access your dashboard
2. **Dashboard Overview**: View your project statistics, recent activity, and spending
3. **Manage Projects**: Track project progress, view timelines, and communicate with the team
4. **Upload Documents**: Share files and documents related to your projects
5. **Real-time Chat**: Message the agency team for updates and support

### Dashboard Sections

- **Dashboard**: Overview of all projects, spending, and recent activity
- **My Projects**: Detailed view of all your projects with status and progress
- **Project Timeline**: Visual timeline of project milestones and deadlines
- **Messages**: Communication with the TechCraft Solutions team
- **Documents**: File management and sharing
- **Profile**: Account settings and preferences

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run preview          # Build and preview locally

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking
npm run format           # Format code with Prettier

# Database (if applicable)
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with sample data
```

## 🌐 API Integration

The application integrates with a RESTful API backend. Key endpoints include:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/protected/check-auth` - Verify authentication

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/recent-projects` - Recent projects
- `GET /api/dashboard/recent-messages` - Recent messages

### Projects
- `GET /api/onboarding/all-projects` - List all projects
- `POST /api/onboarding/projects` - Create new project
- `PUT /api/onboarding/projects/{id}` - Update project
- `DELETE /api/onboarding/projects/{id}` - Delete project

### Chat
- `GET /api/chat/conversations` - Get conversations
- `POST /api/chat/conversations/{id}/messages` - Send message

### Documents
- `POST /api/documents/projects/{id}/documents` - Upload document
- `GET /api/documents/projects/{id}/documents` - List documents

For complete API documentation, see [API_GUIDE.md](API_GUIDE.md) and [ONBOARDING_API_DOCS.md](ONBOARDING_API_DOCS.md).

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Import your GitHub repository to Vercel
   - Vercel will automatically detect Next.js configuration

2. **Environment Variables**
   - Add all required environment variables in Vercel dashboard
   - Configure build settings if needed

3. **Deploy**
   - Push changes to main branch for automatic deployment
   - Access your deployed application

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Client-side and server-side route protection
- **Input Validation**: Comprehensive form validation
- **HTTPS**: Secure communication in production
- **CORS**: Configured for secure API communication

## 🎨 UI/UX Features

- **Dark Theme**: Modern dark theme optimized for long work sessions
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Loading States**: Skeleton loaders and progress indicators
- **Error Handling**: User-friendly error messages and retry mechanisms
- **Accessibility**: WCAG compliant components and keyboard navigation

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm run lint
   npm run type-check
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add your feature description"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Maintain consistent code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is proprietary software owned by TechCraft Solutions.

## 📞 Support

For support, questions, or bug reports:

- **Email**: support@techcraftsolutions.com
- **Documentation**: [API Guide](API_GUIDE.md), [Onboarding Docs](ONBOARDING_API_DOCS.md)
- **Issues**: Create an issue in the repository

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment
- **shadcn/ui** for beautiful UI components
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations

---

**Built with ❤️ by TechCraft Solutions Team**
