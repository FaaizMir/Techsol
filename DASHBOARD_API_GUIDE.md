# TechCraft Solutions Dashboard - API and Component Guide

## Overview

This document provides a comprehensive guide to the TechCraft Solutions dashboard architecture, components, and API requirements. The dashboard is designed for a software agency platform where clients can access their project management interface, communicate with the agency, and track progress.

## Dashboard Architecture

The dashboard is built using Next.js 14 with TypeScript, featuring a modern dark theme UI with animations powered by Framer Motion. The main dashboard page (`src/app/(protected)/dashboard/page.tsx`) serves as the central hub with multiple sections.

### Main Components Structure

```
src/app/(protected)/dashboard/page.tsx (Main Dashboard)
├── DashboardOverview (Overview with stats and recent activity)
├── ProjectsSection (Project management and tracking)
├── ChatSection (Client communication)
├── DocumentsSection (Document management)
├── ClientsSection (Client relationship management)
└── ProfileSection (User profile and settings)
```

## Component Details

### 1. Dashboard Overview (`DashboardOverview.tsx`)

**Purpose**: Provides a high-level overview of the agency's performance and recent activity.

**Features**:
- Key metrics cards (Active Projects, Completed, Total Clients, Revenue)
- Recent projects list with status badges
- Recent client messages

**Data Requirements**:
```typescript
interface DashboardStats {
  activeProjects: number;
  completedProjects: number;
  totalClients: number;
  revenue: string;
  revenueChange: string;
}

interface RecentProject {
  id: number;
  name: string;
  client: string;
  status: string;
  progress: number;
}

interface RecentMessage {
  id: number;
  client: string;
  lastMessage: string;
  time: string;
  unread: number;
}
```

### 2. Projects Section (`ProjectsSection.tsx`)

**Purpose**: Manages and tracks all client projects.

**Features**:
- Project listing with search functionality
- Status tracking (In Progress, Review, Completed)
- Progress bars and due dates
- CRUD operations (View, Edit, Delete)

**Data Requirements**:
```typescript
interface Project {
  id: number;
  name: string;
  status: string;
  progress: number;
  dueDate: string;
  client: string;
  priority: string;
  budget: string;
  description: string;
  tasks: { name: string; completed: boolean }[];
  requirements: any;
  milestones: any[];
  clientInfo: any;
}
```

### 3. Chat Section (`ChatSection.tsx`)

**Purpose**: Real-time communication between agency and clients.

**Features**:
- Conversation list with search
- Real-time messaging interface
- Unread message indicators
- Message timestamps

**Data Requirements**:
```typescript
interface ChatConversation {
  id: number;
  client: string;
  company: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

interface Message {
  id: number;
  sender: "client" | "me";
  message: string;
  time: string;
}
```

### 4. Documents Section (`DocumentsSection.tsx`)

**Purpose**: Centralized document management for projects.

**Features**:
- Document upload and download
- File type categorization
- Status tracking (Draft, Under Review, Approved)
- Search functionality

**Data Requirements**:
```typescript
interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  client: string;
  uploadDate: string;
  status: "Draft" | "Under Review" | "Approved" | "Signed";
}
```

### 5. Clients Section (`ClientsSection.tsx`)

**Purpose**: Client relationship management.

**Features**:
- Client contact information
- Project history tracking
- Status management (Active, Inactive)
- Communication details

**Data Requirements**:
```typescript
interface Client {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  projects: number;
  totalValue: string;
  lastContact: string;
  status: "Active" | "Inactive";
}
```

### 6. Profile Section (`ProfileSection.tsx`)

**Purpose**: User account management and settings.

**Features**:
- Profile picture management
- Personal information editing
- Account security settings
- Notification preferences

## API Requirements

### Existing APIs (from `lib/api.ts`)

The following APIs are already implemented in the onboarding system:

- `onboardingAPI.getProjects()` - Get all projects
- `onboardingAPI.getProjectById(id)` - Get specific project
- `onboardingAPI.saveProject(data)` - Create/update project
- `onboardingAPI.getClient(projectId)` - Get client info
- `onboardingAPI.saveClient(projectId, client)` - Save client info
- `onboardingAPI.getRequirements(projectId)` - Get project requirements
- `onboardingAPI.saveRequirements(projectId, formData)` - Save requirements with files
- `onboardingAPI.getMilestones(projectId)` - Get project milestones
- `onboardingAPI.saveMilestones(projectId, milestones)` - Save milestones

### Required New APIs

#### Dashboard APIs

**1. Get Dashboard Statistics**
```
GET /api/dashboard/stats
Response: DashboardStats
```

**2. Get Recent Projects**
```
GET /api/dashboard/recent-projects?limit=3
Response: RecentProject[]
```

**3. Get Recent Messages**
```
GET /api/dashboard/recent-messages?limit=3
Response: RecentMessage[]
```

#### Projects APIs

**1. Get All Projects with Filtering**
```
GET /api/projects?status=active&client=john&search=web
Response: Project[]
```

**2. Update Project Status**
```
PUT /api/projects/{id}/status
Body: { status: string, progress?: number }
```

**3. Delete Project**
```
DELETE /api/projects/{id}
```

#### Chat APIs

**1. Get All Conversations**
```
GET /api/chat/conversations
Response: ChatConversation[]
```

