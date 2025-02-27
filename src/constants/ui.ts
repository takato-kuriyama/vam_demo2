// src/constants/ui.ts
// 色定義を移行
export const COLORS = {
  // 背景色
  bg: {
    primary: "bg-white",
    secondary: "bg-gray-50",
    tertiary: "bg-blue-50",
    error1: "bg-red-100",
    error2: "bg-red-200",
    error3: "bg-red-600",
    warning1: "bg-yellow-100",
    warning2: "bg-yellow-200",
    success: "bg-emerald-100",
  },
  // テキスト色
  text: {
    primary: "text-gray-800",
    secondary: "text-gray-600",
    tertiary: "text-gray-500",
    error: "text-red-500",
    warning: "text-yellow-500",
    success: "text-emerald-500",
  },
  // ボーダー色
  border: {
    primary: "border-gray-100",
    secondary: "border-gray-300",
    error: "border-red-200",
    warning: "border-yellow-200",
    success: "border-emerald-200",
  },
  // ホバー色
  hover: {
    primary: "hover:bg-gray-50",
    secondary: "hover:bg-gray-100",
  },
} as const;

export type ColorKeys = keyof typeof COLORS;

// ステータス定義を移行
export const STATUS = {
  NORMAL: "normal",
  WARNING: "warning",
  ERROR: "error",
} as const;

export type StatusType = (typeof STATUS)[keyof typeof STATUS];

export const STATUS_DISPLAY: Record<
  StatusType,
  { text: string; color: string }
> = {
  [STATUS.NORMAL]: { text: "正常値", color: "bg-white" },
  [STATUS.WARNING]: { text: "危険値", color: "bg-yellow-100" },
  [STATUS.ERROR]: { text: "異常値", color: "bg-red-100" },
} as const;

// パラメータの単位定義を移行
export const PARAM_UNITS = {
  CHLORINE: "mg/L", //塩素
  AMMONIA: "ppm",
  CURRENT: "A",
  FLOW_RATE: "L/min",
  POLARITY: "",
  OXYGEN: "%",
  PH: "",
  TEMPERATURE: "℃",
} as const;

export type ParamUnitKeys = keyof typeof PARAM_UNITS;
export type ParamUnitValues = (typeof PARAM_UNITS)[ParamUnitKeys];
