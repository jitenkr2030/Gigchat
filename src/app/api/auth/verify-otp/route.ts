import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, mobile, otp } = await request.json()

    if (!otp || (!email && !mobile)) {
      return NextResponse.json(
        { error: 'OTP and identifier are required' },
        { status: 400 }
      )
    }

    // Find user by email or mobile
    const user = await db.user.findFirst({
      where: {
        OR: [
          email ? { email } : {},
          mobile ? { mobile } : {}
        ].filter(condition => Object.keys(condition).length > 0)
      },
      include: {
        wallet: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check OTP
    if (user.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      )
    }

    // Check OTP expiration
    if (user.otpExpires && user.otpExpires < new Date()) {
      return NextResponse.json(
        { error: 'OTP expired' },
        { status: 400 }
      )
    }

    // Mark user as verified and clear OTP
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otp: null,
        otpExpires: null,
        lastSeenAt: new Date()
      },
      include: {
        wallet: true
      }
    })

    // Create wallet if it doesn't exist
    if (!updatedUser.wallet) {
      await db.wallet.create({
        data: {
          userId: updatedUser.id
        }
      })
    }

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        name: updatedUser.name,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        isOnline: updatedUser.isOnline
      }
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    )
  }
}