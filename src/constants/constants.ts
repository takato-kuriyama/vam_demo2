import HomePage from "../pages/HomePage";
import Dashboard from "../pages/Dashboard";
import DashboardEquipment from "../pages/DashboardEquipment";
import DashboardBreeding from "../pages/DashboardBreeding";
import BreedingManagement from "../pages/BreedingManagement";
import AlertHistory from "../pages/AlertHistory";
import FixedPointMonitoring from "../pages/FixedPointMonitoring";
import UserMaster from "../pages/UserMaster";
import AlertMaster from "../pages/AlertMaster";
import TankMaster from "../pages/TankMaster";
import LineMaster from "../pages/LineMaster";
import EquipmentManagement from "../pages/EquipmentManagement";
import LiveMonitoring from "../pages/LiveMonitoring";
import RemoteControll from "../pages/RemoteControll";
import MasterIndex from "../pages/MasterIndex";
import {
  Bell,
  Home,
  LayoutDashboard,
  Monitor,
  Settings,
  FileText,
  FileEdit,
} from "lucide-react";

//Route
export const ROUTES = {
  HOME: "/homepage",
  DASHBOARD: "/dashboard",
  DASHBOARD_EQUIPMENT: "/dashboard_equipment",
  DASHBOARD_BREEDING: "/dashboard_breeding",
  EQUIPMENT_MANAGEMENT: "/equipment_management",
  BREEDING_MANAGEMENT: "/breeding_management",
  LIVE_MONITORING: "/live_monitoring",
  FIXED_POINT_MONITORING: "/fixed_point_monitoring",
  ALERT_HISTORY: "/alert_history",
  MASTER_INDEX: "/master_index",
  USER_MASTER: "/user_master",
  ALERT_MASTER: "/alert_master",
  TANK_MASTER: "/tank_master",
  LINE_MASTER: "/line_master",
  REMOTE_CONTROLL: "/remote_controll",
} as const;

export const ROUTES_CONFIG = [
  {
    id: "HOME",
    path: "/homepage",
    element: HomePage,
    displayName: "ホーム",
  },
  {
    id: "DASHBOARD",
    path: "/dashboard",
    element: Dashboard,
    displayName: "ダッシュボード",
  },
  {
    id: "DASHBOARD_EQUIPMENT",
    path: "/dashboard_equipment",
    element: DashboardEquipment,
    displayName: "ろ過部ダッシュボード",
  },
  {
    id: "DASHBOARD_BREEDING",
    path: "/dashboard_breeding",
    element: DashboardBreeding,
    displayName: "飼育槽ダッシュボード",
  },
  {
    id: "EQUIPMENT_MANAGEMENT",
    path: "/equipment_management",
    element: EquipmentManagement,
    displayName: "データ一覧",
  },
  {
    id: "BREEDING_MANAGEMENT",
    path: "/breeding_management",
    element: BreedingManagement,
    displayName: "データ入力",
  },
  {
    id: "LIVE_MONITORING",
    path: "/live_monitoring",
    element: LiveMonitoring,
    displayName: "LIVE映像",
  },
  {
    id: "FIXED_POINT_MONITORING",
    path: "/fixed_point_monitoring",
    element: FixedPointMonitoring,
    displayName: "定点観測一覧",
  },
  {
    id: "ALERT_HISTORY",
    path: "/alert_history",
    element: AlertHistory,
    displayName: "アラート履歴",
  },
  {
    id: "REMOTE_CONTROLL",
    path: "/remote_controll",
    element: RemoteControll,
    displayName: "制御",
  },
  {
    id: "MASTER_INDEX",
    path: "/master_index",
    element: MasterIndex,
    displayName: "マスタ管理",
  },
  {
    id: "USER_MASTER",
    path: "/user_master",
    element: UserMaster,
    displayName: "ユーザーマスタ",
  },
  {
    id: "ALERT_MASTER",
    path: "/alert_master",
    element: AlertMaster,
    displayName: "アラートマスタ",
  },
  {
    id: "LINE_MASTER",
    path: "/line_master",
    element: LineMaster,
    displayName: "ろ過部マスタ",
  },
  {
    id: "TANK_MASTER",
    path: "/tank_master",
    element: TankMaster,
    displayName: "飼育槽マスタ",
  },
] as const;

export type RouteKeys = keyof typeof ROUTES;
export type RoutePaths = (typeof ROUTES)[RouteKeys];

