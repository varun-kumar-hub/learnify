import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LandingHero } from "@/components/landing-hero";
import { FeaturesSection } from "@/components/features-section";
import { MethodologySection } from "@/components/methodology-section";

export default async function LandingPage() {
  const supabase = await createClient(); // Await the client creation

  // Check auth status
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen text-foreground relative z-10">
      <LandingHero isLoggedIn={!!user} />
      <FeaturesSection />
      <MethodologySection />
    </div>
  );
}
