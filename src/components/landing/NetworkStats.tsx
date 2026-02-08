"use client";

import { useEffect, useState, useRef } from "react";

interface NetworkStatsProps {
  reports: number;
  members: number;
  organizations?: number;
}

function AnimatedNumber({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setDisplayValue(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, value, duration]);

  return <span ref={ref}>{displayValue.toLocaleString()}</span>;
}

export function NetworkStats({ reports, members, organizations = 25 }: NetworkStatsProps) {
  const stats = [
    { value: members, label: "สมาชิกที่ใช้งาน", suffix: "+" },
    { value: organizations, label: "หน่วยงานพันธมิตร", suffix: "" },
    { value: reports, label: "รายงานที่ยืนยันแล้ว", suffix: "+" },
  ];

  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            ความแข็งแกร่งของเครือข่าย
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            ตัวเลขที่แสดงถึงความน่าเชื่อถือและการมีส่วนร่วมของเครือข่ายเรา
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="text-5xl md:text-6xl font-bold text-cta mb-2">
                <AnimatedNumber value={stat.value} />
                {stat.suffix}
              </p>
              <p className="text-primary-foreground/80 text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
