"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { CustomOptions, UserInfo } from "@/app/dream-trip-planner/page"
import type { DayActivity } from "@/app/dream-trip-planner/page"
import { Calendar, MapPin, Clock, Camera, ArrowLeft, ChevronDown, ChevronUp, Star, DollarSign } from "lucide-react"
import { hotelOptions, transportOptions, attractionOptions } from "./customize-trip/data"

interface ItineraryStepProps {
  customOptions: CustomOptions;
  userInfo: UserInfo;
  onNext: () => void;
  onBack: () => void;
  itinerary: DayActivity[];
  setItinerary: React.Dispatch<React.SetStateAction<DayActivity[]>>;
}

// Real UAE attractions data
const uaeAttractions = {
  "Dubai Luxury Experience": [
    { name: "Burj Khalifa – Top Deck", duration: "2 hours", cost: 179, location: "Downtown Dubai" },
    { name: "Dubai Mall", duration: "3 hours", cost: 0, location: "Downtown Dubai" },
    { name: "Dubai Fountain Show", duration: "1 hour", cost: 0, location: "Downtown Dubai" },
    { name: "Desert Safari", duration: "6 hours", cost: 250, location: "Dubai Desert" },
    { name: "Ain Dubai", duration: "1 hour", cost: 130, location: "Bluewaters Island" },
    { name: "Dubai Miracle Garden", duration: "3 hours", cost: 55, location: "Al Barsha" },
  ],
  "UAE Grand Tour": [
    { name: "Sheikh Zayed Grand Mosque", duration: "2 hours", cost: 0, location: "Abu Dhabi" },
    { name: "Louvre Abu Dhabi", duration: "3 hours", cost: 63, location: "Saadiyat Island" },
    { name: "Ferrari World", duration: "4 hours", cost: 295, location: "Yas Island" },
    { name: "Jebel Jais Zipline", duration: "5 hours", cost: 341, location: "Ras Al Khaimah" },
    { name: "Dubai Frame", duration: "2 hours", cost: 50, location: "Zabeel Park" },
    { name: "Burj Khalifa – Top Deck", duration: "2 hours", cost: 179, location: "Downtown Dubai" },
  ],
  "Family Fun UAE": [
    { name: "Wild Wadi Waterpark", duration: "4 hours", cost: 299, location: "Jumeirah" },
    { name: "Ski Dubai", duration: "3 hours", cost: 220, location: "Mall of the Emirates" },
    { name: "Warner Bros World", duration: "5 hours", cost: 295, location: "Yas Island" },
    { name: "Dubai Miracle Garden", duration: "3 hours", cost: 55, location: "Al Barsha" },
    { name: "Yas Waterworld", duration: "4 hours", cost: 270, location: "Yas Island" },
    { name: "Dubai Aquarium", duration: "2 hours", cost: 120, location: "Dubai Mall" },
  ],
}

