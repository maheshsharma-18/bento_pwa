import { useNavigate } from "react-router-dom";
// REMOVED 'Lock' from this import
import { ArrowLeft, Check, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isTWA } from "@/lib/platform";

export default function Subscription() {
  const navigate = useNavigate();
  const isApp = isTWA(); // 🕵️ Detect Environment

  const features = [
    "Acesso ilimitado a todos os vídeos",
    "Sem anúncios (nunca!)",
    "Controle total de rotina",
    "Suporte prioritário via WhatsApp"
  ];

  const handleSubscribe = () => {
    // In production, replace this with your STRIPE PAYMENT LINK
    window.open("https://stripe.com", "_blank");
  };

  return (
    <div className="min-h-screen bg-background p-6 pb-24">
      <header className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate("/parents")} className="rounded-full">
            <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-heading font-bold text-text">Assinatura</h1>
      </header>

      <div className="max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
        
        {/* Hero Card */}
        <div className="bg-primary/10 p-8 rounded-[40px] text-center border-2 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-4 py-2 rounded-bl-2xl">
                PREMIUM
            </div>
            
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-4xl">
                🦁
            </div>
            <h2 className="text-3xl font-heading font-bold text-primary mb-2">Bento Premium</h2>
            <p className="text-gray-500 mb-6">Desbloqueie todo o potencial.</p>
            
            <div className="text-4xl font-bold text-text mb-1">R$ 19,90</div>
            <div className="text-sm text-gray-400">/mês</div>
        </div>

        {/* Features */}
        <div className="space-y-4 px-4">
            {features.map((feat, i) => (
                <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-600 font-medium">{feat}</span>
                </div>
            ))}
        </div>

        {/* --- THE COMPLIANCE LOGIC --- */}
        <div className="pt-4">
            {isApp ? (
                // MODE B: TWA / APP (Hidden Button)
                <div className="bg-gray-100 p-6 rounded-3xl text-center border border-gray-200">
                    <Smartphone className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-600 mb-2">Gerenciar Assinatura</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Para assinar ou cancelar, por favor visite nosso site 
                        <span className="font-bold text-gray-700"> app.bento.com </span> 
                        pelo navegador do seu computador ou celular.
                    </p>
                    <div className="mt-4 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                        Reader Only Mode
                    </div>
                </div>
            ) : (
                // MODE A: WEB BROWSER (Show Stripe)
                <Button 
                    onClick={handleSubscribe}
                    className="w-full h-14 rounded-3xl text-lg font-bold shadow-xl shadow-primary/20"
                >
                    Assinar Agora
                </Button>
            )}
        </div>

        <p className="text-center text-xs text-gray-400 px-8">
            Cancelamento fácil a qualquer momento.
            <br/>Termos de Uso e Política de Privacidade.
        </p>

      </div>
    </div>
  );
}