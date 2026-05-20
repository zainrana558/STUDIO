
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase client for server-side operations (Server Components, Route Handlers).
 * This client is configured to use the user's session cookie for authentication.
 *
 * IMPORTANT: This client uses the ANON key, which is safe to use in public-facing
 * code. It will respect your Row Level Security (RLS) policies. For admin-level
 * tasks that require bypassing RLS, you should create a separate, dedicated client
 * that uses the SERVICE_ROLE_KEY and is only used in secure, server-only environments.
 */
export function createSupabaseServerClient() {
    const cookieStore = cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Use the anon key for all client-facing operations
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    // The 'set' method in next/headers can be used to create, update, or remove cookies.
                    // Here, it's used by Supabase to persist the user's session.
                    cookieStore.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    // To remove a cookie, we set its value to an empty string and
                    // let Supabase handle the expiration options.
                    cookieStore.set({ name, value: '', ...options });
                },
            },
        }
    );
}
