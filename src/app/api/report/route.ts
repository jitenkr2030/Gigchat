import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { reporterId, reportedId, reason, description } = await request.json()

    if (!reporterId || !reportedId || !reason) {
      return NextResponse.json(
        { error: 'Reporter ID, reported ID, and reason are required' },
        { status: 400 }
      )
    }

    if (reporterId === reportedId) {
      return NextResponse.json(
        { error: 'Cannot report yourself' },
        { status: 400 }
      )
    }

    // Check if report already exists
    const existingReport = await db.report.findFirst({
      where: {
        reporterId,
        reportedId,
        status: 'PENDING'
      }
    })

    if (existingReport) {
      return NextResponse.json(
        { error: 'You have already reported this user' },
        { status: 400 }
      )
    }

    // Create report
    const report = await db.report.create({
      data: {
        reporterId,
        reportedId,
        reason,
        description
      },
      include: {
        reporter: {
          select: {
            id: true,
            name: true
          }
        },
        reported: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Auto-ban user if multiple reports
    const reportCount = await db.report.count({
      where: {
        reportedId,
        status: 'PENDING'
      }
    })

    if (reportCount >= 3) {
      await db.user.update({
        where: { id: reportedId },
        data: { isBanned: true }
      })

      await db.report.updateMany({
        where: {
          reportedId,
          status: 'PENDING'
        },
        data: {
          status: 'RESOLVED'
        }
      })
    }

    return NextResponse.json({
      message: 'Report submitted successfully',
      report
    })
  } catch (error) {
    console.error('Submit report error:', error)
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED' | null

    const whereClause: any = {}
    if (status) {
      whereClause.status = status
    }

    const reports = await db.report.findMany({
      where: whereClause,
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
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ reports })
  } catch (error) {
    console.error('Get reports error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}