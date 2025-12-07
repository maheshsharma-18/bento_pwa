import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Clock, Ghost } from "lucide-react"; // Replace with your PNGs later
import { cn } from "@/lib/utils";

export default function Welcome() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 0,
      icon: <ShieldCheck className="w-32 h-32 text-primary mb-6" />, // Replace with <img src={...} />
      title: t('welcome.slide1_title'),
      desc: t('welcome.slide1_desc'),
      bg: "bg-background"
    },
    {
      id: 1,
      icon: <Clock className="w-32 h-32 text-secondary mb-6" />,
      title: t('welcome.slide2_title'),
      desc: t('welcome.slide2_desc'),
      bg: "bg-background"
    },
    {
      id: 2,
      icon: <Ghost className="w-32 h-32 text-primary mb-6" />,
      title: t('welcome.slide3_title'),
      desc: t('welcome.slide3_desc'),
      bg: "bg-background"
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(curr => curr + 1);
    }
  };

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background">
      
      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center max-w-md w-full">
        <div className="animate-in fade-in zoom-in duration-500 key={currentSlide}">
            {slides[currentSlide].icon}
        </div>
        
        <h1 className="text-3xl font-heading font-bold text-primary mb-4 transition-all">
            {slides[currentSlide].title}
        </h1>
        
        <p className="text-lg text-text font-sans leading-relaxed">
            {slides[currentSlide].desc}
        </p>
      </div>

      {/* Bottom Controls */}
      <div className="w-full p-8 flex flex-col items-center gap-6">
        
        {/* Dots Indicator */}
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <div 
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                currentSlide === index ? "bg-primary w-8" : "bg-gray-300"
              )}
            />
          ))}
        </div>

        {/* Button Logic: Only show 'Get Started' on last slide */}
        <div className="h-14 w-full max-w-xs">
          {currentSlide === slides.length - 1 ? (
            <Button 
                onClick={() => navigate('/auth')}
                className="w-full h-12 text-lg rounded-3xl shadow-lg shadow-primary/20 animate-in fade-in slide-in-from-bottom-4"
            >
              {t('welcome.btn_start')}
            </Button>
          ) : (
            <Button 
                variant="ghost" 
                onClick={nextSlide}
                className="w-full text-text/50 hover:text-primary hover:bg-transparent"
            >
              Skip / Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
