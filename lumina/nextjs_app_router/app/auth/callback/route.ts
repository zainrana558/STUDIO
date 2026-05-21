
import { createSupabaseServerClient } from '../../../lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    if (!code) {
        // No code provided - redirect to login with message
        return NextResponse.redirect(new URL('/login?error=no_code', request.url));
    }

    const supabase = createSupabaseServerClient();
    
    // Try to exchange code for session with retry logic
    let maxRetries = 3;
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (!error) {
            // Success - redirect to destination
            return NextResponse.redirect(new URL(next, request.url));
        }
        
        lastError = error;
        console.error(`[AUTH_CALLBACK] Attempt ${attempt} failed:`, error.message);
        
        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, attempt)));
        }
    }

    // All retries exhausted - log the error and redirect to error page
    console.error('[AUTH_CALLBACK] Failed after all retries:', lastError);
    return NextResponse.redirect(new URL(`/login?error=auth_failed&message=${encodeURIComponent(lastError?.message || 'Authentication failed')}`, request.url));
}
