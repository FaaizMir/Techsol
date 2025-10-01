# TechCraft Solutions - Dashboard Documentation

*Comprehensive guide to the client dashboard components, hooks, and API integrations*

## 📊 Dashboard Overview

The TechCraft Solutions client dashboard is a comprehensive interface designed for clients to manage their projects, track progress, communicate with the agency team, and monitor spending. Built with a modular component architecture using React hooks and TanStack Query for data management.

## 🏗️ Dashboard Architecture

### Core Structure
```
Dashboard Page (page.tsx)
├── Sidebar Navigation
├── Main Content Area
│   ├── Dashboard Overview
│   ├── Projects Section
│   ├── Project Timeline
│   ├── Messages (Chat)
│   ├── Documents
│   └── Profile
└── Loading States & Error Handling
```

### State Management
- **Local State**: React useState for UI interactions
- **Server State**: TanStack Query for API data fetching and caching
- **Global State**: Zustand stores for authentication and onboarding
- **Real-time**: Socket.io for live messaging updates

## 📱 Dashboard Components

### 1. DashboardOverview Component

**File**: `src/components/dashboard/DashboardOverview.tsx`

**Purpose**: Main dashboard landing page showing key metrics, recent activity, and quick actions.

**Props**:
```typescript
interface DashboardOverviewProps {
  projects: any[]
  chatConversations: any[]
  stats: {
    totalProjects: number
    activeProjects: number
    completedProjects: number
    totalSpent: string
  }
  recentProjects: any[]
  recentMessages: any[]
  onShowOnboarding: () => void
}
```

**Features**:
- Welcome message and branding
- Statistics cards (Total Projects, Active, Completed, Total Spent)
- Recent projects list with progress bars
- Recent messages from team
- Quick action buttons (New Project, View Projects)

**Hooks Used**:
- None (receives data via props from parent)

**APIs Consumed**:
- Dashboard stats (via parent component)
- Recent projects (via parent component)
- Recent messages (via parent component)

---

### 2. ProjectsSection Component

**File**: `src/components/dashboard/ProjectsSection.tsx`

**Purpose**: Comprehensive project management interface for clients to view and manage their projects.

**Props**:
```typescript
interface ProjectsSectionProps {
  projects: any[]
  searchQuery: string
  setSearchQuery: (query: string) => void
}
```

**Features**:
- Project search and filtering
- Project cards with status, progress, and actions
- Empty state for no projects
- Project creation prompts

**Hooks Used**:
- None (receives data via props)

**APIs Consumed**:
- All projects data (via parent component)
- Project search/filtering (client-side)

---

### 3. ChatSection Component

**File**: `src/components/dashboard/ChatSection.tsx`

**Purpose**: Real-time messaging interface for client-agency communication.

**Props**:
```typescript
interface ChatSectionProps {
  chatConversations: any[]
  selectedChat: number | null
  setSelectedChat: (id: number | null) => void
  newMessage: string
  setNewMessage: (message: string) => void
  onSendMessage: () => void
}
```

**Features**:
- Conversation list sidebar
- Message thread view
- Real-time message sending
- Message search
- Unread message indicators

**Hooks Used**:
- None (receives data via props)

**APIs Consumed**:
- Conversations list (via parent component)
- Individual conversation messages (via parent component)
- Send message functionality (via parent component)

---

### 4. DocumentsSection Component

**File**: `src/components/dashboard/DocumentsSection.tsx`

**Purpose**: Document management interface for file uploads, downloads, and organization.

**Props**:
```typescript
interface DocumentsSectionProps {
  documents?: any[]
}
```

**Features**:
- Document upload interface
- File type filtering
- Download functionality
- Document status tracking

**Hooks Used**:
- None (currently receives empty array)

**APIs Consumed**:
- Document listing (not yet implemented)
- File upload (not yet implemented)
- File download (not yet implemented)

---

### 5. ProjectTimeline Component

**File**: `src/components/dashboard/ProjectTimeline.tsx`

**Purpose**: Visual timeline representation of project milestones and progress.

**Props**: None (currently)

**Features**:
- Timeline visualization
- Milestone tracking
- Progress indicators
- Date-based organization

**Hooks Used**:
- None (currently static component)

**APIs Consumed**:
- Timeline data (not yet implemented)

---

### 6. ProfileSection Component

**File**: `src/components/dashboard/ProfileSection.tsx`

**Purpose**: User profile management and account settings.

**Props**: None

**Features**:
- Profile information display
- Account settings
- Preferences management

**Hooks Used**:
- None (currently static component)

**APIs Consumed**:
- Profile data (not yet implemented)
- Profile updates (not yet implemented)

