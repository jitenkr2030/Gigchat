'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface UseSocketProps {
  userId?: string
  autoConnect?: boolean
}

export function useSocket({ userId, autoConnect = true }: UseSocketProps = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const [onlineCount, setOnlineCount] = useState(0)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!autoConnect) return

    // Initialize socket connection
    const socket = io('/?XTransformPort=3001', {
      transports: ['websocket', 'polling']
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Connected to chat service')
      setIsConnected(true)
      
      // Join with user ID if provided
      if (userId) {
        socket.emit('join', userId)
      }
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from chat service')
      setIsConnected(false)
    })

    socket.on('online_count', (data: { count: number }) => {
      setOnlineCount(data.count)
    })

    return () => {
      socket.disconnect()
    }
  }, [userId, autoConnect])

  const join = (userId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join', userId)
    }
  }

  const sendMessage = (data: { senderId: string; receiverId: string; content: string }) => {
    if (socketRef.current) {
      socketRef.current.emit('send_message', data)
    }
  }

  const startTyping = (data: { senderId: string; receiverId: string }) => {
    if (socketRef.current) {
      socketRef.current.emit('typing_start', data)
    }
  }

  const stopTyping = (data: { senderId: string; receiverId: string }) => {
    if (socketRef.current) {
      socketRef.current.emit('typing_stop', data)
    }
  }

  const sendCallOffer = (data: { callerId: string; receiverId: string; offer: any; type: string }) => {
    if (socketRef.current) {
      socketRef.current.emit('call_offer', data)
    }
  }

  const sendCallAnswer = (data: { callerId: string; receiverId: string; answer: any }) => {
    if (socketRef.current) {
      socketRef.current.emit('call_answer', data)
    }
  }

  const sendIceCandidate = (data: { targetUserId: string; candidate: any }) => {
    if (socketRef.current) {
      socketRef.current.emit('ice_candidate', data)
    }
  }

  const endCall = (data: { callerId: string; receiverId: string; duration: number; totalCost: number }) => {
    if (socketRef.current) {
      socketRef.current.emit('call_end', data)
    }
  }

  const on = (event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback)
    }
  }

  const off = (event: string, callback?: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback)
    }
  }

  return {
    isConnected,
    onlineCount,
    socket: socketRef.current,
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