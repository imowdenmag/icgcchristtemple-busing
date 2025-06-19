"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Trash2, Upload, Eye } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"

interface CMSPanelProps {
  data: any
  updateData: (section: string, updates: any) => Promise<{ success: boolean; error?: string }>
  onClose: () => void
  onLogout: () => void
}

export function CMSPanel({ data, updateData, onClose, onLogout }: CMSPanelProps) {
  const [activeTab, setActiveTab] = useState("hero")
  const [editingArea, setEditingArea] = useState<string | null>(null)
  const [editingTerminal, setEditingTerminal] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleUpdateData = async (section: string, updates: any) => {
    setIsSaving(true)
    setSaveStatus({ type: null, message: "" })

    try {
      const result = await updateData(section, updates)
      if (result.success) {
        setSaveStatus({ type: "success", message: "Changes saved successfully!" })
        setTimeout(() => setSaveStatus({ type: null, message: "" }), 3000)
      } else {
        setSaveStatus({ type: "error", message: result.error || "Failed to save changes" })
      }
    } catch (error) {
      setSaveStatus({ type: "error", message: "An error occurred while saving" })
    } finally {
      setIsSaving(false)
    }
  }

  const addArea = () => {
    const newArea = {
      id: Date.now().toString(),
      name: "New Area",
      terminals: [],
    }
    handleUpdateData("busSchedule", {
      ...data.busSchedule,
      areas: [...data.busSchedule.areas, newArea],
    })
  }

  const updateArea = (areaId: string, updates: any) => {
    handleUpdateData("busSchedule", {
      ...data.busSchedule,
      areas: data.busSchedule.areas.map((area: any) => (area.id === areaId ? { ...area, ...updates } : area)),
    })
  }

  const deleteArea = (areaId: string) => {
    handleUpdateData("busSchedule", {
      ...data.busSchedule,
      areas: data.busSchedule.areas.filter((area: any) => area.id !== areaId),
    })
  }

  const addTerminal = (areaId: string) => {
    const newTerminal = {
      id: Date.now().toString(),
      name: "New Terminal",
      buses: 1,
      boardingTime: "4:00 PM",
      departureTime: "4:30 PM",
    }

    handleUpdateData("busSchedule", {
      ...data.busSchedule,
      areas: data.busSchedule.areas.map((area: any) =>
        area.id === areaId ? { ...area, terminals: [...area.terminals, newTerminal] } : area,
      ),
    })
  }

  const updateTerminal = (areaId: string, terminalId: string, updates: any) => {
    handleUpdateData("busSchedule", {
      ...data.busSchedule,
      areas: data.busSchedule.areas.map((area: any) =>
        area.id === areaId
          ? {
              ...area,
              terminals: area.terminals.map((terminal: any) =>
                terminal.id === terminalId ? { ...terminal, ...updates } : terminal,
              ),
            }
          : area,
      ),
    })
  }

  const deleteTerminal = (areaId: string, terminalId: string) => {
    handleUpdateData("busSchedule", {
      ...data.busSchedule,
      areas: data.busSchedule.areas.map((area: any) =>
        area.id === areaId
          ? {
              ...area,
              terminals: area.terminals.filter((terminal: any) => terminal.id !== terminalId),
            }
          : area,
      ),
    })
  }

  const addFooterLink = () => {
    const newLink = { name: "New Link", url: "/new-link" }
    handleUpdateData("footer", {
      ...data.footer,
      links: [...data.footer.links, newLink],
    })
  }

  const updateFooterLink = (index: number, updates: any) => {
    const updatedLinks = data.footer.links.map((link: any, i: number) => (i === index ? { ...link, ...updates } : link))
    handleUpdateData("footer", { ...data.footer, links: updatedLinks })
  }

  const deleteFooterLink = (index: number) => {
    const updatedLinks = data.footer.links.filter((_: any, i: number) => i !== index)
    handleUpdateData("footer", { ...data.footer, links: updatedLinks })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Content Management System</h1>
            <p className="text-sm text-gray-600 mt-1">Logged in as Admin • Session active</p>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" onClick={onLogout} className="text-red-600 hover:text-red-700">
              Logout
            </Button>
            <Button onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>

        {/* Save Status Alert */}
        {saveStatus.type && (
          <Alert variant={saveStatus.type === "error" ? "destructive" : "default"} className="mb-6">
            {saveStatus.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>{saveStatus.message}</AlertDescription>
          </Alert>
        )}

        {/* Loading Overlay */}
        {isSaving && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving changes...</span>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="event">Event Details</TabsTrigger>
            <TabsTrigger value="schedule">Bus Schedule</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="hero-type">Media Type</Label>
                  <Select
                    value={data.hero.type}
                    onValueChange={(value) => handleUpdateData("hero", { ...data.hero, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hero-src">Media URL</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="hero-src"
                      value={data.hero.src}
                      onChange={(e) => handleUpdateData("hero", { ...data.hero, src: e.target.value })}
                      placeholder="Enter image or video URL"
                    />
                    <Button variant="outline">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="hero-alt">Alt Text</Label>
                  <Input
                    id="hero-alt"
                    value={data.hero.alt}
                    onChange={(e) => handleUpdateData("hero", { ...data.hero, alt: e.target.value })}
                    placeholder="Describe the image for accessibility"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Event Details */}
          <TabsContent value="event">
            <Card>
              <CardHeader>
                <CardTitle>Event Details Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="event-title">Event Title</Label>
                  <Input
                    id="event-title"
                    value={data.eventDetails.title}
                    onChange={(e) => handleUpdateData("eventDetails", { ...data.eventDetails, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="event-subtitle">Subtitle</Label>
                  <Input
                    id="event-subtitle"
                    value={data.eventDetails.subtitle}
                    onChange={(e) =>
                      handleUpdateData("eventDetails", { ...data.eventDetails, subtitle: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="event-date">Date</Label>
                    <Input
                      id="event-date"
                      value={data.eventDetails.date}
                      onChange={(e) => handleUpdateData("eventDetails", { ...data.eventDetails, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="event-time">Time</Label>
                    <Input
                      id="event-time"
                      value={data.eventDetails.time}
                      onChange={(e) => handleUpdateData("eventDetails", { ...data.eventDetails, time: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="event-venue">Venue</Label>
                  <Input
                    id="event-venue"
                    value={data.eventDetails.venue}
                    onChange={(e) => handleUpdateData("eventDetails", { ...data.eventDetails, venue: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="event-description">Description</Label>
                  <Textarea
                    id="event-description"
                    value={data.eventDetails.description}
                    onChange={(e) =>
                      handleUpdateData("eventDetails", { ...data.eventDetails, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bus Schedule */}
          <TabsContent value="schedule">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={data.busSchedule.generalNotes}
                    onChange={(e) =>
                      handleUpdateData("busSchedule", { ...data.busSchedule, generalNotes: e.target.value })
                    }
                    rows={2}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Bus Areas & Terminals</CardTitle>
                    <Button onClick={addArea}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Area
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.busSchedule.areas.map((area: any) => (
                      <Card key={area.id} className="border-l-4 border-l-green-500">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              {editingArea === area.id ? (
                                <Input
                                  value={area.name}
                                  onChange={(e) => updateArea(area.id, { name: e.target.value })}
                                  onBlur={() => setEditingArea(null)}
                                  onKeyPress={(e) => e.key === "Enter" && setEditingArea(null)}
                                  autoFocus
                                />
                              ) : (
                                <h3
                                  className="font-semibold cursor-pointer hover:text-green-600"
                                  onClick={() => setEditingArea(area.id)}
                                >
                                  {area.name}
                                </h3>
                              )}
                              <Badge variant="secondary">{area.terminals.length} terminals</Badge>
                            </div>
                            <div className="space-x-2">
                              <Button size="sm" variant="outline" onClick={() => addTerminal(area.id)}>
                                <Plus className="h-3 w-3 mr-1" />
                                Terminal
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => deleteArea(area.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {area.terminals.map((terminal: any) => (
                              <div key={terminal.id} className="border rounded p-3 bg-gray-50">
                                <div className="grid grid-cols-5 gap-3 items-center">
                                  <div>
                                    <Label className="text-xs">Terminal Name</Label>
                                    <Input
                                      value={terminal.name}
                                      onChange={(e) => updateTerminal(area.id, terminal.id, { name: e.target.value })}
                                      size="sm"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Buses</Label>
                                    <Input
                                      type="number"
                                      value={terminal.buses}
                                      onChange={(e) =>
                                        updateTerminal(area.id, terminal.id, { buses: Number.parseInt(e.target.value) })
                                      }
                                      size="sm"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Boarding Time</Label>
                                    <Input
                                      value={terminal.boardingTime}
                                      onChange={(e) =>
                                        updateTerminal(area.id, terminal.id, { boardingTime: e.target.value })
                                      }
                                      size="sm"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Departure Time</Label>
                                    <Input
                                      value={terminal.departureTime}
                                      onChange={(e) =>
                                        updateTerminal(area.id, terminal.id, { departureTime: e.target.value })
                                      }
                                      size="sm"
                                    />
                                  </div>
                                  <div className="flex justify-end">
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => deleteTerminal(area.id, terminal.id)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Footer */}
          <TabsContent value="footer">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Church Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="church-name">Church Name</Label>
                    <Input
                      id="church-name"
                      value={data.footer.churchName}
                      onChange={(e) => handleUpdateData("footer", { ...data.footer, churchName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="church-location">Location</Label>
                    <Input
                      id="church-location"
                      value={data.footer.location}
                      onChange={(e) => handleUpdateData("footer", { ...data.footer, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="church-address">Full Address</Label>
                    <Textarea
                      id="church-address"
                      value={data.footer.address}
                      onChange={(e) => handleUpdateData("footer", { ...data.footer, address: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="church-phone">Phone</Label>
                      <Input
                        id="church-phone"
                        value={data.footer.phone}
                        onChange={(e) => handleUpdateData("footer", { ...data.footer, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="church-email">Email</Label>
                      <Input
                        id="church-email"
                        value={data.footer.email}
                        onChange={(e) => handleUpdateData("footer", { ...data.footer, email: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Quick Links</CardTitle>
                    <Button onClick={addFooterLink}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.footer.links.map((link: any, index: number) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          placeholder="Link Name"
                          value={link.name}
                          onChange={(e) => updateFooterLink(index, { name: e.target.value })}
                        />
                        <Input
                          placeholder="URL"
                          value={link.url}
                          onChange={(e) => updateFooterLink(index, { url: e.target.value })}
                        />
                        <Button variant="destructive" size="sm" onClick={() => deleteFooterLink(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
