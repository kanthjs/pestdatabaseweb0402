"use client";

import Link from "next/link";
import Image from "next/image";

export default function HomePage() {

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col font-sans transition-colors duration-300">


      {/* Main Content */}
      <main className="flex-grow flex flex-col lg:flex-row relative">
        {/* Left Column (Text) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 lg:px-20 py-12 lg:py-0 bg-background z-10">
          <div className="max-w-lg mx-auto lg:mx-0">
            {/* Live Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold tracking-wide uppercase mb-6 border border-secondary/20">
              <span className="w-2 h-2 rounded-full bg-secondary mr-2 animate-pulse"></span>
              Live Monitoring Active
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6">
              Safeguarding Rice Harvests <span className="text-secondary">Together.</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Join the national network of farmers and agronomists. Report pest
              sightings instantly, track outbreaks in real-time, and access
              expert management strategies to protect your yield.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                className="flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-full text-cta-foreground bg-cta hover:opacity-90 shadow-xl shadow-orange-500/20 transition-all hover:-translate-y-1"
                href="/survey"
              >
                <span className="material-icons-outlined mr-2">
                  add_a_photo
                </span>
                Report a Sighting
              </Link>
              <Link
                className="flex items-center justify-center px-8 py-3.5 border border-border text-base font-medium rounded-full text-foreground bg-card hover:bg-muted transition-all shadow-sm hover:shadow-md"
                href="/dashboard"
              >
                <span className="material-icons-outlined mr-2">dashboard</span>
                Pest Data
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 pt-8 border-t border-border grid grid-cols-3 gap-6">
              {[
                { value: "12k+", label: "Reports Filed" },
                { value: "850", label: "Active Surveyors" },
                { value: "98%", label: "Coverage Rate" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-primary font-display">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Image & Alerts) */}
        <div className="w-full lg:w-1/2 bg-muted relative overflow-hidden h-96 lg:h-auto min-h-[500px]">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 bg-primary opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(currentColor 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          ></div>

          {/* Main Image */}
          <div className="absolute inset-0">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsFTNo1gJGqSi6iL3lMZUfIdag7qxOmev-BjWfiH9LwzM3UKa4uV4eIl2FUr3wuiYRCwj_RuROSiDIaMGDIU4nv6s14883dDchR1J6ubGZi8fliP69GGtgOkEVbTcKhxYp0kYcnTJy6Lf4sCiOLr_iXiYK1b7Wu8mUw0vKj7W8usXBSOxzr8gFqiz0wijRnilqrNkbUXzAb5J6ckRAQXeMuUm4BE4rGGm55Oqbf7Lag27D8m4f5jidpWbPfG0z9cttY982wKpTIhyd"
              alt="Lush green rice terrace fields viewed from above"
              fill
              className="object-cover mix-blend-multiply opacity-60 hover:scale-105 transition-transform duration-1000"
              unoptimized
            />
          </div>

          {/* Alert Card 1 */}
          <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 bg-card p-4 rounded-xl shadow-xl shadow-black/5 border border-border max-w-xs hidden lg:block animate-fade-in-up backdrop-blur-sm bg-opacity-95">
            <div className="flex items-start gap-3">
              <div className="bg-destructive/10 p-2.5 rounded-xl text-destructive">
                <span className="material-icons-outlined text-xl">warning</span>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Alert • Just Now
                </p>
                <h4 className="font-bold text-primary text-sm mt-1 font-display">
                  Brown Planthopper
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Detected in Sector 4B. High density.
                </p>
              </div>
            </div>
          </div>

          {/* Alert Card 2 */}
          <div
            className="absolute bottom-1/3 right-1/4 transform translate-x-1/4 bg-card p-4 rounded-xl shadow-xl shadow-black/5 border border-border max-w-xs hidden lg:block animate-fade-in-up backdrop-blur-sm bg-opacity-95"
            style={{
              animationDelay: "0.2s",
              animationName: "fadeInUpRight"
            }}
          >
            <div className="flex items-start gap-3">
              <div className="bg-secondary/10 p-2.5 rounded-full text-secondary">
                <span className="material-icons-outlined text-xl">
                  check_circle
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Status • 2m ago
                </p>
                <h4 className="font-bold text-primary text-sm mt-1 font-display">
                  Survey Complete
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  No pests found in Demo Plot A.
                </p>
              </div>
            </div>
          </div>

          {/* Gradient Overlay for blending */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent lg:bg-gradient-to-r lg:from-background lg:via-transparent lg:to-transparent pointer-events-none"></div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary font-display">
              Why Use RicePestNet?
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Empowering agriculture with data-driven decisions for a sustainable future.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "smartphone",
                title: "Easy Mobile Reporting",
                desc: "Submit detailed reports directly from the field, even with low connectivity. GPS coordinates are automatically tagged."
              },
              {
                icon: "insights",
                title: "Real-time Analytics",
                desc: "Visualize pest distribution patterns and historical data to predict potential outbreaks before they spread."
              },
              {
                icon: "people_outline",
                title: "Community Expert Access",
                desc: "Connect with local agronomists and receive verified treatment recommendations for specific pest types."
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-background hover:bg-muted/30 transition-all hover:-translate-y-1 hover:shadow-lg border border-border group">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 transform group-hover:rotate-6">
                  <span className="material-icons-outlined text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3 font-display">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="font-display font-bold text-xl text-primary">
              RicePest<span className="text-secondary">Net</span>
            </span>
            <p className="text-sm text-muted-foreground mt-2">
              © 2023 Rice Pest Survey Network. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            {["Privacy Policy", "Terms of Service", "Support"].map((item) => (
              <Link key={item} className="hover:text-primary transition-colors font-medium" href="#">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
