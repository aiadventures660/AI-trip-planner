"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { CustomOptions, TripPlan, DayCustomization, UserInfo } from "@/app/dream-trip-planner/page"
import {
  Hotel,
  UtensilsCrossed,
  Car,
  ArrowLeft,
  DollarSign,
  Calendar,
  MapPin,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

import { hotelOptions, mealOptions, transportOptions, attractionOptions } from "./customize-trip/data"
import SidebarSection from "./customize-trip/sidebar-section"
import DayCustomizationCard from "./customize-trip/day-customization-card"

interface CustomizeStepProps {
  customOptions: CustomOptions
  setCustomOptions: (options: CustomOptions) => void
  userInfo: UserInfo
  onNext: () => void
  onBack: () => void
}

export default function CustomizeStep({
  customOptions,
  setCustomOptions,
  userInfo,
  onNext,
  onBack,
}: CustomizeStepProps) {
  const [draggedItem, setDraggedItem] = useState<{ type: string; id: string } | null>(null)
  const [dragOverDay, setDragOverDay] = useState<number | null>(null)
  const [dragOverType, setDragOverType] = useState<string | null>(null)
  const [collapsedDays, setCollapsedDays] = useState<Set<number>>(new Set())
  const [collapsedSidebarSections, setCollapsedSidebarSections] = useState<Set<string>>(new Set())
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())
  const [showDialog, setShowDialog] = useState(false)

  const handleDragStart = useCallback((e: React.DragEvent, type: string, id: string) => {
    setDraggedItem({ type, id })
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", `${type}:${id}`)
    
    // Add visual feedback to dragged element
    const target = e.target as HTMLElement
    if (target) {
      target.style.opacity = "0.5"
      target.style.transform = "scale(0.95)"
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, day: number, type: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverDay(day)
    setDragOverType(type)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Only trigger if leaving the drop zone entirely
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    setDragOverDay(null)
    setDragOverType(null)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, day: number, type: string) => {
      e.preventDefault()
      if (draggedItem) {
        const dayKey = `day${day}` as keyof CustomOptions
        const updatedDay = {
          ...customOptions[dayKey],
          [type === 'hotel' ? 'hotels' : type]: draggedItem.id,
        }
        setCustomOptions({
          ...customOptions,
          [dayKey]: updatedDay,
        })
        
        // Add success feedback
        const target = e.currentTarget as HTMLElement
        if (target) {
          target.style.transform = "scale(1.02)"
          target.style.transition = "transform 0.2s ease"
          setTimeout(() => {
            target.style.transform = "scale(1)"
          }, 200)
        }
      }
      setDraggedItem(null)
      setDragOverDay(null)
      setDragOverType(null)
    },
    [draggedItem, customOptions, setCustomOptions],
  )

  const handleRemoveItem = useCallback(
    (day: number, type: string) => {
      const dayKey = `day${day}` as keyof CustomOptions
      const updatedDay = {
        ...customOptions[dayKey],
        [type === 'hotel' ? 'hotels' : type]: null,
      }
      setCustomOptions({
        ...customOptions,
        [dayKey]: updatedDay,
      })
    },
    [customOptions, setCustomOptions],
  )

  const toggleDayCollapse = useCallback((dayNumber: number) => {
    setCollapsedDays((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(dayNumber)) {
        newSet.delete(dayNumber)
      } else {
        newSet.add(dayNumber)
      }
      return newSet
    })
  }, [])

  const toggleSectionCollapse = useCallback((dayNumber: number, section: "hotels" | "meals" | "transport" | "attractions") => {
    const sectionKey = `day${dayNumber}-${section}`
    setCollapsedSections((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(sectionKey)) {
        newSet.delete(sectionKey)
      } else {
        newSet.add(sectionKey)
      }
      return newSet
    })
  }, [])

  const isDayCollapsed = useCallback((dayNumber: number) => collapsedDays.has(dayNumber), [collapsedDays])

  const isSectionCollapsed = useCallback(
    (dayNumber: number, section: "hotels" | "meals" | "transport" | "attractions") => {
      return collapsedSections.has(`day${dayNumber}-${section}`)
    },
    [collapsedSections],
  )

  const calculateDayTotal = useCallback((day: DayCustomization) => {
    const hotel = day.hotels ? hotelOptions[day.hotels as keyof typeof hotelOptions] : null
    const meals = day.meals ? mealOptions[day.meals as keyof typeof mealOptions] : null
    const transport = day.transport ? transportOptions[day.transport as keyof typeof transportOptions] : null
    const attractions = day.attractions ? attractionOptions[day.attractions as keyof typeof attractionOptions] : null

    return (hotel?.price || 0) + (meals?.price || 0) + (transport?.price || 0) + (attractions?.price || 0)
  }, [])

  const numberOfDays = userInfo.duration

  const activeDays = useMemo(() => {
    const allDays = [
      customOptions.day1,
      customOptions.day2,
      customOptions.day3,
      customOptions.day4,
      customOptions.day5,
      customOptions.day6,
      customOptions.day7,
    ]
    return allDays.slice(0, numberOfDays)
  }, [customOptions, numberOfDays])

  const calculateTotalPrice = useCallback(() => {
    const customizationTotal = activeDays.reduce((sum, day) => sum + calculateDayTotal(day), 0)
    return customizationTotal
  }, [activeDays, calculateDayTotal])

  const calculateCommission = useCallback(() => {
    return calculateTotalPrice() * 0.1
  }, [calculateTotalPrice])

  const toggleSidebarSection = useCallback((section: string) => {
    setCollapsedSidebarSections((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }, [])

  const isSidebarSectionCollapsed = useCallback(
    (section: string) => collapsedSidebarSections.has(section),
    [collapsedSidebarSections],
  )

  const cardWidth = useMemo(() => {
    return numberOfDays <= 3 ? "min-w-[400px] flex-1" : "min-w-[350px] flex-1"
  }, [numberOfDays])

  const handleQuickAdd = useCallback((type: string, id: string) => {
    // Find the first day that doesn't have this type of item
    const dayKey = activeDays.find(day => {
      const dayData = customOptions[`day${day.day}` as keyof CustomOptions]
      return !dayData[type as keyof DayCustomization]
    })
    
    if (dayKey) {
      const updatedDay = {
        ...customOptions[`day${dayKey.day}` as keyof CustomOptions],
        [type === 'hotel' ? 'hotels' : type]: id,
      }
      setCustomOptions({
        ...customOptions,
        [`day${dayKey.day}` as keyof CustomOptions]: updatedDay,
      })
    } else {
      // If all days have this type, add to the first day
      const firstDay = activeDays[0]
      if (firstDay) {
        const updatedDay = {
          ...customOptions[`day${firstDay.day}` as keyof CustomOptions],
          [type === 'hotel' ? 'hotels' : type]: id,
        }
        setCustomOptions({
          ...customOptions,
          [`day${firstDay.day}` as keyof CustomOptions]: updatedDay,
        })
      }
    }
  }, [activeDays, customOptions, setCustomOptions])

  // Helper to check if all days have at least one selection
  const allDaysHaveSelection = useMemo(() => {
    return activeDays.every(day => day.hotels || day.transport || day.attractions)
  }, [activeDays])

  const handleNext = () => {
    if (!allDaysHaveSelection) {
      setShowDialog(true)
      return
    }
    onNext()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Customize Your {numberOfDays}-Day UAE Experience
          </CardTitle>
          <p className="text-sm text-gray-500">
            Drag and drop items from the sidebar to customize each day. Click on days to expand or collapse.
          </p>
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Pro Tip:</span>
              <span>Drag items from the sidebar to any day card, or click the + button for quick add to the first available day.</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4 relative z-10">
          <div className="sticky top-4">
            <SidebarSection
              id="hotels"
              title="5-Star Hotels"
              icon={<Hotel className="w-5 h-5" />}
              options={hotelOptions}
              collapsed={isSidebarSectionCollapsed("hotels")}
              onToggle={() => toggleSidebarSection("hotels")}
              onDragStart={handleDragStart}
              onQuickAdd={handleQuickAdd}
            />
            <SidebarSection
              id="transport"
              title="Transportation"
              icon={<Car className="w-5 h-5" />}
              options={transportOptions}
              collapsed={isSidebarSectionCollapsed("transport")}
              onToggle={() => toggleSidebarSection("transport")}
              onDragStart={handleDragStart}
              onQuickAdd={handleQuickAdd}
            />
            <SidebarSection
              id="attractions"
              title="Attractions"
              icon={<MapPin className="w-5 h-5" />}
              options={attractionOptions}
              collapsed={isSidebarSectionCollapsed("attractions")}
              onToggle={() => toggleSidebarSection("attractions")}
              onDragStart={handleDragStart}
              onQuickAdd={handleQuickAdd}
            />
            </div>
        </div>

        <div className="lg:col-span-3">
          {draggedItem && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Dragging:</span>
                <span>Drop this item on any day card to add it to your itinerary</span>
                          </div>
                        </div>
          )}
          <div className="flex flex-wrap gap-4 min-h-[400px] items-start content-start">
            {activeDays.map((day, index) => (
              <div key={day.day} className={cardWidth}>
                <DayCustomizationCard
                  day={day}
                  index={index}
                  isCollapsed={isDayCollapsed(day.day)}
                  onToggle={() => toggleDayCollapse(day.day)}
                  calculateDayTotal={calculateDayTotal}
                  isSectionCollapsed={isSectionCollapsed}
                  toggleSectionCollapse={toggleSectionCollapse}
                  handleRemoveItem={handleRemoveItem}
                  handleDragOver={handleDragOver}
                  handleDragLeave={handleDragLeave}
                  handleDrop={handleDrop}
                  dragOverDay={dragOverDay}
                  dragOverType={dragOverType}
                />
                          </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-20 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-blue-200 flex gap-4 w-full md:w-auto justify-between md:justify-end p-4 shadow-lg">
        <button
          onClick={onBack}
          className="px-8 py-2 rounded-full border border-blue-600 text-blue-700 bg-white hover:bg-blue-50 shadow-md text-lg font-medium transition-colors"
        >
          ← Back
        </button>
        <Button
          onClick={handleNext}
          className="px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg shadow-md rounded-full"
        >
          View Detailed Itinerary →
        </Button>
      </div>

      {/* Dialog for missing selections */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Incomplete Customization</DialogTitle>
            <DialogDescription>
              Please select at least one option (hotel, transport, or attraction) for each day before proceeding to the next step.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowDialog(false)} className="mt-2">OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
