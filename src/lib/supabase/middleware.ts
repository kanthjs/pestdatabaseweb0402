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
        { path: "/dashboard/admin", roles: ["ADMIN"] },
        { path: "/dashboard/expert", roles: ["EXPERT", "ADMIN"] },
        { path: "/dashboard/user", roles: ["USER", "EXPERT", "ADMIN"] },
        { path: "/expert", roles: ["EXPERT", "ADMIN"] },
        { path: "/admin", roles: ["ADMIN"] },
    ];

    // Check if current route is protected
    const matchedRoute = protectedRoutes.find((route) =>
        request.nextUrl.pathname.startsWith(route.path)
    );

    if (matchedRoute || request.nextUrl.pathname === "/dashboard") {
        // Not authenticated - redirect to login (only for protected routes, /dashboard is public but we redirect if logged in)
        if (!user) {
            if (matchedRoute) {
                const url = request.nextUrl.clone();
                url.pathname = "/login";
                url.searchParams.set("redirectTo", request.nextUrl.pathname);
                return NextResponse.redirect(url);
            }
            // If /dashboard and not logged in, allow access (it's the public dashboard)
            return supabaseResponse;
        }

        // Check role permissions and handle /dashboard redirect
        try {
            const userProfile = await prisma.userProfile.findFirst({
                where: {
                    OR: [
                        { id: user.id },
                        { email: user.email || "" },
                    ],
                },
                select: { role: true },
            });

            const userRole = userProfile?.role || "USER";

            // Redirect /dashboard to specific dashboard based on role
            if (request.nextUrl.pathname === "/dashboard") {
                const url = request.nextUrl.clone();
                if (userRole === "ADMIN") url.pathname = "/dashboard/admin";
                else if (userRole === "EXPERT") url.pathname = "/dashboard/expert";
                else url.pathname = "/dashboard/user";
                return NextResponse.redirect(url);
            }

            console.log(`Middleware: Path=${request.nextUrl.pathname}, User=${user.email}, Role=${userRole}, Required=${matchedRoute?.roles.join()}`);

            if (matchedRoute && !matchedRoute.roles.includes(userRole)) {
                console.log(`Middleware: Access DENIED - Role ${userRole} not in [${matchedRoute.roles.join()}]`);
                // User doesn't have required role - redirect to unauthorized
                const url = request.nextUrl.clone();
                url.pathname = "/unauthorized";
                return NextResponse.redirect(url);
            }

            console.log(`Middleware: Access GRANTED`);
        } catch (error) {
            // Error fetching user profile - deny access only if it was a protected route
            if (matchedRoute) {
                const url = request.nextUrl.clone();
                url.pathname = "/unauthorized";
                return NextResponse.redirect(url);
            }
        }
    }

    return supabaseResponse;
}
