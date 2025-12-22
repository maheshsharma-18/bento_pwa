import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, CheckCircle, Upload, Film, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'videos' | 'reports'>('videos');
  const queryClient = useQueryClient();

  // --- VIDEO UPLOAD STATE ---
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Aventuras");

  // 1. FETCH REPORTS
  const { data: reports } = useQuery({
    queryKey: ['admin_reports'],
    queryFn: async () => {
      const { data } = await supabase.from('content_reports').select('*').order('created_at', { ascending: false });
      return data || [];
    }
  });

  // 2. ACTION: RESOLVE REPORT
  const resolveReport = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('content_reports').update({ status: 'resolved' }).eq('id', id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin_reports'] })
  });

  // 3. ACTION: UPLOAD VIDEO
  const uploadVideo = async () => {
    // Extract ID from: https://www.youtube.com/watch?v=dQw4w9WgXcQ
    const youtubeId = videoUrl.split("v=")[1]?.split("&")[0];

    if (!youtubeId || !title) return alert("URL inválida ou título faltando");

    const { error } = await supabase.from('videos').insert({
        youtube_id: youtubeId,
        title: title,
        category: category,
        is_premium: false, // Default free
        thumbnail_url: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
    });

    if (error) alert("Erro: " + error.message);
    else {
        alert("Vídeo enviado!");
        setVideoUrl("");
        setTitle("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-24">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">🦁 Super Admin</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <Button
            variant={activeTab === 'videos' ? 'default' : 'outline'}
            onClick={() => setActiveTab('videos')}
            className="gap-2"
        >
            <Film className="w-4 h-4" /> Upload de Vídeos
        </Button>
        <Button
            variant={activeTab === 'reports' ? 'default' : 'outline'}
            onClick={() => setActiveTab('reports')}
            className="gap-2"
        >
            <AlertTriangle className="w-4 h-4" /> Reportes ({reports?.filter(r => r.status === 'open').length})
        </Button>
      </div>

      {/* TAB: VIDEOS */}
      {activeTab === 'videos' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
            <h2 className="text-xl font-bold">Adicionar Novo Vídeo</h2>
            <Input
                placeholder="YouTube URL"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
            />
            <Input
                placeholder="Título do Vídeo"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <select
                className="w-full p-2 border rounded-md"
                value={category}
                onChange={e => setCategory(e.target.value)}
            >
                <option>Aventuras</option>
                <option>Educativo</option>
                <option>Cantigas</option>
                <option>Aventuras dos Bichinhos</option>
            </select>
            <Button onClick={uploadVideo} className="w-full gap-2">
                <Upload className="w-4 h-4" /> Salvar no App
            </Button>
        </div>
      )}

      {/* TAB: REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
            {reports?.map((report) => (
                <div key={report.id} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
                    <div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${report.status === 'open' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            {report.status.toUpperCase()}
                        </span>
                        <p className="font-bold mt-2">{report.reason}</p>
                        <p className="text-sm text-gray-500">Video ID: {report.video_id}</p>
                    </div>
                    {report.status === 'open' && (
                        <div className="flex gap-2">
                            <Button size="icon" variant="outline" className="text-green-600 hover:bg-green-50" onClick={() => resolveReport.mutate(report.id)}>
                                <CheckCircle className="w-5 h-5" />
                            </Button>
                            {/* In real app, clicking this might delete the video */}
                            <Button size="icon" variant="outline" className="text-red-600 hover:bg-red-50">
                                <Trash2 className="w-5 h-5" />
                            </Button>
                        </div>
                    )}
                </div>
            ))}
        </div>
      )}
    </div>
  );
}