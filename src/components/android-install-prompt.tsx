"use client";

import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function AndroidInstallPrompt() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the prompt
    const isDismissed = localStorage.getItem("android-prompt-dismissed");

    // Simple mobile detection (can be more robust if needed)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    // Also specifically check for Android if you want to target only Android
    // const isAndroid = /Android/i.test(navigator.userAgent);

    // Check if running in native app (Capacitor)
    const isNative = typeof window !== 'undefined' && (window as any).Capacitor?.isNative;

    if (isMobile && !isDismissed && !isNative) {
      // Delay showing it slightly so it doesn't pop up instantly
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("android-prompt-dismissed", "true");
  };

  const handleDownload = () => {
    // Replace with actual link
    window.open("/android/app-release.apk", "_blank");
    handleDismiss();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:hidden"
        >
          <div className="bg-background/95 backdrop-blur-md border border-border p-4 rounded-xl shadow-2xl flex items-center gap-4">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">Get the App</h3>
              <p className="text-xs text-muted-foreground truncate">
                Better experience on Android
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleDownload}
                className="h-8 px-3 text-xs"
              >
                <Download className="h-3 w-3 mr-1.5" />
                Install
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground"
                onClick={handleDismiss}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
