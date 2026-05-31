import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OrbsBackdrop from "@/components/orbs-backdrop";
import Creator from "./creator";
import { logout } from "./actions";

export default async function AppPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already guards /app; re-check here as defense in depth.
  if (!user) redirect("/login");

  return (
    <main className="relative min-h-screen">
      <OrbsBackdrop />

      {/* Minimal app header (not the full landing navbar) */}
      <header className="glass sticky top-4 z-50 mx-4 flex items-center justify-between rounded-2xl px-6 py-3">
        <span className="font-bold tracking-tight text-white">Carousel</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#A1A1AA]">{user.email}</span>
          <form action={logout}>
            <button className="glass rounded-full px-4 py-1.5 text-sm text-white transition-colors hover:border-white/30">
              Logout
            </button>
          </form>
        </div>
      </header>

      <Creator />
    </main>
  );
}
