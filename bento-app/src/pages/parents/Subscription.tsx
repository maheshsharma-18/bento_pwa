import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Smartphone, Star, Zap, Infinity as InfinityIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isTWA } from "@/lib/platform";
import { cn } from "@/lib/utils";

export default function Subscription() {
  const navigate = useNavigate();
  const isApp = isTWA(); 

  const plans = [
    {
      id: "monthly",
      name: "Mensal",
      price: "R$ 19,90",
      period: "/mês",
      icon: Star,
      color: "bg-blue-100 text-blue-600",
      highlight: false,
      link: "https://buy.stripe.com/test_monthly"
    },
    {
      id: "annual",
      name: "Anual",
      price: "R$ 191,04",
      period: "/ano",
      saved: "Economize 20%",
      icon: Zap,
      color: "bg-green-100 text-green-600",
      highlight: true,
      link: "https://buy.stripe.com/test_annual"
    },
    {
      id: "lifetime",
      name: "Vitalício",
      price: "R$ 399,90",
      period: "único",
      icon: InfinityIcon,
      color: "bg-purple-100 text-purple-600",
      highlight: false,
      link: "https://buy.stripe.com/test_lifetime"
    }
  ];

  const handleSubscribe = (link: string) => {
    window.open(link, "_blank");
  };

  return (
    <div className="min-h-screen bg-background p-6 pb-24">
      <header className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/parents")} className="rounded-full">
            <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-heading font-bold text-text">Assinatura Bento</h1>
      </header>

      <div className="max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
        
        {/* Intro Text */}
        <div className="text-center mb-4">
            <p className="text-gray-500">Escolha o melhor plano para sua família.</p>
        </div>

        {/* Plans Grid */}
        <div className="space-y-4">
            {plans.map((plan) => (
                <div 
                    key={plan.id}
                    className={cn(
                        "relative bg-white p-5 rounded-3xl border-2 transition-all",
                        plan.highlight ? "border-primary shadow-md scale-105 z-10" : "border-transparent shadow-sm hover:border-gray-100"
                    )}
                >
                    {plan.highlight && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Recomendado
                        </div>
                    )}

                    <div className="flex justify-between items-center mb-3">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", plan.color)}>
                            <plan.icon className="w-5 h-5" />
                        </div>
                        <div className="text-right">
                            <span className="block text-2xl font-bold text-text leading-none">{plan.price}</span>
                            <span className="text-xs text-gray-400 font-medium">{plan.period}</span>
                        </div>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-text mb-1">{plan.name}</h3>
                    {plan.saved && <p className="text-xs font-bold text-green-600 mb-3">{plan.saved}</p>}

                    {/* Features (Simplified) */}
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Check className="w-3 h-3 text-green-500" /> Acesso Ilimitado
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Check className="w-3 h-3 text-green-500" /> Sem Anúncios
                        </div>
                    </div>

                    {/* Button Logic */}
                    {isApp ? (
                         <div className="bg-gray-50 p-2 rounded-xl text-center border border-gray-100">
                            <p className="text-[10px] text-gray-400 leading-tight">
                                Disponível apenas via site <br/> 
                                <span className="font-bold">app.bento.com</span>
                            </p>
                        </div>
                    ) : (
                        <Button 
                            onClick={() => handleSubscribe(plan.link)}
                            className={cn(
                                "w-full rounded-xl font-bold",
                                plan.highlight ? "bg-primary hover:bg-primary/90" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            )}
                        >
                            Assinar {plan.name}
                        </Button>
                    )}
                </div>
            ))}
        </div>

        {/* TWA Info Box */}
        {isApp && (
            <div className="bg-orange-50 p-4 rounded-2xl flex items-start gap-3 border border-orange-100">
                 <Smartphone className="w-5 h-5 text-orange-400 mt-1 shrink-0" />
                 <p className="text-xs text-orange-700 leading-relaxed">
                    Devido às políticas da Google Play, assinaturas devem ser feitas pelo navegador. 
                    Seu acesso será liberado no app automaticamente após a compra.
                 </p>
            </div>
        )}

        <p className="text-center text-[10px] text-gray-300 px-8">
            Cancelamento fácil a qualquer momento.
        </p>

      </div>
    </div>
  );
}