**2. Get Conversation Messages**
```
GET /api/chat/conversations/{id}/messages
Response: Message[]
```

**3. Send Message**
```
POST /api/chat/conversations/{id}/messages
Body: { message: string }
```

**4. Mark Messages as Read**
```
PUT /api/chat/conversations/{id}/read
```

#### Documents APIs

**1. Get Project Documents**
```
GET /api/projects/{projectId}/documents
Response: Document[]
```

**2. Upload Document**
```
POST /api/projects/{projectId}/documents
Body: FormData (file, metadata)
```

**3. Download Document**
```
GET /api/documents/{id}/download
```

**4. Update Document Status**
```
PUT /api/documents/{id}/status
Body: { status: string }
```

**5. Delete Document**
```
DELETE /api/documents/{id}
```

#### Clients APIs

**1. Get All Clients**
```
GET /api/clients?status=active&search=john
Response: Client[]
```

**2. Get Client Details**
```
GET /api/clients/{id}
Response: Client & Project[]
```

**3. Update Client**
```
PUT /api/clients/{id}
Body: Client
```

**4. Create Client**
```
POST /api/clients
Body: Client
```

#### Profile APIs

**1. Get User Profile**
```
GET /api/profile
Response: UserProfile
```

**2. Update Profile**
```
PUT /api/profile
Body: UserProfile
```

**3. Update Profile Picture**
```
POST /api/profile/picture
Body: FormData
```

**4. Change Password**
```
PUT /api/profile/password
Body: { currentPassword: string, newPassword: string }
```

## Database Schema Suggestions

### Projects Table
```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'planning',
  progress INTEGER DEFAULT 0,
  due_date DATE,
  client_id INTEGER REFERENCES clients(id),
  priority VARCHAR(20) DEFAULT 'medium',
  budget DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Clients Table
```sql
CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  company VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(id),
  sender_type VARCHAR(20), -- 'client' or 'agency'
  sender_id INTEGER,
  message TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP
);
```

### Documents Table
```sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id),
  name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500),
  file_size VARCHAR(50),
  file_type VARCHAR(10),
  status VARCHAR(20) DEFAULT 'draft',
  uploaded_by INTEGER,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## UI Enhancements Suggestions

### 1. Analytics Dashboard Component

Add visual analytics to the dashboard overview:

**Features**:
- Revenue chart over time
- Project completion rate
- Client acquisition funnel
- Project status distribution pie chart

**New Component**: `AnalyticsCharts.tsx`

```typescript
// Suggested implementation
import { LineChart, BarChart, PieChart } from 'recharts';

interface AnalyticsChartsProps {
  revenueData: { month: string; revenue: number }[];
  projectStatusData: { status: string; count: number }[];
  completionRateData: { month: string; rate: number }[];
}

export default function AnalyticsCharts({ ... }) {
  // Implementation with Recharts
}
```

**API Requirements**:
```
GET /api/analytics/revenue?period=12months
GET /api/analytics/project-status
GET /api/analytics/completion-rate
```

### 2. Project Timeline Component

Enhanced project view with Gantt-style timeline:

**Features**:
- Milestone tracking
- Task dependencies
- Progress visualization
- Deadline warnings

**New Component**: `ProjectTimeline.tsx`

### 3. Notification Center

Real-time notifications for:
- Project updates
- New messages
- Deadline approaching
- Payment reminders

**New Component**: `NotificationCenter.tsx`

### 4. Advanced Search and Filtering

Add advanced filters to projects and clients:
- Date range filters
- Multi-select status filters
- Budget range filters
- Client type filters

### 5. File Preview Component

Document preview functionality:
- PDF viewer
- Image preview
- Code syntax highlighting

**New Component**: `DocumentViewer.tsx`

## Implementation Steps

### Phase 1: Core API Development
1. Implement authentication middleware
2. Create project CRUD APIs
3. Build client management APIs
4. Develop document upload/download APIs

### Phase 2: Real-time Features
1. Implement WebSocket for chat
2. Add real-time notifications
3. Create live project updates

### Phase 3: Analytics and Enhancements
1. Build analytics APIs
2. Create chart components
3. Implement advanced search
4. Add file preview functionality

### Phase 4: Optimization
1. Add caching layers
2. Implement pagination
3. Optimize database queries
4. Add error handling and logging

## Security Considerations

1. **Authentication**: JWT tokens with refresh mechanism
2. **Authorization**: Role-based access (client vs agency)
3. **File Upload**: Virus scanning, file type validation
4. **Data Validation**: Input sanitization and validation
5. **Rate Limiting**: API rate limiting for abuse prevention
6. **Encryption**: Encrypt sensitive data at rest

## Testing Strategy

1. **Unit Tests**: Component testing with Jest/React Testing Library
2. **Integration Tests**: API endpoint testing
3. **E2E Tests**: Full user workflow testing with Playwright
4. **Performance Tests**: Load testing for concurrent users

## Deployment Considerations

1. **Environment Variables**: Secure API keys and database URLs
2. **Database**: PostgreSQL for production
3. **File Storage**: AWS S3 or similar for document storage
4. **CDN**: For static assets and file delivery
5. **Monitoring**: Error tracking and performance monitoring

This guide provides a solid foundation for building a comprehensive dashboard API. Start with the core features and gradually add enhancements based on user feedback and business requirements.</content>
<parameter name="filePath">DASHBOARD_API_GUIDE.md