import { z } from "zod";

// Notification validation schemas
export const markNotificationSchema = z.object({
    id: z.string().cuid().optional(),
    markAll: z.boolean().optional(),
}).refine((data) => data.id || data.markAll, {
    message: "Either 'id' or 'markAll' must be provided",
});

export type MarkNotificationInput = z.infer<typeof markNotificationSchema>;
