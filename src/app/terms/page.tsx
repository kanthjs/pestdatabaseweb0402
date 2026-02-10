import { LandingFooter } from "@/components/landing/LandingFooter";
import Link from "next/link";

export const metadata = {
    title: "Terms of Use | RicePestNet",
    description: "Terms of Use for the Thai Rice Pest Monitoring Network",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-primary py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                        ข้อกำหนดการใช้งาน
                    </h1>
                    <p className="text-xl text-primary-foreground/80 font-light">
                        Terms of Use
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-sm">
                        <p className="text-muted-foreground mb-8 italic">
                            Last Updated: February 10, 2026
                        </p>

                        <div className="prose prose-green dark:prose-invert max-w-none space-y-8 text-foreground leading-relaxed">

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">1. Acceptance of Terms</h2>
                                <p>
                                    By accessing and using the Thai Rice Pest Monitoring Network website and portal (collectively, the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this Service.
                                </p>
                                <p>
                                    These Terms of Use ("Terms") govern your access to and use of our Service, including any content, functionality, and services offered on or through the Service.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">2. Use of the Service</h2>
                                <h3 className="text-xl font-semibold">2.1 Permitted Use</h3>
                                <p>
                                    You may use the Service only for lawful purposes and in accordance with these Terms. The Service is intended to facilitate the monitoring, reporting, and management of rice pest and disease information across Thailand.
                                </p>

                                <h3 className="text-xl font-semibold">2.2 Prohibited Activities</h3>
                                <p>You agree not to:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Use the Service in any way that violates any applicable national or international law or regulation</li>
                                    <li>Submit false, misleading, or inaccurate information or reports</li>
                                    <li>Impersonate or attempt to impersonate another user, person, or entity</li>
                                    <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
                                    <li>Use any robot, spider, or other automatic device, process, or means to access the Service for any purpose</li>
                                    <li>Introduce any viruses, trojan horses, worms, logic bombs, or other material that is malicious or technologically harmful</li>
                                    <li>Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Service</li>
                                </ul>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">3. User Accounts and Registration</h2>
                                <h3 className="text-xl font-semibold">3.1 Account Creation</h3>
                                <p>
                                    To access certain features of the Service, you may be required to register for an account. When you register, you agree to provide accurate, current, and complete information about yourself and to maintain and update this information to keep it accurate, current, and complete.
                                </p>

                                <h3 className="text-xl font-semibold">3.2 Account Security</h3>
                                <p>
                                    You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. We encourage you to use "strong" passwords (passwords that use a combination of upper and lower case letters, numbers, and symbols) with your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                                </p>

                                <h3 className="text-xl font-semibold">3.3 Account Termination</h3>
                                <p>
                                    We reserve the right to terminate or suspend your account and access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the Service, us, or third parties, or for any other reason.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">4. User Content and Data Submission</h2>
                                <h3 className="text-xl font-semibold">4.1 Responsibility for Content</h3>
                                <p>
                                    You are solely responsible for any data, reports, photographs, information, or other content that you submit, post, or display on or through the Service ("User Content"). By submitting User Content, you represent and warrant that:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>You own or have the necessary rights, licenses, and permissions to submit the User Content</li>
                                    <li>The User Content is accurate and truthful to the best of your knowledge</li>
                                    <li>The User Content does not violate any third-party rights, including intellectual property rights</li>
                                    <li>The User Content complies with these Terms and applicable laws</li>
                                </ul>

                                <h3 className="text-xl font-semibold">4.2 License to User Content</h3>
                                <p>
                                    By submitting User Content to the Service, you grant us a worldwide, non-exclusive, royalty-free, perpetual, irrevocable license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such User Content for the purposes of operating, promoting, and improving the Service, and for research and public health purposes related to agricultural pest management.
                                </p>

                                <h3 className="text-xl font-semibold">4.3 Data Accuracy</h3>
                                <p>
                                    While we strive to verify submitted reports and data, we cannot guarantee the accuracy, completeness, or reliability of any User Content. Users should independently verify any information before making decisions based on data from the Service.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">5. Intellectual Property Rights</h2>
                                <h3 className="text-xl font-semibold">5.1 Service Content</h3>
                                <p>
                                    The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of the Thai Rice Pest Monitoring Network and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
                                </p>

                                <h3 className="text-xl font-semibold">5.2 Limited License</h3>
                                <p>
                                    Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, non-sublicensable license to access and use the Service for your personal or organizational use in connection with rice pest monitoring and agricultural management activities.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">6. Privacy and Data Protection</h2>
                                <p>
                                    Our collection and use of personal information in connection with your use of the Service is described in our <Link href="/privacy" className="text-primary hover:text-primary/80 underline">Privacy Policy</Link>. By using the Service, you consent to such collection and use.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">7. Disclaimer of Warranties</h2>
                                <p>
                                    The Service is provided on an "AS IS" and "AS AVAILABLE" basis, without any warranties of any kind, either express or implied. Neither the Thai Rice Pest Monitoring Network nor any person associated with it makes any warranty or representation with respect to the completeness, security, reliability, quality, accuracy, or availability of the Service.
                                </p>
                                <p>
                                    We do not warrant that:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>The Service will be available at any particular time or location, uninterrupted or secure</li>
                                    <li>Any defects or errors will be corrected</li>
                                    <li>The Service is free of viruses or other harmful components</li>
                                    <li>The results of using the Service will meet your requirements</li>
                                </ul>
                                <p>
                                    For additional disclaimers, please refer to our <Link href="/disclaimer" className="text-primary hover:text-primary/80 underline">Disclaimer page</Link>.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">8. Limitation of Liability</h2>
                                <p>
                                    To the fullest extent permitted by applicable law, in no event will the Thai Rice Pest Monitoring Network, its affiliates, officers, directors, employees, agents, suppliers, or licensors be liable for:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                                    <li>Any loss of profits, revenues, data, use, goodwill, or other intangible losses</li>
                                    <li>Any damages resulting from your access to or use of or inability to access or use the Service</li>
                                    <li>Any damages resulting from any conduct or content of any third party on the Service</li>
                                    <li>Any damages resulting from unauthorized access, use, or alteration of your transmissions or content</li>
                                </ul>
                                <p>
                                    This limitation of liability applies whether the alleged liability is based on contract, tort, negligence, strict liability, or any other basis, even if we have been advised of the possibility of such damage.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">9. Indemnification</h2>
                                <p>
                                    You agree to defend, indemnify, and hold harmless the Thai Rice Pest Monitoring Network, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Service.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">10. Links to Other Websites</h2>
                                <p>
                                    The Service may contain links to third-party websites or services that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that we shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">11. Changes to Terms</h2>
                                <p>
                                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                                </p>
                                <p>
                                    By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, in whole or in part, please stop using the Service.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">12. Governing Law and Jurisdiction</h2>
                                <p>
                                    These Terms shall be governed and construed in accordance with the laws of the Kingdom of Thailand, without regard to its conflict of law provisions. Any disputes arising out of or relating to these Terms or the Service shall be subject to the exclusive jurisdiction of the courts of Thailand.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">13. Severability</h2>
                                <p>
                                    If any provision of these Terms is held to be invalid, illegal, or unenforceable, the validity, legality, and enforceability of the remaining provisions shall not in any way be affected or impaired, and a valid, legal, and enforceable provision shall be substituted for the invalid, illegal, or unenforceable provision.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">14. Contact Information</h2>
                                <p>
                                    If you have any questions about these Terms, please contact us at:
                                </p>
                                <div className="bg-muted/30 p-6 rounded-lg border border-border">
                                    <p className="mb-2">
                                        <strong>Thai Rice Pest Monitoring Network</strong>
                                    </p>
                                    <p className="mb-2">
                                        Email: contact@ricepestnet.go.th
                                    </p>
                                    <p>
                                        Phone: 0-XXXX-XXXX
                                    </p>
                                </div>
                            </div>

                        </div>

                        <div className="mt-12 pt-8 border-t border-border flex justify-center">
                            <Link
                                href="/"
                                className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
                            >
                                <span className="material-icons-outlined mr-2">arrow_back</span>
                                กลับสู่หน้าหลัก
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
}
