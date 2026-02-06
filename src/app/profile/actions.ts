"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface UserProfileData {
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    occupationRoles: string | null;
    address: string | null;
    province: string | null;
    district: string | null;
    subDistrict: string | null;
    zipCode: string | null;
    email: string;
    role: string;
    expertRequest: string;
}

export async function getProfileData(): Promise<UserProfileData | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Try to find existing profile by id first
    let profile = await prisma.userProfile.findUnique({
        where: { id: user.id },
    });

    if (!profile) {
        // Try to find by email in case user was created with different id
        profile = await prisma.userProfile.findUnique({
            where: { email: user.email || "" },
        });
    }

    if (!profile) {
        // Create a new profile if it doesn't exist
        const userName = user.email 
            ? user.email.split('@')[0] + '_' + Date.now().toString(36)
            : 'user_' + Date.now().toString(36);
        
        try {
            profile = await prisma.userProfile.create({
                data: {
                    id: user.id,
                    userName,
                    email: user.email || "",
                    firstName: user.user_metadata?.first_name || null,
                    lastName: user.user_metadata?.last_name || null,
                },
            });
        } catch (error: any) {
            // If unique constraint fails, try to fetch the existing profile
            if (error.code === "P2002") {
                profile = await prisma.userProfile.findUnique({
                    where: { email: user.email || "" },
                });
            }
            if (!profile) throw error;
        }
    }

    return {
        ...profile,
        role: profile.role,
        expertRequest: profile.expertRequest,
    };
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "Not authenticated" };
    }

    const profileData = {
        firstName: formData.get("firstName") as string || null,
        lastName: formData.get("lastName") as string || null,
        phone: formData.get("phone") as string || null,
        occupationRoles: formData.get("occupationRoles") as string || null,
        address: formData.get("address") as string || null,
        province: formData.get("province") as string || null,
        district: formData.get("district") as string || null,
        subDistrict: formData.get("subDistrict") as string || null,
        zipCode: formData.get("zipCode") as string || null,
    };

    try {
        // Try to find existing profile by id or email
        let profile = await prisma.userProfile.findUnique({
            where: { id: user.id },
        });

        if (!profile && user.email) {
            profile = await prisma.userProfile.findUnique({
                where: { email: user.email },
            });
        }

        if (profile) {
            // Update existing profile
            await prisma.userProfile.update({
                where: { id: profile.id },
                data: profileData,
            });
        } else {
            // Create new profile with unique userName
            const userName = user.email 
                ? user.email.split('@')[0] + '_' + Date.now().toString(36)
                : 'user_' + Date.now().toString(36);
            
            try {
                await prisma.userProfile.create({
                    data: {
                        id: user.id,
                        userName,
                        email: user.email || "",
                        ...profileData,
                    },
                });
            } catch (createError: any) {
                // If unique constraint fails on email, try to update the existing record
                if (createError.code === "P2002" && user.email) {
                    const existingProfile = await prisma.userProfile.findUnique({
                        where: { email: user.email },
                    });
                    if (existingProfile) {
                        await prisma.userProfile.update({
                            where: { id: existingProfile.id },
                            data: { ...profileData, id: user.id },
                        });
                    } else {
                        throw createError;
                    }
                } else {
                    throw createError;
                }
            }
        }

        revalidatePath("/profile");
        return { success: true, message: "Profile updated successfully" };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { success: false, message: "Failed to update profile" };
    }
}

export async function requestExpertStatus() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "Not authenticated" };
    }

    try {
        await prisma.userProfile.update({
            where: { id: user.id },
            data: {
                expertRequest: "PENDING",
            },
        });

        revalidatePath("/profile");
        return { success: true, message: "Expert request submitted" };
    } catch (error) {
        console.error("Error requesting expert status:", error);
        return { success: false, message: "Failed to submit request" };
    }
}
