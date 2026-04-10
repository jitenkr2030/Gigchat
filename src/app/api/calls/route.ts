import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { callerId, receiverId, type = 'AUDIO' } = await request.json()

    if (!callerId || !receiverId) {
      return NextResponse.json(
        { error: 'Caller ID and receiver ID are required' },
        { status: 400 }
      )
    }

    // Check if both users are online and available
    const [caller, receiver] = await Promise.all([
      db.user.findUnique({ where: { id: callerId } }),
      db.user.findUnique({ where: { id: receiverId } })
    ])

    if (!caller || !receiver) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (!receiver.isOnline || !receiver.isAvailable) {
      return NextResponse.json(
        { error: 'Receiver is not available' },
        { status: 400 }
      )
    }

    // Check caller's wallet balance
    const callerWallet = await db.wallet.findUnique({
      where: { userId: callerId }
    })

    if (!callerWallet || callerWallet.balance < 1) {
      return NextResponse.json(
        { error: 'Insufficient balance for call' },
        { status: 400 }
      )
    }

    // Create call record
    const call = await db.call.create({
      data: {
        callerId,
        receiverId,
        type,
        status: 'INITIATED'
      },
      include: {
        caller: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            avatar: true,
            pricePerMinute: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Call initiated',
      call
    })
  } catch (error) {
    console.error('Initiate call error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate call' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { callId, status, startedAt, endedAt, duration, totalCost } = await request.json()

    if (!callId || !status) {
      return NextResponse.json(
        { error: 'Call ID and status are required' },
        { status: 400 }
      )
    }

    // Update call record
    const call = await db.call.update({
      where: { id: callId },
      data: {
        status,
        startedAt: startedAt ? new Date(startedAt) : undefined,
        endedAt: endedAt ? new Date(endedAt) : undefined,
        duration,
        totalCost
      },
      include: {
        caller: true,
        receiver: true
      }
    })

    // If call ended with duration, process billing
    if (status === 'ENDED' && duration && totalCost) {
      // Deduct from caller's wallet
      await db.wallet.update({
        where: { userId: call.callerId },
        data: {
          balance: {
            decrement: totalCost
          },
          totalSpent: {
            increment: totalCost
          }
        }
      })

      // Add to receiver's wallet (with platform commission)
      const platformCommission = totalCost * 0.3 // 30% platform fee
      const creatorEarning = totalCost - platformCommission

      await db.wallet.update({
        where: { userId: call.receiverId },
        data: {
          balance: {
            increment: creatorEarning
          },
          totalEarned: {
            increment: creatorEarning
          }
        }
      })

      // Create transaction records
      await Promise.all([
        db.transaction.create({
          data: {
            userId: call.callerId,
            amount: totalCost,
            type: 'CALL_CHARGE',
            description: `Call with ${call.receiver.name}`,
            referenceId: callId
          }
        }),
        db.transaction.create({
          data: {
            userId: call.receiverId,
            amount: creatorEarning,
            type: 'CHAT_EARNING',
            description: `Call from ${call.caller.name}`,
            referenceId: callId
          }
        }),
        db.transaction.create({
          data: {
            userId: call.receiverId,
            amount: platformCommission,
            type: 'PLATFORM_FEE',
            description: `Platform fee for call with ${call.caller.name}`,
            referenceId: callId
          }
        })
      ])
    }

    return NextResponse.json({
      message: 'Call updated successfully',
      call
    })
  } catch (error) {
    console.error('Update call error:', error)
    return NextResponse.json(
      { error: 'Failed to update call' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const whereClause: any = {
      OR: [
        { callerId: userId },
        { receiverId: userId }
      ]
    }

    if (status) {
      whereClause.status = status
    }

    const calls = await db.call.findMany({
      where: whereClause,
      include: {
        caller: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            avatar: true,
            pricePerMinute: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return NextResponse.json({ calls })
  } catch (error) {
    console.error('Get calls error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calls' },
      { status: 500 }
    )
  }
}