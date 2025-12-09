import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil } from "lucide-react";
import { useProfiles } from "@/hooks/useProfiles";
import { Button } from "@/components/ui/button";

export default function ManageProfiles() {
  const navigate = useNavigate();
  const { data: profiles, isLoading } = useProfiles();

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <header className="flex items-center gap-4 mb-10">
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/parents")} // Back to Dashboard
            className="rounded-full"
        >
            <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-heading font-bold text-text">Gerenciar Perfis</h1>
      </header>

      {/* Profiles Grid */}
      <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
        {isLoading && <div className="col-span-2 text-center">Carregando...</div>}
        
        {profiles?.map((profile) => (
          <div 
            key={profile.id} 
            className="relative group flex flex-col items-center gap-3"
          >
            {/* Edit Button Overlay */}
            <div 
                className="relative w-32 h-32 cursor-pointer"
                onClick={() => navigate(`/parents/profiles/${profile.id}`)}
            >
                <img 
                    src={profile.avatar_url || ""} 
                    alt={profile.name}
                    className="w-full h-full object-cover rounded-3xl border-4 border-transparent group-hover:border-primary/50 transition-all bg-white shadow-sm"
                />
                {/* Pencil Icon Badge */}
                <div className="absolute inset-0 bg-black/20 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="w-8 h-8 text-white" />
                </div>
            </div>
            
            <span className="font-heading font-bold text-lg text-text">
              {profile.name}
            </span>
          </div>
        ))}

        {/* Add New Button */}
        <div 
          className="flex flex-col items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/parents/profiles/new")}
        >
          <div className="w-32 h-32 rounded-3xl border-2 border-dashed border-gray-300 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
            <Plus className="w-10 h-10 text-gray-400 group-hover:text-primary" />
          </div>
          <span className="font-heading font-bold text-lg text-gray-400 group-hover:text-primary">
            Adicionar
          </span>
        </div>
      </div>
    </div>
  );
}
