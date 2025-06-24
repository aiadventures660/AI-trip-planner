import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { TripPlan, DayCustomization } from "@/app/dream-trip-planner/page"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Hotel,
  Car,
  Star,
  CheckCircle,
  X,
  ChevronDown,
  MapPin,
} from "lucide-react"
import { hotelOptions, transportOptions, attractionOptions } from "./data"

function renderSection(
  day: DayCustomization,
  type: "hotels" | "transport" | "attractions",
  icon: React.ReactNode,
  title: string,
  options: any,
  isSectionCollapsed: (dayNumber: number, section: "hotels" | "meals" | "transport" | "attractions") => boolean,
  toggleSectionCollapse: (dayNumber: number, section: "hotels" | "meals" | "transport" | "attractions") => void,
  handleRemoveItem: (day: number, type: string) => void,
  handleDragOver: (e: React.DragEvent, day: number, type: string) => void,
  handleDragLeave: (e: React.DragEvent) => void,
  handleDrop: (e: React.DragEvent, day: number, type: string) => void,
  dragOverDay: number | null,
  dragOverType: string | null,
) {
  const isCollapsed = isSectionCollapsed(day.day, type)
  const selectedOption = day[type]
  const optionData = selectedOption ? options[selectedOption as keyof typeof options] : null
  
  const dropZoneClassName = `p-3 border-2 border-dashed rounded-lg transition-all duration-300 relative ${
    dragOverDay === day.day && dragOverType === type
    ? {
        hotels: 'border-blue-500 bg-blue-50 shadow-lg scale-105',
        transport: 'border-purple-500 bg-purple-50 shadow-lg scale-105',
        attractions: 'border-orange-500 bg-orange-50 shadow-lg scale-105',
      }[type]
    : {
        hotels: 'border-gray-300 hover:border-blue-400 hover:shadow-md hover:bg-blue-25',
        transport: 'border-gray-300 hover:border-purple-400 hover:shadow-md hover:bg-purple-25',
        attractions: 'border-gray-300 hover:border-orange-400 hover:shadow-md hover:bg-orange-25',
      }[type]
  }`;

  return (
    <div
      className="space-y-2 transition-all duration-500 ease-in-out"
      key={`${day.day}-${type}`}
    >
      <div
        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-200 hover:shadow-sm"
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          toggleSectionCollapse(day.day, type)
        }}
        tabIndex={0}
        role="button"
        aria-expanded={!isCollapsed}
        aria-controls={`section-${day.day}-${type}`}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggleSectionCollapse(day.day, type)}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-sm">{title}</span>
          {optionData && (
            <Badge variant="outline" className="text-xs transition-all duration-200">
              AED {optionData.price}
              {type === "hotels" ? "/night" : type === "attractions" ? "/person" : ""}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {selectedOption && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleRemoveItem(day.day, type)
                  }}
                  className="h-6 w-6 p-0 hover:bg-red-100 transition-colors duration-200"
                  aria-label={`Remove ${type}`}
                >
                  <X className="w-3 h-3 text-red-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove {optionData?.name}</p>
              </TooltipContent>
            </Tooltip>
          )}
          <div className={`transition-transform duration-300 ease-out ${isCollapsed ? "rotate-0" : "rotate-180"}`}>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isCollapsed && optionData ? "max-h-16 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        {optionData && (
          <div className="bg-white p-2 rounded border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-2">
              {type === "hotels" && (
                <div className="flex items-center gap-1">
                  {[...Array(Math.min(optionData.stars, 3))].map((_, i) => (
                    <Star key={i} className="w-2 h-2 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              )}
              <span className="text-xs font-medium text-gray-700">{optionData.name}</span>
              <Badge variant="outline" className="text-xs ml-auto">
                AED {optionData.price}
                {type === "hotels" ? "/night" : type === "attractions" ? "/person" : ""}
              </Badge>
            </div>
          </div>
        )}
      </div>
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isCollapsed ? "max-h-0 opacity-0" : "max-h-[400px] opacity-100"
        }`}
        id={`section-${day.day}-${type}`}
      >
        <div className="pt-2">
          <div
            onDragOver={e => handleDragOver(e, day.day, type)}
            onDragLeave={handleDragLeave}
            onDrop={e => handleDrop(e, day.day, type)}
            className={dropZoneClassName}
          >
            {optionData ? (
              <div className="bg-white p-3 rounded border transition-all duration-200 hover:shadow-md">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h5 className="font-semibold text-sm">{optionData.name}</h5>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                {type === "hotels" && (
                  <>
                    <p className="text-xs text-gray-600 mb-2">{optionData.location}</p>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(optionData.stars)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {optionData.features.slice(0, 3).map((feature: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
                <Badge variant="outline" className="text-xs">
                  {optionData.price === 0
                    ? "Free"
                    : `AED ${optionData.price}${type === "hotels" ? "/night" : type === "attractions" ? "/person" : "/day"}`}
                </Badge>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    type === 'hotels' ? 'bg-blue-100' : 
                    type === 'transport' ? 'bg-purple-100' : 
                    'bg-orange-100'
                  }`}>
                    {icon}
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Drop {title} here</p>
                  <p className="text-xs text-gray-400">Drag from sidebar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DayCustomizationCard({
  day,
  index,
  isCollapsed,
  onToggle,
  calculateDayTotal,
  isSectionCollapsed,
  toggleSectionCollapse,
  handleRemoveItem,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  dragOverDay,
  dragOverType,
}: {
  day: DayCustomization
  index: number
  isCollapsed: boolean
  onToggle: () => void
  calculateDayTotal: (day: DayCustomization) => number
  isSectionCollapsed: (dayNumber: number, section: "hotels" | "meals" | "transport" | "attractions") => boolean
  toggleSectionCollapse: (dayNumber: number, section: "hotels" | "meals" | "transport" | "attractions") => void
  handleRemoveItem: (day: number, type: string) => void
  handleDragOver: (e: React.DragEvent, day: number, type: string) => void
  handleDragLeave: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent, day: number, type: string) => void
  dragOverDay: number | null
  dragOverType: string | null
}) {
  return (
    <TooltipProvider>
      <div
        className={`transition-all duration-700 ease-in-out w-full ${
          isCollapsed ? 'scale-[0.98] opacity-95' : 'scale-100 opacity-100'
        }`}
        style={{
          transformOrigin: 'top center',
          minHeight: isCollapsed ? '120px' : 'auto',
          maxHeight: isCollapsed ? '120px' : 'none',
          overflow: 'hidden',
          height: isCollapsed ? '120px' : 'auto',
        }}
      >
        <Card
          className={`border-2 border-dashed transition-all duration-700 ease-in-out overflow-hidden h-full w-full ${
            isCollapsed
              ? 'shadow-sm border-gray-200 hover:border-gray-300'
              : 'shadow-md hover:shadow-lg border-blue-300 hover:border-blue-400'
          }`}
        >
          <CardHeader
            className={`pb-3 cursor-pointer transition-all duration-300 ${
              isCollapsed
                ? 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150'
                : 'bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100'
            }`}
            onClick={onToggle}
            tabIndex={0}
            role="button"
            aria-expanded={!isCollapsed}
            aria-controls={`day-card-${day.day}`}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onToggle()}
          >
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-300 ${
                    isCollapsed
                      ? 'bg-gradient-to-r from-gray-400 to-gray-500'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}
                >
                  {day.day}
                </div>
                <span className="text-lg">Day {day.day}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  AED {calculateDayTotal(day).toLocaleString()}
                </Badge>
                <div
                  className={`transition-transform duration-300 ease-out ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}
                >
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </CardTitle>
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isCollapsed ? 'max-h-24 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
              }`}
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {day.hotels && (
                    <span className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full border border-blue-200 transition-all duration-200 hover:bg-blue-200">
                      <Hotel className="w-3 h-3 text-blue-600" />
                      <span className="text-blue-700 font-medium">
                        {hotelOptions[day.hotels as keyof typeof hotelOptions]?.name.split(" ")[0]}
                      </span>
                    </span>
                  )}
                  {day.transport && (
                    <span className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-full border border-purple-200 transition-all duration-200 hover:bg-purple-200">
                      <Car className="w-3 h-3 text-purple-600" />
                      <span className="text-purple-700 font-medium">
                        {transportOptions[day.transport as keyof typeof transportOptions]?.name}
                      </span>
                    </span>
                  )}
                  {day.attractions && (
                    <span className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full border border-orange-200 transition-all duration-200 hover:bg-orange-200">
                      <MapPin className="w-3 h-3 text-orange-600" />
                      <span className="text-orange-700 font-medium">
                        {attractionOptions[day.attractions as keyof typeof attractionOptions]?.name.split(" ")[0]}
                      </span>
                    </span>
                  )}
                </div>
                {(!day.hotels || !day.transport || !day.attractions) && (
                  <p className="text-xs text-gray-500 italic">
                    {!day.hotels && !day.transport && !day.attractions
                      ? 'No customizations yet - click to expand'
                      : 'Some options pending - click to customize'}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          <div
            id={`day-card-${day.day}`}
            className={`transition-all duration-700 ease-in-out overflow-hidden ${
              isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[2000px] opacity-100'
            }`}
          >
            <CardContent className="space-y-4 p-4">
              {renderSection(
                day,
                "hotels",
                <Hotel className="w-4 h-4" />, 'Hotel', hotelOptions,
                isSectionCollapsed, toggleSectionCollapse, handleRemoveItem, handleDragOver, handleDragLeave, handleDrop, dragOverDay, dragOverType
              )}
              {renderSection(
                day,
                "transport",
                <Car className="w-4 h-4" />, 'Transport', transportOptions,
                isSectionCollapsed, toggleSectionCollapse, handleRemoveItem, handleDragOver, handleDragLeave, handleDrop, dragOverDay, dragOverType
              )}
              {renderSection(
                day,
                "attractions",
                <MapPin className="w-4 h-4" />, 'Attractions', attractionOptions,
                isSectionCollapsed, toggleSectionCollapse, handleRemoveItem, handleDragOver, handleDragLeave, handleDrop, dragOverDay, dragOverType
              )}
            </CardContent>
          </div>
        </Card>
      </div>
    </TooltipProvider>
  )
} 