import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Updated Interface: Added 'duration' so Search.tsx doesn't break
export interface Video {
  id: string;
  title: string;
  description: string | null;
  category: string;
  youtube_id?: string; 
  thumbnail_url: string | null;
  is_premium: boolean;
  featured: boolean;
  duration: number | null; // <--- ADDED THIS
}

export const useVideos = () => {
  return useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      // Fetch from the SECURE VIEW (No youtube_ids)
      const { data, error } = await supabase
        .from('public_videos') 
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Video[];
    },
  });
};