//ページタイトル
export const PAGE_TITLES = {
  HOME: "ホーム",
  DASHBOARD: "ダッシュボード一覧",
  DASHBOARD_EQUIPMENT: "ろ過部ダッシュボード",
  DASHBOARD_BREEDING: "飼育槽ダッシュボード",
  EQUIPMENT_MANAGEMENT: "データ一覧",
  BREEDING_MANAGEMENT: "データ入力",
  ALERT_HISTORY: "アラート履歴一覧",
  MASTER_INDEX: "マスタ管理",
  ALERT_MASTER: "アラートマスタ",
  USER_MASTER: "ユーザーマスタ",
  TANK_MASTER: "飼育槽マスタ",
  LINE_MASTER: "ろ過部マスタ",
  FIXED_POINT: "定点観測一覧",
  LIVE_MONITORING: "LIVE映像",
  REMOTE_CONTROLL: "制御パネル",
} as const;

//Colors
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

//メニューバー用
export const HEADER_MENU_ITEMS = [
  { id: "home", path: ROUTES.HOME, label: "ホーム", icon: Home },
  {
    id: "dashboard",
    path: ROUTES.DASHBOARD,
    label: "ダッシュボード",
    icon: LayoutDashboard,
  },
  {
    id: "breeding",
    path: ROUTES.BREEDING_MANAGEMENT,
    label: "データ入力",
    icon: FileEdit,
  },
  {
    id: "equipment",
    path: ROUTES.EQUIPMENT_MANAGEMENT,
    label: "データ一覧",
    icon: FileText,
  },
  {
    id: "live",
    path: ROUTES.LIVE_MONITORING,
    label: "LIVE映像",
    icon: Monitor,
  },
  {
    id: "fixed",
    path: ROUTES.FIXED_POINT_MONITORING,
    label: "定点観測一覧",
    icon: Monitor,
  },
  {
    id: "alert",
    path: ROUTES.ALERT_HISTORY,
    label: "アラート履歴",
    icon: Bell,
  },
  {
    id: "remoteControll",
    path: ROUTES.REMOTE_CONTROLL,
    label: "制御",
    icon: Settings,
  },
  {
    id: "masterIndex",
    path: ROUTES.MASTER_INDEX,
    label: "マスタ管理",
    icon: FileText,
  },
] as const;

export const SIDE_MENU_ITEMS = [
  {
    id: "home",
    path: ROUTES.HOME,
    label: "ホーム",
    icon: Home,
  },
  {
    id: "dashboard",
    path: ROUTES.DASHBOARD,
    label: "ダッシュボード",
    icon: LayoutDashboard,
  },
  {
    id: "monitoring",
    label: "モニタリング",
    icon: Monitor,
    subItems: [
      {
        id: "breeding",
        path: ROUTES.BREEDING_MANAGEMENT,
        label: "データ入力",
      },
      {
        id: "equipment",
        path: ROUTES.EQUIPMENT_MANAGEMENT,
        label: "データ一覧",
      },
      { id: "live", path: ROUTES.LIVE_MONITORING, label: "LIVE映像" },
      {
        id: "fixed",
        path: ROUTES.FIXED_POINT_MONITORING,
        label: "定点観測一覧",
      },
    ],
  },
  {
    id: "alert",
    path: ROUTES.ALERT_HISTORY,
    label: "アラート履歴",
    icon: Bell,
  },
  {
    id: "control",
    path: ROUTES.REMOTE_CONTROLL,
    label: "制御",
    icon: Settings,
  },
  {
    id: "master",
    path: ROUTES.MASTER_INDEX,
    label: "マスタ管理",
    icon: FileText,
    subItems: [
      { id: "user", path: ROUTES.USER_MASTER, label: "ユーザーマスタ" },
      { id: "alert", path: ROUTES.ALERT_MASTER, label: "アラートマスタ" },
      { id: "line", path: ROUTES.LINE_MASTER, label: "ろ過部マスタ" },
      { id: "tank", path: ROUTES.TANK_MASTER, label: "飼育槽マスタ" },
    ],
  },
] as const;

//Dashboards
export const DASHBOARDS: Dashboard[] = [
  {
    id: "01",
    name: "ろ過部ダッシュボード",
    path: ROUTES.DASHBOARD_EQUIPMENT,
  },
  {
    id: "02",
    name: "飼育槽ダッシュボード",
    path: ROUTES.DASHBOARD_BREEDING,
  },
  {
    id: "03",
    name: "TESTダッシュボード",
    path: ROUTES.DASHBOARD_EQUIPMENT,
  },
  {
    id: "04",
    name: "04ダッシュボード",
    path: ROUTES.DASHBOARD_EQUIPMENT,
  },
];

