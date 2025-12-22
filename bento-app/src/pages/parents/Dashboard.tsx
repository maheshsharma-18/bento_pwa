import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Clock, CreditCard, TrendingUp, MessageSquare, Settings as SettingsIcon, SlidersHorizontal, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      // ⚠️ IMPORTANT: Replace this with the EXACT email you set in SQL and AdminGate
      // e.g. 'sagar@gmail.com'
      if (user?.email === 'photosvideos8169@gmail.com') { 
        setIsAdmin(true);
      }
    };
    checkAdmin();
  }, []);

  return (
    <div className="min-h-screen bg-background p-6 pb-24">
       <header className="flex items-center gap-4 mb-8">
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/who-is-watching")}
            className="rounded-full"
        >
            <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-heading font-bold text-text">Painel de Controle</h1>
      </header>

      <div className="grid grid-cols-1 gap-4">

         {/* --- 🔒 SECRET ADMIN CARD (Only visible to you) --- */}
         {isAdmin && (
            <div 
              onClick={() => navigate("/admin")}
              className="bg-red-50 p-6 rounded-3xl shadow-sm border-2 border-red-100 flex items-center gap-4 cursor-pointer hover:bg-red-100 transition-all"
            >
                <div className="w-12 h-12 bg-red-200 rounded-2xl flex items-center justify-center text-red-700">
                    <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-heading font-bold text-lg text-red-800">Super Admin</h3>
                    <p className="text-red-600 text-sm font-bold">Gerenciar App & Conteúdo</p>
                </div>
            </div>
         )}
         {/* -------------------------------------------------- */}
         
         <div 
          onClick={() => navigate("/parents/profiles")}
          className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-primary/30 transition-all"
        >
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                <Users className="w-6 h-6" />
            </div>
            <div>
                <h3 className="font-heading font-bold text-lg">Gerenciar Perfis</h3>
                <p className="text-gray-400 text-sm">Adicionar ou editar crianças</p>
            </div>
        </div>

         <div 
          onClick={() => navigate("/parents/routine")}
          className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-primary/30 transition-all"
        >
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                <Clock className="w-6 h-6" />
            </div>
            <div>
                <h3 className="font-heading font-bold text-lg">Rotina & Limites</h3>
                <p className="text-gray-400 text-sm">Configurar horários de uso</p>
            </div>
        </div>

        <div 
          onClick={() => navigate("/parents/subscription")}
          className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-primary/30 transition-all"
        >
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                <CreditCard className="w-6 h-6" />
            </div>
            <div>
                <h3 className="font-heading font-bold text-lg">Assinatura</h3>
                <p className="text-gray-400 text-sm">Gerenciar plano Premium</p>
            </div>
        </div>

        <div 
          onClick={() => navigate("/parents/affiliates")}
          className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-primary/30 transition-all"
        >
            <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-600">
                <TrendingUp className="w-6 h-6" />
            </div>
            <div>
                <h3 className="font-heading font-bold text-lg">Programa de Parceiros</h3>
                <p className="text-gray-400 text-sm">Ganhe dinheiro indicando</p>
            </div>
        </div>

        <div 
          onClick={() => navigate("/parents/support")}
          className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-primary/30 transition-all"
        >
            <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600">
                <MessageSquare className="w-6 h-6" />
            </div>
            <div>
                <h3 className="font-heading font-bold text-lg">Ajuda</h3>
                <p className="text-gray-400 text-sm">Fale com o suporte</p>
            </div>
        </div>

        <div 
          onClick={() => navigate("/parents/app-settings")}
          className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-primary/30 transition-all"
        >
            <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600">
                <SlidersHorizontal className="w-6 h-6" />
            </div>
            <div>
                <h3 className="font-heading font-bold text-lg">Preferências</h3>
                <p className="text-gray-400 text-sm">Áudio e Reprodução</p>
            </div>
        </div>

        <div 
          onClick={() => navigate("/parents/settings")}
          className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-primary/30 transition-all"
        >
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600">
                <SettingsIcon className="w-6 h-6" />
            </div>
            <div>
                <h3 className="font-heading font-bold text-lg">Configurações</h3>
                <p className="text-gray-400 text-sm">PIN e Conta</p>
            </div>
        </div>

      </div>
    </div>
  );
}