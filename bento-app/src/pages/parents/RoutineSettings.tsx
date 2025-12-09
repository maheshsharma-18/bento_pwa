import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// REMOVED UNUSED LABEL IMPORT
import { supabase } from "@/lib/supabase";
import { useProfiles } from "@/hooks/useProfiles";
import { useQueryClient } from "@tanstack/react-query";

export default function RoutineSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profiles } = useProfiles();
  
  const [loading, setLoading] = useState(false);
  const [bedtime, setBedtime] = useState("20:00");
  const [wakeUp, setWakeUp] = useState("07:00");

  useEffect(() => {
    if (profiles && id) {
      const profile = profiles.find(p => p.id === id);
      if (profile?.routine_settings) {
        const settings = profile.routine_settings;
        if (settings.bedtime) setBedtime(settings.bedtime);
        if (settings.wake_up) setWakeUp(settings.wake_up);
      }
    }
  }, [profiles, id]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const newSettings = {
        bedtime: bedtime,
        wake_up: wakeUp,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('child_profiles')
        .update({ routine_settings: newSettings })
        .eq('id', id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['profiles'] });
      alert("Rotina salva com sucesso!");
      navigate("/parents/routine");
    } catch (error: any) {
      alert("Erro ao salvar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedChild = profiles?.find(p => p.id === id);

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate("/parents/routine")} className="rounded-full">
            <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex items-center gap-3">
             {selectedChild?.avatar_url && (
                <img src={selectedChild.avatar_url} className="w-10 h-10 rounded-full bg-white border" />
             )}
             <h1 className="text-xl font-heading font-bold text-text">
                Rotina de {selectedChild?.name}
            </h1>
        </div>
      </header>

      <div className="max-w-md mx-auto space-y-6">
        
        {/* Bedtime Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-indigo-100">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <Moon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg">Hora de Dormir</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
                O aplicativo será bloqueado automaticamente neste horário.
            </p>
            <div className="relative">
                <Input 
                    type="time" 
                    value={bedtime} 
                    onChange={(e) => setBedtime(e.target.value)}
                    className="h-16 text-2xl font-bold text-center rounded-2xl border-2 border-indigo-50 focus:border-indigo-200"
                />
            </div>
        </div>

        {/* Wake Up Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                    <Sun className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg">Hora de Acordar</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
                O aplicativo será desbloqueado a partir deste horário.
            </p>
            <div className="relative">
                <Input 
                    type="time" 
                    value={wakeUp} 
                    onChange={(e) => setWakeUp(e.target.value)}
                    className="h-16 text-2xl font-bold text-center rounded-2xl border-2 border-orange-50 focus:border-orange-200"
                />
            </div>
        </div>

        <Button onClick={handleSave} disabled={loading} className="w-full h-14 rounded-3xl text-lg font-bold gap-2 shadow-lg shadow-primary/20 mt-4">
            <Save className="w-5 h-5" />
            {loading ? "Salvando..." : "Salvar Rotina"}
        </Button>

      </div>
    </div>
  );
}