export type Dashboard = {
  id: string;
  name: string;
  path: RoutePaths;
};

//Param_Unit
export const PARAM_UNITS = {
  CHLORINE: "mg/L", //塩素
  AMMONIA: "ppm",
  CURRENT: "A",
  FLOW_RATE: "L/min",
  POLARITY: "",
} as const;

export type ParamUnitKeys = keyof typeof PARAM_UNITS;
export type ParamUnitValues = (typeof PARAM_UNITS)[ParamUnitKeys];

//ろ過部の初期サンプルデータ
export const SAMPLE_FILTER_DATA: SampleFilterData = {
  resClIdx1: 7.05,
  resClIdx2: 7.01,
  ammonia: 0.45,
  current: 153.0,
  flowRate: 30.53,
  polarity: "A",
} as const;

export type SampleFilterData = {
  resClIdx1: number;
  resClIdx2: number;
  ammonia: number;
  current: number;
  flowRate: number;
  polarity: "A" | "B";
};

// ろ過部のパラメータ定義
export const FILTER_PARAMETERS: FilterParameter[] = [
  {
    id: "resClIdx1",
    name: "残留塩素計値①",
    unit: PARAM_UNITS.CHLORINE,
    type: "numeric",
  },
  {
    id: "resClIdx2",
    name: "残留塩素計値②",
    unit: PARAM_UNITS.CHLORINE,
    type: "numeric",
  },
  {
    id: "ammonia",
    name: "アンモニア",
    unit: PARAM_UNITS.AMMONIA,
    type: "numeric",
  },
  {
    id: "current",
    name: "電解電流値",
    unit: PARAM_UNITS.CURRENT,
    type: "numeric",
  },
  {
    id: "flowRate",
    name: "流量値",
    unit: PARAM_UNITS.FLOW_RATE,
    type: "numeric",
  },
  {
    id: "polarity",
    name: "電解極性",
    unit: PARAM_UNITS.POLARITY,
    type: "string",
  },
] as const;

export type NumericFilterParameter = {
  id: "resClIdx1" | "resClIdx2" | "ammonia" | "current" | "flowRate";
  name: string;
  unit: ParamUnitValues;
  type: "numeric";
};

export type StringFilterParameter = {
  id: "polarity";
  name: string;
  unit: ParamUnitValues;
  type: "string";
};

export type FilterParameter = NumericFilterParameter | StringFilterParameter;

//パラメーターステータス
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

//餌種類
export const FEED_TYPES = [
  { id: "type0", name: "" },
  { id: "type1", name: "EP1" },
  { id: "type2", name: "EP2" },
  { id: "type3", name: "EP3" },
] as const;

export type FeedType = (typeof FEED_TYPES)[number];
export type FeedTypeId = FeedType["id"];

//摂餌活性
export const FEEDING_ACTIVITY = [
  { value: 1, label: "1: 良くない" },
  { value: 2, label: "2: あまり良くない" },
  { value: 3, label: "3: 普通" },
  { value: 4, label: "4: 良い" },
  { value: 5, label: "5: とても良い" },
] as const;

export type FeedingActivity = (typeof FEEDING_ACTIVITY)[number];
export type FeedingActivityValue = FeedingActivity["value"];

//ろ過部一覧
export const EQ_TANKS: Tank[] = [
  { id: "A", name: "Aライン" },
  { id: "B", name: "Bライン" },
  { id: "C", name: "Cライン" },
] as const;

//飼育水槽一覧
export const BR_TANKS: Tank[] = [
  { id: "A1", name: "A1水槽" },
  { id: "A2", name: "A2水槽" },
  { id: "A3", name: "A3水槽" },
  { id: "A4", name: "A4水槽" },
  { id: "A5", name: "A5水槽" },
  { id: "B1", name: "B1水槽" },
  { id: "B2", name: "B2水槽" },
  // { id: "B3", name: "B3水槽" },
  // { id: "B4", name: "B4水槽" },
  // { id: "B5", name: "B5水槽" },
] as const;

export type Tank = {
  id: string;
  name: string;
};

