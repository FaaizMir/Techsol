# Additional API Requirements

## Overview
This document outlines additional API endpoints that would enhance the dashboard functionality. These are optional but recommended for a complete user experience.

---

## 🔧 Currently Missing APIs (Nice to Have)

### 1. **Bulk Operations**

#### 1.1 Bulk Delete Documents
**Endpoint:** `DELETE /documents/bulk`

**Description:** Delete multiple documents at once

**Request Body:**
```json
{
  "documentIds": [1, 2, 3, 4]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deleted": 4,
    "failed": []
  }
}
```

---

#### 1.2 Bulk Delete Projects
**Endpoint:** `DELETE /onboarding/projects/bulk`

**Description:** Delete multiple projects at once

**Request Body:**
```json
{
  "projectIds": [1, 2, 3]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deleted": 3,
    "failed": []
  }
}
```

---

### 2. **Analytics & Reports**

#### 2.1 Client Analytics
**Endpoint:** `GET /clients/{clientId}/analytics`

**Description:** Get detailed analytics for a specific client

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProjects": 5,
    "activeProjects": 2,
    "completedProjects": 3,
    "totalRevenue": 50000,
    "averageProjectValue": 10000,
    "projectCompletionRate": 60,
    "averageProjectDuration": 90,
    "lastActivity": "2025-09-21T10:00:00.000Z"
  }
}
```

---

#### 2.2 Project Performance Report
**Endpoint:** `GET /onboarding/projects/{projectId}/report`

**Description:** Generate a comprehensive project report

**Response:**
```json
{
  "success": true,
  "data": {
    "projectId": 1,
    "name": "E-commerce Website",
    "startDate": "2025-01-01",
    "endDate": "2025-12-31",
    "status": "active",
    "budget": 10000,
    "spent": 5000,
    "remaining": 5000,
    "overallProgress": 50,
    "milestones": {
      "total": 6,
      "completed": 3,
      "inProgress": 2,
      "pending": 1
    },
    "tasks": {
      "total": 20,
      "completed": 10,
      "inProgress": 5,
      "pending": 5
    },
    "documents": {
      "total": 15,
      "approved": 10,
      "pending": 5
    },
    "teamMembers": 4,
    "clientSatisfaction": 4.5
  }
}
```

---

### 3. **Notifications**

#### 3.1 Get User Notifications
**Endpoint:** `GET /notifications`

**Description:** Get all notifications for the authenticated user

**Query Parameters:**
- `type` (optional): Filter by type (project, message, document, etc.)
- `read` (optional): Filter by read status (true/false)
- `limit` (optional): Number of notifications to return

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "project_update",
      "title": "Project Status Changed",
      "message": "E-commerce Website status changed to In Progress",
      "projectId": 1,
      "isRead": false,
      "createdAt": "2025-09-21T10:00:00.000Z"
    },
    {
      "id": 2,
      "type": "new_message",
      "title": "New Message",
      "message": "You have a new message from John Smith",
      "conversationId": 1,
      "isRead": true,
      "createdAt": "2025-09-20T15:30:00.000Z"
    }
  ]
}
```

---

#### 3.2 Mark Notification as Read
**Endpoint:** `PUT /notifications/{notificationId}/read`

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

#### 3.3 Mark All Notifications as Read
**Endpoint:** `PUT /notifications/read-all`

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

### 4. **Activity Log**

#### 4.1 Get Project Activity Log
**Endpoint:** `GET /onboarding/projects/{projectId}/activity`

**Description:** Get activity log for a specific project

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "action": "milestone_completed",
      "description": "Design Phase milestone completed",
      "userId": 1,
      "userName": "John Doe",
      "timestamp": "2025-09-21T10:00:00.000Z",
      "metadata": {
        "milestoneId": 1,
        "milestoneName": "Design Phase"
      }
    },
    {
      "id": 2,
      "action": "document_uploaded",
      "description": "Design Mockups.zip uploaded",
      "userId": 1,
      "userName": "John Doe",
      "timestamp": "2025-09-20T14:30:00.000Z",
      "metadata": {
        "documentId": 5,
        "documentName": "Design Mockups.zip"
      }
    }
  ]
}
```

---

#### 4.2 Get User Activity Log
**Endpoint:** `GET /profile/activity`

**Description:** Get activity log for the authenticated user

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "action": "project_created",
      "description": "Created new project: E-commerce Website",
      "timestamp": "2025-09-15T10:00:00.000Z",
      "projectId": 1
    },
    {
      "id": 2,
      "action": "profile_updated",
      "description": "Updated profile information",
      "timestamp": "2025-09-14T16:20:00.000Z"
    }
  ]
}
```

---

### 5. **Search & Autocomplete**

#### 5.1 Global Search
**Endpoint:** `GET /search`

**Description:** Search across all entities (projects, clients, documents)

