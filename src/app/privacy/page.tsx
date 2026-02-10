import { LandingFooter } from "@/components/landing/LandingFooter";
import Link from "next/link";

export const metadata = {
    title: "Privacy Policy | RicePestNet",
    description: "Privacy Policy for the Thai Rice Pest Monitoring Network",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-primary py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                        นโยบายความเป็นส่วนตัว
                    </h1>
                    <p className="text-xl text-primary-foreground/80 font-light">
                        Privacy Policy
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto prose prose-green dark:prose-invert max-w-none">
                    <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-sm">
                        <p className="text-muted-foreground mb-8 italic">
                            อัปเดตล่าสุด: 20 กันยายน 2019
                        </p>

                        <div className="space-y-8 text-foreground leading-relaxed">
                            <p>
                                This is the Privacy Policy of Plant Health Australia Limited (PHA) (Privacy Policy) which applies to the collection of information via the Plant Surveillance Network Australasia Pacific (PSNAP) website and portal (website and portal).
                            </p>

                            <p>
                                PHA understands your privacy is important and is committed to respecting your rights and complying with all privacy obligations under the Privacy Act 1988 (Cth) (Privacy Act), including the Australian Privacy Principles (APPs). The APPs are designed to protect your privacy by regulating the way personal information is managed.
                            </p>

                            <p>
                                Under the Privacy Act, personal information is defined as information or an opinion about an identified individual, or an individual who is reasonably identifiable, irrespective of whether the information or opinion is true or is recorded in a material form (Personal Information).
                            </p>

                            <p>
                                This Privacy Policy sets out how and when PHA will collect, use and disclose Personal Information obtained via the website and portal, and how you may access your Personal Information.
                            </p>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">Collection of Personal Information</h2>

                                <h3 className="text-xl font-semibold">1. Purpose</h3>
                                <p>
                                    PHA collects and holds Personal Information that is reasonably necessary for, or related to, the activities and services PHA provides, and to administrative functions associated with these services. Accordingly, PHA collects Personal Information of visitors to the website (visitors) for the primary purposes of improving its services. PHA will only use Personal Information for this purpose, or for a related secondary purpose for which such information was collected.
                                </p>

                                <h3 className="text-xl font-semibold">2. Kinds of Personal Information collected</h3>
                                <p>
                                    The kind of Personal Information collected and held by PHA may include your name, email address, home or work address and telephone number, which are encrypted for your security.
                                </p>
                                <p>
                                    The kind of computer hardware and software information collected and held by PHA may include IP addresses, browser type, domain names, access time, referring website addresses, average hits per day, most visited pages, length of visit, most and least active day/week/time/date, top referring URLs, top search engines, top search phrases, top search keywords, top browsers and versions and top operating systems.
                                </p>
                                <p>
                                    Based upon this information, PHA may record statistics on successful site hits, page hits, document views, visitors who visit the website once and visitors who visit the website more than once.
                                </p>

                                <h3 className="text-xl font-semibold">3. Method of collection</h3>
                                <p>
                                    PHA may collect Personal Information from a range of sources including: directly from you, your use of the PHA website and the use of standard forms.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">Use and disclosure of information</h2>

                                <p className="flex items-start gap-4">
                                    <span className="font-bold text-primary">4.</span>
                                    <span>PHA may use Personal Information to manage your account, assess eligibility for access to the members portal, respond to any enquiries made or complaints lodged by you, provide services you have requested, analyse usage and accuracy of the website, and monitor and investigate security breaches.</span>
                                </p>

                                <p className="flex items-start gap-4">
                                    <span className="font-bold text-primary">5.</span>
                                    <span>PHA will only disclose your Personal Information for the purpose it was collected, for a reasonably expected or related secondary purpose, or for other purposes explained at the time of collection.</span>
                                </p>

                                <p className="flex items-start gap-4">
                                    <span className="font-bold text-primary">6.</span>
                                    <span>PHA will only record the email address of the individual who is granted access to the portal. This e-mail address will only be used for the purpose for which it was provided, and will not be added to any mailing list or disclosed to a third party without your consent.</span>
                                </p>

                                <p className="flex items-start gap-4">
                                    <span className="font-bold text-primary">7.</span>
                                    <span>No attempt will be made to identify you or your browsing activities individually, except in the unlikely event of an investigation (for example, where a law enforcement agency may exercise a warrant to inspect the Internet Service Provider’s logs).</span>
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">Security of your Personal Information</h2>
                                <p className="flex items-start gap-4">
                                    <span className="font-bold text-primary">8.</span>
                                    <span>PHA will take all reasonable steps as defined by the APPs to ensure your Personal Information is kept securely and is not misused, interfered with or disclosed unless authorised by this Privacy Policy.</span>
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">Access to, and correction of, your Personal Information</h2>
                                <p className="flex items-start gap-4">
                                    <span className="font-bold text-primary">9.</span>
                                    <span>PHA will take reasonable steps to ensure that the Personal Information collected, used or disclosed is accurate, complete or up to date. You can help us to do this by letting us know if your personal details change. You are able to manage your Personal Information including updating, changing or removing Personal Information.</span>
                                </p>

                                <p className="flex items-start gap-4">
                                    <span className="font-bold text-primary">10.</span>
                                    <span>You are entitled to request access to your Personal Information held by PHA by contacting PHA on 02 6215 7700 or by emailing PSNAP@phau.com.au. PHA may deny your request to access or correct your Personal Information in limited circumstances, in accordance with the APPs. In these circumstances, PHA will provide you with a reason for its decision, and, in the case of a request for correction, PHA will include a statement about the requested correction.</span>
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">Use of Cookies</h2>
                                <p className="flex items-start gap-4">
                                    <span className="font-bold text-primary">11.</span>
                                    <span>PHA uses cookies to record your viewing preferences or other input submitted by you to provide a secure, personalised experience on the website. Cookies are small data files that a website is able to place on a user’s computer hard drive or in its memory to record aspects of that user’s experience of the website.</span>
                                </p>

                                <p className="flex items-start gap-4">
                                    <span className="font-bold text-primary">12.</span>
                                    <span>You have the ability to accept or decline cookies, most browsers automatically accept cookies however you can modify your browser settings to decline cookies if you prefer.</span>
                                </p>

                                <p className="flex items-start gap-4">
                                    <span className="font-bold text-primary">13.</span>
                                    <span>Cookies are not used by the website or portal for identifying or tracking site visitors or for passing details to third parties.</span>
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">Links</h2>
                                <p className="flex items-start gap-4">
                                    <span className="font-bold text-primary">14.</span>
                                    <span>The website may contain links to websites operated by third parties. PHA makes no representations or warranties in relation to the privacy practices of third party websites and is not responsible for the privacy practices or the content of any third party website. Third party websites are responsible for informing you about their own privacy practices.</span>
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">Complaints</h2>
                                <p className="flex items-start gap-4">
                                    <span className="font-bold text-primary">15.</span>
                                    <span>You are able to make a complaint with regard to the collection, disclosure or retention of your Personal Information by contacting PHA on 02 6215 7700 or by emailing PSNAP@phau.com.au .</span>
                                </p>

                                <p className="flex items-start gap-4">
                                    <span className="font-bold text-primary">16.</span>
                                    <span>PHA will consider your complaint to determine whether there are simple or immediate steps which can be taken to resolve the complaint.</span>
                                </p>

                                <p className="flex items-start gap-4">
                                    <span className="font-bold text-primary">17.</span>
                                    <span>If your complaint requires more detailed consideration or investigation, PHA will endeavour to complete the investigation into your complaint promptly. PHA may ask you to provide further information about your complaint and the outcome you are seeking. PHA will then typically gather facts, locate and review relevant documents and speak with individuals involved. In most cases, PHA will investigate and respond to a complaint within 30 days of receipt of your complaint. If the matter is more complex or the investigation may take longer, PHA will let you know.</span>
                                </p>

                                <p className="flex items-start gap-4">
                                    <span className="font-bold text-primary">18.</span>
                                    <span>If you are not satisfied with the response to your query or with the resolution of your request or complaint, you may make a further complaint to the Office of the Australian Information Commissioner on 1300 363 992 or by using the contact details found at oaic.gov.au.</span>
                                </p>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary border-b border-border pb-2">Variations and Updates to this Privacy Policy</h2>
                                <p className="flex items-start gap-4">
                                    <span className="font-bold text-primary">19.</span>
                                    <span>PHA will review this Privacy Policy regularly, and may make changes from time to time. If so, PHA will update this Privacy Policy to reflect those changes. The updated version of this Privacy Policy will be effective from the date of posting on the website. PHA recommend that you visit the website regularly to keep up to date with any changes.</span>
                                </p>

                                <p className="flex items-start gap-4">
                                    <span className="font-bold text-primary">20.</span>
                                    <span>This Privacy Policy was last updated on 20 September 2019.</span>
                                </p>
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
