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

    // Show to everyone who hasn't dismissed it (and isn't in native app)
    // Relaxed restrictions as per user request to show on laptop too
    // FORCE SHOW for debugging: Ignore dismissal and native check for now
    // if (!isDismissed && !isNative) {
    setIsVisible(true);
    // }
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
          className="fixed bottom-4 left-4 right-4 z-[9999] md:bottom-6 md:right-6 md:left-auto md:w-[400px]"
        >
          <div className="bg-background/95 backdrop-blur-md border border-border p-4 rounded-xl shadow-2xl flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <Smartphone className="h-6 w-6 text-blue-600" />
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
                className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white"
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
