"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { UserInfo, TripPlan, DayActivity, CustomOptions } from "@/app/dream-trip-planner/page"
import {
  CheckCircle,
  ArrowLeft,
  Download,
  Calendar,
  MapPin,
  Users,
  Hotel,
  UtensilsCrossed,
  Car,
  Edit,
  CreditCard,
  Plane,
  FileText,
  Eye,
  AlertTriangle,
  User,
  DollarSign,
} from "lucide-react"
import { hotelOptions, transportOptions, attractionOptions } from "./customize-trip/data"
import Image from "next/image"

interface SummaryStepProps {
  userInfo: UserInfo
  selectedPlan: TripPlan | null
  itinerary: DayActivity[]
  customOptions: CustomOptions
  onBack: () => void
}

export default function SummaryStep({ userInfo, selectedPlan, itinerary, customOptions, onBack }: SummaryStepProps) {
  const [isBooking, setIsBooking] = useState(false)
  const [isBooked, setIsBooked] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const calculateDayTotal = (dayOptions: any) => {
    let total = 0;
    if (dayOptions.hotels && hotelOptions[dayOptions.hotels as keyof typeof hotelOptions]) {
      total += hotelOptions[dayOptions.hotels as keyof typeof hotelOptions].price;
    }
    if (dayOptions.transport && transportOptions[dayOptions.transport as keyof typeof transportOptions]) {
      total += transportOptions[dayOptions.transport as keyof typeof transportOptions].price;
    }
    if (dayOptions.attractions && attractionOptions[dayOptions.attractions as keyof typeof attractionOptions]) {
      total += attractionOptions[dayOptions.attractions as keyof typeof attractionOptions].price;
    }
    return total;
  };

  const calculateTotalPrice = () => {
    let total = selectedPlan?.budget || 0;
    for (let i = 1; i <= userInfo.duration; i++) {
      const dayKey = `day${i}` as keyof CustomOptions;
      total += calculateDayTotal(customOptions[dayKey]);
    }
    return total;
  };

  // Calculate total with 10% commission
  const totalWithCommission = (calculateTotalPrice() * 1.1);
  const commission = calculateTotalPrice() * 0.1;
  const subtotal = calculateTotalPrice();

  // Collect custom highlights from user selections (shared for PDF and on-screen)
  const selectedHotels = new Set<string>();
  const selectedTransports = new Set<string>();
  const selectedAttractions = new Set<string>();
  for (let i = 1; i <= userInfo.duration; i++) {
    const dayKey = `day${i}` as keyof CustomOptions;
    if (customOptions[dayKey]?.hotels) selectedHotels.add(customOptions[dayKey]?.hotels as string);
    if (customOptions[dayKey]?.transport) selectedTransports.add(customOptions[dayKey]?.transport as string);
    if (customOptions[dayKey]?.attractions) selectedAttractions.add(customOptions[dayKey]?.attractions as string);
  }
  const hotelHighlights = (Array.from(selectedHotels).map((key: string) => {
    const h = hotelOptions[key as keyof typeof hotelOptions];
    return h ? `${h.name}${h.features && h.features.length ? ' – ' + h.features.slice(0,2).join(', ') : ''}` : null;
  }).filter(Boolean)) as string[];
  const transportHighlights = (Array.from(selectedTransports).map((key: string) => {
    const t = transportOptions[key as keyof typeof transportOptions];
    return t ? `${t.name}${t.features && t.features.length ? ' – ' + t.features.slice(0,2).join(', ') : ''}` : null;
  }).filter(Boolean)) as string[];
  const attractionHighlights = (Array.from(selectedAttractions).map((key: string) => {
    const a = attractionOptions[key as keyof typeof attractionOptions];
    return a ? `${a.name}${a.features && a.features.length ? ' – ' + a.features.slice(0,2).join(', ') : ''}` : null;
  }).filter(Boolean)) as string[];
  const customHighlights: string[] = [...hotelHighlights, ...transportHighlights, ...attractionHighlights];

  const handleBooking = () => {
    setIsBooking(true)
    // Simulate booking process
    setTimeout(() => {
      setIsBooking(false)
      setIsBooked(true)
    }, 3000)
  }

  const handleDownloadPlan = () => {
    // Create a simple text version of the plan
    const planText = `
TRIP SUMMARY
============

Traveler: ${userInfo.name}
Trip: ${selectedPlan?.title}
Duration: ${selectedPlan?.duration} days
Cities: ${selectedPlan?.cities.join(" → ")}
Total Cost: AED ${calculateTotalPrice().toLocaleString()}

ITINERARY
=========
${itinerary
  .map(
    (day) => `
Day ${day.day} - ${day.city}
${day.activities.map((activity) => `• ${activity}`).join("\n")}
`,
  )
  .join("\n")}

CUSTOMIZATIONS
==============
Hotel: ${customOptions.day1.hotels || 'Not selected'}
    `

    const blob = new Blob([planText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedPlan?.title.replace(/\s+/g, "-")}-itinerary.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generatePDF = async () => {
    try {
      // Dynamic import to avoid SSR issues
      const jsPDF = (await import('jspdf')).default
      const html2canvas = (await import('html2canvas')).default

      // Create a temporary div for PDF generation
      const pdfContainer = document.createElement('div')
      pdfContainer.style.position = 'absolute'
      pdfContainer.style.left = '-9999px'
      pdfContainer.style.top = '0'
      pdfContainer.style.width = '800px'
      pdfContainer.style.padding = '40px'
      pdfContainer.style.backgroundColor = 'white'
      pdfContainer.style.fontFamily = 'Arial, sans-serif'
      pdfContainer.style.fontSize = '12px'
      pdfContainer.style.lineHeight = '1.4'
      pdfContainer.style.color = 'black'

      pdfContainer.innerHTML = `
        <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 24px;">🤖 Dream AI Trip Planner</h1>
          <h2 style="color: #1e40af; margin: 10px 0; font-size: 20px;">${selectedPlan?.title}</h2>
          <p style="margin: 0; color: #666;">Generated on ${new Date().toLocaleDateString()}</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #2563eb; border-bottom: 1px solid #ddd; padding-bottom: 10px; font-size: 16px;">📋 Trip Summary & Confirmation</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
            <div style='background: #f8f9fa; padding: 12px; border-radius: 6px;'><strong>Full Name:</strong> ${userInfo.name}</div>
            <div style='background: #f8f9fa; padding: 12px; border-radius: 6px;'><strong>Departure City:</strong> ${userInfo.travelFrom}</div>
            <div style='background: #f8f9fa; padding: 12px; border-radius: 6px;'><strong>Journey Month:</strong> ${userInfo.journeyMonth}</div>
            <div style='background: #f8f9fa; padding: 12px; border-radius: 6px;'><strong>Duration:</strong> ${userInfo.duration} ${userInfo.duration === 1 ? 'day' : 'days'}</div>
            <div style='background: #f8f9fa; padding: 12px; border-radius: 6px;'><strong>Budget Range:</strong> ${userInfo.budget}</div>
            <div style='background: #f8f9fa; padding: 12px; border-radius: 6px;'><strong>Travelers:</strong> ${userInfo.adults} Adult${userInfo.adults !== 1 ? 's' : ''}${userInfo.children > 0 ? `, ${userInfo.children} Child${userInfo.children !== 1 ? 'ren' : ''}` : ''}${userInfo.infants > 0 ? `, ${userInfo.infants} Infant${userInfo.infants !== 1 ? 's' : ''}` : ''}</div>
            <div style='background: #f8f9fa; padding: 12px; border-radius: 6px;'><strong>Destination:</strong> ${selectedPlan?.cities?.length ? `UAE: ${selectedPlan.cities.join(" → ")}` : 'UAE'}</div>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #2563eb; border-bottom: 1px solid #ddd; padding-bottom: 10px; font-size: 16px;">🏨 Customizations</h2>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 20px 0;">
            <div style="background: #fef3c7; padding: 12px; border-radius: 6px; text-align: center;">
              <h4 style="color: #92400e; margin: 0 0 5px 0; font-size: 14px;">🏨 Accommodation</h4>
              <p style="margin: 0; font-size: 12px;">${customOptions.day1.hotels || 'Not selected'}</p>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #2563eb; border-bottom: 1px solid #ddd; padding-bottom: 10px; font-size: 16px;">🗺️ Detailed Itinerary</h2>
          ${itinerary.map(day => `
            <div style="background: #f1f5f9; padding: 15px; margin: 15px 0; border-radius: 6px;">
              <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 14px;">Day ${day.day} - ${day.city}</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                ${day.activities.map(activity => `<li style="padding: 3px 0; border-bottom: 1px solid #e2e8f0; font-size: 12px;">• ${activity}</li>`).join('')}
              </ul>
              ${day.travelTime !== "0 hours" ? `<p style="margin: 10px 0 0 0; font-size: 12px;"><strong>Travel Time:</strong> ${day.travelTime}</p>` : ''}
            </div>
          `).join('')}
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #2563eb; border-bottom: 1px solid #ddd; padding-bottom: 10px; font-size: 16px;">💰 Price Breakdown</h2>
          <div style="background: #f0fdf4; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; margin: 10px 0; font-size: 12px;">
              <span>Subtotal</span>
              <span>AED ${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Commission (10%)</span>
              <span>AED ${commission.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 15px 0 0 0; font-size: 14px; font-weight: bold; color: #059669; border-top: 2px solid #10b981; padding-top: 10px;">
              <span>Total Amount:</span>
              <span className="text-green-600">{totalWithCommission.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} AED (w/ 10% commission)</span>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #2563eb; border-bottom: 1px solid #ddd; padding-bottom: 10px; font-size: 16px;">✨ Trip Highlights</h2>
          <p style="margin: 0 0 15px 0; font-size: 12px;">${selectedPlan?.description || ''}</p>
          <div style="margin-top: 15px;">
            ${customHighlights.length > 0
              ? (customHighlights as string[]).map((h: string) => `<span style=\"background: #dbeafe; padding: 4px 8px; margin: 3px; border-radius: 12px; display: inline-block; font-size: 10px;\">${h}</span>`).join('')
              : '<span style="color: #888; font-size: 11px;">No custom highlights selected.</span>'}
          </div>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 10px; color: #666; text-align: center;">
          <p style="margin: 5px 0;">Thank you for choosing Dream AI Trip Planner!</p>
          <p style="margin: 5px 0;">For any questions or modifications, please contact our support team.</p>
          <p style="margin: 5px 0;">Booking Reference: #TRP${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>
      `

      document.body.appendChild(pdfContainer)

      // Convert to canvas
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      // Remove the temporary container
      document.body.removeChild(pdfContainer)

      // Create PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Download the PDF
      pdf.save(`${selectedPlan?.title.replace(/\s+/g, "-")}-trip-summary.pdf`)

    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  const handleDownloadPDF = () => {
    setShowPreview(true)
  }

  const confirmDownloadPDF = () => {
    setShowPreview(false)
    generatePDF()
  }

  // Helper to get selected option details
  function getOption(type: 'hotel' | 'transport' | 'attraction', key: string | null | undefined): any {
    if (!key) return null;
    if (type === 'hotel') return hotelOptions[key as keyof typeof hotelOptions];
    if (type === 'transport') return transportOptions[key as keyof typeof transportOptions];
    if (type === 'attraction') return attractionOptions[key as keyof typeof attractionOptions];
    return null;
  }

  // Collect images for collage
  const collageImages = [];
  for (let i = 1; i <= userInfo.duration; i++) {
    const dayKey: keyof CustomOptions = `day${i}` as keyof CustomOptions;
    const hotel = getOption('hotel', customOptions[dayKey]?.hotels);
    const attraction = getOption('attraction', customOptions[dayKey]?.attractions);
    if (hotel && hotel.image) collageImages.push(hotel.image);
    if (attraction && attraction.image) collageImages.push(attraction.image);
  }

  if (isBooked) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800 mb-2">Booking Confirmed! 🎉</h2>
          <p className="text-green-700 mb-6">
            Your dream trip has been booked successfully. You'll receive a confirmation email shortly.
          </p>
          <div className="space-y-3">
            <Button onClick={handleDownloadPlan} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Your Itinerary
            </Button>
            <Button onClick={handleDownloadPDF} className="w-full">
              <FileText className="w-4 h-4 mr-2" />
              Download Trip Summary as PDF
            </Button>
            <p className="text-sm text-green-600">
              Booking Reference: #TRP{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8 pb-32">
      {/* Trip Overview */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-blue-700 text-2xl flex items-center gap-2">
            <CheckCircle className="w-6 h-6" /> Trip Summary & Confirmation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Traveler Info */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-blue-600 flex items-center gap-2">
                <Users className="w-4 h-4" /> Traveler
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <User className="w-4 h-4" /> <span className="font-medium">Full Name:</span> {userInfo.name}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Plane className="w-4 h-4" /> <span className="font-medium">Departure City:</span> {userInfo.travelFrom}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar className="w-4 h-4" /> <span className="font-medium">Journey Month:</span> {userInfo.journeyMonth}
              </div>
            </div>
            {/* Trip Details */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-blue-600 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Trip Details
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar className="w-4 h-4" /> <span className="font-medium">Duration:</span> {userInfo.duration} {userInfo.duration === 1 ? 'day' : 'days'}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <DollarSign className="w-4 h-4" /> <span className="font-medium">Budget Range:</span> {userInfo.budget}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Users className="w-4 h-4" /> <span className="font-medium">Travelers:</span> {userInfo.adults} Adult{userInfo.adults !== 1 ? 's' : ''}{userInfo.children > 0 ? `, ${userInfo.children} Child${userInfo.children !== 1 ? 'ren' : ''}` : ''}{userInfo.infants > 0 ? `, ${userInfo.infants} Infant${userInfo.infants !== 1 ? 's' : ''}` : ''}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <MapPin className="w-4 h-4" /> <span className="font-medium">Destination:</span> {selectedPlan?.cities?.length ? `UAE: ${selectedPlan.cities.join(" → ")}` : 'UAE'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Collage */}
      {collageImages.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center items-center">
          {collageImages.slice(0, 6).map((img, idx) => (
            <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <Image src={img} alt="Collage" fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Customizations for All Days */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <Hotel className="w-5 h-5" /> Your Customizations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: userInfo.duration }, (_, i) => {
              const dayKey = `day${i + 1}` as keyof CustomOptions;
              const hotel = getOption('hotel', customOptions[dayKey]?.hotels);
              const transport = getOption('transport', customOptions[dayKey]?.transport);
              const attraction = getOption('attraction', customOptions[dayKey]?.attractions);
              return (
                <Card key={dayKey} className="bg-gray-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-600">{i + 1}</span>
                      Day {i + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🏨</span>
                      <span className="font-medium">Hotel:</span>
                      {hotel ? (
                        <>
                          {hotel.image && <Image src={hotel.image} alt={hotel.name} width={28} height={28} className="rounded" />}
                          <span>{hotel.name}</span>
                          <Badge variant="outline">AED {hotel.price}</Badge>
                        </>
                      ) : (
                        <span className="italic text-gray-400">Not selected</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{transport?.icon || "🚗"}</span>
                      <span className="font-medium">Transport:</span>
                      {transport ? (
                        <>
                          <span>{transport.name}</span>
                          <Badge variant="outline">AED {transport.price}</Badge>
                        </>
                      ) : (
                        <span className="italic text-gray-400">Not selected</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{attraction?.icon || "📍"}</span>
                      <span className="font-medium">Attraction:</span>
                      {attraction ? (
                        <>
                          <span>{attraction.name}</span>
                          <Badge variant="outline">AED {attraction.price}</Badge>
                        </>
                      ) : (
                        <span className="italic text-gray-400">Not selected</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Price Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <CreditCard className="w-5 h-5" /> Price Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>AED ${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Commission (10%)</span>
                <span>AED ${commission.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t-2 border-green-300 pt-3">
                <span>Total Amount:</span>
                <span className="text-green-600">{totalWithCommission.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} AED (w/ 10% commission)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Itinerary Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Itinerary Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {itinerary.map((day) => {
              const dayKey = `day${day.day}` as keyof typeof customOptions;
              const dayCustom = customOptions[dayKey];
              const hotel = dayCustom.hotels ? hotelOptions[dayCustom.hotels as keyof typeof hotelOptions] : null;
              const transport = dayCustom.transport ? transportOptions[dayCustom.transport as keyof typeof transportOptions] : null;
              const attraction = dayCustom.attractions ? attractionOptions[dayCustom.attractions as keyof typeof attractionOptions] : null;
              return (
                <Card key={day.day} className="bg-gray-50">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-600">
                        {day.day}
                      </div>
                      <span className="font-medium text-sm">{day.city}</span>
                    </div>
                    <ul className="text-xs text-gray-700 space-y-2">
                      {day.activities.map((activity, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-blue-500">•</span> {activity}
                        </li>
                      ))}
                      {day.travelTime !== "0 hours" && (
                        <li className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                          <span>🕒</span> Travel: {day.travelTime}
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons (Below Itinerary Overview) */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 mt-2">
        <Button
          onClick={onBack}
          className="flex-1 px-8 text-lg rounded-full shadow-md border border-blue-600 text-blue-700 bg-white hover:bg-blue-50 hover:text-blue-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Customize
        </Button>
        <Button
          onClick={handleDownloadPDF}
          className="flex-1 px-8 text-lg rounded-full shadow-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview & Download PDF
        </Button>
        <Button
          onClick={handleBooking}
          disabled={isBooking}
          className="flex-1 px-8 text-lg rounded-full shadow-md bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
        >
          {isBooking ? (
            <>
              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Book Now - AED {totalWithCommission.toLocaleString()}
            </>
          )}
        </Button>
      </div>

      {/* Important Notes */}
      <div className="mt-8">
        <Card className="bg-yellow-100 border-yellow-300 shadow-none">
          <CardContent>
            <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Important Notes
            </h4>
            <ul className="text-sm text-yellow-900 space-y-1">
              <li>• All prices are subject to availability and may change</li>
              <li>• Cancellation policy applies as per terms and conditions</li>
              <li>• Travel insurance is recommended</li>
              <li>• Valid ID proof required for all travelers</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* PDF Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              PDF Preview - {selectedPlan?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
              <h1 className="text-2xl font-bold text-blue-600 mb-2">🤖 Dream AI Trip Planner</h1>
              <h2 className="text-xl font-semibold text-blue-800 mb-2">{selectedPlan?.title}</h2>
              <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
            </div>

            {/* Trip Information */}
            <div>
              <h2 className="text-lg font-semibold text-blue-600 border-b border-gray-300 pb-2 mb-4">📋 Trip Summary & Confirmation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <strong>Full Name:</strong> {userInfo.name}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <strong>Departure City:</strong> {userInfo.travelFrom}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <strong>Journey Month:</strong> {userInfo.journeyMonth}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <strong>Duration:</strong> {userInfo.duration} {userInfo.duration === 1 ? 'day' : 'days'}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <strong>Budget Range:</strong> {userInfo.budget}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <strong>Travelers:</strong> {userInfo.adults} Adult{userInfo.adults !== 1 ? 's' : ''}{userInfo.children > 0 ? `, ${userInfo.children} Child${userInfo.children !== 1 ? 'ren' : ''}` : ''}{userInfo.infants > 0 ? `, ${userInfo.infants} Infant${userInfo.infants !== 1 ? 's' : ''}` : ''}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <strong>Destination:</strong> {selectedPlan?.cities?.length ? `UAE: ${selectedPlan.cities.join(" → ")}` : 'UAE'}
                </div>
              </div>
            </div>

            {/* Customizations */}
            <div>
              <h2 className="text-lg font-semibold text-blue-600 border-b border-gray-300 pb-2 mb-4">🏨 Customizations</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-yellow-800 mb-2">🏨 Accommodation</h4>
                  <p className="text-sm">{customOptions.day1.hotels || 'Not selected'}</p>
                </div>
              </div>
            </div>

            {/* Itinerary Preview */}
            <div>
              <h2 className="text-lg font-semibold text-blue-600 border-b border-gray-300 pb-2 mb-4">🗺️ Detailed Itinerary</h2>
              <div className="space-y-4">
                {itinerary.map((day) => (
                  <div key={day.day} className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-3">Day {day.day} - {day.city}</h3>
                    <ul className="space-y-2">
                      {day.activities.map((activity, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          {activity}
                        </li>
                      ))}
                    </ul>
                    {day.travelTime !== "0 hours" && (
                      <p className="text-sm mt-3"><strong>Travel Time:</strong> {day.travelTime}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div>
              <h2 className="text-lg font-semibold text-blue-600 border-b border-gray-300 pb-2 mb-4">💰 Price Breakdown</h2>
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>AED ${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Commission (10%)</span>
                    <span>AED ${commission.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t-2 border-green-300 pt-3">
                    <span>Total Amount:</span>
                    <span className="text-green-600">{totalWithCommission.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} AED (w/ 10% commission)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trip Highlights */}
            <div>
              <h2 className="text-lg font-semibold text-blue-600 border-b border-gray-300 pb-2 mb-4">✨ Trip Highlights</h2>
              <p className="mb-4">{selectedPlan?.description || ''}</p>
              <div className="flex flex-wrap gap-2">
                {customHighlights.length > 0
                  ? (customHighlights as string[]).map((h: string) => <Badge key={h} variant="secondary" className="text-xs">
                    {h}
                  </Badge>)
                  : <Badge variant="secondary" className="text-xs">No custom highlights selected.</Badge>
                }
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-300 pt-6 text-center text-sm text-gray-600">
              <p className="mb-2">Thank you for choosing Dream AI Trip Planner!</p>
              <p className="mb-2">For any questions or modifications, please contact our support team.</p>
              <p>Booking Reference: #TRP{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowPreview(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={confirmDownloadPDF} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
