import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email, mobile, type = 'email' } = await request.json()

    if (!email && !mobile) {
      return NextResponse.json(
        { error: 'Email or mobile number is required' },
        { status: 400 }
      )
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Check if user exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          email ? { email } : {},
          mobile ? { mobile } : {}
        ].filter(condition => Object.keys(condition).length > 0)
      }
    })

    if (existingUser) {
      // Update existing user with new OTP
      await db.user.update({
        where: { id: existingUser.id },
        data: {
          otp,
          otpExpires,
          isVerified: false
        }
      })
    } else {
      // Create new user
      const identifier = email || mobile
      await db.user.create({
        data: {
          email: email || null,
          mobile: mobile || null,
          otp,
          otpExpires,
          isVerified: false
        }
      })
    }

    // In production, send OTP via email/SMS service
    console.log(`OTP for ${email || mobile}: ${otp}`)

    return NextResponse.json({
      message: 'OTP sent successfully',
      identifier: email || mobile,
      // In development, return OTP for testing
      ...(process.env.NODE_ENV === 'development' && { otp })
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}