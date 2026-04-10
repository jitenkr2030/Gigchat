'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Phone, MessageCircle, Video, Star, Users, Shield, Clock, DollarSign } from 'lucide-react'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<'CUSTOMER' | 'CREATOR' | null>(null)
  const [onlineCreators, setOnlineCreators] = useState(12)

  useEffect(() => {
    // Simulate online creators count
    const interval = setInterval(() => {
      setOnlineCreators(prev => prev + Math.floor(Math.random() * 3) - 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"></div>
                <span className="text-xl font-bold">GigChat</span>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  {onlineCreators} Creators Online
                </Badge>
                <Button variant="outline">Profile</Button>
                <Button>Wallet</Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Creators List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Available Creators</span>
                    <Badge variant="secondary">{onlineCreators} Online</Badge>
                  </CardTitle>
                  <CardDescription>Connect with creators instantly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} />
                          <AvatarFallback>U{i}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">Creator {i}</h3>
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <div className="w-2 h-2 bg-green-600 rounded-full mr-1"></div>
                              Online
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">Fluent in English, Hindi</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm ml-1">4.{8 - i}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-semibold">${2 + i * 0.5}/min</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Chat
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4 mr-1" />
                          Call
                        </Button>
                        <Button size="sm">
                          <Video className="w-4 h-4 mr-1" />
                          Video
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Wallet Balance</span>
                    <span className="font-semibold text-green-600">$25.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Today's Spent</span>
                    <span className="font-semibold">$12.50</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Chats</span>
                    <span className="font-semibold">23</span>
                  </div>
                  <Button className="w-full">Add Money</Button>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Why GigChat?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">Safe & Secure</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    <span className="text-sm">24/7 Available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="text-sm">Verified Creators</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm">Fair Pricing</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"></div>
              <span className="text-xl font-bold">GigChat</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                {onlineCreators} Creators Online
              </Badge>
              <Button variant="outline">Sign In</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Connect & Earn with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              {" "}Real Conversations
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Paid chat, audio & video calls. Join thousands earning money by talking.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
              Start Talking Now
            </Button>
            <Button size="lg" variant="outline">
              Become a Creator
            </Button>
          </div>
        </div>

        {/* Auth Section */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Join GigChat in seconds</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-mobile">Email or Mobile</Label>
                  <Input id="email-mobile" placeholder="Enter email or mobile number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP Code</Label>
                  <Input id="otp" placeholder="Enter 6-digit code" />
                </div>
                <Button className="w-full">Send OTP</Button>
                <Button className="w-full" variant="outline">
                  Login with OTP
                </Button>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email-mobile">Email or Mobile</Label>
                  <Input id="signup-email-mobile" placeholder="Enter email or mobile number" />
                </div>
                <div className="space-y-2">
                  <Label>I want to</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Talk to Creators
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Earn Money
                    </Button>
                  </div>
                </div>
                <Button className="w-full">Create Account</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Real-time Chat</CardTitle>
              <CardDescription>
                Instant messaging with creators worldwide. Pay per message or per minute.
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
                Crystal clear audio calls. Automatic per-minute billing with transparent pricing.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Video Calls</CardTitle>
              <CardDescription>
                Face-to-face conversations. HD video quality with secure connections.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <div className="flex justify-center space-x-8 mb-8">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">100% Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Verified Creators</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Join 50,000+ users already earning and connecting on GigChat
          </p>
        </div>
      </main>
    </div>
  )
}