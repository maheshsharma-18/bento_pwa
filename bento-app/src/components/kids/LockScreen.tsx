import { Moon, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LockScreen() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 bg-[#1a1b2e] text-white flex flex-col items-center justify-center p-8 animate-in fade-in duration-700">
      
      {/* Sleeping Mascot Animation (Placeholder) */}
      <div className="relative mb-8">
        <div className="w-48 h-48 bg-[#252642] rounded-full flex items-center justify-center animate-pulse">
            <span className="text-6xl">😴</span>
        </div>
        {/* Zzz Animation */}
        <div className="absolute -top-4 right-4 text-4xl font-heading font-bold text-blue-300 animate-bounce delay-100">Z</div>
        <div className="absolute top-2 right-12 text-2xl font-heading font-bold text-blue-400 animate-bounce delay-300">z</div>
        <div className="absolute top-8 right-2 text-xl font-heading font-bold text-blue-500 animate-bounce delay-700">z</div>
      </div>

      <h1 className="text-3xl font-heading font-bold mb-4 text-center">
        Hora de Dormir!
      </h1>
      
      <p className="text-gray-400 text-center max-w-xs mb-12 text-lg">
        O Bento já foi descansar. Que tal você fazer o mesmo? Até amanhã!
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <div className="bg-[#252642] p-4 rounded-2xl flex items-center gap-3">
            <Moon className="w-6 h-6 text-blue-400" />
            <span className="text-sm text-gray-300">O app desbloqueia automaticamente pela manhã.</span>
        </div>

        <Button 
            variant="ghost" 
            onClick={() => navigate('/parents')}
            className="text-gray-500 hover:text-white mt-4 gap-2"
        >
            <Lock className="w-4 h-4" />
            Desbloqueio dos Pais
        </Button>
      </div>
    </div>
  );
}
