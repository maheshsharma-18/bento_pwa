import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useSettings = () => {
  const queryClient = useQueryClient();

  // 1. Local Storage State (Device Level)
  const [soundEffects, setSoundEffects] = useState(() => {
    return localStorage.getItem("bento_sound") !== "false"; // Default true
  });
  
  const [bgMusic, setBgMusic] = useState(() => {
    return localStorage.getItem("bento_music") !== "false"; // Default true
  });

  // 2. Fetch Account Settings (Server Level)
  const { data: profileSettings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { autoplay: true };

      const { data, error } = await supabase
        .from('profiles')
        .select('settings_autoplay')
        .eq('id', user.id)
        .single();
      
      if (error) return { autoplay: true };
      return { autoplay: data.settings_autoplay ?? true };
    }
  });

  // 3. Toggle Functions
  const toggleSound = () => {
    const newVal = !soundEffects;
    setSoundEffects(newVal);
    localStorage.setItem("bento_sound", String(newVal));
  };

  const toggleMusic = () => {
    const newVal = !bgMusic;
    setBgMusic(newVal);
    localStorage.setItem("bento_music", String(newVal));
  };

  const toggleAutoplay = useMutation({
    mutationFn: async (newValue: boolean) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      await supabase
        .from('profiles')
        .update({ settings_autoplay: newValue })
        .eq('id', user.id);
    },
    onMutate: async (newValue) => {
      // Optimistic Update
      await queryClient.cancelQueries({ queryKey: ['settings'] });
      const previous = queryClient.getQueryData(['settings']);
      queryClient.setQueryData(['settings'], { autoplay: newValue });
      return { previous };
    },
    onError: (_err, _newVal, context: any) => {
      queryClient.setQueryData(['settings'], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    }
  });

  return {
    settings: {
      soundEffects,
      bgMusic,
      autoplay: profileSettings?.autoplay ?? true,
    },
    loading: isLoading,
    actions: {
      toggleSound,
      toggleMusic,
      toggleAutoplay: (val: boolean) => toggleAutoplay.mutate(val)
    }
  };
};