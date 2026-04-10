'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface UseSocketProps {
  userId?: string
  autoConnect?: boolean
}

export function useSocket({ userId, autoConnect = true }: UseSocketProps = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const [onlineCount, setOnlineCount] = useState(0)
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    if (!autoConnect) return

    // Initialize socket connection
    const socketInstance = io('/?XTransformPort=3001', {
      transports: ['websocket', 'polling']
    })

    socketInstance.on('connect', () => {
      console.log('Connected to chat service')
      setIsConnected(true)
      setSocket(socketInstance)
      
      // Join with user ID if provided
      if (userId) {
        socketInstance.emit('join', userId)
      }
    })

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from chat service')
      setIsConnected(false)
      setSocket(null)
    })

    socketInstance.on('online_count', (data: { count: number }) => {
      setOnlineCount(data.count)
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [userId, autoConnect])

  const join = (userId: string) => {
    if (socket) {
      socket.emit('join', userId)
    }
  }

  const sendMessage = (data: { senderId: string; receiverId: string; content: string }) => {
    if (socket) {
      socket.emit('send_message', data)
    }
  }

  const startTyping = (data: { senderId: string; receiverId: string }) => {
    if (socket) {
      socket.emit('typing_start', data)
    }
  }

  const stopTyping = (data: { senderId: string; receiverId: string }) => {
    if (socket) {
      socket.emit('typing_stop', data)
    }
  }

  const sendCallOffer = (data: { callerId: string; receiverId: string; offer: any; type: string }) => {
    if (socket) {
      socket.emit('call_offer', data)
    }
  }

  const sendCallAnswer = (data: { callerId: string; receiverId: string; answer: any }) => {
    if (socket) {
      socket.emit('call_answer', data)
    }
  }

  const sendIceCandidate = (data: { targetUserId: string; candidate: any }) => {
    if (socket) {
      socket.emit('ice_candidate', data)
    }
  }

  const endCall = (data: { callerId: string; receiverId: string; duration: number; totalCost: number }) => {
    if (socket) {
      socket.emit('call_end', data)
    }
  }

  const on = (event: string, callback: (data: any) => void) => {
    if (socket) {
      socket.on(event, callback)
    }
  }

  const off = (event: string, callback?: (data: any) => void) => {
    if (socket) {
      socket.off(event, callback)
    }
  }

  return {
    isConnected,
    onlineCount,
    socket,
    join,
    sendMessage,
    startTyping,
    stopTyping,
    sendCallOffer,
    sendCallAnswer,
    sendIceCandidate,
    endCall,
    on,
    off
  }
}