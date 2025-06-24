"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plane, MapPin, Calendar, Users, DollarSign, Sparkles, ArrowLeft, CheckCircle, Star, Camera, Clock, CreditCard } from "lucide-react";
import UserInfoStep from "@/components/user-info-step";
import ItineraryStep from "@/components/itinerary-step";
import CustomizeStep from "@/components/customize-step";
import SummaryStep from "@/components/summary-step";
import { InfoCard } from "@/components/ui/info-card";

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

// UAE Travel Data (from the provided JSON)
const uaeData = {
  hotels: [
    { id: "hotel-rak-inn", name: "RAK Inn 3★", stars: 3, costPerNight: 250 },
    { id: "hotel-marina-4", name: "Marina View 4★", stars: 4, costPerNight: 450 },
    { id: "hotel-atlantis-5", name: "Atlantis The Palm 5★", stars: 5, costPerNight: 1200 },
    { id: "marriot-abu-dhabi", name: "Marriott Abu Dhabi 5★", stars: 5, costPerNight: 2200 },
  ],
  transports: [
    { id: "basic", label: "Basic Sedan", costPerDay: 200 },
    { id: "mid", label: "Mid Luxury Van", costPerDay: 350 },
    { id: "lux-suv", label: "Luxury SUV", costPerDay: 600 },
  ],
  attractions: [
    { id: "burj-khalifa", name: "Burj Khalifa – Top Deck", emirate: "Dubai", durationHrs: 2, costAdult: 179 },
    { id: "dubai-fountain", name: "Dubai Fountain Show", emirate: "Dubai", durationHrs: 1, costAdult: 0 },
    { id: "grand-mosque", name: "Sheikh Zayed Grand Mosque", emirate: "Abu Dhabi", durationHrs: 2, costAdult: 0 },
    { id: "louvre-abu-dhabi", name: "Louvre Abu Dhabi", emirate: "Abu Dhabi", durationHrs: 3, costAdult: 63 },
    { id: "ferrari-world", name: "Ferrari World", emirate: "Abu Dhabi", durationHrs: 4, costAdult: 295 },
    { id: "dubai-mall", name: "Dubai Mall", emirate: "Dubai", durationHrs: 3, costAdult: 0 },
    { id: "desert-safari", name: "Dubai Desert Safari", emirate: "Dubai", durationHrs: 6, costAdult: 250 },
    { id: "ain-dubai", name: "Ain Dubai", emirate: "Dubai", durationHrs: 1, costAdult: 130 },
    { id: "miracle-garden", name: "Dubai Miracle Garden", emirate: "Dubai", durationHrs: 3, costAdult: 55 },
    { id: "yas-waterworld", name: "Yas Waterworld", emirate: "Abu Dhabi", durationHrs: 4, costAdult: 270 },
    { id: "jebel-jais", name: "Jebel Jais Zipline", emirate: "Ras Al Khaimah", durationHrs: 5, costAdult: 341 },
    { id: "wild-wadi", name: "Wild Wadi Waterpark", emirate: "Dubai", durationHrs: 4, costAdult: 299 },
    { id: "ski-dubai", name: "Ski Dubai", emirate: "Dubai", durationHrs: 3, costAdult: 220 },
    { id: "dubai-frame", name: "Dubai Frame", emirate: "Dubai", durationHrs: 2, costAdult: 50 },
    { id: "warner-bros-world", name: "Warner Bros World", emirate: "Abu Dhabi", durationHrs: 5, costAdult: 295 },
  ],
};

interface AISuggestionsStepProps {
  userInfo: UserInfo;
  selectedPlan: TripPlan | null;
  setSelectedPlan: (plan: TripPlan) => void;
  onNext: () => void;
  onBack: () => void;
}

