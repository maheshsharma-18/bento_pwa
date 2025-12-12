import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
}

export const useSupport = () => {
  const queryClient = useQueryClient();

  // 1. Fetch User's Tickets
  const { data: tickets, isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Ticket[];
    },
  });

  // 2. Create New Ticket
  const createTicket = useMutation({
    mutationFn: async ({ subject, message }: { subject: string; message: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not logged in");

      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          subject,
          message
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    }
  });

  return { tickets, isLoading, createTicket };
};