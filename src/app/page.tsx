'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Phone, MessageCircle, Video, Star, Users, Shield, Clock, 
  DollarSign, Send, PhoneOff, VideoOff, Mic, MicOff, 
  UserCheck, UserX, Flag, LogOut, Wallet, TrendingUp,
  MessageSquare, PhoneCall
} from 'lucide-react'

// Demo accounts
const DEMO_ACCOUNTS = {
  customer: {
    id: 'customer_1',
    email: 'customer@demo.com',
    name: 'John Doe',
    role: 'CUSTOMER',
    balance: 100
  },
  creator1: {
    id: 'creator_1',
    email: 'creator1@demo.com',
    name: 'Sarah Miller',
    role: 'CREATOR',
    pricePerMinute: 2.5,
    balance: 250,
    rating: 4.8
  },
  creator2: {
    id: 'creator_2',
    email: 'creator2@demo.com',
    name: 'Emma Wilson',
    role: 'CREATOR',
    pricePerMinute: 3.0,
    balance: 180,
    rating: 4.9
  },
  creator3: {
    id: 'creator_3',
    email: 'creator3@demo.com',
    name: 'Lisa Chen',
    role: 'CREATOR',
    pricePerMinute: 2.0,
    balance: 320,
    rating: 4.7
  },
  admin: {
    id: 'admin_1',
    email: 'admin@demo.com',
    name: 'Admin User',
    role: 'ADMIN',
    balance: 0
  }
}

