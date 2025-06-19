"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Download,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
  MapPin,
  Clock,
  Calendar,
  Bus,
  Phone,
  Mail,
  Settings,
  Loader2,
  AlertCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CMSPanel } from "./cms-panel"
import { useChurchData } from "@/hooks/use-church-data"
import { useAuth } from "@/contexts/auth-context"
import { AuthLoginPanel } from "./auth-login-panel"

// Fallback data in case Supabase is not available
const fallbackData = {
  hero: {
    type: "image",
    src: "/placeholder.svg?height=400&width=1200",
    alt: "Revival Saturdays Banner",
  },
  eventDetails: {
    title: "Revival Saturdays",
    subtitle: "Join us for powerful worship and spiritual renewal",
    date: "Every Saturday",
    time: "6:00 PM - 8:00 PM",
    venue: "Christ Temple East Main Auditorium",
    description: "Experience the power of God in our weekly revival services. Come as you are and be transformed!",
  },
  busSchedule: {
    generalNotes: "All buses depart 30 minutes after service ends. Please arrive 15 minutes before boarding time.",
    areas: [
      {
        id: "1",
        name: "Adenta Area",
        terminals: [
          { id: "1", name: "Adenta Barrier", buses: 2, boardingTime: "4:30 PM", departureTime: "5:00 PM" },
          { id: "2", name: "Frafraha Junction", buses: 1, boardingTime: "4:45 PM", departureTime: "5:15 PM" },
        ],
      },
    ],
  },
  footer: {
    churchName: "Christ Temple East",
    location: "Accra, Ghana",
    address: "123 Liberation Road, East Legon, Accra",
    phone: "+233 24 123 4567",
    email: "info@christtempleeast.org",
    links: [
      { name: "About Us", url: "/about" },
      { name: "Events", url: "/events" },
      { name: "Contact", url: "/contact" },
      { name: "FAQs", url: "/faqs" },
    ],
  },
}

