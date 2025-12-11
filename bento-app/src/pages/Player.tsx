import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Heart, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase"; // Import Supabase
import { useVideos } from "@/hooks/useVideos";

export default function Player() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { data: videos } = useVideos();
  
  // State for the Secure ID
  const [youtubeId, setYoutubeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  // Find metadata from cache (Title, Desc, etc.)
  const video = videos?.find((v) => v.id === videoId);

  useEffect(() => {
    const fetchVideoId = async () => {
      if (!videoId) return;

      // CALL THE NEW SECURE RPC
      const { data } = await supabase.rpc('get_video_embed', { 
        video_uuid: videoId 
      });

      if (data) {
        setYoutubeId(data);
      } else {
        setAccessDenied(true); // Premium content blocked
      }
      setLoading(false);
    };

    fetchVideoId();
  }, [videoId]);

  if (!video) return <div className="text-white p-10">Carregando detalhes...</div>;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)} 
          className="text-white hover:bg-white/20 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </div>

      {/* Video Player Area */}
      <div className="flex-1 flex items-center justify-center bg-black w-full">
        <div className="w-full aspect-video max-h-[80vh] relative bg-gray-900 flex items-center justify-center">
          
          {loading && <div className="animate-spin text-4xl">🦁</div>}

          {!loading && accessDenied && (
            <div className="text-center p-6">
                <Lock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Conteúdo Premium</h2>
                <p className="text-gray-400 mb-4">Atualize sua assinatura para assistir.</p>
                <Button onClick={() => navigate('/parents')} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    Gerenciar Assinatura
                </Button>
            </div>
          )}

          {!loading && youtubeId && (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&controls=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </div>

      {/* Video Details */}
      <div className="p-6 bg-black pb-12">
        <h1 className="text-2xl font-heading font-bold mb-2">{video.title}</h1>
        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-400 text-sm font-medium bg-gray-800 px-3 py-1 rounded-full">
            {video.category}
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Heart className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Share2 className="w-6 h-6" />
            </Button>
          </div>
        </div>
        <p className="text-gray-300 leading-relaxed text-sm">
          {video.description || "Sem descrição disponível."}
        </p>
      </div>
    </div>
  );
}
