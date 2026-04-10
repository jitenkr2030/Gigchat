import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const partnerId = searchParams.get('partnerId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!userId || !partnerId) {
      return NextResponse.json(
        { error: 'User ID and partner ID are required' },
        { status: 400 }
      )
    }

    const skip = (page - 1) * limit

    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    // Mark messages as read
    await db.message.updateMany({
      where: {
        senderId: partnerId,
        receiverId: userId,
        isRead: false
      },
      data: {
        isRead: true
      }
    })

    const total = await db.message.count({
      where: {
        OR: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId }
        ]
      }
    })

    return NextResponse.json({
      messages: messages.reverse(), // Return in chronological order
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { senderId, receiverId, content } = await request.json()

    if (!senderId || !receiverId || !content) {
      return NextResponse.json(
        { error: 'Sender ID, receiver ID, and content are required' },
        { status: 400 }
      )
    }

    // Check if users are blocked
    const block = await db.block.findFirst({
      where: {
        OR: [
          { blockerId: senderId, blockedId: receiverId },
          { blockerId: receiverId, blockedId: senderId }
        ]
      }
    })

    if (block) {
      return NextResponse.json(
        { error: 'Message blocked' },
        { status: 403 }
      )
    }

    // Filter content
    const filteredContent = filterContent(content)
    const isBlocked = filteredContent !== content

    // Create message
    const message = await db.message.create({
      data: {
        content: filteredContent,
        senderId,
        receiverId,
        isBlocked
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Message sent successfully',
      data: message
    })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

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