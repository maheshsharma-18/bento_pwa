import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleEmailAuth = async () => {
    if (!acceptedTerms) return alert(t('auth.terms_error'));
    if (!email || !password) return alert("Por favor, insira email e senha");

    setLoading(true);
    
    // 1. Get Stored Referral Code
    const referralCode = localStorage.getItem("bento_ref_code");
    
    try {
      let result;
      
      if (isSignUp) {
        result = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            // PASS TO SUPABASE HERE
            data: { 
              referral_code: referralCode // Can be null, that's okay
            }
          }
        });
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }

      const { error } = result;

      if (error) {
        alert("Erro de Autenticação: " + error.message);
      } else {
        navigate('/'); 
      }
    } catch (err: any) {
      console.error("Crash:", err);
      alert("Erro Crítico: " + (err.message || "Verifique o console"));
    } finally {
      setLoading(false); 
    }
  };

  const handleGoogleLogin = async () => {
    if (!acceptedTerms) return alert(t('auth.terms_error'));
   
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: `${window.location.origin}/who-is-watching`,
        // PASS TO SUPABASE HERE (Google Flow)
        queryParams: {
            // Note: OAuth metadata handling can be tricky. 
            // Ideally, we pass it in 'data', but Supabase OAuth options are limited.
            // For robust Google referral tracking, we usually rely on the Browser Cookie 
            // matching the Session later, BUT Supabase triggers can sometimes access query params 
            // depending on setup.
            // A safer bet for Google Auth referrals is handling it POST-login if metadata fails.
            // However, let's try passing it via standard options if supported by your version.
        }
        // Actually, strictly speaking, Supabase signInWithOAuth doesn't support passing 'data' 
        // to the trigger immediately like signUp does. 
        // FIX: For Google, we will rely on the LocalStorage check inside a separate hook 
        // or just accept Email referrals for this MVP Phase. 
        // Let's stick to Email Referral for Phase 4 to be 100% sure it works via Trigger.
      },
    });
    if (error) alert(error.message);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <div className="w-full max-w-sm space-y-6 text-center animate-in fade-in duration-500">
        
        {/* Mascot */}
        <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center text-4xl">🦁</div>
            <h1 className="text-3xl font-heading font-bold text-primary">{t('auth.welcome_back')}</h1>
        </div>

        {/* Inputs */}
        <div className="space-y-3 text-left">
            <Input 
                type="email" 
                placeholder="Email (ex: test@bento.com)" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl h-12"
            />
            <Input 
                type="password" 
                placeholder="Senha" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl h-12"
            />
        </div>

        {/* Buttons */}
        <div className="space-y-4 w-full pt-2">
            <Button 
                onClick={handleEmailAuth}
                disabled={loading}
                className="w-full rounded-3xl h-14 text-lg shadow-lg"
            >
                {loading ? "Carregando..." : (isSignUp ? "Criar Conta" : "Entrar")}
            </Button>

            <div 
                className="text-sm text-gray-400 cursor-pointer hover:text-primary underline" 
                onClick={() => setIsSignUp(!isSignUp)}
            >
                {isSignUp ? "Já tem conta? Entrar" : "Não tem conta? Criar uma"}
            </div>
            
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm">ou</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <Button 
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full rounded-3xl h-14 text-lg border-2 border-primary text-primary"
            >
                <span className="mr-2">G</span> {t('auth.login_google')}
            </Button>
        </div>

        {/* Terms */}
        <div className="flex items-start space-x-3 pt-4">
            <Checkbox 
                id="terms" 
                checked={acceptedTerms}
                onCheckedChange={(c) => setAcceptedTerms(c === true)}
                className="mt-1 data-[state=checked]:bg-primary text-white border-primary"
            />
            <label htmlFor="terms" className="text-sm font-medium text-text text-left">
                {t('auth.terms')}
            </label>
        </div>

      </div>
    </div>
  )
}