export default function Home() {
  const [currentDemoUser, setCurrentDemoUser] = useState<any>(null)
  const [selectedCreator, setSelectedCreator] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState('browse')
  const [onlineCreators, setOnlineCreators] = useState(3)
  const [inCall, setInCall] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [callCost, setCallCost] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const callIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const simulateLogin = (account: keyof typeof DEMO_ACCOUNTS) => {
    setCurrentDemoUser(DEMO_ACCOUNTS[account])
    setActiveTab('browse')
  }

  const simulateLogout = () => {
    setCurrentDemoUser(null)
    setSelectedCreator(null)
    setMessages([])
    setInCall(false)
    if (callIntervalRef.current) {
      clearInterval(callIntervalRef.current)
    }
  }

  const startChat = (creator: any) => {
    setSelectedCreator(creator)
    setActiveTab('chat')
    // Simulate some initial messages
    setMessages([
      {
        id: '1',
        content: `Hi! I'm ${creator.name}. How can I help you today?`,
        senderId: creator.id,
        sender: { name: creator.name, avatar: null },
        createdAt: new Date().toISOString()
      }
    ])
  }

  const sendChatMessage = () => {
    if (!newMessage.trim() || !currentDemoUser || !selectedCreator) return

    const message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: currentDemoUser.id,
      receiverId: selectedCreator.id,
      sender: { name: currentDemoUser.name, avatar: null },
      createdAt: new Date().toISOString()
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Simulate creator response
    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        const responses = [
          "That's interesting! Tell me more.",
          "I understand how you feel.",
          "What would you like to talk about?",
          "I'm here to listen. Please continue.",
          "That sounds great! Can you elaborate?"
        ]
        const response = {
          id: (Date.now() + 1).toString(),
          content: responses[Math.floor(Math.random() * responses.length)],
          senderId: selectedCreator.id,
          receiverId: currentDemoUser.id,
          sender: { name: selectedCreator.name, avatar: null },
          createdAt: new Date().toISOString()
        }
        setMessages(prev => [...prev, response])
        setIsTyping(false)
      }, 1500)
    }, 500)
  }

  const startVoiceCall = () => {
    if (!selectedCreator || !currentDemoUser) return
    
    setInCall(true)
    setCallDuration(0)
    setCallCost(0)
    
    // Simulate call billing
    callIntervalRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1)
      setCallCost(prev => prev + (selectedCreator.pricePerMinute / 60))
    }, 1000)
  }

  const endCall = () => {
    setInCall(false)
    if (callIntervalRef.current) {
      clearInterval(callIntervalRef.current)
    }
    setCallDuration(0)
    setCallCost(0)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!currentDemoUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"></div>
                <span className="text-xl font-bold">GigChat Demo</span>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                {onlineCreators} Creators Online
              </Badge>
            </div>
          </div>
        </header>

        {/* Demo Login */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Welcome to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                {" "}GigChat Demo
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 px-4">
              Experience the platform with demo accounts
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Customer Demo */}
            <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span>Customer Account</span>
                </CardTitle>
                <CardDescription>
                  Experience the platform as a paying customer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">Email: customer@demo.com</p>
                  <p className="text-sm font-medium">Balance: $100.00</p>
                  <p className="text-sm text-gray-600">Ready to chat and call</p>
                </div>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => simulateLogin('customer')}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Login as Customer
                </Button>
              </CardContent>
            </Card>

            {/* Creator Demo */}
            <Card className="border-2 border-pink-200 hover:border-pink-400 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-pink-600" />
                  <span>Creator Account</span>
                </CardTitle>
                <CardDescription>
                  Experience earning money as a creator
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {['creator1', 'creator2', 'creator3'].map((creator, index) => (
                    <div key={creator} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium">
                        {DEMO_ACCOUNTS[creator as keyof typeof DEMO_ACCOUNTS].name}
                      </p>
                      <p className="text-sm text-gray-600">
                        ${DEMO_ACCOUNTS[creator as keyof typeof DEMO_ACCOUNTS].pricePerMinute}/min • 
                        Rating: {DEMO_ACCOUNTS[creator as keyof typeof DEMO_ACCOUNTS].rating}
                      </p>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  onClick={() => simulateLogin('creator1')}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Login as Creator
                </Button>
              </CardContent>
            </Card>

            {/* Admin Demo */}
            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>Admin Account</span>
                </CardTitle>
                <CardDescription>
                  Manage platform and users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">Email: admin@demo.com</p>
                  <p className="text-sm font-medium">Role: Administrator</p>
                  <p className="text-sm text-gray-600">Full platform access</p>
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => simulateLogin('admin')}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Login as Admin
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Real-time Chat</CardTitle>
                <CardDescription>
                  Instant messaging with content filtering
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-pink-600" />
                </div>
                <CardTitle>Voice Calls</CardTitle>
                <CardDescription>
                  Per-minute billing with automatic payment
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Safety Features</CardTitle>
                <CardDescription>
                  Content filtering, block & report system
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Demo Credentials */}
          <Card className="mt-6 sm:mt-8 border-2 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800 text-lg sm:text-xl">Demo Credentials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
                <div>
                  <p className="font-medium text-yellow-800">Customer Login:</p>
                  <p className="text-yellow-700">Email: customer@demo.com</p>
                  <p className="text-yellow-700">Password: demo123</p>
                  <p className="text-yellow-700">Balance: $100</p>
                </div>
                <div>
                  <p className="font-medium text-yellow-800">Creator Login:</p>
                  <p className="text-yellow-700">Email: creator@demo.com</p>
                  <p className="text-yellow-700">Password: demo123</p>
                  <p className="text-yellow-700">Rate: $2.50/min</p>
                </div>
                <div>
                  <p className="font-medium text-yellow-800">Admin Login:</p>
                  <p className="text-yellow-700">Email: admin@demo.com</p>
                  <p className="text-yellow-700">Password: admin123</p>
                  <p className="text-yellow-700">Full Access</p>
                </div>
              </div>
              <p className="text-xs text-yellow-600 mt-4">
                This is a demo environment. All transactions and features are simulated for testing purposes.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const creators = [DEMO_ACCOUNTS.creator1, DEMO_ACCOUNTS.creator2, DEMO_ACCOUNTS.creator3]

  // Demo admin user
  const isAdmin = currentDemoUser?.email === 'admin@demo.com'

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"></div>
              <span className="text-lg sm:text-xl font-bold hidden sm:block">GigChat Demo</span>
              <span className="text-lg sm:text-xl font-bold sm:hidden">GC</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-600 text-xs sm:text-sm">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-1 sm:mr-2"></div>
                <span className="hidden sm:inline">{onlineCreators} Online</span>
                <span className="sm:hidden">{onlineCreators}</span>
              </Badge>
              <Badge variant="outline" className="text-xs sm:text-sm">
                <Wallet className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">${currentDemoUser.balance || 0}</span>
                <span className="sm:hidden">${currentDemoUser.balance || 0}</span>
              </Badge>
              <Button variant="outline" size="sm" onClick={simulateLogout} className="h-8 px-2 sm:h-9 sm:px-3">
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                Welcome, {currentDemoUser.name}!
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                {currentDemoUser.role === 'CUSTOMER' ? 'Browse creators and start conversations' : 'Manage your creator profile and earnings'}
              </p>
            </div>
            <Badge variant={currentDemoUser.role === 'CREATOR' ? 'default' : 'secondary'} className="w-fit">
              {currentDemoUser.role}
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-5' : currentDemoUser.role === 'CREATOR' ? 'grid-cols-4' : 'grid-cols-3'} h-auto py-2 px-1 sm:px-2`}>
            {currentDemoUser.role === 'CUSTOMER' && (
              <>
                <TabsTrigger value="browse" className="text-xs sm:text-sm py-2 px-1 sm:px-3">Browse</TabsTrigger>
                <TabsTrigger value="chat" disabled={!selectedCreator} className="text-xs sm:text-sm py-2 px-1 sm:px-3">
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Chat</span>
                </TabsTrigger>
                <TabsTrigger value="wallet" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
                  <Wallet className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Wallet</span>
                </TabsTrigger>
              </>
            )}
            {currentDemoUser.role === 'CREATOR' && (
              <>
                <TabsTrigger value="browse" className="text-xs sm:text-sm py-2 px-1 sm:px-3">Profile</TabsTrigger>
                <TabsTrigger value="chat" disabled={!selectedCreator} className="text-xs sm:text-sm py-2 px-1 sm:px-3">
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Chat</span>
                </TabsTrigger>
                <TabsTrigger value="wallet" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
                  <Wallet className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Wallet</span>
                </TabsTrigger>
                <TabsTrigger value="earnings" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Earnings</span>
                </TabsTrigger>
              </>
            )}
            {isAdmin && (
              <>
                <TabsTrigger value="browse" className="text-xs sm:text-sm py-2 px-1 sm:px-3">Overview</TabsTrigger>
                <TabsTrigger value="chat" disabled={!selectedCreator} className="text-xs sm:text-sm py-2 px-1 sm:px-3">
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Chat</span>
                </TabsTrigger>
                <TabsTrigger value="wallet" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
                  <Wallet className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Wallet</span>
                </TabsTrigger>
                <TabsTrigger value="earnings" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="admin" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Admin</span>
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="browse" className="space-y-4 sm:space-y-6">
            {currentDemoUser.role === 'CUSTOMER' ? (
              // Customer View - Browse Creators
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">Available Creators</CardTitle>
                  <CardDescription className="text-sm sm:text-base">Connect with creators instantly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  {creators.map((creator) => (
                    <div key={creator.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.id}`} />
                          <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-sm sm:text-base truncate">{creator.name}</h3>
                            <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                              <div className="w-2 h-2 bg-green-600 rounded-full mr-1"></div>
                              Online
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600">Fluent in English, Hindi</p>
                          <div className="flex items-center space-x-3 sm:space-x-4 mt-1">
                            <div className="flex items-center">
                              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                              <span className="text-xs sm:text-sm ml-1">{creator.rating}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                              <span className="text-xs sm:text-sm font-semibold">${creator.pricePerMinute}/min</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button size="sm" variant="outline" onClick={() => startChat(creator)} className="w-full sm:w-auto">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Chat</span>
                        </Button>
                        <Button size="sm" variant="outline" onClick={startVoiceCall} disabled={inCall} className="w-full sm:w-auto">
                          <Phone className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Call</span>
                        </Button>
                        <Button size="sm" variant="outline" className="w-full sm:w-auto">
                          <Video className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Video</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : currentDemoUser.role === 'CREATOR' ? (
              // Creator View - My Profile & Stats
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">My Creator Profile</CardTitle>
                    <CardDescription className="text-sm sm:text-base">Manage your creator profile and availability</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                      <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentDemoUser.id}`} />
                        <AvatarFallback className="text-lg sm:text-xl">{currentDemoUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl sm:text-2xl font-bold">{currentDemoUser.name}</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-2">Professional Creator</p>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-current" />
                            <span className="ml-1 text-sm sm:text-base font-semibold">{currentDemoUser.rating || 4.8}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                            <span className="ml-1 text-sm sm:text-base font-semibold">${currentDemoUser.pricePerMinute || 2.5}/min</span>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                            Available
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Languages</Label>
                        <p className="text-sm text-gray-600 mt-1">English, Hindi, Spanish</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Specialties</Label>
                        <p className="text-sm text-gray-600 mt-1">Life Coaching, Business, Technology</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Response Time</Label>
                        <p className="text-sm text-gray-600 mt-1">Usually within 1 minute</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Availability</Label>
                        <p className="text-sm text-gray-600 mt-1">Mon-Fri: 9AM-8PM</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <Button className="w-full sm:w-auto">
                        <UserCheck className="w-4 h-4 mr-2" />
                        Set Status: Available
                      </Button>
                      <Button variant="outline" className="w-full sm:w-auto">
                        Edit Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">Today's Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-green-600">$45.50</div>
                      <p className="text-sm text-gray-600">Earned Today</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Chats</span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Calls</span>
                        <span className="font-medium">3</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Minutes</span>
                        <span className="font-medium">47</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Avg Rating</span>
                        <span className="font-medium">4.9</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Admin View - Platform Overview
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">1,247</div>
                    <p className="text-xs sm:text-sm text-gray-600">+12% this month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">Active Creators</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-green-600">342</div>
                    <p className="text-xs sm:text-sm text-gray-600">89 online now</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-purple-600">$24,580</div>
                    <p className="text-xs sm:text-sm text-gray-600">+8% this week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">Pending Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-red-600">7</div>
                    <p className="text-xs sm:text-sm text-gray-600">Need review</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="chat" className="space-y-4 sm:space-y-6">
            {selectedCreator && (
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedCreator.id}`} />
                        <AvatarFallback>{selectedCreator.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base">{selectedCreator.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {isTyping ? 'Typing...' : 'Online'}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={startVoiceCall} disabled={inCall} className="flex-1 sm:flex-none">
                        <Phone className="w-4 h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Voice Call</span>
                        <span className="sm:hidden">Call</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Call UI */}
                  {inCall && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="font-medium text-sm sm:text-base">Call with {selectedCreator.name}</span>
                          <span className="text-xs sm:text-sm text-gray-600">{formatDuration(callDuration)}</span>
                          <span className="text-xs sm:text-sm text-red-600">Cost: ${callCost.toFixed(2)}</span>
                        </div>
                        <Button size="sm" variant="destructive" onClick={endCall} className="w-full sm:w-auto">
                          <PhoneOff className="w-4 h-4 mr-1 sm:mr-2" />
                          End Call
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Messages */}
                  <ScrollArea className="h-64 sm:h-96 mb-4 border rounded-lg p-3 sm:p-4">
                    <div className="space-y-3 sm:space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === currentDemoUser.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg ${
                              message.senderId === currentDemoUser.id
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm sm:text-base">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderId === currentDemoUser.id ? 'text-purple-200' : 'text-gray-500'
                            }`}>
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                      disabled={inCall}
                      className="flex-1"
                    />
                    <Button onClick={sendChatMessage} disabled={inCall} size="sm" className="px-3">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="wallet" className="space-y-4 sm:space-y-6">
            {currentDemoUser.role === 'CUSTOMER' ? (
              // Customer Wallet View
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">Wallet Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-4">
                      ${currentDemoUser.balance || 0}
                    </div>
                    <div className="space-y-2">
                      <Button className="w-full mb-2 text-sm sm:text-base">Add $10</Button>
                      <Button variant="outline" className="w-full mb-2 text-sm sm:text-base">Add $25</Button>
                      <Button variant="outline" className="w-full text-sm sm:text-base">Add $50</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Chat with Sarah</span>
                        <span className="text-red-600">-$2.50</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Call with Emma</span>
                        <span className="text-red-600">-$6.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Added Money</span>
                        <span className="text-green-600">+$25.00</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : currentDemoUser.role === 'CREATOR' ? (
              // Creator Wallet View - Earnings & Payouts
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">Available Balance</CardTitle>
                    <CardDescription className="text-sm sm:text-base">Ready for withdrawal</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-4">
                      ${currentDemoUser.balance || 0}
                    </div>
                    <div className="space-y-2">
                      <Button className="w-full mb-2 text-sm sm:text-base">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Withdraw to Bank
                      </Button>
                      <Button variant="outline" className="w-full text-sm sm:text-base">
                        View Payout History
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">Earnings Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Today's Earnings</span>
                        <span className="text-green-600 font-medium">+$45.50</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">This Week</span>
                        <span className="text-green-600 font-medium">+$312.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">This Month</span>
                        <span className="text-green-600 font-medium">+$1,247.80</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Platform Fee (30%)</span>
                        <span className="text-red-600 font-medium">-$374.34</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold pt-2 border-t">
                        <span>Net Earnings</span>
                        <span className="text-green-600">+$873.46</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Admin Wallet View - Platform Revenue
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">Platform Revenue</CardTitle>
                    <CardDescription className="text-sm sm:text-base">Total platform earnings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-4">
                      $24,580
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">From Chat (30%)</span>
                        <span className="text-green-600">+$8,524</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">From Calls (30%)</span>
                        <span className="text-green-600">+$12,345</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">From Video (30%)</span>
                        <span className="text-green-600">+$3,711</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">Payout Status</CardTitle>
                    <CardDescription className="text-sm sm:text-base">Creator payments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Pending Payouts</span>
                        <span className="text-orange-600 font-medium">$8,234</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Processed Today</span>
                        <span className="text-green-600 font-medium">$3,456</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Paid Out</span>
                        <span className="text-blue-600 font-medium">$57,890</span>
                      </div>
                      <Button className="w-full mt-4 text-sm sm:text-base">
                        Process Payouts
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {currentDemoUser.role === 'CREATOR' && (
            <TabsContent value="earnings" className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">Total Earned</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-green-600">
                      ${currentDemoUser.balance || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">Today's Earnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">
                      $45.50
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">Ranking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-purple-600">
                      #12
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">Earnings This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 sm:h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 text-sm sm:text-base">Earnings chart would go here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="admin" className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">1,247</div>
                    <p className="text-xs sm:text-sm text-gray-600">+12% this month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">Active Creators</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-green-600">342</div>
                    <p className="text-xs sm:text-sm text-gray-600">89 online now</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-purple-600">$24,580</div>
                    <p className="text-xs sm:text-sm text-gray-600">+8% this week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">Pending Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-red-600">7</div>
                    <p className="text-xs sm:text-sm text-gray-600">Need review</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">User Management</CardTitle>
                    <CardDescription className="text-sm sm:text-base">Manage platform users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      {[
                        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'CUSTOMER', status: 'Active' },
                        { id: 2, name: 'Sarah Miller', email: 'sarah@example.com', role: 'CREATOR', status: 'Active' },
                        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'CUSTOMER', status: 'Banned' },
                        { id: 4, name: 'Emma Wilson', email: 'emma@example.com', role: 'CREATOR', status: 'Active' }
                      ].map((user) => (
                        <div key={user.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg space-y-2 sm:space-y-0">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm sm:text-base truncate">{user.name}</p>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">{user.email}</p>
                            <Badge variant={user.role === 'CREATOR' ? 'default' : 'secondary'} className="mt-1 text-xs">
                              {user.role}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={user.status === 'Active' ? 'default' : 'destructive'} className="text-xs">
                              {user.status}
                            </Badge>
                            {user.status === 'Active' ? (
                              <Button size="sm" variant="destructive">
                                <UserX className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline">
                                <UserCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-lg sm:text-xl">Recent Reports</CardTitle>
                    <CardDescription className="text-sm sm:text-base">User safety reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      {[
                        { id: 1, reporter: 'Alice', reported: 'Bob', reason: 'Inappropriate content', status: 'Pending' },
                        { id: 2, reporter: 'Charlie', reported: 'David', reason: 'Spam', status: 'Resolved' },
                        { id: 3, reporter: 'Eve', reported: 'Frank', reason: 'Harassment', status: 'Pending' }
                      ].map((report) => (
                        <div key={report.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg space-y-2 sm:space-y-0">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm sm:text-base">{report.reason}</p>
                            <p className="text-xs sm:text-sm text-gray-600">
                              {report.reporter} reported {report.reported}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={report.status === 'Pending' ? 'destructive' : 'default'} className="text-xs">
                              {report.status}
                            </Badge>
                            {report.status === 'Pending' && (
                              <div className="flex space-x-1">
                                <Button size="sm" variant="outline" className="text-xs">Review</Button>
                                <Button size="sm" variant="destructive" className="text-xs">Ban</Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">Platform Analytics</CardTitle>
                  <CardDescription className="text-sm sm:text-base">Usage and performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 sm:h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 text-sm sm:text-base">Analytics charts would go here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  )
}