// src/data/equipmentData.ts
// こちらのファイルは実際にはデータを生成し、エクスポートするだけの役割です
// データそのものは mockDataStore.ts に格納され、API呼び出しや
// データベースクエリをシミュレートしています

import { DataStore } from "./mockDataStore";
import { EquipmentData } from "../types/dataModels";

// データをロードする
export const loadEquipmentData = async (): Promise<EquipmentData[]> => {
  await DataStore.loadData();
  return DataStore.data.equipmentData;
};

// ラインIDでフィルタリングしたデータを取得
export const getEquipmentDataByLine = async (
  lineId: string
): Promise<EquipmentData[]> => {
  await DataStore.loadData();
  return DataStore.data.equipmentData.filter((data) => data.lineId === lineId);
};

// 日付範囲でフィルタリングしたデータを取得
export const getEquipmentDataByDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<EquipmentData[]> => {
  await DataStore.loadData();

  return DataStore.data.equipmentData.filter((data) => {
    const dataDate = new Date(data.timestamp);
    return dataDate >= startDate && dataDate <= endDate;
  });
};

// あるラインの最新のデータを取得
export const getLatestEquipmentDataForLine = async (
  lineId: string
): Promise<EquipmentData | null> => {
  await DataStore.loadData();
  return DataStore.getLatestEquipmentDataForLine(lineId);
};
