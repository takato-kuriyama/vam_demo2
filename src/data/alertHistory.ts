// src/data/alertHistory.ts
// アラート履歴データアクセス用ヘルパー関数

import { DataStore } from "./mockDataStore";
import { AlertData } from "../types/dataModels";

// アラートデータの取得
export const loadAlertData = async (): Promise<AlertData[]> => {
  await DataStore.loadData();
  return DataStore.data.alerts;
};

// 未解決のアラートのみ取得
export const getUnresolvedAlerts = async (): Promise<AlertData[]> => {
  await DataStore.loadData();
  return DataStore.data.alerts.filter((alert) => !alert.resolved);
};

// ラインIDでフィルタリングしたアラートを取得
export const getAlertsByLine = async (lineId: string): Promise<AlertData[]> => {
  await DataStore.loadData();
  return DataStore.data.alerts.filter((alert) => alert.lineId === lineId);
};

// タンクIDでフィルタリングしたアラートを取得
export const getAlertsByTank = async (tankId: string): Promise<AlertData[]> => {
  await DataStore.loadData();
  return DataStore.data.alerts.filter((alert) => alert.tankId === tankId);
};

// 日付範囲でフィルタリングしたアラートを取得
export const getAlertsByDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<AlertData[]> => {
  await DataStore.loadData();

  return DataStore.data.alerts.filter((alert) => {
    const alertDate = new Date(alert.timestamp);
    return alertDate >= startDate && alertDate <= endDate;
  });
};

// アラートを解決済みとしてマーク
export const resolveAlert = async (alertId: string): Promise<void> => {
  await DataStore.loadData();
  DataStore.resolveAlert(alertId);
};

// アラート統計情報を取得
export const getAlertStats = async (): Promise<{
  total: number;
  unresolved: number;
  byLine: Record<string, { total: number; unresolved: number }>;
}> => {
  await DataStore.loadData();
  return DataStore.getAlertStats();
};

// アラート検索
export const searchAlerts = async (options: {
  searchTerm?: string;
  showOnlyUnresolved?: boolean;
  lineId?: string;
  tankId?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<AlertData[]> => {
  await DataStore.loadData();

  let filtered = [...DataStore.data.alerts];

  // 未解決のみ表示
  if (options.showOnlyUnresolved) {
    filtered = filtered.filter((alert) => !alert.resolved);
  }

  // ラインIDでフィルタリング
  if (options.lineId) {
    filtered = filtered.filter((alert) => alert.lineId === options.lineId);
  }

  // タンクIDでフィルタリング
  if (options.tankId) {
    filtered = filtered.filter((alert) => alert.tankId === options.tankId);
  }

  // 検索語でフィルタリング
  if (options.searchTerm) {
    const searchLower = options.searchTerm.toLowerCase();
    filtered = filtered.filter(
      (alert) =>
        alert.paramName.toLowerCase().includes(searchLower) ||
        alert.description.toLowerCase().includes(searchLower) ||
        alert.solution.toLowerCase().includes(searchLower)
    );
  }

  // 日付でフィルタリング
  if (options.startDate) {
    filtered = filtered.filter(
      (alert) => new Date(alert.timestamp) >= options.startDate!
    );
  }

  if (options.endDate) {
    filtered = filtered.filter(
      (alert) => new Date(alert.timestamp) <= options.endDate!
    );
  }

  // 最新のアラートが先頭に来るように並び替え
  return filtered.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};
