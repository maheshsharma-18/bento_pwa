import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase"; // Import the client we just made
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to handle Google Login
  const handleGoogleLogin = async () => {
    if (!acceptedTerms) return alert(t('auth.terms_error'));
    
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) alert(error.message);
    setLoading(false);
  };

  // Function for Visitor Mode (Phase 1 Requirement)
  const handleVisitorMode = () => {
    if (!acceptedTerms) return alert(t('auth.terms_error'));
    // In real app, we might set a "guest" flag in local storage
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <div className="w-full max-w-sm space-y-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Mascot / Logo Area */}
        <div className="flex flex-col items-center gap-4">
            {/* Replace this div with: <img src="/assets/icons/mascot.png" className="w-32 h-32" /> */}
            <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center text-4xl">
                🦁
            </div>
            <h1 className="text-3xl font-heading font-bold text-primary">
                {t('auth.welcome_back')}
            </h1>
        </div>

        {/* Buttons Section */}
        <div className="space-y-4 w-full pt-4">
            <Button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full rounded-3xl h-14 text-lg bg-white border-2 border-primary text-primary hover:bg-primary/5 shadow-sm"
            >
                {/* Use Google Icon from assets here if available */}
                <span className="mr-2">G</span> {t('auth.login_google')}
            </Button>

            <Button 
                variant="default"
                disabled={loading}
                className="w-full rounded-3xl h-14 text-lg shadow-lg shadow-primary/20"
            >
                {t('auth.login_email')}
            </Button>

            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm">ou</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <Button 
                variant="secondary"
                onClick={handleVisitorMode}
                className="w-full rounded-3xl h-14 text-lg bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
                {t('auth.visitor')}
            </Button>
        </div>

        {/* Terms Checkbox (Mandatory) */}
        <div className="flex items-start space-x-3 pt-4">
            <Checkbox 
                id="terms" 
                checked={acceptedTerms}
                onCheckedChange={(checked: boolean | "indeterminate") => setAcceptedTerms(checked === true)}
                className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:text-white border-primary"
            />
            <div className="grid gap-1.5 leading-none">
                <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-text text-left"
                >
                    {t('auth.terms')}
                </label>
                {/* Add links to actual terms if you have them */}
            </div>
        </div>

      </div>
    </div>
  )
}
