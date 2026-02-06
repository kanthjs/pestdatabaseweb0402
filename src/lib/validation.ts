import { z } from "zod";

// Notification validation schemas
export const markNotificationSchema = z.object({
    id: z.string().cuid().optional(),
    markAll: z.boolean().optional(),
}).refine((data) => data.id || data.markAll, {
    message: "Either 'id' or 'markAll' must be provided",
});

export type MarkNotificationInput = z.infer<typeof markNotificationSchema>;

// Survey/Pest Report validation schemas
export const pestReportSchema = z.object({
    province: z.string().min(1, "Province is required"),
    plantId: z.string().min(1, "Plant selection is required"),
    pestId: z.string().min(1, "Pest selection is required"),
    symptomOnSet: z.string().datetime("Invalid date format"),
    fieldAffectedArea: z.number().min(0, "Area must be positive").max(10000, "Area too large"),
    incidencePercent: z.number().min(0).max(100, "Must be between 0-100"),
    severityPercent: z.number().min(0).max(100, "Must be between 0-100"),
    latitude: z.number().min(-90).max(90, "Invalid latitude"),
    longitude: z.number().min(-180).max(180, "Invalid longitude"),
    imageUrls: z.array(z.string().url("Invalid image URL")),
    imageCaptions: z.array(z.string()),
    isAnonymous: z.boolean().default(false),
    reporterFirstName: z.string().max(100).optional(),
    reporterLastName: z.string().max(100).optional(),
    reporterPhone: z.string().max(20).optional(),
    reporterRole: z.string().max(50).optional(),
}).refine((data) => {
    if (!data.isAnonymous) {
        return data.reporterFirstName || data.reporterPhone;
    }
    return true;
}, {
    message: "Name or phone is required when not anonymous",
    path: ["reporterFirstName"],
});

export type PestReportInput = z.infer<typeof pestReportSchema>;

// Expert review action validation
export const reviewActionSchema = z.object({
    reportId: z.string().cuid("Invalid report ID"),
    action: z.enum(["verify", "reject"], { message: "Action must be 'verify' or 'reject'" }),
    rejectionReason: z.string().max(500).optional(),
}).refine((data) => {
    if (data.action === "reject") {
        return data.rejectionReason && data.rejectionReason.length > 0;
    }
    return true;
}, {
    message: "Rejection reason is required when rejecting a report",
    path: ["rejectionReason"],
});

export type ReviewActionInput = z.infer<typeof reviewActionSchema>;

// Pagination params validation
export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sortBy: z.enum(["createdAt", "updatedAt", "reportedAt"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

// Date range validation
export const dateRangeSchema = z.object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
}).refine((data) => data.startDate <= data.endDate, {
    message: "End date must be after start date",
    path: ["endDate"],
});

export type DateRangeInput = z.infer<typeof dateRangeSchema>;

// Query params for dashboard
export const dashboardQuerySchema = z.object({
    days: z.coerce.number().int().min(1).max(365).default(30),
    province: z.string().optional(),
    pestId: z.string().optional(),
});

export type DashboardQueryInput = z.infer<typeof dashboardQuerySchema>;
