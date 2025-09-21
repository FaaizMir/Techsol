// lib/socket.ts
import { io, Socket } from "socket.io-client"

let socket: Socket | null = null

export function getSocket(token: string): Socket {
  if (!socket) {
    socket = io("http://localhost:3001", {
      auth: { token }, // ✅ attach token
    })
  }
  return socket
}
