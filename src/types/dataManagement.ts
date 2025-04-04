// 飼育管理データの型定義

// 給餌情報の型
export interface FeedEntry {
  id: string;
  time: string | Date; // 文字列(HH:MM形式)またはDateオブジェクト
  feed1Type: string;
  feed1Amount: string;
  feed2Type: string;
  feed2Amount: string;
}

// 斃死情報の型
export interface MortalityRecord {
  id: string;
  weight: string; // 魚体重
  symptoms: string; // 症状
  photos: (File | null)[]; // 写真(複数枚)←3枚までを想定
  notes: string; // 備考
}

// カスタム項目の型
export interface CustomField {
  id: string;
  name: string;
  value: string;
  isPermanent: boolean;
}

// 飼育管理データの型
export interface BreedingFormData {
  dateTime: string;
  tankId: string;
  waterTemp: string;
  feedingActivity: string;
  mortality: number; // 総斃死数
  transferIn: string;
  transferOut: string;
  culling: string;
  memo: string;
  csvExportData: Record<string, any>; // CSV出力用データ
  averageWeight?: string;
  nh4?: string;
  no2?: string;
  no3?: string;
  tClo?: string;
  cloDp?: string;
  ph?: string;
}

// CSV出力データの型
export interface CsvExportData {
  date: string;
  tank: string;
  waterTemp: string;
  feedEntries: {
    time: string;
    feed1Type: string;
    feed1TypeName: string;
    feed1Amount: string;
    feed2Type: string;
    feed2TypeName: string;
    feed2Amount: string;
    totalAmount: string;
  }[];
  feedingActivity: string;
  mortalityRecords: {
    weight: string;
    symptoms: string;
    notes: string;
  }[];
  totalMortality: number;
  transferIn: string;
  transferOut: string;
  culling: string;
  memo: string;
  averageWeight?: string;
  nh4?: string;
  no2?: string;
  no3?: string;
  tClo?: string;
  cloDp?: string;
  ph?: string;
  // customFields: {
  //   name: string;
  //   value: string;
  // }[];
}
