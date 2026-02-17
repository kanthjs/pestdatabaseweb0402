"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { rateLimiters } from "@/lib/rate-limit";

export async function login(formData: FormData) {
    const email = formData.get("email") as string;

    // Rate limiting check
    const rateLimitResult = rateLimiters.auth(`login:${email}`);
    if (!rateLimitResult.success) {
        return { success: false, message: rateLimitResult.error };
    }

    const supabase = await createClient();

    const data = {
        email,
        password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        return { success: false, message: "Invalid email or password" };
    }

    let redirectTo = (formData.get("redirectTo") as string);
    console.log("Login: redirectTo from form:", redirectTo);

    if (!redirectTo) {
        // Fetch user profile to determine role
        const { data: { user } } = await supabase.auth.getUser();
        console.log("Login: user:", user?.email, "id:", user?.id);
        if (user) {
            // Try find by ID first, then by email (like in API)
            let profile = await prisma.userProfile.findUnique({
                where: { id: user.id },
                select: { role: true }
            });
            console.log("Login: profile by id:", profile);

            // If not found by ID and user has email, try looking up by email
            if (!profile && user.email) {
                profile = await prisma.userProfile.findUnique({
                    where: { email: user.email },
                    select: { role: true }
                });
                console.log("Login: profile by email:", profile);
            }

            const role = profile?.role || "USER";
            console.log("Login: final role:", role);

            if (role === "ADMIN") redirectTo = "/dashboard/admin";
            else redirectTo = "/dashboard";
        } else {
            redirectTo = "/dashboard";
        }
    }
    console.log("Login: final redirectTo:", redirectTo);

    revalidatePath("/", "layout");
    redirect(redirectTo);
}

export async function signup(formData: FormData) {
    const email = formData.get("email") as string;

    // Rate limiting check
    const rateLimitResult = rateLimiters.signup(`signup:${email}`);
    if (!rateLimitResult.success) {
        return { success: false, message: rateLimitResult.error };
    }

    const supabase = await createClient();

    const password = formData.get("password") as string;

    const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        // Handle Supabase email rate limit error
        const errorMsg = error.message.toLowerCase();
        const isRateLimited =
            errorMsg.includes("rate limit") ||
            errorMsg.includes("email rate limit") ||
            (error as any).status === 429;

        if (isRateLimited) {
            return {
                success: false,
                message: "ขณะนี้ระบบส่งอีเมลยืนยันถึงขีดจำกัด กรุณารอสักครู่แล้วลองใหม่อีกครั้ง (ประมาณ 1 ชั่วโมง)",
            };
        }

        return { success: false, message: error.message };
    }

    // Create user profile in our database
    if (authData.user) {
        try {
            const userName = email.split('@')[0] + '_' + Date.now().toString(36);
            await prisma.userProfile.create({
                data: {
                    id: authData.user.id,
                    userName,
                    email: email,
                    role: "USER",
                },
            });
        } catch (e) {
            // Error creating user profile - log in development only
            if (process.env.NODE_ENV === "development") {
                console.error("Error creating user profile:", e);
            }
        }
    }

    revalidatePath("/", "layout");
    redirect("/login?message=Check your email to confirm your account");
}

export async function signout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/");
}

export async function getCurrentUser() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Get user profile with role - try by ID first, then by email
    let profile = await prisma.userProfile.findUnique({
        where: { id: user.id },
    });

    // If not found by ID and user has email, try looking up by email
    if (!profile && user.email) {
        profile = await prisma.userProfile.findUnique({
            where: { email: user.email },
        });
    }

    return {
        ...user,
        role: profile?.role || "USER",
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        fullName: profile ? `${profile.firstName} ${profile.lastName}`.trim() : user.user_metadata?.full_name,
        phone: profile?.phone,
        occupationRoles: profile?.occupationRoles,
    };
}
