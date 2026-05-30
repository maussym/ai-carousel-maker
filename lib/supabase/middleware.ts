// Session refresh + route protection, run from the root middleware on every
// matched request. Refreshes the auth token (so Server Components always see a
// valid session) and enforces redirects. Uses the anon key only.
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: do not run code between createServerClient and getUser() - it
  // refreshes the token, and a gap here can log users out at random.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Unauthenticated user hitting a protected route → /login
  if (!user && pathname.startsWith('/app')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return redirectKeepingCookies(url, supabaseResponse)
  }

  // Authenticated user hitting /login → /app
  if (user && pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/app'
    return redirectKeepingCookies(url, supabaseResponse)
  }

  // IMPORTANT: return supabaseResponse as-is so refreshed auth cookies persist.
  return supabaseResponse
}

// Redirect while carrying over any auth cookies the client just refreshed.
function redirectKeepingCookies(url: URL, from: NextResponse) {
  const response = NextResponse.redirect(url)
  from.cookies.getAll().forEach((cookie) => response.cookies.set(cookie))
  return response
}
