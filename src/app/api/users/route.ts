import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role') as 'CUSTOMER' | 'CREATOR' | null
    const online = searchParams.get('online')
    const limit = parseInt(searchParams.get('limit') || '20')

    const whereClause: any = {
      isBanned: false,
      isVerified: true
    }

    if (role) {
      whereClause.role = role
    }

    if (online === 'true') {
      whereClause.isOnline = true
      whereClause.isAvailable = true
    }

    const users = await db.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
        language: true,
        role: true,
        pricePerMinute: true,
        isOnline: true,
        isAvailable: true,
        averageRating: true,
        totalRatings: true,
        createdAt: true
      },
      orderBy: [
        { isOnline: 'desc' },
        { averageRating: 'desc' }
      ],
      take: limit
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, name, bio, language, pricePerMinute, role } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (bio !== undefined) updateData.bio = bio
    if (language !== undefined) updateData.language = language
    if (pricePerMinute !== undefined) updateData.pricePerMinute = pricePerMinute
    if (role !== undefined) updateData.role = role

    const user = await db.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        mobile: true,
        name: true,
        avatar: true,
        bio: true,
        language: true,
        role: true,
        pricePerMinute: true,
        isOnline: true,
        isAvailable: true,
        averageRating: true,
        totalRatings: true
      }
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      user
    })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}