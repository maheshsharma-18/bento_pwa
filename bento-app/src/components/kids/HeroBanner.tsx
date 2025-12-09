import { Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Video } from "@/hooks/useVideos";
import { useNavigate } from "react-router-dom";

interface HeroBannerProps {
  video: Video;
}

export default function HeroBanner({ video }: HeroBannerProps) {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-[450px] rounded-[32px] overflow-hidden mb-8">
      {/* Background Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${video.thumbnail_url})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center text-center text-white">
        <h2 className="text-4xl font-heading font-bold mb-2 drop-shadow-lg leading-tight">
          {video.title}
        </h2>
        <p className="text-lg font-medium mb-6 drop-shadow-md opacity-90 max-w-xs">
            {video.description}
        </p>

        {/* Buttons - Matching design exactly */}
        <div className="flex gap-4 w-full max-w-sm">
          <Button 
            onClick={() => navigate(`/player/${video.id}`)}
            className="flex-1 h-14 bg-white text-text hover:bg-white/90 rounded-3xl text-lg font-bold"
          >
            <Play className="w-6 h-6 mr-2 fill-current" />
            Play
          </Button>
          <Button 
            variant="secondary"
            className="flex-1 h-14 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm rounded-3xl text-lg font-bold border border-white/10"
          >
            <Info className="w-6 h-6 mr-2" />
            More Info
          </Button>
        </div>
      </div>
    </div>
  );
}
