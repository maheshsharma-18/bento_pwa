export const isTWA = (): boolean => {
  // 1. Check if running in a browser environment
  if (typeof window === 'undefined') return false;

  // 2. Check standard TWA referrers
  const referrer = document.referrer;
  if (referrer.includes('android-app://')) {
    return true;
  }

  // 3. Optional: Check for specific display mode (standalone)
  // This helps detect if installed as PWA on iOS/Android too
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  // Note: For strict Google Play compliance, checking referrer is the most reliable method
  // for TWAs. We can treat 'standalone' as an app too just to be safe.
  return isStandalone || referrer.includes('android-app://');
};