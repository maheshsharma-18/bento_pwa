import { useNavigate } from "react-router-dom";
import { ArrowLeft, Music, Volume2, PlayCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useSettings } from "@/hooks/useSettings";

export default function AppSettings() {
  const navigate = useNavigate();
  const { settings, actions, loading } = useSettings();

  return (
    <div className="min-h-screen bg-background p-6 pb-24">
      <header className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate("/parents")} className="rounded-full">
            <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-heading font-bold text-text">Preferências do App</h1>
      </header>

      <div className="max-w-md mx-auto space-y-6">

        {/* Device Settings Section */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Neste Dispositivo</h3>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <Music className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="block font-bold text-gray-700">Música de Fundo</span>
                            <span className="text-xs text-gray-400">Música suave nos menus</span>
                        </div>
                    </div>
                    <Checkbox
                        checked={settings.bgMusic}
                        onCheckedChange={actions.toggleMusic}
                        className="w-6 h-6 rounded-md border-2 border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                            <Volume2 className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="block font-bold text-gray-700">Efeitos Sonoros</span>
                            <span className="text-xs text-gray-400">Sons de clique e interação</span>
                        </div>
                    </div>
                    <Checkbox
                        checked={settings.soundEffects}
                        onCheckedChange={actions.toggleSound}
                        className="w-6 h-6 rounded-md border-2 border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                </div>
            </div>
        </section>

        {/* Account Settings Section */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Conta (Todos os Dispositivos)</h3>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                            <PlayCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="block font-bold text-gray-700">Autoplay</span>
                            <span className="text-xs text-gray-400">Próximo vídeo automaticamente</span>
                        </div>
                    </div>
                    <Checkbox
                        checked={settings.autoplay}
                        onCheckedChange={(checked) => actions.toggleAutoplay(checked as boolean)}
                        disabled={loading}
                        className="w-6 h-6 rounded-md border-2 border-gray-300 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                    />
                </div>

                 <div className="flex items-center justify-between opacity-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="block font-bold text-gray-700">Notificações</span>
                            <span className="text-xs text-gray-400">Novos vídeos e alertas</span>
                        </div>
                    </div>
                    {/* Placeholder for now */}
                    <div className="text-xs font-bold text-gray-400 border border-gray-200 px-2 py-1 rounded-lg">Em Breve</div>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
}