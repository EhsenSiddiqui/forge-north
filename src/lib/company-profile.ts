/** Fictional example only. Never treat demo profile details as verified company information. */
export type CompanyProfile = {
  companyName: string;
  region: string;
  city: string;
  verticals: string[];
  certifications: string[];
  otherCertifications: string;
  capabilities: string;
  equipmentSoftware: string;
  labourSkills: string;
};

export const PROFILE_KEY = "reshore-ca-demo-company-profile";
export const REGIONS = ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"];
export const VERTICALS = ["Automotive & mobility", "Aerospace & defence", "Building materials", "Chemicals & plastics", "Electronics", "Food & beverage", "Machinery & equipment", "Metal fabrication", "Packaging", "Wood & paper"];
export const CERTIFICATIONS = ["ISO 9001", "ISO 14001", "ISO 13485", "IATF 16949", "AS9100", "CSA certification", "CWB certification", "HACCP / SQF"];
export const demoProfile: CompanyProfile = {
  companyName: "Maple Ridge Manufacturing (demo)",
  region: "Ontario",
  city: "Hamilton",
  verticals: ["Metal fabrication", "Machinery & equipment"],
  certifications: ["ISO 9001", "CWB certification"],
  otherCertifications: "",
  capabilities: "CNC machining, precision cutting, welding and assembly; prototype-to-small-batch production.",
  equipmentSoftware: "CNC milling centres, laser cutter, robotic welding cell; CAD/CAM and ERP software.",
  labourSkills: "CNC machinists, millwrights, welders, quality technicians and industrial engineers.",
};

export function readCompanyProfile(): CompanyProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const p = parsed as Partial<CompanyProfile>;
    if (typeof p.companyName !== "string" || !p.companyName.trim() || typeof p.region !== "string" || !Array.isArray(p.verticals) || !Array.isArray(p.certifications)) return null;
    return { ...demoProfile, ...p };
  } catch { return null; }
}

export function saveCompanyProfile(profile: CompanyProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
