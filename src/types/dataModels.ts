export interface BaseRecord {
  id: string;
  timestamp: string; // ISO形式の日時
  lineId: string; // ラインID (e.g. "A", "B")
}

// 設備データ (ろ過槽)
export interface EquipmentData extends BaseRecord {
  residualChlorine1: number; // 残留塩素計値①
  residualChlorine2: number; // 残留塩素計値②
  ammonia: number; // アンモニア
  current: number; // 電解電流値
  flowRate: number; // 流量値
  polarity: "A" | "B"; // 電解極性
  temperature: number; // 水温
}

// PLC経由飼育データ
export interface BreedingPlcData extends BaseRecord {
  tankId: string; // 水槽ID (e.g. "A-1", "B-3")
  oxygenSaturation: number; // 酸素飽和度
  ph: number; // pH
  temperature: number; // 水温
}

// 給餌データ
export interface FeedingData extends BaseRecord {
  tankId: string; // 水槽ID
  feedingTime: string; // 給餌時刻（ISO形式）
  feedType1: string; // 餌種類①
  feedAmount1: number; // 給餌量①
  feedType2: string; // 餌種類②
  feedAmount2: number; // 給餌量②
}

// 尾数データ（斃死・間引き等）
export interface FishCountData extends BaseRecord {
  tankId: string; // 水槽ID
  mortality: number; // 斃死数
  symptom: string; // 症状（斃死理由）
  transferIn: number; // 移動IN
  transferOut: number; // 移動OUT
  culling: number; // 間引き
  memo: string; // メモ
}

// パックテストデータ（毎週金曜日）
export interface PackTestData extends BaseRecord {
  tankId: string; // 水槽ID
  no2: number; // 亜硝酸
  no3: number; // 硝酸
  nh4: number; // アンモニア
  // その他のパックテスト項目...
}

// アラート情報
export interface AlertData {
  id: string;
  timestamp: string; // 発生日時
  lineId: string; // ライン
  tankId: string | null; // 水槽（nullの場合はライン全体のアラート）
  alertMasterId: string; // アラートマスタID
  paramName: string; // パラメータ名
  paramValue: number; // 検知値
  thresholdMin: number; // 下限閾値
  thresholdMax: number; // 上限閾値
  description: string; // 説明
  solution: string; // 対応方法
  resolved: boolean; // 解決済みフラグ
  resolvedAt: string | null; // 解決日時
}

// マスタデータ
export interface TankMaster {
  id: string; // タンクID
  name: string; // タンク名
  lineId: string; // 所属ライン
  type: "breeding" | "filter"; // 飼育槽/ろ過槽
  order: number; // 表示順
  active: boolean; // 有効/無効
}

export interface LineMaster {
  id: string; // ラインID
  name: string; // ライン名
  order: number; // 表示順
  active: boolean; // 有効/無効
}

export interface AlertMaster {
  id: string;
  name: string; // アラート名
  targetParam: string; // 対象パラメータ
  thresholdMin: number; // 下限閾値
  thresholdMax: number; // 上限閾値
  dangerMin: number; // 危険下限閾値
  dangerMax: number; // 危険上限閾値
  duplicateControl: string; // 重複抑制時間
  solution: string; // 対応方法
  active: boolean; // 有効/無効
}

// パラメータ定義
export interface ParameterDefinition {
  id: string;
  name: string; // パラメータ名
  unit: string; // 単位
  normalMin: number; // 通常下限値
  normalMax: number; // 通常上限値
  warningMin: number; // 警告下限値
  warningMax: number; // 警告上限値
  dangerMin: number; // 危険下限値
  dangerMax: number; // 危険上限値
}

export interface FixedPointData {
  id: string;
  date: Date;
  lineId: string;
  lineName: string;
  equipmentData: EquipmentData | null;
  breedingData: Record<string, BreedingPlcData | null>;
}
