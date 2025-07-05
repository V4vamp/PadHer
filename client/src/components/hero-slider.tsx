import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, HandHeart } from "lucide-react";
import { Link } from "wouter";

const heroImages = [
  {
    url: "https://pixabay.com/get/g981d8d51d4193847cddb2069a3e3532a872c5a642df7f1166b4dab9c5213337cb15d43533423348097e4f9b8c3c2efcb8189e55c727ac984bcf04ddd3ec6e37d_1280.jpg",
    alt: "Period poverty awareness campaign"
  },
  {
    url: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    alt: "Young girls education program"
  },
  {
    url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    alt: "Community volunteer outreach"
  },
  {
    url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
    alt: "Girls empowerment workshop"
  }
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      className="relative h-screen flex items-center bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
      style={{
        backgroundImage: `url(${heroImages[currentIndex].url})`
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 gradient-overlay" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Empowering Girls
            <span className="block text-accent-pink">One Pad at a Time</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Join us in breaking the cycle of period poverty. Every donation provides sanitary pads and education to young girls who need them most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate">
              <Button size="lg" className="btn-primary text-lg px-8 py-4">
                <Heart className="mr-2 h-6 w-6" />
                Donate Today
              </Button>
            </Link>
            <Link href="/volunteer">
              <Button 
                size="lg" 
                className="bg-white text-primary-pink hover:bg-accent-pink text-lg px-8 py-4 transition-colors"
              >
                <HandHeart className="mr-2 h-6 w-6" />
                Volunteer
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "bg-white scale-125" 
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
