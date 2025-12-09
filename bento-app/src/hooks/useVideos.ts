import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Video {
  id: string;
  title: string;
  description: string | null;
  category: string;
  youtube_id: string;
  thumbnail_url: string | null;
  is_premium: boolean;
  featured: boolean;
}

export const useVideos = () => {
  return useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Video[];
    },
  });
};
