import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface AffiliateProfile {
  user_id: string;
  referral_code: string;
  balance_pending: number;
  balance_available: number;
  pix_key?: string;
}

export const useAffiliate = () => {
  const queryClient = useQueryClient();

  // 1. Fetch Profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['affiliate'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('affiliate_profiles')
        .select('*')
        .single();
      
      // It's okay if no data exists yet (user hasn't joined)
      if (error && error.code !== 'PGRST116') throw error; 
      return data as AffiliateProfile | null;
    },
  });

  // 2. Fetch Referrals List
  const { data: referrals } = useQuery({
    queryKey: ['referrals'],
    enabled: !!profile, // Only fetch if profile exists
    queryFn: async () => {
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // 3. Join Program Mutation
  const joinProgram = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('join_affiliate_program');
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate'] });
    }
  });

  return { profile, referrals, isLoading, joinProgram };
};