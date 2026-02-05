import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh the auth token
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protected routes configuration
    const protectedRoutes = [
        { path: "/expert", roles: ["EXPERT", "ADMIN"] },
        { path: "/admin", roles: ["ADMIN"] },
    ];

    // Check if current route is protected
    const matchedRoute = protectedRoutes.find((route) =>
        request.nextUrl.pathname.startsWith(route.path)
    );

    if (matchedRoute) {
        // Not authenticated - redirect to login
        if (!user) {
            const url = request.nextUrl.clone();
            url.pathname = "/login";
            url.searchParams.set("redirectTo", request.nextUrl.pathname);
            return NextResponse.redirect(url);
        }

        // Check role permissions
        try {
            const userProfile = await prisma.userProfile.findUnique({
                where: { id: user.id },
                select: { role: true },
            });

            const userRole = userProfile?.role || "USER";

            if (!matchedRoute.roles.includes(userRole)) {
                // User doesn't have required role - redirect to unauthorized
                const url = request.nextUrl.clone();
                url.pathname = "/unauthorized";
                return NextResponse.redirect(url);
            }
        } catch (error) {
            // Error fetching user profile - deny access
            const url = request.nextUrl.clone();
            url.pathname = "/unauthorized";
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
}
