import { createClient } from "@/utils/supabase/server";
import { LandingHero } from "@/components/landing-hero";

export default async function LandingPage() {
  const supabase = await createClient(); // Await the client creation

  // Check auth status
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <LandingHero isLoggedIn={!!user} />
    </div>
  );
}
