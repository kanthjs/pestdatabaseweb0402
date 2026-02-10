"use client";

import Link from "next/link";

// ปุ่มลอย (Floating Action Button) สำหรับมือถือ
// แสดงเฉพาะบนหน้าจอขนาดเล็ก ให้ผู้ใช้สามารถกดรายงานศัตรูข้าวได้ตลอดเวลา
export function MobileReportFAB() {
  return (
    <Link
      href="/survey"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-cta text-cta-foreground px-5 py-4 rounded-full shadow-2xl shadow-orange-500/30 transition-all hover:scale-105 active:scale-95 sm:hidden"
      aria-label="รายงานศัตรูข้าว"
    >
      <span className="material-icons-outlined text-2xl">bug_report</span>
      <span className="font-semibold text-base">รายงาน</span>
    </Link>
  );
}
