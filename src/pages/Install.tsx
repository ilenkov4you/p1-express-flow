import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Share } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const { t } = useLanguage();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="mx-auto max-w-md p-6 space-y-6 text-center">
      <Download className="mx-auto h-12 w-12 text-primary" />
      <h1 className="text-2xl font-bold">Install P1.express</h1>
      <p className="text-muted-foreground">
        Add P1.express to your home screen for quick access and an app-like experience.
      </p>

      {installed ? (
        <div className="flex items-center justify-center gap-2 text-primary">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">App installed!</span>
        </div>
      ) : deferredPrompt ? (
        <Button onClick={handleInstall} size="lg" className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Install App
        </Button>
      ) : isIOS ? (
        <div className="rounded-lg border p-4 space-y-2 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">On iPhone / iPad:</p>
          <p>
            Tap <Share className="inline h-4 w-4" /> <strong>Share</strong> in Safari, then tap{" "}
            <strong>"Add to Home Screen"</strong>.
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Open this page in Chrome or Edge on your phone to install.
        </p>
      )}
    </div>
  );
}
