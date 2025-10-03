# Dashboard Testing Guide

## Quick Start

### Prerequisites
1. Ensure the backend API is running at `http://localhost:3000/api`
2. You have a valid user account with authentication token
3. Node modules are installed (`npm install`)

---

## 🚀 Starting the Dashboard

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The dashboard will be available at `http://localhost:3000` (or your configured port).

---

## 🧪 Testing Each Section

### 1. **Login & Authentication**
- Navigate to `/login`
- Enter credentials
- Token should be stored in localStorage
- Should redirect to `/dashboard` on success

---

### 2. **Dashboard Overview**
**Location:** Click "Dashboard" in sidebar

**Test Cases:**
- [ ] Stats cards display correctly (Total Projects, Active, Completed, Total Spent)
- [ ] Recent projects list shows up to 5 projects
- [ ] Recent messages show up to 5 conversations
- [ ] "Start New Project" button triggers onboarding modal
- [ ] All data loads without errors

**Expected API Calls:**
- `GET /dashboard/stats`
- `GET /dashboard/recent-projects?limit=5`
- `GET /dashboard/recent-messages?limit=5`

---

### 3. **My Projects**
**Location:** Click "My Projects" in sidebar

**Test Cases:**
- [ ] All projects display in grid layout
- [ ] Search functionality works
- [ ] Filter by status works (active, completed, pending)
- [ ] Project cards show correct information
- [ ] Progress bars display correctly
- [ ] Can view project details

**Expected API Calls:**
- `GET /onboarding/all-projects?limit=10`
- `GET /onboarding/all-projects?status=active` (when filtering)
- `GET /onboarding/all-projects?search=keyword` (when searching)

---

### 4. **Project Timeline**
**Location:** Click "Project Timeline" in sidebar

**Test Cases:**
- [ ] Project dropdown populates with all projects
- [ ] Selecting a project loads its timeline
- [ ] Milestones display in correct order
- [ ] Progress calculation is accurate
- [ ] Status indicators show correct colors
- [ ] Milestone details (deadline, amount) display correctly
- [ ] Loading skeleton shows while fetching

**Expected API Calls:**
- `GET /onboarding/all-projects?limit=100`
- Data is filtered client-side

**How to Test:**
1. Select a project from dropdown
2. Verify milestones appear
3. Check that completed milestones show green checkmarks
4. Verify in-progress milestones show clock icons
5. Ensure pending milestones show empty circles

---

### 5. **Clients Section** ⭐ NEW
**Location:** Click "Clients" in sidebar

**Test Cases:**
- [ ] Client list displays correctly
- [ ] Search by name/email works
- [ ] Filter by status (active/inactive) works
- [ ] "Add Client" button opens modal
- [ ] Can create new client with required fields
- [ ] Can edit existing client
- [ ] Form validation works (name, email, country required)
- [ ] Client cards show all information

**Expected API Calls:**
- `GET /clients` (on load)
- `GET /clients?search=john` (when searching)
- `GET /clients?status=active` (when filtering)
- `POST /clients` (when adding)
- `PUT /clients/{id}` (when editing)

**How to Test:**
1. Click "Add Client" button
2. Fill in form:
   - Name: Test Client
   - Email: test@example.com
   - Phone: +1-555-0123
   - Company: Test Corp
   - Country: United States
   - Status: Active
3. Submit and verify client appears in list
4. Click edit icon on a client
5. Update information and save
6. Search for a client by name
7. Filter by status

---

### 6. **Messages**
**Location:** Click "Messages" in sidebar

**Test Cases:**
- [ ] Conversation list displays
- [ ] Can select a conversation
- [ ] Messages load for selected conversation
- [ ] Can send new messages
- [ ] Unread count displays correctly

**Expected API Calls:**
- `GET /chat/conversations`
- `GET /chat/conversations/{id}/messages`
- `POST /chat/conversations/{id}/messages`

---

### 7. **Documents** ⭐ UPDATED
**Location:** Click "Documents" in sidebar

**Test Cases:**
- [ ] Project dropdown populates
- [ ] Selecting project loads its documents
- [ ] Can upload new document
- [ ] Search documents by name
- [ ] Filter by status (draft, under review, approved, signed)
- [ ] Can download documents
- [ ] Can delete documents with confirmation
- [ ] Can mark draft as "Under Review"
- [ ] File upload accepts common formats

**Expected API Calls:**
- `GET /onboarding/all-projects?limit=100`
- `GET /documents/projects/{projectId}/documents`
- `POST /documents/projects/{projectId}/documents` (upload)
- `DELETE /documents/{documentId}` (delete)
- `PUT /documents/{documentId}/status` (status update)

**How to Test:**
1. Select a project from dropdown
2. Choose a file to upload (PDF, DOCX, etc.)
3. Click "Upload" button
4. Verify document appears in list
5. Search for document by name
6. Filter by status
7. Try to delete a document
8. Mark a draft document for review

---

