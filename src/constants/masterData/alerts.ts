import { AlertMaster } from "../../types/dataModels";

// アラート定義
export const ALERT_MASTERS: AlertMaster[] = [
  {
    id: "1",
    name: "残留塩素異常アラート",
    targetParam: "residualChlorine1",
    thresholdMin: 2.5,
    thresholdMax: 4.5,
    dangerMin: 2.0,
    dangerMax: 5.0,
    duplicateControl: "1h",
    solution:
      "・残留塩素計の値を確認してください\n・装置の動作状況を確認してください",
    active: true,
  },
  {
    id: "2",
    name: "アンモニア異常アラート",
    targetParam: "ammonia",
    thresholdMin: 0.0,
    thresholdMax: 0.8,
    dangerMin: 0.0,
    dangerMax: 1.0,
    duplicateControl: "3h",
    solution: "・アンモニア濃度を確認してください\n・給餌量を調整してください",
    active: true,
  },
  {
    id: "3",
    name: "酸素濃度アラート",
    targetParam: "oxygenSaturation",
    thresholdMin: 70,
    thresholdMax: 100,
    dangerMin: 65,
    dangerMax: 110,
    duplicateControl: "2h",
    solution:
      "・酸素供給装置を確認してください\n・水槽の状態を確認してください",
    active: true,
  },
  {
    id: "4",
    name: "pH異常アラート",
    targetParam: "ph",
    thresholdMin: 6.5,
    thresholdMax: 8.0,
    dangerMin: 6.0,
    dangerMax: 8.5,
    duplicateControl: "3h",
    solution: "・水質を確認してください\n・給餌量を確認してください",
    active: true,
  },
  {
    id: "5",
    name: "水温異常アラート",
    targetParam: "temperature",
    thresholdMin: 23,
    thresholdMax: 28,
    dangerMin: 22,
    dangerMax: 29,
    duplicateControl: "3h",
    solution: "・温度調節装置を確認してください",
    active: true,
  },
];

// 重複アラート抑制の選択肢
export const ALERT_DUPLICATE_CONTROLS = [
  { id: "1h", name: "重複アラートを1時間抑制" },
  { id: "3h", name: "重複アラートを3時間抑制" },
  { id: "6h", name: "重複アラートを6時間抑制" },
  { id: "12h", name: "重複アラートを12時間抑制" },
  { id: "24h", name: "重複アラートを24時間抑制" },
] as const;

// アラートの対象データ選択肢
export const ALERT_TARGET_DATA = [
  { id: "residualChlorine1", name: "残留塩素①" },
  { id: "residualChlorine2", name: "残留塩素②" },
  { id: "ammonia", name: "アンモニア" },
  { id: "oxygenSaturation", name: "酸素濃度" },
  { id: "ph", name: "pH" },
  { id: "temperature", name: "水温" },
] as const;

// ヘルパー関数
export const getActiveAlertMasters = () =>
  ALERT_MASTERS.filter((alert) => alert.active);
export const getAlertMasterByParam = (paramId: string) =>
  ALERT_MASTERS.find((alert) => alert.targetParam === paramId && alert.active);
export const getAlertMasterById = (id: string) =>
  ALERT_MASTERS.find((alert) => alert.id === id);

// アラート履歴サンプルデータ（新データ構造では実際には使用しない - データ生成ロジックで自動的に生成される）
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
