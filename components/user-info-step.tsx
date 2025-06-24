"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { UserInfo } from "@/app/dream-trip-planner/page"
import { User, Calendar, DollarSign, Users, Plane, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserInfoStepProps {
  userInfo: UserInfo
  setUserInfo: (info: UserInfo) => void
  onNext: () => void
}

const budgetRanges = [
  "AED 5,000 - AED 15,000",
  "AED 15,000 - AED 30,000",
  "AED 30,000 - AED 60,000",
  "AED 60,000 - AED 120,000",
  "AED 120,000+",
]

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const travelOptions = [
  { value: "mumbai", label: "Mumbai, India" },
  { value: "delhi", label: "Delhi, India" },
  { value: "bangalore", label: "Bangalore, India" },
  { value: "chennai", label: "Chennai, India" },
  { value: "kolkata", label: "Kolkata, India" },
  { value: "hyderabad", label: "Hyderabad, India" },
  { value: "pune", label: "Pune, India" },
  { value: "ahmedabad", label: "Ahmedabad, India" },
  { value: "jaipur", label: "Jaipur, India" },
  { value: "lucknow", label: "Lucknow, India" },
  { value: "london", label: "London, UK" },
  { value: "paris", label: "Paris, France" },
  { value: "new-york", label: "New York, USA" },
  { value: "los-angeles", label: "Los Angeles, USA" },
  { value: "toronto", label: "Toronto, Canada" },
  { value: "sydney", label: "Sydney, Australia" },
  { value: "singapore", label: "Singapore" },
  { value: "tokyo", label: "Tokyo, Japan" },
  { value: "seoul", label: "Seoul, South Korea" },
  { value: "beijing", label: "Beijing, China" },
  { value: "dubai", label: "Dubai, UAE" },
  { value: "abudhabi", label: "Abu Dhabi, UAE" },
  { value: "riyadh", label: "Riyadh, Saudi Arabia" },
  { value: "jeddah", label: "Jeddah, Saudi Arabia" },
  { value: "doha", label: "Doha, Qatar" },
  { value: "manama", label: "Manama, Bahrain" },
  { value: "muscat", label: "Muscat, Oman" },
  { value: "kuwait", label: "Kuwait City, Kuwait" },
]

export default function UserInfoStep({ userInfo, setUserInfo, onNext }: UserInfoStepProps) {
  const [open, setOpen] = useState(false)

  const handleSubmit = () => {
    if (
      userInfo.name &&
      userInfo.budget &&
      userInfo.travelFrom &&
      userInfo.journeyMonth
    ) {
      onNext()
    }
  }

  const isFormValid =
    userInfo.name && userInfo.budget && userInfo.travelFrom && userInfo.journeyMonth

  return (
    <Card className="shadow-xl rounded-2xl border-blue-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-blue-800">
          <User className="w-6 h-6" />
          Traveler Information
        </CardTitle>
        <p className="text-gray-500 mt-1 text-base">Please provide your details to personalize your trip experience.</p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Personal Info */}
        <div>
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                placeholder="Enter your full name"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Plane className="w-4 h-4" />
                Departure City <span className="text-red-500">*</span>
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {userInfo.travelFrom
                      ? travelOptions.find((option) => option.value === userInfo.travelFrom)?.label
                      : "Select your city/country..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search cities and countries..." />
                    <CommandList>
                      <CommandEmpty>No city/country found.</CommandEmpty>
                      <CommandGroup>
                        {travelOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={(currentValue) => {
                              setUserInfo({ ...userInfo, travelFrom: currentValue })
                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                userInfo.travelFrom === option.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <hr className="my-2 border-blue-100" />
        {/* Trip Details */}
        <div>
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Trip Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Trip Duration (Days)
              </Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="1"
                max="30"
                autoComplete="off"
                placeholder="e.g. 7"
                value={userInfo.duration}
                onChange={(e) => setUserInfo({ ...userInfo, duration: Number.parseInt(e.target.value) || 7 })}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Journey Month <span className="text-red-500">*</span>
              </Label>
              <Select
                value={userInfo.journeyMonth}
                onValueChange={(value) => setUserInfo({ ...userInfo, journeyMonth: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Budget Range <span className="text-red-500">*</span>
              </Label>
              <Select value={userInfo.budget} onValueChange={(value) => setUserInfo({ ...userInfo, budget: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <hr className="my-2 border-blue-100" />
        {/* Travelers */}
        <div>
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Travelers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="adults">Adults (12+)</Label>
              <Input
                id="adults"
                name="adults"
                type="number"
                min={1}
                autoComplete="off"
                placeholder="e.g. 2"
                value={userInfo.adults}
                onChange={(e) => setUserInfo({ ...userInfo, adults: Number.parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>
        </div>
        {/* Sticky Next Button */}
        <div className="sticky bottom-0 z-20 bg-white border-t border-blue-100 flex justify-end p-4 rounded-b-2xl">
          <Button onClick={handleSubmit} disabled={!isFormValid} className="px-8 text-lg rounded-full shadow-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Next: Customize Trip →
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
