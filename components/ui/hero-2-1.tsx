"use client";

import { useState } from "react";
import { ArrowRight, Menu, X, MapPin, Plane, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

const Hero2 = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Photo Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10">
        {/* Logo/Brand at the top */}
        <div className="container mx-auto flex items-center px-4 py-6 mt-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
            <span className="font-bold">🌍</span>
          </div>
          <span className="ml-2 text-xl font-bold text-white">TravelPlanner AI</span>
        </div>

        {/* Badge */}
        <div className="mx-auto mt-6 flex max-w-fit items-center justify-center space-x-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm border border-white/30">
          <Compass className="h-4 w-4 text-white" />
          <span className="text-sm font-medium text-white">
            Your AI Travel Companion
          </span>
          <ArrowRight className="h-4 w-4 text-white" />
        </div>

        {/* Hero section */}
        <div className="container mx-auto mt-12 px-4 text-center">
          <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
            Plan Your Dream Adventure with AI
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90">
            Discover personalized travel itineraries, hidden gems, and unforgettable experiences. 
            Let AI craft your perfect journey from start to finish.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-8 sm:space-y-0">
            <Link href="/dream-trip-planner" passHref legacyBehavior>
              <button className="relative h-14 rounded-full px-10 text-lg font-semibold text-black bg-white overflow-hidden z-10 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
                <span className="relative z-20 drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)] flex items-center">
                  <Plane className="mr-2 h-5 w-5" />
                  Build Custom Tour
                </span>
                <span className="absolute inset-0 z-10 rounded-full p-[2px] pointer-events-none animate-pulse-gradient bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 blur-sm opacity-80 group-hover:opacity-100 group-hover:blur-md transition-all duration-300" style={{maskImage: 'linear-gradient(#fff 0 0)'}}></span>
              </button>
            </Link>
            <Link href="/dream-AI-trip-planner" passHref legacyBehavior>
              <button className="relative h-14 rounded-full border border-white/30 px-10 text-lg font-semibold text-white overflow-hidden z-10 bg-white/10 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl group hover:bg-white/20">
                <span className="relative z-20 drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)] flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Build through AI
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Hero2 }; 