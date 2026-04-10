import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const raterId = searchParams.get('raterId')

    if (userId) {
      // Get ratings for a specific user
      const ratings = await db.rating.findMany({
        where: { ratedId: userId },
        include: {
          rater: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })

      // Calculate average rating
      const avgRating = await db.rating.aggregate({
        where: { ratedId: userId },
        _avg: { rating: true },
        _count: { rating: true }
      })

      return NextResponse.json({
        ratings,
        averageRating: avgRating._avg.rating || 0,
        totalRatings: avgRating._count.rating
      })
    }

    if (raterId) {
      // Get ratings given by a user
      const ratings = await db.rating.findMany({
        where: { raterId },
        include: {
          rated: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({ ratings })
    }

    return NextResponse.json(
      { error: 'User ID or rater ID is required' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Get ratings error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { raterId, ratedId, rating, review } = await request.json()

    if (!raterId || !ratedId || !rating) {
      return NextResponse.json(
        { error: 'Rater ID, rated ID, and rating are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (raterId === ratedId) {
      return NextResponse.json(
        { error: 'Cannot rate yourself' },
        { status: 400 }
      )
    }

    // Check if rating already exists
    const existingRating = await db.rating.findUnique({
      where: {
        raterId_ratedId: {
          raterId,
          ratedId
        }
      }
    })

    let newRating
    if (existingRating) {
      // Update existing rating
      newRating = await db.rating.update({
        where: {
          raterId_ratedId: {
            raterId,
            ratedId
          }
        },
        data: {
          rating,
          review
        }
      })
    } else {
      // Create new rating
      newRating = await db.rating.create({
        data: {
          raterId,
          ratedId,
          rating,
          review
        }
      })
    }

    // Update user's average rating
    const ratingStats = await db.rating.aggregate({
      where: { ratedId },
      _avg: { rating: true },
      _count: { rating: true }
    })

    await db.user.update({
      where: { id: ratedId },
      data: {
        averageRating: ratingStats._avg.rating || 0,
        totalRatings: ratingStats._count.rating
      }
    })

    return NextResponse.json({
      message: 'Rating submitted successfully',
      rating: newRating
    })
  } catch (error) {
    console.error('Submit rating error:', error)
    return NextResponse.json(
      { error: 'Failed to submit rating' },
      { status: 500 }
    )
  }
}