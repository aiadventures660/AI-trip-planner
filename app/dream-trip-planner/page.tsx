"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MapPin, Calendar, Users, DollarSign } from "lucide-react";
import UserInfoStep from "@/components/user-info-step";
import CustomizeStep from "@/components/customize-step";
import ItineraryStep from "@/components/itinerary-step";
import SummaryStep from "@/components/summary-step";
import { hotelOptions, mealOptions, transportOptions, attractionOptions } from "@/components/customize-trip/data";

export interface UserInfo {
  name: string;
  duration: number;
  budget: string;
  adults: number;
  children: number;
  infants: number;
  travelFrom: string;
  journeyMonth: string;
}

export interface TripPlan {
  id: string;
  title: string;
  cities: string[];
  duration: number;
  budget: number;
  theme: string;
  description: string;
  highlights: string[];
}

export interface DayActivity {
  day: number;
  city: string;
  activities: string[];
  travelTime: string;
  locations: string[];
}

export interface DayCustomization {
  day: number;
  hotels: string | null;
  meals: string | null;
  transport: string | null;
  attractions: string | null;
}

export interface CustomOptions {
  day1: DayCustomization;
  day2: DayCustomization;
  day3: DayCustomization;
  day4: DayCustomization;
  day5: DayCustomization;
  day6: DayCustomization;
  day7: DayCustomization;
}

function generateItinerary(customOptions: CustomOptions, userInfo: UserInfo) {
  const days = Array.from({ length: userInfo.duration }, (_, i) => i + 1);
  return days.map((dayNum) => {
    const dayKey = `day${dayNum}` as keyof CustomOptions;
    const day = customOptions[dayKey];
    const hotel = day.hotels ? hotelOptions[day.hotels as keyof typeof hotelOptions] : null;
    const meal = day.meals ? mealOptions[day.meals as keyof typeof mealOptions] : null;
    const transport = day.transport ? transportOptions[day.transport as keyof typeof transportOptions] : null;
    const attraction = day.attractions ? attractionOptions[day.attractions as keyof typeof attractionOptions] : null;
    const activities = [
      hotel ? `Hotel: ${hotel.name}` : null,
      meal ? `Meal: ${meal.name}` : null,
      transport ? `Transport: ${transport.name}` : null,
      attraction ? `Attraction: ${attraction.name}` : null,
    ].filter(Boolean) as string[];
    return {
      day: dayNum,
      city: "UAE",
      activities,
      travelTime: "0 hours",
      locations: [hotel?.location, attraction?.location].filter(Boolean) as string[],
    };
  });
}

export default function DreamTripPlannerPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    duration: 7,
    budget: "",
    adults: 2,
    children: 0,
    infants: 0,
    travelFrom: "",
    journeyMonth: "",
  });
  const [selectedPlan, setSelectedPlan] = useState<TripPlan | null>(null);
  const [itinerary, setItinerary] = useState<DayActivity[]>([]);
  const [customOptions, setCustomOptions] = useState<CustomOptions>({
    day1: { day: 1, hotels: null, meals: null, transport: null, attractions: null },
    day2: { day: 2, hotels: null, meals: null, transport: null, attractions: null },
    day3: { day: 3, hotels: null, meals: null, transport: null, attractions: null },
    day4: { day: 4, hotels: null, meals: null, transport: null, attractions: null },
    day5: { day: 5, hotels: null, meals: null, transport: null, attractions: null },
    day6: { day: 6, hotels: null, meals: null, transport: null, attractions: null },
    day7: { day: 7, hotels: null, meals: null, transport: null, attractions: null },
  });

  const steps = [
    { number: 1, title: "User Information", icon: Users },
    { number: 2, title: "Customize Trip", icon: MapPin },
    { number: 3, title: "Itinerary", icon: Calendar },
    { number: 4, title: "Summary", icon: DollarSign },
  ];

  const progress = (currentStep / 4) * 100;

  const nextStep = () => {
    if (currentStep === 3) {
      setItinerary(generateItinerary(customOptions, userInfo));
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <UserInfoStep userInfo={userInfo} setUserInfo={setUserInfo} onNext={nextStep} />;
      case 2:
        return (
          <CustomizeStep
            customOptions={customOptions}
            setCustomOptions={setCustomOptions}
            userInfo={userInfo}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <ItineraryStep
            customOptions={customOptions}
            userInfo={userInfo}
            itinerary={itinerary}
            setItinerary={setItinerary}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <SummaryStep
            userInfo={userInfo}
            selectedPlan={selectedPlan}
            itinerary={itinerary}
            customOptions={customOptions}
            onBack={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">✈️ Dream Trip Planner</h1>
          <p className="text-gray-600">Plan your perfect getaway in 5 simple steps</p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.number}
                    className={`flex flex-col items-center ${
                      currentStep >= step.number ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        currentStep >= step.number ? "bg-blue-600 text-white" : "bg-gray-200"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-center">{step.title}</span>
                  </div>
                );
              })}
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Step {currentStep} of 4</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </CardContent>
        </Card>

        {/* Current Step Content */}
        {renderStep()}
      </div>
    </div>
  );
} 