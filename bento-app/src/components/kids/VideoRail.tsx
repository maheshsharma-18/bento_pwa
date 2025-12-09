import type { Video } from "@/hooks/useVideos";
import { Play, Lock } from "lucide-react";

interface VideoRailProps {
  title: string;
  icon?: React.ReactNode;
  videos: Video[];
}

export default function VideoRail({ title, icon, videos }: VideoRailProps) {
  if (videos.length === 0) return null;

  return (
    <section className="mb-8">
      {/* Section Title with Icon */}
      <div className="flex items-center gap-3 mb-4 px-2">
        {icon}
        <h3 className="text-xl font-heading font-bold text-text">{title}</h3>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide snap-x">
        {videos.map((video) => (
          <div 
            key={video.id} 
            className="relative flex-none w-[220px] h-[140px] rounded-2xl overflow-hidden snap-start shadow-md"
          >
            {/* Thumbnail */}
            <img 
              src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`} 
              alt={video.title}
              className="w-full h-full object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

            {/* Premium Tag (if applicable) */}
            {video.is_premium && (
              <div className="absolute top-3 right-3 bg-[#F59E0B] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                <Lock className="w-3 h-3 mr-1" />
                Premium
              </div>
            )}

            {/* Title & Play Icon */}
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
              <h4 className="text-white font-bold text-sm truncate pr-2">{video.title}</h4>
              <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-current" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