---

## 🎣 Custom Hooks

### Authentication Hooks

#### `useAuth` Hook
**File**: `src/hooks/use-auth.ts` (via AuthProvider)

**Purpose**: Manages user authentication state and actions.

**Functions**:
- `login(email, password)` - User authentication
- `signup(email, password)` - User registration
- `logout()` - User logout
- `checkAuth()` - Verify authentication status

**APIs Used**:
- `POST /auth/login`
- `POST /auth/signup`
- `GET /protected/check-auth`

---

### Dashboard Data Hooks

#### `useDashboardStats` Hook
**File**: `src/hooks/use-dashboard.ts`

**Purpose**: Fetches dashboard statistics and metrics.

**Returns**:
```typescript
{
  data: {
    totalProjects: number
    activeProjects: number
    completedProjects: number
    totalSpent: string
  },
  isLoading: boolean,
  error: any
}
```

**APIs Used**:
- `GET /dashboard/stats`

---

#### `useRecentProjects` Hook
**File**: `src/hooks/use-dashboard.ts`

**Purpose**: Fetches recently updated projects.

**Parameters**:
- `limit?: number` - Number of projects to fetch

**Returns**:
```typescript
{
  data: RecentProject[],
  isLoading: boolean,
  error: any
}
```

**APIs Used**:
- `GET /dashboard/recent-projects?limit={limit}`

---

#### `useRecentMessages` Hook
**File**: `src/hooks/use-dashboard.ts`

**Purpose**: Fetches recent messages from team communications.

**Parameters**:
- `limit?: number` - Number of messages to fetch

**Returns**:
```typescript
{
  data: RecentMessage[],
  isLoading: boolean,
  error: any
}
```

**APIs Used**:
- `GET /dashboard/recent-messages?limit={limit}`

---

### Onboarding & Project Hooks

#### `useAllProjects` Hook
**File**: `src/hooks/use-onboarding.ts`

**Purpose**: Fetches all projects with filtering options.

**Parameters**:
```typescript
{
  status?: string;
  client?: string;
  search?: string;
  page?: number;
  limit?: number;
}
```

**Returns**:
```typescript
{
  data: Project[],
  isLoading: boolean,
  error: any
}
```

**APIs Used**:
- `GET /onboarding/all-projects?{queryParams}`

---

#### `useConversations` Hook
**File**: `src/hooks/use-chat.ts`

**Purpose**: Fetches all chat conversations.

**Returns**:
```typescript
{
  data: Conversation[],
  isLoading: boolean,
  error: any
}
```

**APIs Used**:
- `GET /chat/conversations`

---

### Onboarding Flow Hooks

#### `useOnboarding` Hook
**File**: `src/hooks/use-onboarding.ts`

**Purpose**: Manages the complete project onboarding flow.

**State**:
```typescript
{
  showModal: boolean
  currentStep: number
  data: OnboardingData
  isLoading: boolean
  projectId: number | null
  error: string | null
}
```

**Actions**:
- `startOnboarding()` - Initialize onboarding
- `saveProjectDetails()` - Save project information
- `saveRequirements()` - Save project requirements
- `saveMilestones()` - Save project milestones
- `saveClientInfo()` - Save client information
- `reviewData()` - Review onboarding data
- `completeOnboardingProcess()` - Complete onboarding

**APIs Used**:
- `POST /onboarding/start`
- `POST /onboarding/project`
- `POST /onboarding/requirements/{projectId}`
- `POST /onboarding/milestones/{projectId}`
- `POST /onboarding/client/{projectId}`
- `POST /onboarding/review`
- `POST /onboarding/complete`

---

## 🔄 Data Flow Architecture

### Dashboard Page Data Flow

```
Dashboard Page (page.tsx)
├── useDashboardStats() → API: /dashboard/stats
├── useRecentProjects(5) → API: /dashboard/recent-projects?limit=5
├── useRecentMessages(5) → API: /dashboard/recent-messages?limit=5
├── useAllProjects({limit:10}) → API: /onboarding/all-projects?limit=10
├── useConversations() → API: /chat/conversations
└── useClients({limit:10}) → API: /clients?limit=10 (commented out)

Data Transformation:
├── projects = allProjectsData?.data || []
├── chatConversations = conversationsData?.data || []
├── recentProjects = recentProjectsData?.data || []
├── recentMessages = recentMessagesData?.data || []
└── stats = dashboardStats?.data || {default values}

Pass to Components:
├── DashboardOverview receives: projects, chatConversations, stats, recentProjects, recentMessages
├── ProjectsSection receives: projects, searchQuery, setSearchQuery
├── ChatSection receives: chatConversations, selectedChat, setSelectedChat, newMessage, setNewMessage, onSendMessage
└── Other components receive minimal props (mostly static)
```

