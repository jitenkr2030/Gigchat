import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const period = searchParams.get('period') || 'week' // 'day', 'week', 'month', 'all'

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user's wallet
    const wallet = await db.wallet.findUnique({
      where: { userId }
    })

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      )
    }

    // Calculate date range based on period
    const now = new Date()
    let startDate = new Date()

    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 1)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'all':
        startDate = new Date(0)
        break
    }

    // Get transactions for the period
    const transactions = await db.transaction.findMany({
      where: {
        userId,
        type: 'CHAT_EARNING',
        createdAt: {
          gte: startDate
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate period earnings
    const periodEarnings = transactions.reduce((sum, tx) => sum + tx.amount, 0)

    // Get call statistics
    const calls = await db.call.findMany({
      where: {
        receiverId: userId, // User was the creator (receiver)
        status: 'ENDED',
        startedAt: {
          gte: startDate
        }
      }
    })

    const totalCallDuration = calls.reduce((sum, call) => sum + (call.duration || 0), 0)
    const totalCallEarnings = calls.reduce((sum, call) => sum + (call.totalCost || 0), 0)

    // Get message count (this would need to be implemented with message pricing)
    const messagesSent = await db.message.count({
      where: {
        senderId: userId,
        createdAt: {
          gte: startDate
        }
      }
    })

    // Get daily earnings for chart
    const dailyEarnings = await db.$queryRaw`
      SELECT 
        DATE(createdAt) as date,
        SUM(amount) as earnings,
        COUNT(*) as transactions
      FROM Transaction 
      WHERE userId = ${userId} 
        AND type = 'CHAT_EARNING'
        AND createdAt >= ${startDate}
      GROUP BY DATE(createdAt)
      ORDER BY date DESC
      LIMIT 7
    `

    // Get leaderboard position (top creators by earnings)
    const topEarners = await db.wallet.findMany({
      select: {
        userId: true,
        totalEarned: true,
        user: {
          select: {
            name: true,
            avatar: true,
            averageRating: true
          }
        }
      },
      orderBy: { totalEarned: 'desc' },
      take: 10
    })

    const userRank = topEarners.findIndex(earner => earner.userId === userId) + 1

    return NextResponse.json({
      summary: {
        totalEarned: wallet.totalEarned,
        currentBalance: wallet.balance,
        periodEarnings,
        period,
        totalCalls: calls.length,
        totalCallDuration,
        totalCallEarnings,
        messagesSent,
        rank: userRank > 0 ? userRank : null
      },
      dailyEarnings,
      leaderboard: topEarners,
      recentTransactions: transactions.slice(0, 10)
    })
  } catch (error) {
    console.error('Get earnings error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch earnings' },
      { status: 500 }
    )
  }
}