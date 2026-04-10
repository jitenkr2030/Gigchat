import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    type = searchParams.get('type') // 'users', 'transactions', 'reports'

    if (!type) {
      return NextResponse.json(
        { error: 'Type parameter is required' },
        { status: 400 }
      )
    }

    switch (type) {
      case 'users':
        const users = await db.user.findMany({
          select: {
            id: true,
            email: true,
            mobile: true,
            name: true,
            role: true,
            isOnline: true,
            isBanned: true,
            isVerified: true,
            averageRating: true,
            totalRatings: true,
            createdAt: true,
            lastSeenAt: true,
            wallet: {
              select: {
                balance: true,
                totalEarned: true,
                totalSpent: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 50
        })
        return NextResponse.json({ users })

      case 'transactions':
        const transactions = await db.transaction.findMany({
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 50
        })
        return NextResponse.json({ transactions })

      case 'reports':
        const reports = await db.report.findMany({
          include: {
            reporter: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            reported: {
              select: {
                id: true,
                name: true,
                email: true,
                isBanned: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 50
        })
        return NextResponse.json({ reports })

      case 'stats':
        const totalUsers = await db.user.count()
        const totalCreators = await db.user.count({ where: { role: 'CREATOR' } })
        const totalCustomers = await db.user.count({ where: { role: 'CUSTOMER' } })
        const onlineUsers = await db.user.count({ where: { isOnline: true } })
        const bannedUsers = await db.user.count({ where: { isBanned: true } })
        
        const totalTransactions = await db.transaction.count()
        const totalRevenue = await db.transaction.aggregate({
          where: { type: 'CALL_CHARGE' },
          _sum: { amount: true }
        })
        
        const totalEarnings = await db.wallet.aggregate({
          _sum: { totalEarned: true }
        })

        const pendingReports = await db.report.count({ where: { status: 'PENDING' } })

        return NextResponse.json({
          stats: {
            totalUsers,
            totalCreators,
            totalCustomers,
            onlineUsers,
            bannedUsers,
            totalTransactions,
            totalRevenue: totalRevenue._sum.amount || 0,
            totalEarnings: totalEarnings._sum.totalEarned || 0,
            pendingReports
          }
        })

      default:
        return NextResponse.json(
          { error: 'Invalid type parameter' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Admin GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, userId, reportId, data } = await request.json()

    switch (action) {
      case 'ban_user':
        if (!userId) {
          return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
          )
        }
        
        await db.user.update({
          where: { id: userId },
          data: { isBanned: true }
        })

        // Update related reports
        await db.report.updateMany({
          where: { reportedId: userId, status: 'PENDING' },
          data: { status: 'RESOLVED' }
        })

        return NextResponse.json({ message: 'User banned successfully' })

      case 'unban_user':
        if (!userId) {
          return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 }
          )
        }
        
        await db.user.update({
          where: { id: userId },
          data: { isBanned: false }
        })

        return NextResponse.json({ message: 'User unbanned successfully' })

      case 'update_report':
        if (!reportId || !data.status) {
          return NextResponse.json(
            { error: 'Report ID and status are required' },
            { status: 400 }
          )
        }
        
        await db.report.update({
          where: { id: reportId },
          data: { status: data.status }
        })

        return NextResponse.json({ message: 'Report updated successfully' })

      case 'update_user':
        if (!userId || !data) {
          return NextResponse.json(
            { error: 'User ID and data are required' },
            { status: 400 }
          )
        }
        
        const updatedUser = await db.user.update({
          where: { id: userId },
          data: {
            ...(data.name && { name: data.name }),
            ...(data.role && { role: data.role }),
            ...(data.pricePerMinute !== undefined && { pricePerMinute: data.pricePerMinute }),
            ...(data.isOnline !== undefined && { isOnline: data.isOnline }),
            ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable })
          }
        })

        return NextResponse.json({
          message: 'User updated successfully',
          user: updatedUser
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Admin POST error:', error)
    return NextResponse.json(
      { error: 'Failed to perform admin action' },
      { status: 500 }
    )
  }
}