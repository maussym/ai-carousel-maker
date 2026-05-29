// SERVER-ONLY admin client. Uses SUPABASE_SERVICE_ROLE_KEY, which BYPASSES RLS
// and has full database access. NEVER import this from a 'use client' component
// or anywhere that ships to the browser. Use it only in Route Handlers
// (app/api/**) or Server Actions — e.g. writing the anonymous_usage table and
// enforcing plan limits.
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

if (typeof window !== 'undefined') {
  throw new Error('lib/supabase/admin.ts must never be imported in the browser.')
}

export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
