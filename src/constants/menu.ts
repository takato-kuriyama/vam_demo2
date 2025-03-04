// src/constants/menu.ts
import { ROUTES, RoutePaths } from "./routes";
import {
  Bell,
  Home,
  LayoutDashboard,
  Monitor,
  Settings,
  FileText,
  FileEdit,
  Fish,
  GitBranch,
  CameraIcon,
} from "lucide-react";

// ヘッダーメニュー項目を移行
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
    id: "fishStocking",
    path: ROUTES.FISH_STOCKING,
    label: "池入れ記録",
    icon: Fish,
  },
  {
    id: "fishTransfer",
    path: ROUTES.FISH_TRANSFER,
    label: "水槽間移動記録",
    icon: GitBranch,
  },
  {
    id: "equipment",
    path: ROUTES.DATA_LISTING,
    label: "データ一覧",
    icon: FileText,
  },
  {
    id: "live",
    path: ROUTES.LIVE_MONITORING,
    label: "LIVE映像",
    icon: CameraIcon,
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

// サイドメニュー項目の定義を移行
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
    id: "breeding",
    path: ROUTES.BREEDING_MANAGEMENT,
    label: "データ入力",
    icon: FileEdit,
  },
  {
    id: "fishStocking",
    path: ROUTES.FISH_STOCKING,
    label: "池入れ記録",
    icon: Fish,
  },
  {
    id: "fishTransfer",
    path: ROUTES.FISH_TRANSFER,
    label: "水槽間移動記録",
    icon: GitBranch,
  },
  {
    id: "dataListing",
    path: ROUTES.DATA_LISTING,
    label: "データ一覧",
    icon: FileText,
  },
  {
    id: "live",
    path: ROUTES.LIVE_MONITORING,
    label: "LIVE映像",
    icon: CameraIcon,
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
      { id: "seed", path: ROUTES.SEED_MASTER, label: "種苗マスタ" },
    ],
  },
] as const;

// ダッシュボード定義を移行
export interface Dashboard {
  id: string;
  name: string;
  path: RoutePaths;
}

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

// マスタ一覧定義を移行
export interface Masters {
  id: string;
  name: string;
  path: RoutePaths;
}

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
  {
    id: "05",
    name: "種苗マスタ",
    path: ROUTES.SEED_MASTER,
  },
];
