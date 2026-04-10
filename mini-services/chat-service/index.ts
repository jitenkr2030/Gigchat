import { Server } from 'socket.io'
import { createServer } from 'http'

const PORT = 3001

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

// Store online users
const onlineUsers = new Map<string, string>() // userId -> socketId
const userSockets = new Map<string, string>() // socketId -> userId

// Helper function to filter abusive content
function filterContent(content: string): string {
  const abusiveWords = ['fuck', 'shit', 'bitch', 'asshole', 'bastard', 'whore', 'slut']
  let filteredContent = content.toLowerCase()
  
  for (const word of abusiveWords) {
    const regex = new RegExp(word, 'gi')
    filteredContent = filteredContent.replace(regex, '*'.repeat(word.length))
  }
  
  // Filter phone numbers and WhatsApp
  filteredContent = filteredContent.replace(/\b\d{10}\b/g, '**********')
  filteredContent = filteredContent.replace(/whatsapp/gi, '*******')
  filteredContent = filteredContent.replace(/\d{4}[\s-]?\d{3}[\s-]?\d{4}/g, '***********')
  
  return filteredContent
}

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)

  // User joins with their userId
  socket.on('join', (userId: string) => {
    onlineUsers.set(userId, socket.id)
    userSockets.set(socket.id, userId)
    socket.join(userId)

    // Broadcast online status
    socket.broadcast.emit('user_online', { userId })
    console.log(`User ${userId} joined with socket ${socket.id}`)
  })

  // Send message
  socket.on('send_message', (data) => {
    try {
      const { senderId, receiverId, content } = data

      // Filter content
      const filteredContent = filterContent(content)
      const isBlocked = filteredContent !== content

      const message = {
        id: Date.now().toString(),
        content: filteredContent,
        senderId,
        receiverId,
        isBlocked,
        createdAt: new Date().toISOString(),
        sender: {
          id: senderId,
          name: `User ${senderId}`,
          avatar: null
        }
      }

      // Send to receiver if online
      const receiverSocketId = onlineUsers.get(receiverId)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('new_message', message)
      }

      // Send confirmation to sender
      socket.emit('message_sent', message)

      console.log(`Message from ${senderId} to ${receiverId}: ${filteredContent}`)
    } catch (error) {
      console.error('Send message error:', error)
      socket.emit('message_error', { error: 'Failed to send message' })
    }
  })

  // Typing indicator
  socket.on('typing_start', (data) => {
    const { senderId, receiverId } = data
    const receiverSocketId = onlineUsers.get(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user_typing', { userId: senderId })
    }
  })

  socket.on('typing_stop', (data) => {
    const { senderId, receiverId } = data
    const receiverSocketId = onlineUsers.get(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user_stop_typing', { userId: senderId })
    }
  })

  // Call signaling
  socket.on('call_offer', (data) => {
    const { callerId, receiverId, offer, type } = data
    const receiverSocketId = onlineUsers.get(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('incoming_call', {
        callerId,
        offer,
        type
      })
    }
  })

  socket.on('call_answer', (data) => {
    const { callerId, receiverId, answer } = data
    const callerSocketId = onlineUsers.get(callerId)
    if (callerSocketId) {
      io.to(callerSocketId).emit('call_answered', {
        receiverId,
        answer
      })
    }
  })

  socket.on('ice_candidate', (data) => {
    const { targetUserId, candidate } = data
    const targetSocketId = onlineUsers.get(targetUserId)
    if (targetSocketId) {
      io.to(targetSocketId).emit('ice_candidate', {
        candidate
      })
    }
  })

  socket.on('call_end', (data) => {
    const { callerId, receiverId, duration, totalCost } = data
    const receiverSocketId = onlineUsers.get(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('call_ended', {
        callerId,
        duration,
        totalCost
      })
    }
  })

  // Handle disconnect
  socket.on('disconnect', () => {
    const userId = userSockets.get(socket.id)
    if (userId) {
      onlineUsers.delete(userId)
      userSockets.delete(socket.id)

      // Broadcast offline status
      socket.broadcast.emit('user_offline', { userId })
      console.log(`User ${userId} disconnected`)
    }
  })
})

// Get online users count
io.on('connection', (socket) => {
  socket.emit('online_count', { count: onlineUsers.size })
})

httpServer.listen(PORT, () => {
  console.log(`Chat service running on port ${PORT}`)
})