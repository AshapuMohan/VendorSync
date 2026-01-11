import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname

    const isLoginOrRegister = path === '/login' || path === '/register'

    const token = request.cookies.get('token')?.value || ''

    if (isLoginOrRegister && token) {
        // Only redirect from auth pages if logged in
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
    }

    if (!isLoginOrRegister && !token) {
        // If trying to access protected route without token, redirect to login
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/register',
        '/dashboard/:path*',
        '/tenders/:path*',
    ]
}
