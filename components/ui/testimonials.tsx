"use client";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { motion } from "motion/react";

const testimonials = [
  {
    text: "Wahawonders AI transformed our travel planning experience! The AI suggestions were spot-on and the customization options made our UAE trip unforgettable.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    name: "Sarah Johnson",
    role: "Travel Enthusiast",
  },
  {
    text: "The drag-and-drop interface is incredibly intuitive. I planned our entire 7-day Dubai adventure in just 30 minutes. Highly recommend!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    name: "Ahmed Hassan",
    role: "Business Traveler",
  },
  {
    text: "From luxury hotels to desert safaris, every recommendation was perfect. The price calculations and commission transparency are excellent.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    name: "Emily Chen",
    role: "Luxury Travel Consultant",
  },
  {
    text: "As a family, we loved how easy it was to customize each day. The attractions section helped us discover hidden gems in Abu Dhabi.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    name: "David Rodriguez",
    role: "Family Traveler",
  },
  {
    text: "The meal options and transportation choices were fantastic. We experienced authentic Emirati cuisine thanks to the local food recommendations.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    name: "Fatima Al-Zahra",
    role: "Food Blogger",
  },
  {
    text: "Wahawonders AI made our honeymoon planning effortless. The 5-star hotel selections and romantic attraction suggestions were perfect.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    name: "Michael & Lisa",
    role: "Honeymooners",
  },
  {
    text: "The quick add feature saved us so much time! We could easily add attractions and meals to any day with just one click.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    name: "Alex Thompson",
    role: "Tech Entrepreneur",
  },
  {
    text: "Perfect for group travel! We planned a corporate retreat for 15 people and the platform handled all our diverse preferences beautifully.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    name: "Jennifer Park",
    role: "HR Manager",
  },
  {
    text: "The real-time price updates and commission transparency gave us confidence in our booking decisions. No hidden fees!",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    name: "Robert Wilson",
    role: "Financial Advisor",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const Testimonials = () => {
  return (
    <section className="bg-background py-32 relative">
      <div className="container z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter text-foreground">
            What our travelers say
          </h2>
          <p className="text-center mt-5 text-muted-foreground text-lg">
            See what our customers have to say about their Wahawonders AI experience.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-16 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 