"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col font-sans transition-colors duration-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <span className="material-icons-outlined text-primary text-3xl">
                agriculture
              </span>
              <span className="font-display font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                RicePest<span className="text-primary">Net</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                href="#"
              >
                About
              </Link>
              <Link
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                href="#"
              >
                Data Map
              </Link>
              <Link
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                href="#"
              >
                Resources
              </Link>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium"
                href="#"
              >
                Log In
              </Link>
              <Link
                className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-transform active:scale-95 flex items-center gap-2"
                href="/survey"
              >
                <span>Report Pest</span>
                <span className="material-icons-outlined text-sm">
                  arrow_forward
                </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none"
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="material-icons-outlined text-2xl">
                  {mobileMenuOpen ? "close" : "menu"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                About
              </Link>
              <Link
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Data Map
              </Link>
              <Link
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Resources
              </Link>
              <Link
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Log In
              </Link>
              <Link
                href="/survey"
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Report Pest
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col lg:flex-row relative">
        {/* Left Column (Text) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 lg:px-20 py-12 lg:py-0 bg-background z-10">
          <div className="max-w-lg mx-auto lg:mx-0">
            {/* Live Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-primary text-xs font-semibold tracking-wide uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Live Monitoring Active
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              Safeguarding Rice Harvests <span className="text-primary">Together.</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Join the national network of farmers and agronomists. Report pest
              sightings instantly, track outbreaks in real-time, and access
              expert management strategies to protect your yield.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-opacity-90 shadow-lg shadow-green-500/20 transition-all hover:-translate-y-0.5"
                href="/survey"
              >
                <span className="material-icons-outlined mr-2">
                  add_a_photo
                </span>
                Report a Sighting
              </Link>
              <Link
                className="flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                href="#"
              >
                <span className="material-icons-outlined mr-2">dashboard</span>
                Manage Dashboard
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-6">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  12k+
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Reports Filed
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  850
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Active Surveyors
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  98%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Coverage Rate
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Image & Alerts) */}
        <div className="w-full lg:w-1/2 bg-gray-100 dark:bg-gray-900 relative overflow-hidden h-96 lg:h-auto min-h-[500px]">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 bg-primary opacity-5 dark:opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(#4d7c0f 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          ></div>

          {/* Main Image */}
          <div className="absolute inset-0">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsFTNo1gJGqSi6iL3lMZUfIdag7qxOmev-BjWfiH9LwzM3UKa4uV4eIl2FUr3wuiYRCwj_RuROSiDIaMGDIU4nv6s14883dDchR1J6ubGZi8fliP69GGtgOkEVbTcKhxYp0kYcnTJy6Lf4sCiOLr_iXiYK1b7Wu8mUw0vKj7W8usXBSOxzr8gFqiz0wijRnilqrNkbUXzAb5J6ckRAQXeMuUm4BE4rGGm55Oqbf7Lag27D8m4f5jidpWbPfG0z9cttY982wKpTIhyd"
              alt="Lush green rice terrace fields viewed from above"
              layout="fill"
              objectFit="cover"
              className="mix-blend-multiply dark:mix-blend-overlay opacity-80 dark:opacity-40"
              unoptimized // Using external URL
            />
          </div>

          {/* Alert Card 1 */}
          <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 max-w-xs hidden lg:block animate-fade-in-up">
            <div className="flex items-start gap-3">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full text-red-600 dark:text-red-400">
                <span className="material-icons-outlined text-xl">warning</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Alert • Just Now
                </p>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm mt-1">
                  Brown Planthopper
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Detected in Sector 4B. High density.
                </p>
              </div>
            </div>
          </div>

          {/* Alert Card 2 */}
          <div
            className="absolute bottom-1/3 right-1/4 transform translate-x-1/4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 max-w-xs hidden lg:block animate-fade-in-up"
            style={{
              animationDelay: "0.2s", // We can also use inline style for delays if class doesn't work perfectly
              animationName: "fadeInUpRight" // Custom animation for right side
            }}
          >
            <div className="flex items-start gap-3">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-primary">
                <span className="material-icons-outlined text-xl">
                  check_circle
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Status • 2m ago
                </p>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm mt-1">
                  Survey Complete
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  No pests found in Demo Plot A.
                </p>
              </div>
            </div>
          </div>

          {/* Gradient Overlay for blending */}
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-transparent to-transparent lg:bg-gradient-to-r lg:from-white lg:dark:from-gray-900 lg:via-transparent lg:to-transparent pointer-events-none"></div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Why Use RicePestNet?
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Empowering agriculture with data-driven decisions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 transition-shadow hover:shadow-lg border border-transparent hover:border-gray-100 dark:hover:border-gray-600 group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <span className="material-icons-outlined">smartphone</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Easy Mobile Reporting
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Submit detailed reports directly from the field, even with low
                connectivity. GPS coordinates are automatically tagged.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 transition-shadow hover:shadow-lg border border-transparent hover:border-gray-100 dark:hover:border-gray-600 group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <span className="material-icons-outlined">insights</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Real-time Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Visualize pest distribution patterns and historical data to
                predict potential outbreaks before they spread.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 transition-shadow hover:shadow-lg border border-transparent hover:border-gray-100 dark:hover:border-gray-600 group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <span className="material-icons-outlined">people_outline</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Community Expert Access
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Connect with local agronomists and receive verified treatment
                recommendations for specific pest types.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="font-display font-bold text-lg text-gray-900 dark:text-white">
              RicePest<span className="text-primary">Net</span>
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              © 2023 Rice Pest Survey Network. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <Link className="hover:text-primary transition-colors" href="#">
              Privacy Policy
            </Link>
            <Link className="hover:text-primary transition-colors" href="#">
              Terms of Service
            </Link>
            <Link className="hover:text-primary transition-colors" href="#">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