export default function BusingSchedulePage() {
  const { data, loading, error, updateData } = useChurchData()
  const [searchTerm, setSearchTerm] = useState("")
  const [showCMS, setShowCMS] = useState(false)
  const [shareMenuOpen, setShareMenuOpen] = useState(false)
  const { user, loading: authLoading, signOut } = useAuth()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Use fallback data if Supabase data is not available
  const currentData = data || fallbackData

  // Update the useEffect to use Supabase auth
  useEffect(() => {
    setIsAuthenticated(!!user)
  }, [user])

  // Filter terminals based on search
  const filteredAreas =
    currentData.busSchedule?.areas
      ?.map((area: any) => ({
        ...area,
        terminals: area.terminals.filter(
          (terminal: any) =>
            terminal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            area.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      }))
      .filter((area: any) => area.terminals.length > 0) || []

  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = `Join us for ${currentData.eventDetails.title} - ${currentData.eventDetails.date} at ${currentData.eventDetails.time}`

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      instagram: url,
    }

    if (platform === "instagram") {
      navigator.clipboard.writeText(url)
      alert("Link copied to clipboard! You can now paste it in Instagram.")
    } else {
      window.open(shareUrls[platform as keyof typeof shareUrls], "_blank")
    }
    setShareMenuOpen(false)
  }

  const downloadPDF = () => {
    alert("PDF download functionality would be implemented here")
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Loading church content...</p>
        </div>
      </div>
    )
  }

  if (showCMS) {
    if (!isAuthenticated) {
      return <AuthLoginPanel onClose={() => setShowCMS(false)} />
    }
    return (
      <CMSPanel
        data={currentData}
        updateData={updateData}
        onClose={() => setShowCMS(false)}
        onLogout={async () => {
          await signOut()
          setShowCMS(false)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mx-4 mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error} - Using cached data. Some features may be limited.</AlertDescription>
        </Alert>
      )}

      {/* Admin Button */}
      <Button
        onClick={() => setShowCMS(true)}
        className="fixed top-4 right-4 z-50 bg-green-600 hover:bg-green-700"
        size="sm"
      >
        <Settings className="h-4 w-4 mr-2" />
        Admin
      </Button>

      {/* Hero Section */}
      <section className="relative w-full h-[400px] overflow-hidden">
        {currentData.hero.type === "image" ? (
          <Image
            src={currentData.hero.src || "/placeholder.svg"}
            alt={currentData.hero.alt}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <video src={currentData.hero.src} autoPlay loop muted className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{currentData.eventDetails.title}</h1>
            <p className="text-xl md:text-2xl">{currentData.eventDetails.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="py-8 bg-green-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold">{currentData.eventDetails.date}</p>
                    <p className="text-sm text-gray-600">Date</p>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold">{currentData.eventDetails.time}</p>
                    <p className="text-sm text-gray-600">Time</p>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold">{currentData.eventDetails.venue}</p>
                    <p className="text-sm text-gray-600">Venue</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-gray-700">{currentData.eventDetails.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Busing Schedule Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Bus Schedule</h2>
              <p className="text-gray-600 mb-6">{currentData.busSchedule.generalNotes}</p>

              {/* Search and Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search terminals or areas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button onClick={downloadPDF} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>

            {/* Schedule Accordion */}
            <Accordion type="multiple" className="space-y-4">
              {filteredAreas.map((area: any) => (
                <AccordionItem key={area.id} value={area.id} className="border rounded-lg">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center space-x-3">
                      <Bus className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-lg">{area.name}</span>
                      <Badge variant="secondary">
                        {area.terminals.reduce((sum: number, terminal: any) => sum + terminal.buses, 0)} buses
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="grid gap-4">
                      {area.terminals.map((terminal: any) => (
                        <Card key={terminal.id} className="border-l-4 border-l-green-600">
                          <CardContent className="p-4">
                            <div className="grid sm:grid-cols-4 gap-4 items-center">
                              <div>
                                <h4 className="font-semibold">{terminal.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {terminal.buses} bus{terminal.buses > 1 ? "es" : ""}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="font-medium">Boarding</p>
                                <p className="text-green-600">{terminal.boardingTime}</p>
                              </div>
                              <div className="text-center">
                                <p className="font-medium">Departure</p>
                                <p className="text-green-600">{terminal.departureTime}</p>
                              </div>
                              <div className="flex justify-center">
                                <Badge variant="outline" className="bg-green-50">
                                  {terminal.buses} Bus{terminal.buses > 1 ? "es" : ""}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredAreas.length === 0 && searchTerm && (
              <div className="text-center py-8">
                <p className="text-gray-500">No terminals found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Social Share Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="relative">
          {shareMenuOpen && (
            <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border p-2 space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare("whatsapp")}
                className="w-full justify-start text-green-600 hover:bg-green-50"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare("facebook")}
                className="w-full justify-start text-blue-600 hover:bg-blue-50"
              >
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare("twitter")}
                className="w-full justify-start text-sky-600 hover:bg-sky-50"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare("instagram")}
                className="w-full justify-start text-pink-600 hover:bg-pink-50"
              >
                <Instagram className="h-4 w-4 mr-2" />
                Instagram
              </Button>
            </div>
          )}
          <Button
            onClick={() => setShareMenuOpen(!shareMenuOpen)}
            className="rounded-full h-12 w-12 bg-green-600 hover:bg-green-700 shadow-lg"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">{currentData.footer.churchName}</h3>
                <p className="text-gray-300 mb-2">{currentData.footer.location}</p>
                <p className="text-gray-300 text-sm">{currentData.footer.address}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact Us</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span className="text-gray-300">{currentData.footer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-gray-300">{currentData.footer.email}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <div className="space-y-2">
                  {currentData.footer.links.map((link: any, index: number) => (
                    <Link
                      key={index}
                      href={link.url}
                      className="block text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center">
              <p className="text-gray-400">
                © {new Date().getFullYear()} {currentData.footer.churchName}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
