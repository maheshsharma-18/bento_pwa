import { useState } from "react";
import { useNavigate } from "react-router-dom";
// REMOVED MessageSquare and CheckCircle from this import
import { ArrowLeft, Plus, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSupport } from "@/hooks/useSupport";
import { cn } from "@/lib/utils";

export default function Support() {
  const navigate = useNavigate();
  const { tickets, createTicket } = useSupport();
  
  const [activeTab, setActiveTab] = useState<'faq' | 'tickets'>('faq');
  const [isCreating, setIsCreating] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!subject || !message) return alert("Preencha todos os campos.");
    try {
      await createTicket.mutateAsync({ subject, message });
      setSubject("");
      setMessage("");
      setIsCreating(false);
      alert("Ticket enviado com sucesso!");
    } catch (error) {
      alert("Erro ao enviar.");
    }
  };

  const faqs = [
    { q: "Como cancelo minha assinatura?", a: "Vá em 'Assinatura' no Painel dos Pais e clique em Cancelar." },
    { q: "O vídeo travou, o que fazer?", a: "Verifique sua internet. O Bento precisa de conexão estável." },
    { q: "Como mudo o PIN?", a: "Em breve você poderá alterar o PIN nas configurações de conta." }
  ];

  return (
    <div className="min-h-screen bg-background p-6 pb-24">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate("/parents")} className="rounded-full">
            <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-heading font-bold text-text">Ajuda & Suporte</h1>
      </header>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-2xl mb-8">
        <button 
            onClick={() => setActiveTab('faq')}
            className={cn("flex-1 py-3 rounded-xl text-sm font-bold transition-all", activeTab === 'faq' ? "bg-white shadow-sm text-primary" : "text-gray-400")}
        >
            Perguntas Frequentes
        </button>
        <button 
            onClick={() => setActiveTab('tickets')}
            className={cn("flex-1 py-3 rounded-xl text-sm font-bold transition-all", activeTab === 'tickets' ? "bg-white shadow-sm text-primary" : "text-gray-400")}
        >
            Meus Tickets
        </button>
      </div>

      {/* TAB 1: FAQ */}
      {activeTab === 'faq' && (
        <div className="space-y-4 animate-in fade-in">
            {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <button 
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="flex justify-between items-center w-full text-left"
                    >
                        <span className="font-bold text-text">{faq.q}</span>
                        {openFaq === idx ? <ChevronUp className="w-5 h-5 text-gray-400"/> : <ChevronDown className="w-5 h-5 text-gray-400"/>}
                    </button>
                    {openFaq === idx && (
                        <p className="mt-3 text-sm text-gray-500 leading-relaxed border-t pt-3 border-gray-50">
                            {faq.a}
                        </p>
                    )}
                </div>
            ))}
            
            <div className="mt-8 p-6 bg-blue-50 rounded-3xl text-center">
                <p className="text-blue-800 font-bold mb-2">Ainda precisa de ajuda?</p>
                <Button onClick={() => setActiveTab('tickets')} variant="link" className="text-primary underline">
                    Abrir um chamado
                </Button>
            </div>
        </div>
      )}

      {/* TAB 2: TICKETS */}
      {activeTab === 'tickets' && (
        <div className="animate-in fade-in">
            
            {!isCreating ? (
                <>
                    {/* List */}
                    <div className="space-y-4 mb-20">
                        {tickets?.length === 0 && (
                            <div className="text-center py-10 text-gray-400">
                                Nenhum ticket aberto.
                            </div>
                        )}
                        {tickets?.map((t) => (
                            <div key={t.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-text">{t.subject}</h3>
                                    <span className={cn(
                                        "text-[10px] px-2 py-1 rounded-full uppercase font-bold",
                                        t.status === 'resolved' ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                                    )}>
                                        {t.status === 'resolved' ? "Resolvido" : "Aberto"}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2">{t.message}</p>
                                <div className="mt-3 text-xs text-gray-300 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(t.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Floating Action Button */}
                    <div className="fixed bottom-6 right-6">
                        <Button 
                            onClick={() => setIsCreating(true)}
                            className="w-14 h-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 flex items-center justify-center"
                        >
                            <Plus className="w-8 h-8 text-white" />
                        </Button>
                    </div>
                </>
            ) : (
                /* Create Form */
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500">Assunto</label>
                        <Input 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Ex: Problema no pagamento"
                            className="h-12 rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500">Mensagem</label>
                        <textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full h-32 p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                            placeholder="Descreva seu problema..."
                        />
                    </div>
                    <div className="flex gap-4">
                        <Button variant="ghost" onClick={() => setIsCreating(false)} className="flex-1 rounded-xl h-12">
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleSubmit} 
                            disabled={createTicket.isPending}
                            className="flex-1 rounded-xl h-12 gap-2 shadow-lg shadow-primary/20"
                        >
                            {createTicket.isPending ? "Enviando..." : "Enviar Ticket"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
}