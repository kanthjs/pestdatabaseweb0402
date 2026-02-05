// Types for Survey Form

export interface Province {
    provinceId: number;
    provinceNameEn: string;
}

export interface Plant {
    plantId: string;
    plantNameEn: string;
}

export interface Pest {
    pestId: string;
    pestNameEn: string;
}

export interface PestReportFormData {
    province: string;
    latitude: number;
    longitude: number;
    plantId: string;
    pestId: string;
    symptomOnSet: string;
    fieldAffectedArea: number;
    incidencePercent: number;
    severityPercent: number;
    imageUrls: string[];
    imageCaptions: string[];
    isAnonymous: boolean;
    reporterFirstName: string;
    reporterLastName: string;
    reporterPhone: string;
    reporterRole: string;
}

export const REPORTER_ROLES = [
    { id: "REP001", label: "Farmer (เกษตรกร)" },
    { id: "REP002", label: "Agriculture Volunteer (อาสาสมัครเกษตร)" },
    { id: "REP003", label: "Agricultural Extension Officer (เจ้าหน้าที่ส่งเสริมการเกษตร)" },
    { id: "REP004", label: "Rice Research Center Staff (เจ้าหน้าที่ศูนย์วิจัยข้าว)" },
    { id: "REP005", label: "Government Officials (เจ้าหน้าที่ราชการ)" },
    { id: "REP006", label: "Community Leader (ผู้นำชุมชน)" },
    { id: "REP007", label: "University Researcher (อาจารย์มหาวิทยาลัย)" },
    { id: "REP008", label: "Student (นักศึกษา)" },
    { id: "REP009", label: "Not Specified (ไม่ระบุ)" },
] as const;

export const STEPS = [
    { id: "location", label: "Location", icon: "location_on" },
    { id: "plant", label: "Plant", icon: "grass" },
    { id: "pest", label: "Pest", icon: "bug_report" },
    { id: "issue", label: "Issue Details", icon: "pest_control" },
    { id: "reporter", label: "Reporter", icon: "person" },
] as const;

export type StepId = (typeof STEPS)[number]["id"];
