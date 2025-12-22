import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function AdminGate() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      // HARDCODED SECURITY CHECK (Matches the SQL Policy)
      // Replace with Matheus's real email
      if (user?.email === 'photosvideos8169@gmail.com') {
        setIsAdmin(true);
      } else {
        alert("Acesso Negado: Área restrita para Super Admin.");
        navigate("/");
      }
    };

    checkAdmin();
  }, [navigate]);

  if (isAdmin === null) return <div className="p-10 text-center">Verificando permissões... 🦁</div>;

  return <Outlet />;
}