function AISuggestionsStep({
  userInfo,
  selectedPlan,
  setSelectedPlan,
  onNext,
  onBack,
}: AISuggestionsStepProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [suggestions, setSuggestions] = useState<TripPlan[]>([]);
  const [aiProgress, setAiProgress] = useState<number>(0);

  useEffect(() => {
    const generateSuggestions = () => {
      setLoading(true);
      setAiProgress(0);
      const progressInterval = setInterval(() => {
        setAiProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
      setTimeout(() => {
        const baseBudget = userInfo.budget.includes("25,000")
          ? 35000
          : userInfo.budget.includes("50,000")
            ? 65000
            : userInfo.budget.includes("1,00,000")
              ? 120000
              : 85000;
        const plans: TripPlan[] = [
          {
            id: "1",
            title: "Dubai Luxury Experience",
            cities: ["Dubai"],
            duration: userInfo.duration,
            budget: Math.round(baseBudget * 1.2),
            theme: "Luxury & Modern Marvels",
            description: "Experience the pinnacle of luxury in the world's most glamorous city",
            highlights: [
              "Burj Khalifa Top Deck",
              "Atlantis The Palm Stay",
              "Dubai Mall Shopping",
              "Desert Safari Adventure",
              "Luxury SUV Transport",
            ],
          },
          {
            id: "2",
            title: "UAE Grand Tour",
            cities: ["Dubai", "Abu Dhabi", "Ras Al Khaimah"],
            duration: userInfo.duration,
            budget: Math.round(baseBudget * 0.9),
            theme: "Cultural Heritage & Adventure",
            description: "Discover the rich culture and modern wonders across three emirates",
            highlights: [
              "Sheikh Zayed Grand Mosque",
              "Ferrari World Abu Dhabi",
              "Jebel Jais Zipline",
              "Louvre Abu Dhabi",
              "Multi-Emirate Experience",
            ],
          },
          {
            id: "3",
            title: "Family Fun UAE",
            cities: ["Dubai", "Abu Dhabi"],
            duration: userInfo.duration,
            budget: Math.round(baseBudget * 0.8),
            theme: "Family Entertainment",
            description: "Perfect family adventure with theme parks and kid-friendly attractions",
            highlights: [
              "Wild Wadi Waterpark",
              "Ski Dubai Experience",
              "Warner Bros World",
              "Dubai Miracle Garden",
              "Family-Friendly Hotels",
            ],
          },
        ];
        setSuggestions(plans);
        setLoading(false);
        clearInterval(progressInterval);
        setAiProgress(100);
      }, 3000);
    };
    generateSuggestions();
  }, [userInfo]);

  const handleSelectPlan = (plan: TripPlan) => {
    setSelectedPlan(plan);
  };

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="relative">
              <Sparkles className="w-5 h-5 animate-spin text-blue-500" />
              <div className="absolute inset-0 animate-ping">
                <Sparkles className="w-5 h-5 text-blue-300" />
              </div>
            </div>
            AI is crafting your perfect UAE experience...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-8">
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-spin">
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1"></div>
              </div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white animate-bounce" />
              </div>
            </div>
            <div className="w-full max-w-md mx-auto mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Analyzing preferences...</span>
                <span>{Math.round(aiProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${aiProgress}%` }}
                ></div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600 font-medium">🤖 Processing your travel preferences...</p>
              <p className="text-sm text-gray-500">
                Matching you with the best UAE experiences for your {userInfo.journeyMonth} journey from {userInfo.travelFrom}
              </p>
            </div>
          </div>
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
                <CardContent className="p-6 relative">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                      <Skeleton className="h-12 w-12 rounded-full" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="relative">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          AI-Powered UAE Trip Suggestions
        </CardTitle>
        <p className="text-gray-600">
          Based on your preferences, here are 3 perfect UAE experiences crafted just for you ✨
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6">
          {suggestions.map((plan, index) => {
            const cardColors = [
              {
                borderColor: "#FF5613",
                hoverTextColor: "#000",
                image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
              },
              {
                borderColor: "#9F4EFF",
                hoverTextColor: "#fff",
                image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
              },
              {
                borderColor: "#2196F3",
                hoverTextColor: "#fff",
                image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
              },
            ];
            const cardConfig = cardColors[index] || cardColors[0];
            return (
              <div
                key={plan.id}
                className={`relative group cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                  selectedPlan?.id === plan.id ? "scale-[1.01]" : ""
                }`}
                onClick={() => handleSelectPlan(plan)}
              >
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    <InfoCard
                      image={cardConfig.image}
                      title={plan.title}
                      description={plan.description}
                      borderColor={cardConfig.borderColor}
                      borderBgColor="#f5f5f5"
                      cardBgColor="#fff"
                      textColor="#242424"
                      hoverTextColor={cardConfig.hoverTextColor}
                      effectBgColor={cardConfig.borderColor}
                      patternColor1="rgba(200,200,200,0.10)"
                      patternColor2="rgba(220,220,220,0.10)"
                      contentPadding="14.3px 16px"
                      width={388}
                      height={378}
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      {selectedPlan?.id === plan.id && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-sm font-medium text-green-600">Selected</span>
                        </div>
                      )}
                      <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                        <Star className="w-3 h-3 mr-1 text-yellow-500" />
                        {plan.theme}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {index === 0 ? "🏆 Most Popular" : index === 1 ? "🌟 Best Value" : "👨‍👩‍👧‍👦 Family Favorite"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-xs text-gray-500">Destinations</p>
                          <p className="text-sm font-medium">{plan.cities.join(" → ")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        <div>
                          <p className="text-xs text-gray-500">Duration</p>
                          <p className="text-sm font-medium">{plan.duration} days</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-purple-500" />
                        <div>
                          <p className="text-xs text-gray-500">Total Cost</p>
                          <p className="text-sm font-bold text-green-600">₹{plan.budget.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        Experience Highlights:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {plan.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                            <span className="text-gray-700">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        Perfect for {userInfo.journeyMonth} travel from {userInfo.travelFrom}
                      </div>
                      <Button
                        className={`px-6 transition-all duration-200 ${
                          selectedPlan?.id === plan.id
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        }`}
                      >
                        {selectedPlan?.id === plan.id ? "✓ Selected" : "Choose This Plan"}
                      </Button>
                    </div>
                    {selectedPlan?.id === plan.id && (
                      <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800 font-medium flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Excellent choice! This plan perfectly covers {plan.cities.slice(0, 2).join(" & ")}
                          {plan.cities.length > 2 && ` and more emirates`} for your {userInfo.journeyMonth} trip
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Preferences
          </Button>
          <Button
            onClick={onNext}
            disabled={!selectedPlan}
            className="px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
          >
            View Detailed Itinerary →
          </Button>
        </div>
        <div className="text-center pt-4 border-t">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>AI Confidence: 98% match with your preferences</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type ItineraryStep2Props = {
  userInfo: UserInfo;
  customOptions: CustomOptions;
  itinerary: DayActivity[];
  setItinerary: React.Dispatch<React.SetStateAction<DayActivity[]>>;
  onNext: () => void;
  onBack: () => void;
  selectedPlan: TripPlan | null;
};

function ItineraryStep2(props: ItineraryStep2Props) {
  const { userInfo, customOptions, itinerary, setItinerary, onNext, onBack, selectedPlan } = props;

  if (!selectedPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">No Plan Selected</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-700 text-lg mb-6">Please go back and select an AI plan to view your itinerary.</div>
          <Button variant="outline" onClick={onBack}>Back</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-2xl border-0">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-8">
        <CardTitle className="text-white text-3xl flex items-center gap-3">
          <span className="inline-block w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>
          {selectedPlan.title}
        </CardTitle>
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="w-5 h-5" />
            <span className="font-medium">{selectedPlan.cities.join(" → ")}</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <Clock className="w-5 h-5" />
            <span>{selectedPlan.duration} days</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <DollarSign className="w-5 h-5" />
            <span className="font-bold">₹{selectedPlan.budget.toLocaleString()}</span>
          </div>
        </div>
        <div className="mt-2 text-white/80 text-lg">{selectedPlan.description}</div>
      </CardHeader>
      <CardContent className="p-8 bg-white rounded-b-2xl">
        <h3 className="text-xl font-semibold text-blue-700 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Day-by-Day Itinerary
        </h3>
        <div className="space-y-8">
          {Array.from({ length: selectedPlan.duration }, (_, i) => (
            <div key={i} className="flex gap-6 items-start">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-xl font-bold text-blue-700 shadow mb-2">
                  {i + 1}
                </div>
                {i < selectedPlan.duration - 1 && <div className="w-1 h-16 bg-gradient-to-b from-blue-200 to-purple-200" />}
              </div>
              <div className="flex-1 bg-blue-50 rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-blue-700">{selectedPlan.cities[i % selectedPlan.cities.length]}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedPlan.highlights.slice(i, i + 2).map((hl, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700">
                      <Sparkles className="w-3 h-3 mr-1 text-purple-400 inline" />
                      {hl}
                    </Badge>
                  ))}
                </div>
                <div className="text-gray-700 text-sm">Enjoy curated experiences and must-see attractions for this day.</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <div className="sticky bottom-0 left-0 w-full bg-white border-t z-50 flex flex-col sm:flex-row gap-4 p-4 shadow-lg rounded-b-2xl">
        <Button variant="outline" onClick={onBack} className="flex-1 text-lg rounded-full shadow-md border border-blue-600 text-blue-700 bg-white hover:bg-blue-50 hover:text-blue-900 transition-colors">
          Back
        </Button>
        <Button onClick={onNext} className="flex-1 px-8 text-lg rounded-full shadow-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold">
          Confirm & Continue
        </Button>
      </div>
    </Card>
  );
}

type SummaryStep2Props = {
  userInfo: UserInfo;
  selectedPlan: TripPlan | null;
  itinerary: DayActivity[];
  customOptions: CustomOptions;
  onBack: () => void;
};

function SummaryStep2(props: SummaryStep2Props) {
  const { userInfo, selectedPlan, itinerary, customOptions, onBack } = props;

  if (!selectedPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">No Plan Selected</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-700 text-lg mb-6">Please go back and select an AI plan to view your summary.</div>
          <Button variant="outline" onClick={onBack}>Back</Button>
        </CardContent>
      </Card>
    );
  }

  // Price breakdown logic (reuse from previous summary)
  const subtotal = selectedPlan.budget;
  const commission = subtotal * 0.1;
  const total = subtotal + commission;

  return (
    <Card className="shadow-2xl border-0">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-8">
        <CardTitle className="text-white text-3xl flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-yellow-300" />
          {selectedPlan.title}
        </CardTitle>
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="w-5 h-5" />
            <span className="font-medium">{selectedPlan.cities.join(" → ")}</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <Clock className="w-5 h-5" />
            <span>{selectedPlan.duration} days</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 bg-white rounded-b-2xl">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Trip Details Card */}
          <div className="bg-blue-50 rounded-xl p-6 shadow-md space-y-3">
            <h3 className="text-lg font-semibold text-blue-700 mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" /> Traveler Info
            </h3>
            <div className="flex flex-col gap-2 text-gray-700 text-sm">
              <div><span className="font-medium">Name:</span> {userInfo.name}</div>
              <div><span className="font-medium">Departure:</span> {userInfo.travelFrom}</div>
              <div><span className="font-medium">Journey Month:</span> {userInfo.journeyMonth}</div>
              <div><span className="font-medium">Duration:</span> {selectedPlan.duration} days</div>
              <div><span className="font-medium">Budget:</span> ₹{selectedPlan.budget.toLocaleString()}</div>
              <div><span className="font-medium">Destinations:</span> {selectedPlan.cities.join(" → ")}</div>
            </div>
          </div>
          {/* Price Breakdown Card */}
          <div className="bg-green-50 rounded-xl p-6 shadow-md space-y-3">
            <h3 className="text-lg font-semibold text-green-700 mb-2 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-400" /> Price Breakdown
            </h3>
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Commission (10%)</span>
              <span>₹{commission.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t-2 border-green-300 pt-3">
              <span>Total Amount:</span>
              <span className="text-green-600">₹{total.toLocaleString(undefined, { minimumFractionDigits: 2 })} (w/ 10% commission)</span>
            </div>
          </div>
        </div>
        {/* Highlights Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" /> Trip Highlights
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedPlan.highlights.map((hl, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700">
                <Sparkles className="w-3 h-3 mr-1 text-purple-400 inline" />
                {hl}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <div className="sticky bottom-0 left-0 w-full bg-white border-t z-50 flex flex-col sm:flex-row gap-4 p-4 shadow-lg rounded-b-2xl">
        <Button variant="outline" onClick={onBack} className="flex-1 text-lg rounded-full shadow-md border border-blue-600 text-blue-700 bg-white hover:bg-blue-50 hover:text-blue-900 transition-colors">
          Back
        </Button>
        <Button className="flex-1 px-8 text-lg rounded-full shadow-md bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold">
          Finish
        </Button>
      </div>
    </Card>
  );
}

export default function DreamAITripPlannerPage() {
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
    { number: 2, title: "AI Suggestions", icon: Plane },
    { number: 3, title: "Itinerary 2", icon: Calendar },
    { number: 4, title: "Summary 2", icon: DollarSign },
  ];

  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length) {
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
        return <AISuggestionsStep userInfo={userInfo} selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} onNext={nextStep} onBack={prevStep} />;
      case 3:
        return (
          <ItineraryStep2
            userInfo={userInfo}
            customOptions={customOptions}
            itinerary={itinerary}
            setItinerary={setItinerary}
            onNext={nextStep}
            onBack={prevStep}
            selectedPlan={selectedPlan}
          />
        );
      case 4:
        return (
          <SummaryStep2
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🤖 Dream AI Trip Planner</h1>
          <p className="text-gray-600">Plan your perfect getaway with AI assistance in 4 simple steps</p>
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
              <span>Step {currentStep} of {steps.length}</span>
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