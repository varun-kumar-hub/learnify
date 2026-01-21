import { ThemeProvider } from "@/components/theme-provider";
import { GlobalBackground } from "@/components/global-background";
import { InstallPrompt } from "@/components/install-prompt";
import { AndroidInstallPrompt } from "@/components/android-install-prompt";
import { AuthListener } from "@/components/auth-listener";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Learnify Rep",
  description: "Advanced Learning Path Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalBackground />
          <InstallPrompt />
          <AndroidInstallPrompt />
          <AuthListener />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
