// 手入力データ（給餌・尾数・パックテスト）アクセス用ヘルパー関数

import { DataStore } from "./mockDataStore";
import { FeedingData, FishCountData, PackTestData } from "../types/dataModels";

// 給餌データの取得
export const loadFeedingData = async (): Promise<FeedingData[]> => {
  await DataStore.loadData();
  return DataStore.data.feedingData;
};

// タンクIDでフィルタリングした給餌データを取得
export const getFeedingDataByTank = async (
  tankId: string
): Promise<FeedingData[]> => {
  await DataStore.loadData();
  return DataStore.data.feedingData.filter((data) => data.tankId === tankId);
};

// 日付でフィルタリングした給餌データを取得
export const getFeedingDataByDate = async (
  date: Date
): Promise<FeedingData[]> => {
  await DataStore.loadData();

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return DataStore.data.feedingData.filter((data) => {
    const dataDate = new Date(data.timestamp);
    return dataDate >= startOfDay && dataDate <= endOfDay;
  });
};

// 給餌データの追加
export const addFeedingData = async (
  data: Omit<FeedingData, "id">
): Promise<string> => {
  await DataStore.loadData();
  return DataStore.addFeedingData(data);
};

// 尾数データの取得
export const loadFishCountData = async (): Promise<FishCountData[]> => {
  await DataStore.loadData();
  return DataStore.data.fishCountData;
};

// タンクIDでフィルタリングした尾数データを取得
export const getFishCountDataByTank = async (
  tankId: string
): Promise<FishCountData[]> => {
  await DataStore.loadData();
  return DataStore.data.fishCountData.filter((data) => data.tankId === tankId);
};

// 日付でフィルタリングした尾数データを取得
export const getFishCountDataByDate = async (
  date: Date
): Promise<FishCountData[]> => {
  await DataStore.loadData();

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return DataStore.data.fishCountData.filter((data) => {
    const dataDate = new Date(data.timestamp);
    return dataDate >= startOfDay && dataDate <= endOfDay;
  });
};

// 尾数データの追加
export const addFishCountData = async (
  data: Omit<FishCountData, "id">
): Promise<string> => {
  await DataStore.loadData();
  return DataStore.addFishCountData(data);
};

// パックテストデータの取得
export const loadPackTestData = async (): Promise<PackTestData[]> => {
  await DataStore.loadData();
  return DataStore.data.packTestData;
};

// タンクIDでフィルタリングしたパックテストデータを取得
export const getPackTestDataByTank = async (
  tankId: string
): Promise<PackTestData[]> => {
  await DataStore.loadData();
  return DataStore.data.packTestData.filter((data) => data.tankId === tankId);
};

// 日付範囲でフィルタリングしたパックテストデータを取得
export const getPackTestDataByDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<PackTestData[]> => {
  await DataStore.loadData();

  return DataStore.data.packTestData.filter((data) => {
    const dataDate = new Date(data.timestamp);
    return dataDate >= startDate && dataDate <= endDate;
  });
};

// パックテストデータの追加
export const addPackTestData = async (
  data: Omit<PackTestData, "id">
): Promise<string> => {
  await DataStore.loadData();
  return DataStore.addPackTestData(data);
};

// 特定の日の手入力データをまとめて取得
export const getManualDataByDate = async (
  date: Date
): Promise<{
  feeding: FeedingData[];
  fishCount: FishCountData[];
  packTest: PackTestData[];
}> => {
  await DataStore.loadData();

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const feeding = DataStore.data.feedingData.filter((data) => {
    const dataDate = new Date(data.timestamp);
    return dataDate >= startOfDay && dataDate <= endOfDay;
  });

  const fishCount = DataStore.data.fishCountData.filter((data) => {
    const dataDate = new Date(data.timestamp);
    return dataDate >= startOfDay && dataDate <= endOfDay;
  });

  const packTest = DataStore.data.packTestData.filter((data) => {
    const dataDate = new Date(data.timestamp);
    return dataDate >= startOfDay && dataDate <= endOfDay;
  });

  return {
    feeding,
    fishCount,
    packTest,
  };
};

// 特定のタンクの手入力データをまとめて取得
export const getManualDataByTank = async (
  tankId: string
): Promise<{
  feeding: FeedingData[];
  fishCount: FishCountData[];
  packTest: PackTestData[];
}> => {
  await DataStore.loadData();

  const feeding = DataStore.data.feedingData.filter(
    (data) => data.tankId === tankId
  );
  const fishCount = DataStore.data.fishCountData.filter(
    (data) => data.tankId === tankId
  );
  const packTest = DataStore.data.packTestData.filter(
    (data) => data.tankId === tankId
  );

  return {
    feeding,
    fishCount,
    packTest,
  };
};
