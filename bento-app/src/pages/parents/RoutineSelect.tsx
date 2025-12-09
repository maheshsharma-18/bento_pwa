import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { useProfiles } from "@/hooks/useProfiles";
import { Button } from "@/components/ui/button";

export default function RoutineSelect() {
  const navigate = useNavigate();
  const { data: profiles, isLoading } = useProfiles();

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="flex items-center gap-4 mb-10">
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/parents")} 
            className="rounded-full"
        >
            <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-heading font-bold text-text">Configurar Rotina</h1>
      </header>

      <div className="text-center mb-8">
        <p className="text-gray-500">Selecione o perfil para definir horários</p>
      </div>

      <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
        {isLoading && <div className="col-span-2 text-center">Carregando...</div>}
        
        {profiles?.map((profile) => (
          <div 
            key={profile.id} 
            className="group flex flex-col items-center gap-3 cursor-pointer"
            onClick={() => navigate(`/parents/routine/${profile.id}`)}
          >
            <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-4 border-transparent group-hover:border-primary/50 transition-all shadow-sm">
                <img 
                    src={profile.avatar_url || ""} 
                    alt={profile.name}
                    className="w-full h-full object-cover bg-white"
                />
                {/* Clock Badge */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Clock className="w-10 h-10 text-white" />
                </div>
            </div>
            <span className="font-heading font-bold text-lg text-text">
              {profile.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
