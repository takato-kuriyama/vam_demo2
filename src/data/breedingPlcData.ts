// src/data/breedingPlcData.ts
// PLC経由の飼育データアクセス用ヘルパー関数

import { DataStore } from "./mockDataStore";
import { BreedingPlcData } from "../types/dataModels";

// データをロードする
export const loadBreedingPlcData = async (): Promise<BreedingPlcData[]> => {
  await DataStore.loadData();
  return DataStore.data.breedingPlcData;
};

// タンクIDでフィルタリングしたデータを取得
export const getBreedingPlcDataByTank = async (
  tankId: string
): Promise<BreedingPlcData[]> => {
  await DataStore.loadData();
  return DataStore.data.breedingPlcData.filter(
    (data) => data.tankId === tankId
  );
};

// ラインIDでフィルタリングしたデータを取得
export const getBreedingPlcDataByLine = async (
  lineId: string
): Promise<BreedingPlcData[]> => {
  await DataStore.loadData();
  return DataStore.data.breedingPlcData.filter(
    (data) => data.lineId === lineId
  );
};

// 日付範囲でフィルタリングしたデータを取得
export const getBreedingPlcDataByDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<BreedingPlcData[]> => {
  await DataStore.loadData();

  return DataStore.data.breedingPlcData.filter((data) => {
    const dataDate = new Date(data.timestamp);
    return dataDate >= startDate && dataDate <= endDate;
  });
};

// あるタンクの最新のデータを取得
export const getLatestBreedingPlcDataForTank = async (
  tankId: string
): Promise<BreedingPlcData | null> => {
  await DataStore.loadData();
  return DataStore.getLatestBreedingDataForTank(tankId);
};

// あるラインの全タンクの最新データを取得
export const getLatestBreedingPlcDataForLine = async (
  lineId: string
): Promise<Record<string, BreedingPlcData | null>> => {
  await DataStore.loadData();

  const result: Record<string, BreedingPlcData | null> = {};
  const tanks = DataStore.data.masterData.tanks.filter(
    (tank) => tank.lineId === lineId && tank.type === "breeding"
  );

  for (const tank of tanks) {
    result[tank.id] = DataStore.getLatestBreedingDataForTank(tank.id);
  }

  return result;
};
