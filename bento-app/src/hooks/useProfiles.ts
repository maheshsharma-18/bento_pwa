import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ChildProfile } from '@/stores/useSessionStore';

export const useProfiles = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      // 2. Fetch children for this parent
      const { data, error } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('parent_id', user.id);

      if (error) throw error;
      return data as ChildProfile[];
    },
  });
};
