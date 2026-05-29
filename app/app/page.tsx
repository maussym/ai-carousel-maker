import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logout } from './actions'

export default async function AppPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Middleware already guards /app, but re-check here as defense in depth.
  if (!user) redirect('/login')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <p className="text-sm text-gray-600">
        Signed in as <span className="font-medium">{user.email}</span>
      </p>
      <form action={logout}>
        <button className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
          Logout
        </button>
      </form>
    </main>
  )
}
