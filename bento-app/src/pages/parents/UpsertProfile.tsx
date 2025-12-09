import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useProfiles } from "@/hooks/useProfiles";
import { useQueryClient } from "@tanstack/react-query";

export default function UpsertProfile() {
  const { id } = useParams(); // If ID exists, we are editing. If not, creating.
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profiles } = useProfiles();
  
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  // Load data if editing
  useEffect(() => {
    if (isEditing && profiles) {
      const profile = profiles.find(p => p.id === id);
      if (profile) {
        setName(profile.name);
        setAge(profile.age?.toString() || "");
      }
    }
  }, [isEditing, profiles, id]);

  const handleSave = async () => {
    if (!name) return alert("Por favor, insira um nome.");
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      // Auto-generate avatar based on name
      const avatarUrl = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${name}`;

      if (isEditing) {
        // UPDATE
        const { error } = await supabase
          .from('child_profiles')
          .update({ name, age: parseInt(age), avatar_url: avatarUrl })
          .eq('id', id);
        if (error) throw error;
      } else {
        // INSERT
        const { error } = await supabase
          .from('child_profiles')
          .insert({
            parent_id: user.id,
            name, 
            age: parseInt(age), 
            avatar_url: avatarUrl
          });
        if (error) throw error;
      }

      // Refresh cache and go back
      await queryClient.invalidateQueries({ queryKey: ['profiles'] });
      navigate("/parents/profiles");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este perfil?")) return;
    setLoading(true);
    const { error } = await supabase.from('child_profiles').delete().eq('id', id);
    if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['profiles'] });
        navigate("/parents/profiles");
    } else {
        alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/parents/profiles")} className="rounded-full">
                <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl font-heading font-bold text-text">
                {isEditing ? "Editar Perfil" : "Novo Perfil"}
            </h1>
        </div>
        {isEditing && (
            <Button variant="ghost" size="icon" onClick={handleDelete} className="text-red-500 hover:bg-red-50 rounded-full">
                <Trash2 className="w-6 h-6" />
            </Button>
        )}
      </header>

      {/* Form */}
      <div className="max-w-md mx-auto space-y-8">
        {/* Avatar Preview */}
        <div className="flex justify-center">
            <div className="w-32 h-32 rounded-3xl overflow-hidden bg-white shadow-sm border-2 border-dashed border-gray-200">
                {name ? (
                    <img 
                        src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${name}`} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">?</div>
                )}
            </div>
        </div>

        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nome da Criança</Label>
                <Input 
                    id="name" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Ex: Maria" 
                    className="h-12 rounded-xl text-lg"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                <Input 
                    id="age" 
                    type="number" 
                    value={age} 
                    onChange={e => setAge(e.target.value)} 
                    placeholder="Ex: 5" 
                    className="h-12 rounded-xl text-lg"
                />
            </div>
        </div>

        <Button onClick={handleSave} disabled={loading} className="w-full h-14 rounded-3xl text-lg font-bold gap-2 shadow-lg shadow-primary/20">
            <Save className="w-5 h-5" />
            {loading ? "Salvando..." : "Salvar Perfil"}
        </Button>
      </div>
    </div>
  );
}
