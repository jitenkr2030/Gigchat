import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { blockerId, blockedId } = await request.json()

    if (!blockerId || !blockedId) {
      return NextResponse.json(
        { error: 'Blocker ID and blocked ID are required' },
        { status: 400 }
      )
    }

    if (blockerId === blockedId) {
      return NextResponse.json(
        { error: 'Cannot block yourself' },
        { status: 400 }
      )
    }

    // Check if block already exists
    const existingBlock = await db.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId,
          blockedId
        }
      }
    })

    if (existingBlock) {
      return NextResponse.json(
        { error: 'User is already blocked' },
        { status: 400 }
      )
    }

    // Create block
    const block = await db.block.create({
      data: {
        blockerId,
        blockedId
      }
    })

    return NextResponse.json({
      message: 'User blocked successfully',
      block
    })
  } catch (error) {
    console.error('Block user error:', error)
    return NextResponse.json(
      { error: 'Failed to block user' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const blockerId = searchParams.get('blockerId')
    const blockedId = searchParams.get('blockedId')

    if (!blockerId || !blockedId) {
      return NextResponse.json(
        { error: 'Blocker ID and blocked ID are required' },
        { status: 400 }
      )
    }

    // Remove block
    await db.block.delete({
      where: {
        blockerId_blockedId: {
          blockerId,
          blockedId
        }
      }
    })

    return NextResponse.json({
      message: 'User unblocked successfully'
    })
  } catch (error) {
    console.error('Unblock user error:', error)
    return NextResponse.json(
      { error: 'Failed to unblock user' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') // 'blocked' or 'blocked-by'

    if (!userId || !type) {
      return NextResponse.json(
        { error: 'User ID and type are required' },
        { status: 400 }
      )
    }

    let blocks
    if (type === 'blocked') {
      blocks = await db.block.findMany({
        where: { blockerId: userId },
        include: {
          blocked: {
            select: {
              id: true,
              name: true,
              avatar: true,
              isOnline: true
            }
          }
        }
      })
    } else {
      blocks = await db.block.findMany({
        where: { blockedId: userId },
        include: {
          blocker: {
            select: {
              id: true,
              name: true,
              avatar: true,
              isOnline: true
            }
          }
        }
      })
    }

    return NextResponse.json({ blocks })
  } catch (error) {
    console.error('Get blocks error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blocks' },
      { status: 500 }
    )
  }
}