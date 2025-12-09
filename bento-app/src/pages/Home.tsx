import { useVideos } from "@/hooks/useVideos";
import HeroBanner from "@/components/kids/HeroBanner";
import VideoRail from "@/components/kids/VideoRail";
import { PawPrint } from "lucide-react";

export default function Home() {
  const { data: videos, isLoading, error } = useVideos();

  if (isLoading) {
    return <div className="flex justify-center p-20"><div className="animate-spin text-4xl">🦁</div></div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error loading videos.</div>;
  }

  // 1. Find the Featured Hero Video ("O Bosque Mágico")
  const heroVideo = videos?.find(v => v.featured);

  // 2. Filter videos for specific categories
  const adventureVideos = videos?.filter(v => v.category === 'Aventuras dos Bichinhos' && !v.featured) || [];
  const educationalVideos = videos?.filter(v => v.category === 'Educativo') || [];

  return (
    <div className="p-6 pt-8">
      {/* Header - Matching design */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading font-extrabold text-text leading-none">
          Netflix for<br />Kids
        </h1>
        {/* Replace with actual user avatar/mascot later */}
        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-2xl border-2 border-white shadow-sm">
          🦊
        </div>
      </header>

      {/* Hero Banner */}
      {heroVideo && <HeroBanner video={heroVideo} />}

      {/* Video Rails */}
      <VideoRail 
        title="Aventuras dos Bichinhos" 
        icon={<PawPrint className="w-6 h-6 text-orange-500 fill-current" />}
        videos={adventureVideos}
      />
      
      <VideoRail 
        title="Aprender é Divertido" 
        videos={educationalVideos}
      />
      
      {/* Add more rails as needed */}
    </div>
  );
}

