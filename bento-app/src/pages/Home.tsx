import { useVideos } from "@/hooks/useVideos";
import HeroBanner from "@/components/kids/HeroBanner";
import VideoRail from "@/components/kids/VideoRail";
import { PawPrint, Lock } from "lucide-react"; // Added Lock icon
import { useNavigate } from "react-router-dom"; // Added hook for navigation
import { Button } from "@/components/ui/button"; // Added Button component

export default function Home() {
  const { data: videos, isLoading, error } = useVideos();
  const navigate = useNavigate();

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
  const songsVideos = videos?.filter(v => v.category === 'Cantigas') || [];

  return (
    <div className="p-6 pt-8 pb-24">
      {/* Header - Branding & Parent Access */}
      <header className="flex justify-between items-start mb-8">
        <div>
           {/* TASK 1.1: BRANDING FIX */}
          <h1 className="text-2xl font-heading font-extrabold text-primary leading-tight">
            Bento
          </h1>
          <p className="text-sm font-bold text-gray-400">
            vídeos divertidos e educativos
          </p>
        </div>

        {/* TASK 1.2: PARENT LOCK ICON */}
        <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/parents')}
              className="text-gray-400 hover:text-primary hover:bg-primary/10 rounded-full"
            >
              <Lock className="w-6 h-6" />
            </Button>
            
            {/* Child Avatar (Static for now, keeps UI balanced) */}
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-xl border-2 border-white shadow-sm">
              🦊
            </div>
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

      <VideoRail 
        title="Cantigas e Músicas" 
        videos={songsVideos}
      />
      
      {/* Add more rails as needed */}
    </div>
  );
}

