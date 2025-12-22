import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Clock, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useProfiles } from "@/hooks/useProfiles";
import { useQueryClient } from "@tanstack/react-query";
import type { RoutineRule } from "@/stores/useSessionStore";

export default function RoutineSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profiles } = useProfiles();
  
  const [loading, setLoading] = useState(false);
  const [rules, setRules] = useState<RoutineRule[]>([]);
  
  // New Rule Form State
  const [newStart, setNewStart] = useState("21:00");
  const [newEnd, setNewEnd] = useState("07:00");
  const [newAction, setNewAction] = useState<'lock' | 'unlock'>('lock');

  const selectedChild = profiles?.find(p => p.id === id);

  useEffect(() => {
    if (selectedChild?.routine_settings) {
      // Check if it's the new Array format
      if (Array.isArray(selectedChild.routine_settings)) {
        setRules(selectedChild.routine_settings);
      } else {
        // Fallback: If it's the old format {bedtime, wake_up}, ignore or convert it.
        // For now, start fresh.
        setRules([]);
      }
    }
  }, [selectedChild]);

  const handleAddRule = () => {
    if (!newStart || !newEnd) return alert("Defina o horário de início e fim.");
    
    const newRule: RoutineRule = {
      id: crypto.randomUUID(),
      name: newAction === 'lock' ? "Bloqueio" : "Liberado",
      start: newStart,
      end: newEnd,
      action: newAction
    };

    setRules([...rules, newRule]);
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter(r => r.id !== ruleId));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('child_profiles')
        .update({ routine_settings: rules }) // Saving the Array!
        .eq('id', id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['profiles'] });
      alert("Rotina atualizada com sucesso!");
      navigate("/parents/routine");
    } catch (error: any) {
      alert("Erro ao salvar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 pb-24">
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

      <div className="max-w-md mx-auto space-y-8">
        
        {/* 1. Add New Rule Card */}
        <section className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-lg">Adicionar Regra</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="text-xs font-bold text-gray-400 ml-1">Início</label>
                    <Input 
                        type="time" 
                        value={newStart} 
                        onChange={(e) => setNewStart(e.target.value)}
                        className="rounded-xl"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-400 ml-1">Fim</label>
                    <Input 
                        type="time" 
                        value={newEnd} 
                        onChange={(e) => setNewEnd(e.target.value)}
                        className="rounded-xl"
                    />
                </div>
            </div>

            <div className="flex gap-2 mb-4">
                <Button 
                    type="button"
                    variant={newAction === 'lock' ? 'destructive' : 'outline'}
                    onClick={() => setNewAction('lock')}
                    className="flex-1 rounded-xl gap-2"
                >
                    <Lock className="w-4 h-4" /> Bloquear
                </Button>
                <Button 
                    type="button"
                    variant={newAction === 'unlock' ? 'default' : 'outline'}
                    onClick={() => setNewAction('unlock')}
                    className="flex-1 rounded-xl gap-2 bg-green-500 hover:bg-green-600 text-white"
                >
                    <Unlock className="w-4 h-4" /> Liberar
                </Button>
            </div>

            <Button onClick={handleAddRule} className="w-full rounded-xl bg-gray-900 text-white">
                <Plus className="w-4 h-4 mr-2" /> Adicionar à Lista
            </Button>
        </section>

        {/* 2. Active Rules List */}
        <section className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider ml-2">Regras Ativas</h3>
            
            {rules.length === 0 && (
                <div className="text-center py-8 text-gray-400 bg-white/50 rounded-3xl border border-dashed">
                    Nenhuma regra definida.<br/>O app está liberado 24h.
                </div>
            )}

            {rules.map((rule, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${rule.action === 'lock' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
                            {rule.action === 'lock' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                        </div>
                        <div>
                            <span className="block font-bold text-gray-700">
                                {rule.start} - {rule.end}
                            </span>
                            <span className="text-xs text-gray-400 font-bold uppercase">
                                {rule.action === 'lock' ? 'App Bloqueado' : 'App Liberado'}
                            </span>
                        </div>
                    </div>
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleDeleteRule(rule.id)}
                        className="text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full"
                    >
                        <Trash2 className="w-5 h-5" />
                    </Button>
                </div>
            ))}
        </section>

        {/* 3. Save Button */}
        <div className="fixed bottom-6 left-6 right-6 max-w-md mx-auto">
            <Button onClick={handleSave} disabled={loading} className="w-full h-14 rounded-3xl text-lg font-bold shadow-xl">
                {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
        </div>

      </div>
    </div>
  );
}