### 8. **Profile** ⭐ UPDATED
**Location:** Click "Profile" in sidebar

**Test Cases:**
- [ ] Profile data loads correctly
- [ ] Can upload profile picture
- [ ] Can update personal information
- [ ] Can change password
- [ ] Email field is disabled (read-only)
- [ ] Notification toggles work
- [ ] Timezone selector works
- [ ] All changes save successfully

**Expected API Calls:**
- `GET /profile`
- `PUT /profile` (update info)
- `POST /profile/picture` (upload picture)
- `PUT /profile/password` (change password)

**How to Test:**
1. Update first name and last name
2. Click "Save Changes"
3. Verify alert confirmation
4. Upload a new profile picture
5. Click "Change Password"
6. Enter current and new passwords
7. Submit and verify success
8. Toggle notification switches
9. Select a timezone

---

## 🔍 Common Issues & Solutions

### Issue: API calls fail with 401 Unauthorized
**Solution:** 
- Check that token is in localStorage
- Token might be expired - try logging in again
- Verify API base URL is correct

### Issue: Data not loading
**Solution:**
- Check browser console for errors
- Verify backend is running
- Check API response format matches expected structure

### Issue: Components show loading indefinitely
**Solution:**
- Check network tab for failed requests
- Verify API endpoint exists
- Check for CORS issues

### Issue: Forms don't submit
**Solution:**
- Check browser console for validation errors
- Verify required fields are filled
- Check mutation status in React Query DevTools

---

## 📊 Expected Data Flow

### On Page Load
1. User navigates to `/dashboard`
2. `DashboardLayout` checks authentication
3. `OnboardingChecker` verifies onboarding status
4. Dashboard page loads default "Dashboard Overview" section
5. Multiple API calls are made in parallel:
   - Dashboard stats
   - Recent projects
   - Recent messages
6. Data is cached by React Query
7. UI updates with real data

### On Section Change
1. User clicks sidebar navigation item
2. Section transition animation plays
3. New section component mounts
4. API calls are made (or cached data is used)
5. Loading skeleton shows
6. Data populates
7. Section is interactive

---

## 🛠️ Debug Tools

### React Query DevTools
Already integrated! Check the bottom-right corner for the floating icon.

**Features:**
- View all queries and their states
- See cached data
- Manually refetch queries
- Inspect query timelines

### Browser DevTools
- **Console:** Check for errors and logs
- **Network:** Monitor API calls and responses
- **Application > Local Storage:** Check token storage
- **React DevTools:** Inspect component props and state

---

## ✅ Test Checklist

Copy this checklist and mark items as you test:

### Authentication
- [ ] Can log in successfully
- [ ] Token is stored in localStorage
- [ ] Redirect to dashboard works
- [ ] Protected routes are guarded

### Dashboard Overview
- [ ] Stats load correctly
- [ ] Recent projects display
- [ ] Recent messages display
- [ ] Start new project button works

### Projects
- [ ] All projects display
- [ ] Search works
- [ ] Filter works
- [ ] Project cards are interactive

### Timeline
- [ ] Project selection works
- [ ] Milestones display correctly
- [ ] Progress calculation is accurate
- [ ] Timeline visualization is correct

### Clients (NEW)
- [ ] Client list loads
- [ ] Can add new client
- [ ] Can edit existing client
- [ ] Search works
- [ ] Filter works
- [ ] Form validation works

### Documents (UPDATED)
- [ ] Project selection works
- [ ] Documents load per project
- [ ] File upload works
- [ ] Download works
- [ ] Delete works (with confirmation)
- [ ] Status update works
- [ ] Search works
- [ ] Filter works

### Profile (UPDATED)
- [ ] Profile data loads
- [ ] Can update information
- [ ] Can upload profile picture
- [ ] Can change password
- [ ] Notification toggles work
- [ ] Timezone selector works

### Messages
- [ ] Conversations load
- [ ] Can select conversation
- [ ] Messages display
- [ ] Can send messages

### General
- [ ] Sidebar navigation works
- [ ] Animations are smooth
- [ ] Loading states show correctly
- [ ] Error handling works
- [ ] Responsive design works on mobile
- [ ] No console errors

---

## 📝 Reporting Issues

When reporting issues, please include:

1. **Section:** Which dashboard section
2. **Action:** What you were trying to do
3. **Expected:** What should happen
4. **Actual:** What actually happened
5. **Console Errors:** Any errors from browser console
6. **Network:** Failed API calls from network tab
7. **Screenshots:** If applicable

---

## 🎉 Success Criteria

The dashboard is working correctly when:
- ✅ All sections load without errors
- ✅ All CRUD operations work
- ✅ Search and filters function properly
- ✅ Loading states appear and disappear correctly
- ✅ Error messages are user-friendly
- ✅ Animations are smooth
- ✅ Responsive design works on all screen sizes
- ✅ Data persists after page refresh (thanks to React Query cache)

---

Happy Testing! 🚀
