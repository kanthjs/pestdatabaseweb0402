import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ExpertRequestEmailProps {
    adminEmail: string;
    userName: string;
    userEmail: string;
    userPhone?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    role?: string | null;
    requestDate: Date;
}

export async function sendExpertRequestEmail({
    adminEmail,
    userName,
    userEmail,
    userPhone,
    firstName,
    lastName,
    role,
    requestDate,
}: ExpertRequestEmailProps) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not set. Skipping email sending.");
        return { success: false, error: "Missing API Key" };
    }

    try {
        const dashboardUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const { data, error } = await resend.emails.send({
            from: 'Pest Database System <onboarding@resend.dev>',
            to: [adminEmail],
            subject: `[Notification] New Expert Status Request: ${userName}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Expert Status Request</title>
                    <style>
                        body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; }
                        .header { background-color: #f8f9fa; padding: 15px; text-align: center; border-bottom: 1px solid #e0e0e0; margin-bottom: 20px; }
                        .header h2 { margin: 0; color: #0070f3; }
                        .content { padding: 10px; }
                        .info-box { background-color: #f0f7ff; padding: 15px; border-radius: 6px; border-left: 4px solid #0070f3; margin-bottom: 20px; }
                        .info-item { margin-bottom: 8px; }
                        .info-label { font-weight: 600; color: #555; }
                        .btn { display: inline-block; background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; text-align: center; }
                        .footer { margin-top: 30px; font-size: 12px; color: #888; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 15px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Expert Status Request</h2>
                        </div>
                        <div class="content">
                            <p>Hello Admin,</p>
                            <p>A user has submitted a request to be upgraded to <strong>Expert</strong> status.</p>
                            
                            <div class="info-box">
                                <div class="info-item"><span class="info-label">Display Name:</span> ${firstName} ${lastName}</div>
                                <div class="info-item"><span class="info-label">Username:</span> ${userName}</div>
                                <div class="info-item"><span class="info-label">Email:</span> ${userEmail}</div>
                                <div class="info-item"><span class="info-label">Phone:</span> ${userPhone || '-'}</div>
                                <div class="info-item"><span class="info-label">Current Role:</span> ${role || 'User'}</div>
                                <div class="info-item"><span class="info-label">Request Date:</span> ${requestDate.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                            </div>

                            <p>Please review this request in the admin dashboard.</p>
                            
                            <div style="text-align: center; margin-top: 25px;">
                                <a href="${dashboardUrl}/dashboard/admin" class="btn">Go to Admin Dashboard</a>
                            </div>
                        </div>
                        <div class="footer">
                            <p>This is an automated message from the Pest Database System.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        });

        if (error) {
            console.error("Resend error:", error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Email sending failed:", error);
        return { success: false, error: "Internal Server Error" };
    }
}