export default function ItineraryStep({ customOptions, userInfo, onNext, onBack, itinerary, setItinerary }: ItineraryStepProps) {
  const [openDays, setOpenDays] = useState<number[]>([1]);
  const days = Array.from({ length: userInfo.duration }, (_, i) => i + 1);

  const toggleDay = (day: number) => {
    setOpenDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  // Generate itinerary from customOptions and userInfo
  const generateItinerary = () => {
    const days = Array.from({ length: userInfo.duration }, (_, i) => i + 1);
    return days.map((dayNum) => {
      const dayKey = `day${dayNum}` as keyof CustomOptions;
      const day = customOptions[dayKey];
      const hotel = day.hotels ? hotelOptions[day.hotels as keyof typeof hotelOptions] : null;
      const transport = day.transport ? transportOptions[day.transport as keyof typeof transportOptions] : null;
      const attraction = day.attractions ? attractionOptions[day.attractions as keyof typeof attractionOptions] : null;
      const activities = [
        hotel ? `Hotel: ${hotel.name}` : null,
        transport ? `Transport: ${transport.name}` : null,
        attraction ? `Attraction: ${attraction.name}` : null,
      ].filter(Boolean) as string[];
      return {
        day: dayNum,
        city: "UAE", // Or use a more specific city if available
        activities,
        travelTime: "0 hours",
        locations: [hotel?.location, attraction?.location].filter(Boolean) as string[],
      };
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Your Custom Itinerary
        </CardTitle>
        <div className="text-sm text-gray-600">Review your selected options for each day below.</div>
      </CardHeader>
      <CardContent className="space-y-4">
        {days.map((dayNum) => {
          const dayKey = `day${dayNum}` as keyof CustomOptions;
          const day = customOptions[dayKey];
          const hotel = day.hotels ? hotelOptions[day.hotels as keyof typeof hotelOptions] : null;
          const transport = day.transport ? transportOptions[day.transport as keyof typeof transportOptions] : null;
          const attraction = day.attractions ? attractionOptions[day.attractions as keyof typeof attractionOptions] : null;
          const accentColors = ["border-blue-500", "border-green-500", "border-purple-500", "border-orange-500"];
          const accent = accentColors[(dayNum - 1) % accentColors.length];
          return (
            <div key={dayNum} className={`mb-8`}> {/* Day Card */}
              <div className={`bg-white rounded-2xl shadow-lg border-l-8 ${accent} transition-transform hover:scale-[1.01] duration-200`}> 
                <div className="flex flex-col gap-4 p-6">
                  {/* Day Number Header */}
                  <div className="flex items-center mb-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-2xl font-bold text-blue-700 shadow mr-3">{dayNum}</div>
                    <div className="text-xl font-semibold text-gray-700">Day {dayNum}</div>
                  </div>
                  {/* Items List */}
                  <div className="flex flex-col gap-4">
                    {/* Hotel */}
                    <div className="flex items-center gap-4 bg-blue-50 rounded-xl p-3 shadow-sm">
                      {hotel ? (
                        <img src={hotel.image} alt={hotel.name} className="w-14 h-14 rounded-xl object-cover border-2 border-blue-200 shadow-md hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">?</div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-blue-700">Hotel:</span>
                          {hotel ? (
                            <>
                              <span className="font-medium text-lg">{hotel.name}</span>
                              <Badge variant="outline">AED {hotel.price}</Badge>
                            </>
                          ) : (
                            <span className="text-gray-400 italic">Not selected</span>
                          )}
                        </div>
                        {hotel && (
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <MapPin className="w-4 h-4 text-blue-400" />
                            <span>{hotel.location}</span>
                          </div>
                        )}
                        {hotel && hotel.features && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {hotel.features.map((feature: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">{feature}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Transport */}
                    <div className="flex items-center gap-4 bg-purple-50 rounded-xl p-3 shadow-sm">
                      {transport ? (
                        <img src={transport.image} alt={transport.name} className="w-14 h-14 rounded-xl object-cover border-2 border-purple-200 shadow-md hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">?</div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-purple-700">Transport:</span>
                          {transport ? (
                            <>
                              <span className="font-medium text-lg">{transport.name}</span>
                              <Badge variant="outline">AED {transport.price}</Badge>
                            </>
                          ) : (
                            <span className="text-gray-400 italic">Not selected</span>
                          )}
                        </div>
                        {transport && (
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <MapPin className="w-4 h-4 text-purple-400" />
                            <span>{transport.features?.[0]}</span>
                          </div>
                        )}
                        {transport && transport.features && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {transport.features.map((feature: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">{feature}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Attractions */}
                    <div className="flex items-center gap-4 bg-orange-50 rounded-xl p-3 shadow-sm">
                      {attraction ? (
                        <img src={attraction.image} alt={attraction.name} className="w-14 h-14 rounded-xl object-cover border-2 border-orange-200 shadow-md hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">?</div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-orange-700">Attractions:</span>
                          {attraction ? (
                            <>
                              {attraction.url ? (
                                <a href={attraction.url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-700 underline hover:text-blue-900 text-lg">{attraction.name}</a>
                              ) : (
                                <span className="font-medium text-lg">{attraction.name}</span>
                              )}
                              <Badge variant="outline">AED {attraction.price}</Badge>
                              {attraction.duration && (
                                <Badge variant="secondary" className="ml-2 text-xs">{attraction.duration}</Badge>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-400 italic">Not selected</span>
                          )}
                        </div>
                        {attraction && (
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <MapPin className="w-4 h-4 text-orange-400" />
                            <span>{attraction.location}</span>
                          </div>
                        )}
                        {attraction && attraction.features && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {attraction.features.map((feature: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">{feature}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/* Summary Card */}
        <div className="sticky bottom-0 z-10 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg border border-blue-200 p-6 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <span className="text-lg font-semibold text-gray-700">Review your selections and proceed to confirm your trip!</span>
          </div>
          <div className="flex gap-4 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={onBack}
              className="px-8 py-2 rounded-full border border-blue-600 text-blue-700 bg-white hover:bg-blue-50 shadow-md text-lg font-medium transition-colors"
            >
              ← Back
            </button>
            <Button
              onClick={onNext}
              className="px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg shadow-md rounded-full"
            >
              Review & Confirm →
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
