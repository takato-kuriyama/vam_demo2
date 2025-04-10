// src/constants/routes.ts
// 既存のROUTES定義を移行
export const ROUTES = {
  HOME: "/homepage",
  DASHBOARD: "/dashboard",
  DASHBOARD_EQUIPMENT: "/dashboard/equipment",
  DASHBOARD_BREEDING: "/dashboard/breeding",
  DATA_LISTING: "/data_listing",
  BREEDING_MANAGEMENT: "/breeding_management",
  FISH_STOCKING: "/fish_stocking",
  FISH_TRANSFER: "/fish_transfer",
  LIVE_MONITORING: "/live_monitoring",
  FIXED_POINT_MONITORING: "/fixed_point_monitoring",
  ALERT_HISTORY: "/alert_history",
  MASTER_INDEX: "/master",
  USER_MASTER: "/master/user",
  ALERT_MASTER: "/master/alert",
  TANK_MASTER: "/master/tank",
  LINE_MASTER: "/master/line",
  REMOTE_CONTROLL: "/remote_controll",
  SEED_MASTER: "/master/seed",
  FEED_MASTER: "/master/feed",
  DASHBOARD_TEST: "/dashboard/test",
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type RoutePaths = (typeof ROUTES)[RouteKeys];

// 既存のROUTES_CONFIG定義を移行
export const ROUTES_CONFIG = [
  {
    id: "HOME",
    path: "/homepage",
    displayName: "ホーム",
  },
  {
    id: "DASHBOARD",
    path: "/dashboard",
    displayName: "ダッシュボード",
  },
  {
    id: "DASHBOARD_EQUIPMENT",
    path: "/dashboard/equipment",
    displayName: "ろ過部ダッシュボード",
  },
  {
    id: "DASHBOARD_BREEDING",
    path: "/dashboard/breeding",
    displayName: "飼育槽ダッシュボード",
  },
  {
    id: "DATA_LISTING",
    path: "/data_listing",
    displayName: "データ一覧",
  },
  {
    id: "BREEDING_MANAGEMENT",
    path: "/breeding_management",
    displayName: "データ入力",
  },
  {
    id: "FISH_STOCKING",
    path: "/fish_stocking",
    displayName: "池入れ記録",
  },
  {
    id: "FISH_TRANSFER",
    path: "/fish_transfer",
    displayName: "水槽間移動記録",
  },
  {
    id: "LIVE_MONITORING",
    path: "/live_monitoring",
    displayName: "LIVE映像",
  },
  {
    id: "FIXED_POINT_MONITORING",
    path: "/fixed_point_monitoring",
    displayName: "定点観測一覧",
  },
  {
    id: "ALERT_HISTORY",
    path: "/alert_history",
    displayName: "アラート履歴",
  },
  {
    id: "REMOTE_CONTROLL",
    path: "/remote_controll",
    displayName: "制御",
  },
  {
    id: "MASTER_INDEX",
    path: "/master",
    displayName: "マスタ管理",
  },
  {
    id: "USER_MASTER",
    path: "/master/user",
    displayName: "ユーザーマスタ",
  },
  {
    id: "ALERT_MASTER",
    path: "/master/alert",
    displayName: "アラートマスタ",
  },
  {
    id: "LINE_MASTER",
    path: "/master/line",
    displayName: "ろ過部マスタ",
  },
  {
    id: "TANK_MASTER",
    path: "/master/tank",
    displayName: "飼育槽マスタ",
  },
  {
    id: "SEED_MASTER",
    path: "/master/seed",
    displayName: "種苗マスタ",
  },
  {
    id: "FEED_MASTER",
    path: "/master/feed",
    displayName: "投入物マスタ",
  },
  {
    id: "DASHBOARD_TEST",
    path: "/dashboard/test",
    displayName: "テストダッシュボード",
  },
] as const;

// ページタイトル定義も移行
export const PAGE_TITLES = {
  HOME: "ホーム",
  DASHBOARD: "ダッシュボード一覧",
  DASHBOARD_EQUIPMENT: "ろ過部ダッシュボード",
  DASHBOARD_BREEDING: "飼育槽ダッシュボード",
  DATA_LISTING: "データ一覧",
  BREEDING_MANAGEMENT: "データ入力",
  FISH_STOCKING: "池入れ記録",
  FISH_TRANSFER: "水槽間移動記録",
  ALERT_HISTORY: "アラート履歴一覧",
  MASTER_INDEX: "マスタ管理",
  ALERT_MASTER: "アラートマスタ",
  USER_MASTER: "ユーザーマスタ",
  TANK_MASTER: "飼育槽マスタ",
  LINE_MASTER: "ろ過部マスタ",
  SEED_MASTER: "種苗マスタ",
  FEED_MASTER: "投入物マスタ",
  FIXED_POINT: "定点観測一覧",
  LIVE_MONITORING: "LIVE映像",
  REMOTE_CONTROLL: "制御パネル",
  DASHBOARD_TEST: "テストダッシュボード",
} as const;