### State Management Flow

```
User Authentication (AuthProvider)
├── Login → useAuthStore.setAuth()
├── Check Auth → API call → update store
└── Logout → clearAuth()

Onboarding State (useOnboardingStore)
├── Start → setStep(0)
├── Progress → update step and data
├── Complete → setStep(6) + mark complete
└── Reset → clear all data

API Data (TanStack Query)
├── Cache management
├── Background refetching
├── Optimistic updates
└── Error handling
```

## 📡 API Endpoints Used

### Authentication APIs
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `GET /protected/check-auth` - Authentication verification

### Dashboard APIs
- `GET /dashboard/stats` - Dashboard statistics
- `GET /dashboard/recent-projects?limit={n}` - Recent projects
- `GET /dashboard/recent-messages?limit={n}` - Recent messages

### Project Management APIs
- `GET /onboarding/all-projects?limit={n}` - All projects list
- `POST /onboarding/projects` - Create project
- `PUT /onboarding/projects/{id}` - Update project
- `DELETE /onboarding/projects/{id}` - Delete project

### Chat APIs
- `GET /chat/conversations` - List conversations
- `GET /chat/conversations/{id}/messages` - Conversation messages
- `POST /chat/conversations/{id}/messages` - Send message
- `PUT /chat/conversations/{id}/read` - Mark as read

### Document APIs (Planned)
- `GET /documents/projects/{id}/documents` - List project documents
- `POST /documents/projects/{id}/documents` - Upload document
- `GET /documents/{id}/download` - Download document
- `PUT /documents/{id}/status` - Update document status
- `DELETE /documents/{id}` - Delete document

### Profile APIs (Planned)
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile
- `POST /profile/picture` - Update profile picture
- `PUT /profile/password` - Change password

## 🔧 Component Integration Matrix

| Component | Hooks Used | APIs Called | Data Source |
|-----------|------------|-------------|-------------|
| DashboardOverview | None | Via props | Parent component |
| ProjectsSection | None | Via props | Parent component |
| ChatSection | None | Via props | Parent component |
| DocumentsSection | None | Static | Not implemented |
| ProjectTimeline | None | Static | Not implemented |
| ProfileSection | None | Static | Not implemented |
| Dashboard Page | 5 hooks | 5 endpoints | Direct API calls |

## 🚀 Future Enhancements

### Planned Component Updates
1. **DocumentsSection**: Integrate with document APIs for full CRUD
2. **ProjectTimeline**: Add timeline API integration
3. **ProfileSection**: Implement profile management
4. **NotificationCenter**: Add notification system
5. **AnalyticsCharts**: Enhanced client analytics

### API Integration Roadmap
1. **Timeline APIs**: Project milestone tracking
2. **Notification APIs**: Real-time notifications
3. **Search APIs**: Global search functionality
4. **Analytics APIs**: Client-specific analytics
5. **File Management**: Advanced document features

### Performance Optimizations
1. **Query Optimization**: Implement proper caching strategies
2. **Lazy Loading**: Component-based code splitting
3. **Real-time Updates**: WebSocket integration for live data
4. **Pagination**: Implement proper pagination for large datasets

## 🐛 Error Handling

### API Error States
- **Loading States**: Skeleton components and loading indicators
- **Error States**: User-friendly error messages with retry options
- **Empty States**: Meaningful empty state components
- **Network Errors**: Offline handling and reconnection logic

### Data Validation
- **TypeScript**: Strict typing for all data structures
- **Runtime Validation**: Zod schemas for API responses
- **Fallback Data**: Default values for missing or invalid data

## 📝 Development Notes

### Component Patterns
- **Props Interface**: All components have typed prop interfaces
- **Error Boundaries**: Components wrapped with error boundaries
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Responsive Design**: Mobile-first approach with breakpoints

### Hook Patterns
- **Query Keys**: Consistent naming for TanStack Query cache keys
- **Mutation Handling**: Optimistic updates with rollback on error
- **Loading States**: Consistent loading state management
- **Error Handling**: Centralized error handling with user feedback

### API Patterns
- **RESTful Design**: Consistent REST API patterns
- **Authentication**: JWT tokens with automatic refresh
- **Response Format**: Standardized success/error response format
- **Rate Limiting**: Client-side rate limiting for API calls

---

*This documentation reflects the current state of the TechCraft Solutions client dashboard as of September 2025. For the latest updates, refer to the codebase and API documentation.*