import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const wallet = await db.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ wallet })
  } catch (error) {
    console.error('Get wallet error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wallet' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, amount, type } = await request.json()

    if (!userId || !amount || !type) {
      return NextResponse.json(
        { error: 'User ID, amount, and type are required' },
        { status: 400 }
      )
    }

    if (type === 'ADD_MONEY' && amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be positive for adding money' },
        { status: 400 }
      )
    }

    // Get or create wallet
    let wallet = await db.wallet.findUnique({
      where: { userId }
    })

    if (!wallet) {
      wallet = await db.wallet.create({
        data: {
          userId,
          balance: 0,
          totalEarned: 0,
          totalSpent: 0
        }
      })
    }

    // Process transaction
    let newBalance = wallet.balance
    let totalEarned = wallet.totalEarned
    let totalSpent = wallet.totalSpent

    switch (type) {
      case 'ADD_MONEY':
        newBalance += amount
        break
      case 'CALL_CHARGE':
        if (wallet.balance < amount) {
          return NextResponse.json(
            { error: 'Insufficient balance' },
            { status: 400 }
          )
        }
        newBalance -= amount
        totalSpent += amount
        break
      case 'CHAT_EARNING':
        newBalance += amount
        totalEarned += amount
        break
      case 'REFUND':
        newBalance += amount
        totalSpent = Math.max(0, totalSpent - amount)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid transaction type' },
          { status: 400 }
        )
    }

    // Update wallet
    const updatedWallet = await db.wallet.update({
      where: { userId },
      data: {
        balance: newBalance,
        totalEarned,
        totalSpent
      }
    })

    // Create transaction record
    const transaction = await db.transaction.create({
      data: {
        userId,
        amount,
        type,
        description: getTransactionDescription(type, amount)
      }
    })

    return NextResponse.json({
      message: 'Transaction successful',
      wallet: updatedWallet,
      transaction
    })
  } catch (error) {
    console.error('Wallet transaction error:', error)
    return NextResponse.json(
      { error: 'Failed to process transaction' },
      { status: 500 }
    )
  }
}

function getTransactionDescription(type: string, amount: number): string {
  switch (type) {
    case 'ADD_MONEY':
      return `Added $${amount.toFixed(2)} to wallet`
    case 'CALL_CHARGE':
      return `Call charge: $${amount.toFixed(2)}`
    case 'CHAT_EARNING':
      return `Chat earning: $${amount.toFixed(2)}`
    case 'REFUND':
      return `Refund: $${amount.toFixed(2)}`
    default:
      return 'Transaction'
  }
}