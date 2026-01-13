import { createClient } from "@/utils/supabase/server";
import { LandingHero } from "@/components/landing-hero";
import { FeaturesSection } from "@/components/features-section";
import { MethodologySection } from "@/components/methodology-section";

export default async function LandingPage() {
  const supabase = await createClient(); // Await the client creation

  // Check auth status
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingHero isLoggedIn={!!user} />
      <FeaturesSection />
      <MethodologySection />
    </div>
  );
}
