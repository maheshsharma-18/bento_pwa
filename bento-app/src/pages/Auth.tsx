import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function Auth() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background p-6">
      <div className="w-full max-w-sm space-y-4 text-center">
        {/* Replace with your Mascot Icon from assets */}
        <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto mb-6 flex items-center justify-center">
            🦁
        </div>
        <h1 className="text-2xl font-bold text-primary">{t('auth.welcome_back')}</h1>
        
        <div className="space-y-2 w-full pt-8">
            <Button className="w-full rounded-3xl h-12 text-md" variant="outline">
                {t('auth.login_google')}
            </Button>
            <Button className="w-full rounded-3xl h-12 text-md">
                {t('auth.login_email')}
            </Button>
        </div>
      </div>
    </div>
  )
}
