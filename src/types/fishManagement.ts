// src/types/fishManagement.ts

// 種苗供給元（仕入れ先）の型定義
export interface Supplier {
  id: string;
  name: string;
  active?: boolean;
}

// 魚種の型定義
export interface FishSpecies {
  id: string;
  name: string;
  active?: boolean;
}

// 池入れ記録の型定義
export interface StockingRecord {
  id: string;
  date: Date;
  supplierId: string;
  speciesId: string;
  seedName: string;
  tankId: string;
  quantity: number;
  memo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 水槽間移動記録の型定義
export interface TransferRecord {
  id: string;
  date: Date;
  stockingRecordId?: string; // 元の池入れ記録ID（オプション）
  sourceTankId: string;
  seedName: string;
  targetTankId: string;
  quantity: number;
  memo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// タンク内の現在の魚の在庫状況
export interface FishStock {
  tankId: string;
  seedName: string;
  speciesId: string;
  currentQuantity: number;
  initialQuantity: number;
  stockingDate: Date;
  lastUpdated: Date;
}
