import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Trash2, AlertTriangle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useSessionStore } from "@/stores/useSessionStore";

export default function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { clearSession } = useSessionStore(); // <--- Get clearSession

  // PIN State
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");

  const handleChangePin = async () => {
    if (oldPin.length !== 4 || newPin.length !== 4) {
      return alert("O PIN deve ter 4 dígitos.");
    }
    
    setLoading(true);
    
    // FIXED: Removed 'error' variable because we don't use it
    const { data } = await supabase.rpc('change_parent_pin', {
      old_pin_attempt: oldPin,
      new_pin: newPin
    });

    if (data === true) {
      alert("PIN alterado com sucesso!");
      setOldPin("");
      setNewPin("");
    } else {
      alert("Erro: O PIN atual está incorreto.");
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    const confirmText = prompt("Para excluir sua conta permanentemente, digite 'DELETAR' abaixo:");
    if (confirmText !== "DELETAR") return;

    setLoading(true);
    try {
      // 1. Delete Database Data (Now works via Cascade)
      const { error } = await supabase.rpc('delete_my_account');
      if (error) throw error;

      // 2. Clear Local State (Zustand) - Important for UX
      clearSession();

      // 3. Sign Out from Auth
      await supabase.auth.signOut();
      
      // 4. Force Reload to Home
      window.location.href = "/";
      
    } catch (err: any) {
      alert("Erro ao deletar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 pb-24">
      <header className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate("/parents")} className="rounded-full">
            <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-heading font-bold text-text">Configurações</h1>
      </header>

      <div className="max-w-md mx-auto space-y-8">
        
        {/* Security Section */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg">Alterar PIN</h3>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">PIN Atual</label>
                    <Input 
                        type="password" 
                        maxLength={4}
                        placeholder="****"
                        value={oldPin}
                        onChange={(e) => setOldPin(e.target.value)}
                        className="h-12 rounded-xl text-center text-lg tracking-widest"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">Novo PIN</label>
                    <Input 
                        type="password" 
                        maxLength={4}
                        placeholder="****"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        className="h-12 rounded-xl text-center text-lg tracking-widest"
                    />
                </div>
                <Button 
                    onClick={handleChangePin} 
                    disabled={loading}
                    className="w-full h-12 rounded-xl"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Novo PIN
                </Button>
            </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-50 p-6 rounded-3xl border border-red-100">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-lg text-red-700">Zona de Perigo</h3>
            </div>
            
            <p className="text-sm text-red-600/80 mb-6 leading-relaxed">
                A exclusão da conta é permanente. Todos os perfis das crianças e histórico serão apagados.
            </p>

            <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
                disabled={loading}
                className="w-full h-12 rounded-xl bg-red-500 hover:bg-red-600"
            >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir Minha Conta
            </Button>
        </section>

      </div>
    </div>
  );
}