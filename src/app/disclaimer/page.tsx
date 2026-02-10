import { LandingFooter } from "@/components/landing/LandingFooter";
import Link from "next/link";

export const metadata = {
    title: "Disclaimer | RicePestNet",
    description: "Disclaimer for the Thai Rice Pest Monitoring Network",
};

export default function DisclaimerPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-primary py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                        คำชี้แจง
                    </h1>
                    <p className="text-xl text-primary-foreground/80 font-light">
                        Disclaimer
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-sm">
                        <div className="prose prose-green dark:prose-invert max-w-none space-y-8 text-foreground leading-relaxed">
                            <div className="space-y-6">
                                <p>
                                    The material included on this website is provided for general use and information purposes only. Information has been drawn from a range of sources outside of the Plant Surveillance Network Australasia-Pacific (PSNAP).
                                </p>
                                <p>
                                    Although reasonable care is taken in its preparation and publication, the PSNAP does not warrant the accuracy, reliability, completeness or currency of any material contained in the site, or its usefulness is achieving any purpose. To the fullest extent permitted by law, the PSNAP will not be liable for any loss, damage, cost or expense incurred in, or arising by, reason of any person relying on the information on this website. Users of information derived from this website should make and rely on their own assessment and enquiries to verify its accuracy.
                                </p>
                            </div>

                            <div className="space-y-6 pt-6 border-t border-border">
                                <p>
                                    References to other sites are provided as an information service only and do not necessarily constitute endorsement. Conversely, omissions should not be construed as non-endorsement. Every care is taken to provide links to suitable material from this site, however the PSNAP does not guarantee the suitability, completeness or accuracy of any material encountered through a linked site. Further, the PSNAP does not guarantee the availability of any of the sites listed.
                                </p>
                            </div>

                            <div className="space-y-6 pt-6 border-t border-border">
                                <p>
                                    Despite its best efforts, the PSNAP does not warrant that the information in its site is free of infection by computer viruses or other contamination.
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