**Query Parameters:**
- `q`: Search query (required)
- `type`: Filter by type (projects, clients, documents, all)
- `limit`: Number of results per type

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": 1,
        "name": "E-commerce Website",
        "type": "project"
      }
    ],
    "clients": [
      {
        "id": 1,
        "name": "John Smith",
        "email": "john@company.com",
        "type": "client"
      }
    ],
    "documents": [
      {
        "id": 1,
        "name": "Requirements.pdf",
        "projectName": "E-commerce Website",
        "type": "document"
      }
    ]
  }
}
```

---

### 6. **File Management**

#### 6.1 Get File Metadata
**Endpoint:** `GET /documents/{documentId}/metadata`

**Description:** Get detailed metadata for a document

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Requirements.pdf",
    "originalName": "Project Requirements.pdf",
    "size": 2048576,
    "mimeType": "application/pdf",
    "uploadedBy": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "uploadedAt": "2025-09-21T10:00:00.000Z",
    "lastModified": "2025-09-21T10:00:00.000Z",
    "versions": 1,
    "downloads": 5,
    "status": "approved",
    "approvedBy": {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "approvedAt": "2025-09-22T14:00:00.000Z"
  }
}
```

---

#### 6.2 Document Version History
**Endpoint:** `GET /documents/{documentId}/versions`

**Description:** Get version history for a document

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "version": 2,
      "name": "Requirements_v2.pdf",
      "size": 2148576,
      "uploadedBy": "John Doe",
      "uploadedAt": "2025-09-22T10:00:00.000Z",
      "isCurrent": true
    },
    {
      "version": 1,
      "name": "Requirements_v1.pdf",
      "size": 2048576,
      "uploadedBy": "John Doe",
      "uploadedAt": "2025-09-21T10:00:00.000Z",
      "isCurrent": false
    }
  ]
}
```

---

### 7. **Team Management**

#### 7.1 Get Team Members
**Endpoint:** `GET /team/members`

**Description:** Get all team members in the organization

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@techcraft.com",
      "role": "Project Manager",
      "avatar": "/uploads/avatar-1.jpg",
      "status": "active",
      "joinedAt": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@techcraft.com",
      "role": "Developer",
      "avatar": "/uploads/avatar-2.jpg",
      "status": "active",
      "joinedAt": "2025-02-01T00:00:00.000Z"
    }
  ]
}
```

---

#### 7.2 Assign Team Member to Project
**Endpoint:** `POST /onboarding/projects/{projectId}/assign`

**Request Body:**
```json
{
  "userId": 2,
  "role": "Developer"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "projectId": 1,
    "userId": 2,
    "role": "Developer",
    "assignedAt": "2025-09-21T10:00:00.000Z"
  }
}
```

---

### 8. **Export & Backup**

#### 8.1 Export Data
**Endpoint:** `POST /export`

**Description:** Export data in various formats (CSV, PDF, JSON)

**Request Body:**
```json
{
  "type": "clients",
  "format": "csv",
  "filters": {
    "status": "active"
  }
}
```

**Response:**
Binary file download or:
```json
{
  "success": true,
  "data": {
    "downloadUrl": "/exports/clients-2025-09-21.csv",
    "expiresAt": "2025-09-22T10:00:00.000Z"
  }
}
```

---

#### 8.2 Backup Project Data
**Endpoint:** `POST /onboarding/projects/{projectId}/backup`

**Description:** Create a backup of all project data

**Response:**
```json
{
  "success": true,
  "data": {
    "backupId": 123,
    "downloadUrl": "/backups/project-1-backup-2025-09-21.zip",
    "size": 10485760,
    "createdAt": "2025-09-21T10:00:00.000Z",
    "expiresAt": "2025-10-21T10:00:00.000Z"
  }
}
```

---

## 🎯 Priority Recommendations

### High Priority
1. **Notifications API** - Essential for user engagement
2. **Global Search** - Improves user experience significantly
3. **File Metadata** - Important for document management

### Medium Priority
1. **Activity Log** - Useful for tracking changes
2. **Client Analytics** - Helps with business insights
3. **Team Management** - Needed for collaboration

### Low Priority
1. **Bulk Operations** - Nice to have for efficiency
2. **Export/Backup** - Advanced feature
3. **Version History** - Can be added later

---

## 📝 Notes

All these APIs are **optional enhancements** to the current implementation. The dashboard is fully functional without them, but they would provide:

- Better user experience
- More insights and analytics
- Improved collaboration features
- Data export capabilities
- Enhanced file management

When implementing these APIs, please follow the same response format as existing endpoints:
```json
{
  "success": boolean,
  "data": object | array,
  "error": {
    "code": string,
    "message": string
  }
}
```

---

## 🔗 Integration Guide

Once these APIs are implemented, the frontend integration would be:

1. Create custom hooks in `src/hooks/` folder
2. Add API functions to `src/lib/api.ts`
3. Use React Query for caching and state management
4. Add UI components in relevant dashboard sections

Example:
```typescript
// In src/hooks/use-notifications.ts
export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiCall('/notifications', 'GET'),
  });
};

// In component
const { data: notifications } = useNotifications();
```
