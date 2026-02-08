"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CTABannerProps {
  title?: string;
  description?: string;
  buttonText?: string;
  href?: string;
}

export function CTABanner({
  title = "ร่วมเป็นสมาชิกเครือข่ายวันนี้",
  description = "เข้าร่วมกับเราในการปกป้องความมั่นคงทางอาหารของประเทศ",
  buttonText = "เข้าร่วมเครือข่าย",
  href = "/signup",
}: CTABannerProps) {
  return (
    <div className="bg-primary rounded-2xl p-8 md:p-12 text-center">
      <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
        {title}
      </h3>
      <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
        {description}
      </p>
      <Link href={href}>
        <Button
          size="lg"
          className="bg-cta text-cta-foreground hover:bg-cta/90 rounded-full px-8 py-6 text-lg font-semibold shadow-xl shadow-orange-500/20"
        >
          <span className="material-icons-outlined mr-2">person_add</span>
          {buttonText}
        </Button>
      </Link>
    </div>
  );
}
