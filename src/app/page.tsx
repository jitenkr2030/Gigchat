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
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                {" "}GigChat Demo
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Experience the platform with demo accounts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <Card className="mt-8 border-2 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800">Demo Credentials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"></div>
              <span className="text-xl font-bold">GigChat Demo</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                {onlineCreators} Online
              </Badge>
              <Badge variant="outline">
                <Wallet className="w-4 h-4 mr-1" />
                ${currentDemoUser.balance || 0}
              </Badge>
              <Button variant="outline" size="sm" onClick={simulateLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">
                Welcome, {currentDemoUser.name}!
              </h1>
              <p className="text-gray-600">
                {currentDemoUser.role === 'CUSTOMER' ? 'Browse creators and start conversations' : 'Manage your creator profile and earnings'}
              </p>
            </div>
            <Badge variant={currentDemoUser.role === 'CREATOR' ? 'default' : 'secondary'}>
              {currentDemoUser.role}
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-5' : 'grid-cols-4'}`}>
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="chat" disabled={!selectedCreator}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="wallet">
              <Wallet className="w-4 h-4 mr-2" />
              Wallet
            </TabsTrigger>
            {currentDemoUser.role === 'CREATOR' && (
              <TabsTrigger value="earnings">
                <TrendingUp className="w-4 h-4 mr-2" />
                Earnings
              </TabsTrigger>
            )}
            {isAdmin && (
              <TabsTrigger value="admin">
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Creators</CardTitle>
                <CardDescription>Connect with creators instantly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {creators.map((creator) => (
                  <div key={creator.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.id}`} />
                        <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{creator.name}</h3>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <div className="w-2 h-2 bg-green-600 rounded-full mr-1"></div>
                            Online
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">Fluent in English, Hindi</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm ml-1">{creator.rating}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold">${creator.pricePerMinute}/min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => startChat(creator)}>
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Chat
                      </Button>
                      <Button size="sm" variant="outline" onClick={startVoiceCall} disabled={inCall}>
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline">
                        <Video className="w-4 h-4 mr-1" />
                        Video
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            {selectedCreator && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedCreator.id}`} />
                        <AvatarFallback>{selectedCreator.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{selectedCreator.name}</h3>
                        <p className="text-sm text-gray-600">
                          {isTyping ? 'Typing...' : 'Online'}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={startVoiceCall} disabled={inCall}>
                        <Phone className="w-4 h-4 mr-1" />
                        Voice Call
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Call UI */}
                  {inCall && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="font-medium">Call with {selectedCreator.name}</span>
                          <span className="text-sm text-gray-600">{formatDuration(callDuration)}</span>
                          <span className="text-sm text-red-600">Cost: ${callCost.toFixed(2)}</span>
                        </div>
                        <Button size="sm" variant="destructive" onClick={endCall}>
                          <PhoneOff className="w-4 h-4 mr-1" />
                          End Call
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Messages */}
                  <ScrollArea className="h-96 mb-4 border rounded-lg p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === currentDemoUser.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderId === currentDemoUser.id
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p>{message.content}</p>
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
                    />
                    <Button onClick={sendChatMessage} disabled={inCall}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-4">
                    ${currentDemoUser.balance || 0}
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full mb-2">Add $10</Button>
                    <Button variant="outline" className="w-full mb-2">Add $25</Button>
                    <Button variant="outline" className="w-full">Add $50</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
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
          </TabsContent>

          {currentDemoUser.role === 'CREATOR' && (
            <TabsContent value="earnings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Earned</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      ${currentDemoUser.balance || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Today's Earnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      $45.50
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ranking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                      #12
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Earnings This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Earnings chart would go here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="admin" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">1,247</div>
                    <p className="text-sm text-gray-600">+12% this month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Active Creators</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">342</div>
                    <p className="text-sm text-gray-600">89 online now</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">$24,580</div>
                    <p className="text-sm text-gray-600">+8% this week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pending Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">7</div>
                    <p className="text-sm text-gray-600">Need review</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage platform users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'CUSTOMER', status: 'Active' },
                        { id: 2, name: 'Sarah Miller', email: 'sarah@example.com', role: 'CREATOR', status: 'Active' },
                        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'CUSTOMER', status: 'Banned' },
                        { id: 4, name: 'Emma Wilson', email: 'emma@example.com', role: 'CREATOR', status: 'Active' }
                      ].map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <Badge variant={user.role === 'CREATOR' ? 'default' : 'secondary'} className="mt-1">
                              {user.role}
                            </Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>
                              {user.status}
                            </Badge>
                            {user.status === 'Active' ? (
                              <Button size="sm" variant="destructive">
                                <UserX className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline">
                                <UserCheck className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Reports</CardTitle>
                    <CardDescription>User safety reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { id: 1, reporter: 'Alice', reported: 'Bob', reason: 'Inappropriate content', status: 'Pending' },
                        { id: 2, reporter: 'Charlie', reported: 'David', reason: 'Spam', status: 'Resolved' },
                        { id: 3, reporter: 'Eve', reported: 'Frank', reason: 'Harassment', status: 'Pending' }
                      ].map((report) => (
                        <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{report.reason}</p>
                            <p className="text-sm text-gray-600">
                              {report.reporter} reported {report.reported}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Badge variant={report.status === 'Pending' ? 'destructive' : 'default'}>
                              {report.status}
                            </Badge>
                            {report.status === 'Pending' && (
                              <div className="flex space-x-1">
                                <Button size="sm" variant="outline">Review</Button>
                                <Button size="sm" variant="destructive">Ban</Button>
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
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                  <CardDescription>Usage and performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Analytics charts would go here</p>
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