//飼育データ項目一覧
export const BREEDING_TABLE_COLUMNS = [
  {
    id: "dateTime",
    label: "日時",
    sticky: "left",
    render: (value: string) => new Date(value).toLocaleString(),
  },
  {
    id: "warterTemp",
    label: "水温",
    suffix: "℃",
    sticky: "top",
  },
  {
    id: "feed1Type",
    label: "餌種類①",
    sticky: "top",
    render: (value: string) => getFeedTypeName(value),
  },
  {
    id: "feed1Amount",
    label: "給餌量",
    suffix: "g",
    sticky: "top",
  },
  {
    id: "feed2Type",
    label: "餌種類②",
    sticky: "top",
    render: (value: string) => getFeedTypeName(value),
  },
  {
    id: "feed2Amount",
    label: "給餌量",
    suffix: "g",
    sticky: "top",
  },
  {
    id: "totalFeedAmount",
    label: "総給餌量",
    suffix: "g",
    sticky: "top",
  },
  {
    id: "feedingActivity",
    label: "摂餌活性",
    sticky: "top",
    render: (value: string) => getFeedingActivityLabel(value),
  },
  {
    id: "mortality",
    label: "斃死数",
    sticky: "top",
  },
  {
    id: "mortalityReason",
    label: "斃死理由",
    sticky: "top",
    render: (value: string) => value || "-",
  },
  {
    id: "transferIn",
    label: "移動IN",
    sticky: "top",
  },
  {
    id: "transferOut",
    label: "移動OUT",
    sticky: "top",
  },
  {
    id: "culling",
    label: "間引き",
    sticky: "top",
  },
  {
    id: "memo",
    label: "メモ",
    sticky: "top",
    render: (value: string) => value || "-",
  },
] as const;

const getFeedTypeName = (id: string): string => {
  const feed = FEED_TYPES.find((type) => type.id === id);
  return feed ? feed.name : "-";
};

const getFeedingActivityLabel = (value: string): string => {
  const activity = FEEDING_ACTIVITY.find(
    (a) => String(a.value) === String(value)
  );
  return activity ? activity.label : "-";
};

//飼育データフォームの初期値定義
export const BASE_BREEDING_FORM_INITIAL_VALUES = {
  dateTime: "", // getCurrentDateTime()で上書きされる
  waterTemp: "",
  feed1Type: "type0",
  feed1Amount: "",
  feed2Type: "type0",
  feed2Amount: "",
  feedingActivity: "",
  mortality: "",
  mortalityReason: "",
  transferIn: "",
  transferOut: "",
  culling: "",
  memo: "",
} as {
  dateTime: string;
  waterTemp: string;
  feed1Type: string;
  feed1Amount: string;
  feed2Type: string;
  feed2Amount: string;
  feedingActivity: string;
  mortality: string;
  mortalityReason: string;
  transferIn: string;
  transferOut: string;
  culling: string;
  memo: string;
};

//飼育データ入力フォーム追加項目一覧
export const ADDITIONAL_BREEDING_FORM_FIELDS = [
  {
    id: "test",
    label: "TEST",
    type: "text",
    initialValue: "", //初期値
  },
  //追加したいフィールドをここに追加していく
] as const;

export type BreedingFormData = typeof BASE_BREEDING_FORM_INITIAL_VALUES & {
  [Key in (typeof ADDITIONAL_BREEDING_FORM_FIELDS)[number]["id"]]: string;
};

export type AdditionalBreedingFormField = {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  initialValue: string;
};

//アラート履歴サンプルデータ
export const SAMPLE_ALERT_HISTORY = [
  {
    id: 1,
    date: "2025-02-12 15:00",
    name: "酸素濃度アラート",
    line: "Aライン",
    tank: "A2",
    description: "閾値19.5%に対して酸素濃度が15%でした。",
    solution: "・酸素発生装置にに異常がないか確認\n・（入力しておく）",
    resolved: false,
  },
  {
    id: 2,
    date: "2025-02-13 09:00",
    name: "サンプルアラート",
    line: "サンプルライン",
    tank: "Sample",
    description: "入力",
    solution: "・入力\n・（入力しておく）",
    resolved: true,
  },
];

export type AlertField = {
  id: number;
  date: string;
  name: string;
  line: string;
  tank: string;
  description: string;
  solution: string;
  resolved: boolean;
};

