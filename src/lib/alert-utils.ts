import { AlertData, ParameterDefinition } from "../types/dataModels";

// パラメータ値からステータスを取得
export function getParameterStatus(
  value: number,
  paramDef: ParameterDefinition
): "normal" | "warning" | "error" {
  if (value < paramDef.dangerMin || value > paramDef.dangerMax) {
    return "error";
  } else if (value < paramDef.warningMin || value > paramDef.warningMax) {
    return "warning";
  }
  return "normal";
}

// アラートのフィルタリング
export function filterAlerts(
  alerts: AlertData[],
  filters: {
    searchTerm?: string;
    showOnlyUnresolved?: boolean;
    lineId?: string;
    tankId?: string;
    startDate?: Date | null;
    endDate?: Date | null;
  }
): AlertData[] {
  let filteredAlerts = [...alerts];

  // 解決済みフィルター
  if (filters.showOnlyUnresolved) {
    filteredAlerts = filteredAlerts.filter((alert) => !alert.resolved);
  }

  // ライン検索
  if (filters.lineId) {
    filteredAlerts = filteredAlerts.filter(
      (alert) => alert.lineId === filters.lineId
    );
  }

  // タンク検索
  if (filters.tankId) {
    filteredAlerts = filteredAlerts.filter(
      (alert) => alert.tankId === filters.tankId
    );
  }

  // 検索語
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filteredAlerts = filteredAlerts.filter(
      (alert) =>
        alert.paramName.toLowerCase().includes(searchLower) ||
        alert.description.toLowerCase().includes(searchLower) ||
        alert.lineId.toLowerCase().includes(searchLower) ||
        (alert.tankId && alert.tankId.toLowerCase().includes(searchLower))
    );
  }

  // 日付範囲
  if (filters.startDate) {
    filteredAlerts = filteredAlerts.filter(
      (alert) => new Date(alert.timestamp) >= filters.startDate!
    );
  }

  if (filters.endDate) {
    filteredAlerts = filteredAlerts.filter(
      (alert) => new Date(alert.timestamp) <= filters.endDate!
    );
  }

  return filteredAlerts;
}
