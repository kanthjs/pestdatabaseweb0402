"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
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
                    fullName: fullName,
                    role: "USER",
                },
            });
        } catch (e) {
            console.error("Error creating user profile:", e);
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
        fullName: profile?.fullName,
    };
}
