import { useState } from "react";
import { Search as SearchIcon, Play, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useVideos } from "@/hooks/useVideos";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const { data: videos, isLoading } = useVideos();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const navigate = useNavigate();

  // Categories based on your database data
  const categories = ["Todos", "Aventuras", "Educativo", "Cantigas", "Aventuras dos Bichinhos"];

  // Filter Logic
  const filteredVideos = videos?.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 pt-8 min-h-screen bg-background">
      {/* Header & Search Bar */}
      <div className="mb-6 sticky top-0 bg-background pt-2 pb-4 z-10">
        <h1 className="text-2xl font-heading font-bold text-primary mb-4">
          Explorar
        </h1>
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input 
            className="w-full pl-12 h-14 rounded-3xl bg-white border-gray-100 shadow-sm text-lg focus-visible:ring-primary/50"
            placeholder="Buscar vídeos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Chips - Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-6 scrollbar-hide -mx-6 px-6">
        {categories.map((cat) => (
          <Button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            variant={selectedCategory === cat ? "default" : "secondary"}
            className={cn(
              "rounded-2xl h-10 px-6 font-bold whitespace-nowrap transition-all",
              selectedCategory === cat 
                ? "bg-primary text-white shadow-md shadow-primary/20" 
                : "bg-white text-text hover:bg-gray-50 border border-gray-100"
            )}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Results Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold text-text">
          {searchQuery || selectedCategory !== "Todos" ? "Resultados" : "Todos os vídeos"} 
          <span className="text-gray-400 ml-2 text-lg">
            ({filteredVideos?.length || 0})
          </span>
        </h2>
      </div>

      {/* Video List Grid */}
      {isLoading ? (
        <div className="text-center py-10 text-gray-400">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredVideos?.map((video) => (
            <div 
              key={video.id} 
              className="group bg-white rounded-2xl p-3 flex gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-all border border-transparent hover:border-primary/10"
            >
              {/* Thumbnail */}
              <div className="relative w-32 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                <img 
                  src={video.thumbnail_url || ""} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                {video.is_premium && (
                  <div className="absolute top-1 left-1 bg-[#F59E0B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center shadow-sm">
                    <Lock className="w-2.5 h-2.5 mr-1" />
                    Premium
                  </div>
                )}
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="w-4 h-4 text-primary fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col justify-center flex-1 py-1">
                <div className="flex items-start justify-between">
                   <h3 className="font-heading font-bold text-text leading-tight mb-1 line-clamp-2">
                    {video.title}
                  </h3>
                </div>
                
                <p className="text-xs text-gray-400 font-medium mb-2">
                  {video.category} • {Math.floor((video.duration || 0) / 60)} min
                </p>

                <Button 
                  size="sm" 
                  onClick={() => navigate(`/player/${video.id}`)}
                  className="w-fit h-8 rounded-xl text-xs bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors px-4"
                >
                  Assistir
                </Button>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredVideos?.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🔍
              </div>
              <h3 className="text-gray-500 font-bold">Nenhum vídeo encontrado</h3>
              <p className="text-gray-400 text-sm">Tente buscar por outro termo.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


