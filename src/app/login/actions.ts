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

    const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";

    revalidatePath("/", "layout");
    redirect(redirectTo);
}

export async function signup(formData: FormData) {
    const email = formData.get("email") as string;

    // Rate limiting check
    const rateLimitResult = rateLimiters.auth(`signup:${email}`);
    if (!rateLimitResult.success) {
        return { success: false, message: rateLimitResult.error };
    }

    const supabase = await createClient();

    const password = formData.get("password") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;

    const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: `${firstName} ${lastName}`.trim(),
                first_name: firstName,
                last_name: lastName,
            },
        },
    });

    if (error) {
        return { success: false, message: error.message };
    }

    // Create user profile in our database
    if (authData.user) {
        try {
            await prisma.userProfile.create({
                data: {
                    id: authData.user.id,
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone,
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

    // Get user profile with role
    const profile = await prisma.userProfile.findUnique({
        where: { id: user.id },
    });

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
