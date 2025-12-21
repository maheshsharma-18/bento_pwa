import { useEffect } from "react"; // Add useEffect
// ... imports
import { useNavigate } from "react-router-dom";
import { Plus, Settings } from "lucide-react";
import { useProfiles } from "@/hooks/useProfiles";
import { useSessionStore } from "@/stores/useSessionStore";
import { Button } from "@/components/ui/button";

export default function WhoIsWatching() {
  const navigate = useNavigate();
  const { data: profiles, isLoading } = useProfiles();
  const { setSelectedChild, lockParentMode } = useSessionStore(); // Get lockParentMode

  // LOCK ON MOUNT: If they are on this screen, Parent Mode should be locked.
  useEffect(() => {
    lockParentMode();
  }, [lockParentMode]);

  const handleSelectProfile = (profile: any) => {
    setSelectedChild(profile);
    navigate("/home"); // <--- CHANGED: Was "/" before, now "/home"
  };

  const handleParentArea = () => {
    // Navigate to Parent Dashboard (We will build this in Step 2)
    navigate("/parents");
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-primary">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-heading font-bold text-text mb-2">Quem está assistindo?</h1>
        <p className="text-gray-500">Escolha um perfil para começar</p>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-2 gap-8 mb-12 max-w-md w-full place-items-center">
        {profiles?.map((profile) => (
          <div 
            key={profile.id} 
            className="group flex flex-col items-center gap-3 cursor-pointer"
            onClick={() => handleSelectProfile(profile)}
          >
            <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-4 border-transparent group-hover:border-primary transition-all shadow-sm group-hover:shadow-lg group-hover:scale-105">
              <img 
                src={profile.avatar_url || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${profile.name}`} 
                alt={profile.name}
                className="w-full h-full object-cover bg-white"
              />
            </div>
            <span className="font-heading font-bold text-lg text-text group-hover:text-primary transition-colors">
              {profile.name}
            </span>
          </div>
        ))}

        {/* Add Profile Button */}
        <div 
          className="group flex flex-col items-center gap-3 cursor-pointer"
          onClick={handleParentArea} // For now, this goes to Parent area to add profiles
        >
          <div className="w-32 h-32 rounded-3xl border-2 border-dashed border-gray-300 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
            <Plus className="w-10 h-10 text-gray-400 group-hover:text-primary" />
          </div>
          <span className="font-heading font-bold text-lg text-gray-400 group-hover:text-primary transition-colors">
            Adicionar
          </span>
        </div>
      </div>

      {/* Parent Area Button */}
      <Button 
        variant="outline" 
        size="lg"
        onClick={handleParentArea}
        className="mt-8 rounded-full border-2 h-14 px-8 gap-2 text-gray-500 hover:text-primary hover:border-primary"
      >
        <Settings className="w-5 h-5" />
        Área dos Pais
      </Button>
    </div>
  );
}
