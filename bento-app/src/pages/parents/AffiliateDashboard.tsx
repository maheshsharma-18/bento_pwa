import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, TrendingUp, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAffiliate } from "@/hooks/useAffiliate";

export default function AffiliateDashboard() {
  const navigate = useNavigate();
  const { profile, referrals, isLoading, joinProgram } = useAffiliate();

  const handleCopy = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(`https://bento.app/invite/${profile.referral_code}`);
      alert("Link copiado!");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate("/parents")} className="rounded-full">
            <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-heading font-bold text-text">Programa de Parceiros</h1>
      </header>

      {/* Loading State */}
      {isLoading && <div className="text-center p-10">Carregando...</div>}

      {/* STATE 1: NOT A PARTNER */}
      {!isLoading && !profile && (
        <div className="flex flex-col items-center text-center space-y-6 mt-10">
            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-16 h-16 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-text">Ganhe com o Bento</h2>
            <p className="text-gray-500 max-w-xs">
                Indique o Bento para outros pais e ganhe <span className="font-bold text-green-600">20% de comissão</span> em cada assinatura!
            </p>
            <Button 
                onClick={() => joinProgram.mutate()} 
                disabled={joinProgram.isPending}
                className="w-full max-w-xs h-14 rounded-3xl text-lg font-bold bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-200"
            >
                {joinProgram.isPending ? "Criando..." : "Quero ser Parceiro"}
            </Button>
        </div>
      )}

      {/* STATE 2: ACTIVE PARTNER */}
      {!isLoading && profile && (
        <div className="space-y-6 animate-in fade-in">
            
            {/* Referral Link Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Seu Link Único</h3>
                <div className="flex gap-2">
                    <div className="flex-1 bg-gray-50 p-3 rounded-xl text-sm font-mono text-gray-600 truncate border border-gray-200">
                        bento.app/invite/{profile.referral_code}
                    </div>
                    <Button onClick={handleCopy} size="icon" className="rounded-xl shrink-0">
                        <Copy className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-5 rounded-3xl border border-green-100">
                    <div className="flex items-center gap-2 mb-2 text-green-700">
                        <DollarSign className="w-5 h-5" />
                        <span className="font-bold text-sm">Disponível</span>
                    </div>
                    <span className="text-2xl font-bold text-green-800">
                        R$ {profile.balance_available}
                    </span>
                </div>
                <div className="bg-orange-50 p-5 rounded-3xl border border-orange-100">
                    <div className="flex items-center gap-2 mb-2 text-orange-700">
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-bold text-sm">Pendente</span>
                    </div>
                    <span className="text-2xl font-bold text-orange-800">
                        R$ {profile.balance_pending}
                    </span>
                </div>
            </div>

            {/* Referrals List */}
            <div className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg text-text">Indicações Recentes</h3>
                </div>
                
                {referrals?.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
                        Nenhuma indicação ainda. <br/> Compartilhe seu link!
                    </div>
                ) : (
                    <div className="space-y-3">
                        {referrals?.map((ref) => (
                            <div key={ref.id} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-gray-50">
                                <div>
                                    <span className="block font-bold text-sm">Novo Usuário</span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(ref.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-green-600">+ R$ {ref.commission_val}</span>
                                    <span className="text-[10px] uppercase bg-gray-100 px-2 py-0.5 rounded-full text-gray-500 font-bold">
                                        {ref.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
}