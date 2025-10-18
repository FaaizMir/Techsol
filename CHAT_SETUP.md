# Chat System Setup Guide

## 🔧 Configuration

### 1. Environment Variables

Create or update your `.env.local` file:

```env
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# Socket.IO Server URL (same as backend, without /api)
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 2. Backend Requirements

Your backend must:
- Run on `http://localhost:5000` (or URL specified in env)
- Have Socket.IO server running on the same port
- Support JWT authentication via `socket.auth.token`

## 🚀 Quick Start

### Step 1: Start Backend Server

Make sure your backend server is running:

```bash
cd backend
npm start
# Should see: Server running on port 5000
```

### Step 2: Verify Backend is Running

Open browser and check:
- API Health: `http://localhost:5000/api/health` (should return 200)
- Socket.IO: `http://localhost:5000/socket.io/socket.io.js` (should return JS file)

### Step 3: Start Frontend

```bash
npm run dev
```

## 🔍 Troubleshooting

### Issue: "websocket error" or infinite reconnections

**Causes:**
1. Backend server not running
2. Wrong `NEXT_PUBLIC_SOCKET_URL` in env
3. CORS issues on backend
4. Backend doesn't have Socket.IO configured

**Solutions:**

1. **Check backend is running:**
   ```bash
   curl http://localhost:5000/api/health
   # Should return JSON response
   ```

2. **Verify Socket.IO endpoint:**
   ```bash
   curl http://localhost:5000/socket.io/
   # Should return Socket.IO info
   ```

3. **Check backend CORS config:**
   ```javascript
   // backend/server.js
   const io = require('socket.io')(server, {
     cors: {
       origin: 'http://localhost:3000', // Your frontend URL
       methods: ['GET', 'POST'],
       credentials: true
     }
   });
   ```

4. **Verify environment variables:**
   ```bash
   # In your frontend terminal
   echo $NEXT_PUBLIC_SOCKET_URL
   # Should show: http://localhost:5000
   ```

### Issue: Infinite re-rendering / "User connected" spam

**Fixed in latest version!** The hooks now use refs to prevent infinite loops.

If still experiencing:
1. Clear browser cache
2. Restart dev server
3. Check that you're using the latest hook version

### Issue: "No authentication token found"

**Solutions:**
1. Make sure user is logged in
2. Check localStorage for `jwt_token` or `token`
3. Verify token is being sent on login:
   ```javascript
   localStorage.setItem('jwt_token', token);
   localStorage.setItem('user_id', user.id);
   localStorage.setItem('user_role', user.role);
   ```

## 📱 Usage Examples

### For Normal Users (Client)

The `ChatSection` component is automatically integrated. Users can:
- See their conversations with admin
- Send messages in real-time
- See typing indicators
- Know when admin is online

### For Admin

The `AdminChatSection` component shows:
- All user conversations
- Real-time notifications for new messages
- Online/offline status of users
- Typing indicators
- Unread message counts

## 🎯 Features Implemented

### ✅ Real-time Features
- [x] WebSocket connection with auto-reconnect
- [x] Send/receive messages instantly
- [x] Typing indicators
- [x] Online/offline status
- [x] Read receipts
- [x] Message notifications (admin only)

### ✅ User Experience
- [x] First-time user flow (no conversation)
- [x] Existing user flow (with conversations)
- [x] Connection status indicator
- [x] Loading states
- [x] Error handling
- [x] Auto-scroll to new messages
- [x] Search conversations (admin)

### ✅ Technical Features
- [x] React Query for data fetching
- [x] Socket.IO for real-time
- [x] TypeScript types
- [x] Error boundaries
- [x] Optimistic updates
- [x] Prevent infinite re-renders

## 🔐 Security

The chat system:
- Requires JWT authentication
- Validates tokens on connection
- Redirects to login on auth errors
- Uses secure WebSocket connections (can upgrade to WSS)

## 📊 API Endpoints Used

### REST API
- `GET /api/chat/conversations` - Get all conversations
- `GET /api/chat/conversations/:id/messages` - Get messages
- `POST /api/chat/conversations/:id/messages` - Send message
- `POST /api/chat/messages` - First message (new user)
- `PUT /api/chat/conversations/:id/read` - Mark as read

### WebSocket Events

**Client Emits:**
- `chatMessage` - Send a message
- `typing` - Typing indicator
- `markAsRead` - Mark messages read
- `joinConversation` - Join chat room
- `leaveConversation` - Leave chat room
- `getOnlineUsers` - Request online users

**Client Listens:**
- `messageReceived` - Confirmation of sent message
- `chatMessage` - New incoming message
- `typingStatus` - Someone is typing
- `onlineUsers` - List of online users
- `userOnline` - User came online
- `userOffline` - User went offline
- `messagesRead` - Messages were read
- `error` - Error occurred

**Admin-only Listens:**
- `newMessage` - NEW message from ANY client (notification)

## 🧪 Testing Checklist

- [ ] Backend server running
- [ ] Frontend connects to Socket.IO
- [ ] User can login
- [ ] User can send first message
- [ ] Admin receives notification
- [ ] Admin can reply
- [ ] User receives reply
- [ ] Typing indicators work
- [ ] Online status updates
- [ ] Messages marked as read
- [ ] Connection survives page refresh
- [ ] Handles disconnection/reconnection

## 📝 Next Steps

1. **Test the chat** - Send messages between user and admin
2. **Check notifications** - Browser notifications for admin
3. **Monitor console** - Should see connection logs
4. **Style customization** - Adjust colors/layout as needed

## 🆘 Still Having Issues?

1. Check browser console for errors
2. Check backend logs
3. Verify all environment variables are set
4. Make sure ports 3000 (frontend) and 5000 (backend) are not blocked
5. Try in incognito mode (clears cache)

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Console shows "✅ Socket connected"
- ✅ Connection status shows green dot
- ✅ Messages send instantly
- ✅ No infinite connection logs
- ✅ Admin sees new message notifications
