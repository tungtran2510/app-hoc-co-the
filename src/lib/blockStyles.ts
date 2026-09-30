export interface BlockStyleConfig {
  label: string | null;
  icon: string | null;
  bg: string | null;
  fg: string;
}

export const DEFAULT_BLOCK_STYLES: Record<string, BlockStyleConfig> = {
  van_ban: { label: null, icon: null, bg: null, fg: "#2E3847" },
  y_nghia: { label: "Ý NGHĨA", icon: "Lightbulb", bg: "#E6F2EF", fg: "#0A4F43" },
  diem_can_nho: { label: "ĐIỂM CẦN NHỚ", icon: "SquareCheck", bg: "#E3ECF7", fg: "#244A78" },
  chu_y: { label: "CHÚ Ý", icon: "TriangleAlert", bg: "#FFF1E6", fg: "#8A3A14" },
  sai_lam: { label: "SAI LẦM THƯỜNG GẶP", icon: "CircleX", bg: "#FBE7E1", fg: "#7A2F12" },
  giai_phap: { label: "GIẢI PHÁP · ỨNG DỤNG", icon: "Wrench", bg: "#EDF3E4", fg: "#3C5420" },
};

export function getBlockStyle(styleKey: string, customStyles?: Record<string, BlockStyleConfig>): BlockStyleConfig {
  if (customStyles && customStyles[styleKey]) {
    return customStyles[styleKey];
  }
  if (DEFAULT_BLOCK_STYLES[styleKey]) {
    return DEFAULT_BLOCK_STYLES[styleKey];
  }
  // Fallback for unknown style
  return {
    label: styleKey.toUpperCase(),
    icon: "FileText",
    bg: "#F1EEE6",
    fg: "#3A4250",
  };
}
