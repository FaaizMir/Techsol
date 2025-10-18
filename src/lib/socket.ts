// lib/socket.ts
import { io, Socket } from "socket.io-client"

let socket: Socket | null = null
let isConnecting = false

// Get socket URL from environment or use default
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'

export function getSocket(token?: string): Socket {
  // Return existing socket if already connected
  if (socket && socket.connected) {
    return socket
  }

  // Prevent multiple simultaneous connection attempts
  if (isConnecting && socket) {
    return socket
  }

  // Get token from parameter or localStorage (check both token keys)
  const authToken = token || (typeof window !== 'undefined' 
    ? localStorage.getItem('token') || localStorage.getItem('jwt_token') 
    : null)
  
  if (!authToken) {
    console.warn('⚠️ No authentication token found for socket connection')
    // Return a dummy socket to prevent errors, but don't connect
    return socket || io(SOCKET_URL, { autoConnect: false })
  }

  console.log('🔌 Initializing socket with token:', authToken.substring(0, 20) + '...')

  isConnecting = true
  
  socket = io(SOCKET_URL, {
    auth: { token: authToken },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    autoConnect: true,
  })

  // Connection event handlers
  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket?.id)
    isConnecting = false
  })

  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error.message)
    isConnecting = false
    
    // Only redirect on auth errors, not connection errors
    if (error.message.includes('unauthorized') || error.message.includes('authentication') || error.message.includes('jwt') || error.message.includes('token')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt_token')
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        localStorage.removeItem('user_role')
        console.log('Redirecting to login due to auth error...')
        setTimeout(() => {
          window.location.href = '/login'
        }, 1000)
      }
    }
  })

  socket.on('disconnect', (reason) => {
    console.log('🔴 Socket disconnected:', reason)
    isConnecting = false
  })

  socket.on('error', (error) => {
    console.error('Socket error:', error)
  })
  
  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export function isSocketConnected(): boolean {
  return socket?.connected || false
}

export { socket }