//定点観測サンプルデータ
export const SAMPLE_FIXED_POINT_DATA: MonitoringDataField[] = [
  {
    id: "1",
    date: "2025/02/15 9:00",
    line: "Aライン",
    filterSystem: {
      chlorineBefore: 3.8,
      chlorineAfter: 0.0,
      ph: 7.5,
      flowRate: 30.0,
      current: 27.0,
      polarity: "A",
    },
    breedingTanks: [
      { tankId: "A-1", oxygenSaturation: 80, ph: 7.1, temperature: 24.2 },
      { tankId: "A-2", oxygenSaturation: 84, ph: 9.3, temperature: 26.8 },
      { tankId: "A-3", oxygenSaturation: 72, ph: 6.8, temperature: 26.0 },
      { tankId: "A-4", oxygenSaturation: 95, ph: 7.5, temperature: 25.2 },
      { tankId: "A-5", oxygenSaturation: 54, ph: 7.2, temperature: 29.1 },
    ],
  },
  {
    id: "2",
    date: "2025/02/15 9:00",
    line: "Bライン",
    filterSystem: {
      chlorineBefore: 3.8,
      chlorineAfter: 0.0,
      ph: 7.5,
      flowRate: 30.0,
      current: 27.0,
      polarity: "A",
    },
    breedingTanks: [
      { tankId: "A-1", oxygenSaturation: 80, ph: 7.1, temperature: 24.2 },
      { tankId: "A-2", oxygenSaturation: 84, ph: 9.3, temperature: 26.8 },
      { tankId: "A-3", oxygenSaturation: 72, ph: 6.8, temperature: 26.0 },
      { tankId: "A-4", oxygenSaturation: 95, ph: 7.5, temperature: 25.2 },
      { tankId: "A-5", oxygenSaturation: 54, ph: 7.2, temperature: 29.1 },
    ],
  },
];

export interface MonitoringDataField {
  id: string;
  date: string;
  line: string;
  filterSystem: {
    chlorineBefore: number;
    chlorineAfter: number;
    ph: number;
    flowRate: number;
    current: number;
    polarity: string;
  };
  breedingTanks: {
    tankId: string;
    oxygenSaturation: number;
    ph: number;
    temperature: number;
  }[];
}

//マスタ一覧
export const MASTERS: Masters[] = [
  {
    id: "01",
    name: "アラートマスタ",
    path: ROUTES.ALERT_MASTER,
  },
  {
    id: "02",
    name: "ユーザーマスタ",
    path: ROUTES.USER_MASTER,
  },
  {
    id: "03",
    name: "ろ過部マスタ",
    path: ROUTES.LINE_MASTER,
  },
  {
    id: "04",
    name: "飼育槽マスタ",
    path: ROUTES.TANK_MASTER,
  },
];

export type Masters = {
  id: string;
  name: string;
  path: RoutePaths;
};

//ユーザーマスタサンプルデータ
export const SAMPLE_USER_DATA: UserDataField[] = [
  {
    id: 1,
    name: "サンプル太郎",
    password: "●●●●●",
    mail: "sample@sample.com",
    authority: "一般",
  },
  {
    id: 2,
    name: "TEST",
    password: "●●●●●",
    mail: "test@test.com",
    authority: "一般",
  },
];

export interface UserDataField {
  id: number;
  name: string;
  password: string;
  mail: string;
  authority: string;
}

//アラートマスタサンプルデータ
export const SAMPLE_ALERT_MASTER_DATA: AlertMasterField[] = [
  {
    id: 1,
    name: "残留塩素異常アラート",
    targetData: "res_cl",
    thresholdMin: 0.5,
    thresholdMax: 3.0,
    dangerMin: 0.5,
    dangerMax: 3.0,
    duplicateControl: "1h",
    solution:
      "・残留塩素計の値を確認してください\n・装置の動作状況を確認してください",
  },
  {
    id: 2,
    name: "アンモニア異常アラート",
    targetData: "ammonia",
    thresholdMin: 0.0,
    thresholdMax: 2.0,
    dangerMin: 0.0,
    dangerMax: 1.0,
    duplicateControl: "3h",
    solution: "・アンモニア濃度を確認してください\n・給餌量を調整してください",
  },
];

// アラートマスタのデータ型
export interface AlertMasterField {
  id: number;
  name: string;
  targetData: string;
  thresholdMin: number;
  thresholdMax: number;
  dangerMin: number;
  dangerMax: number;
  duplicateControl: string;
  solution: string;
}

// アラートの対象データ選択肢
export const ALERT_TARGET_DATA = [
  { id: "res_cl", name: "残留塩素" },
  { id: "ammonia", name: "アンモニア" },
  { id: "oxygen", name: "酸素濃度" },
  { id: "ph", name: "pH" },
] as const;

// 重複アラート抑制の選択肢
export const ALERT_DUPLICATE_CONTROLS = [
  { id: "1h", name: "重複アラートを1時間抑制" },
  { id: "3h", name: "重複アラートを3時間抑制" },
  { id: "6h", name: "重複アラートを6時間抑制" },
  { id: "12h", name: "重複アラートを12時間抑制" },
  { id: "24h", name: "重複アラートを24時間抑制" },
] as const;
