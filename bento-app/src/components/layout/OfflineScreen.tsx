import { WifiOff } from "lucide-react";

export default function OfflineScreen() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#1a1b2e] text-white flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
      
      {/* Sleeping Mascot Animation */}
      <div className="relative mb-8">
        <div className="w-48 h-48 bg-[#252642] rounded-full flex items-center justify-center animate-pulse">
            <span className="text-6xl">🦁</span>
        </div>
        <div className="absolute -top-4 right-4 text-4xl font-heading font-bold text-blue-300 animate-bounce delay-100">?</div>
      </div>

      <h1 className="text-3xl font-heading font-bold mb-4 text-center">
        Sem Internet!
      </h1>
      
      <p className="text-gray-400 text-center max-w-xs mb-8 text-lg">
        O Bento precisa de internet para acordar. Verifique seu Wi-Fi.
      </p>

      <div className="bg-[#252642] p-4 rounded-2xl flex items-center gap-3 animate-pulse">
          <WifiOff className="w-6 h-6 text-red-400" />
          <span className="text-sm text-gray-300">Aguardando conexão...</span>
      </div>
    </div>
  );
}