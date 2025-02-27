// src/hooks/useDataStore.ts
import { useState, useEffect, useCallback } from "react";
import { DataStore } from "../data/mockDataStore";
import {
  EquipmentData,
  BreedingPlcData,
  FeedingData,
  FishCountData,
  PackTestData,
  AlertData,
  LineMaster,
  TankMaster,
  ParameterDefinition,
  AlertMaster,
} from "../types/dataModels";

// データロード状態を管理するフック
export function useDataStore() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await DataStore.loadData();
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("データのロード中にエラーが発生しました")
        );
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    isLoading,
    error,
    dataStore: DataStore,
  };
}

// マスタデータへのアクセスフック
export function useMasterData() {
  const { isLoading, error, dataStore } = useDataStore();
  const [masterData, setMasterData] = useState<{
    lines: LineMaster[];
    tanks: TankMaster[];
    parameters: ParameterDefinition[];
    alertMasters: AlertMaster[];
  }>({
    lines: [],
    tanks: [],
    parameters: [],
    alertMasters: [],
  });

  useEffect(() => {
    if (!isLoading && !error) {
      setMasterData({
        lines: dataStore.data.masterData.lines,
        tanks: dataStore.data.masterData.tanks,
        parameters: dataStore.data.masterData.parameterDefinitions,
        alertMasters: dataStore.data.masterData.alertMasters,
      });
    }
  }, [isLoading, error, dataStore]);

  return {
    isLoading,
    error,
    masterData,
    // マスタデータ更新用の関数
    updateLine: useCallback(
      (id: string, updates: Partial<LineMaster>) => {
        dataStore.updateMasterData("lines", id, updates);
        setMasterData((prev) => ({
          ...prev,
          lines: prev.lines.map((line) =>
            line.id === id ? { ...line, ...updates } : line
          ),
        }));
      },
      [dataStore]
    ),
    updateTank: useCallback(
      (id: string, updates: Partial<TankMaster>) => {
        dataStore.updateMasterData("tanks", id, updates);
        setMasterData((prev) => ({
          ...prev,
          tanks: prev.tanks.map((tank) =>
            tank.id === id ? { ...tank, ...updates } : tank
          ),
        }));
      },
      [dataStore]
    ),
    updateParameter: useCallback(
      (id: string, updates: Partial<ParameterDefinition>) => {
        dataStore.updateMasterData("parameterDefinitions", id, updates);
        setMasterData((prev) => ({
          ...prev,
          parameters: prev.parameters.map((param) =>
            param.id === id ? { ...param, ...updates } : param
          ),
        }));
      },
      [dataStore]
    ),
    updateAlertMaster: useCallback(
      (id: string, updates: Partial<AlertMaster>) => {
        dataStore.updateMasterData("alertMasters", id, updates);
        setMasterData((prev) => ({
          ...prev,
          alertMasters: prev.alertMasters.map((alert) =>
            alert.id === id ? { ...alert, ...updates } : alert
          ),
        }));
      },
      [dataStore]
    ),
  };
}

// ダッシュボード用のデータを取得するフック
export function useDashboardData() {
  const { isLoading, error, dataStore } = useDataStore();
  const [dashboardData, setDashboardData] = useState<{
    latestEquipmentData: Record<string, EquipmentData | null>;
    latestBreedingData: Record<string, Record<string, BreedingPlcData | null>>;
    alertStats: {
      total: number;
      unresolved: number;
      byLine: Record<string, { total: number; unresolved: number }>;
    };
    todayFeedingTotal: Record<string, number>;
  }>({
    latestEquipmentData: {},
    latestBreedingData: {},
    alertStats: { total: 0, unresolved: 0, byLine: {} },
    todayFeedingTotal: {},
  });

  useEffect(() => {
    if (!isLoading && !error) {
      // ラインごとの最新設備データを取得
      const latestEquipmentData: Record<string, EquipmentData | null> = {};
      dataStore.data.masterData.lines.forEach((line) => {
        latestEquipmentData[line.id] = dataStore.getLatestEquipmentDataForLine(
          line.id
        );
      });

      // タンクごとの最新飼育データを取得
      const latestBreedingData: Record<
        string,
        Record<string, BreedingPlcData | null>
      > = {};
      dataStore.data.masterData.lines.forEach((line) => {
        latestBreedingData[line.id] = {};

        const lineTanks = dataStore.data.masterData.tanks.filter(
          (tank) => tank.lineId === line.id && tank.type === "breeding"
        );

        lineTanks.forEach((tank) => {
          latestBreedingData[line.id][tank.id] =
            dataStore.getLatestBreedingDataForTank(tank.id);
        });
      });

      // アラート統計を取得
      const alertStats = dataStore.getAlertStats();

      // 今日の給餌合計を取得
      const todayFeedingTotal = dataStore.getTodayFeedingTotal();

      setDashboardData({
        latestEquipmentData,
        latestBreedingData,
        alertStats,
        todayFeedingTotal,
      });
    }
  }, [isLoading, error, dataStore]);

  return {
    isLoading,
    error,
    dashboardData,
  };
}

// アラート関連のデータを取得するフック
export function useAlertData() {
  const { isLoading, error, dataStore } = useDataStore();
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<AlertData[]>([]);
  const [filter, setFilter] = useState({
    showOnlyUnresolved: false,
    searchTerm: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
  });

  // アラート取得
  useEffect(() => {
    if (!isLoading && !error) {
      setAlerts(dataStore.data.alerts);
    }
  }, [isLoading, error, dataStore]);

  // フィルタリング
  useEffect(() => {
    let filtered = [...alerts];

    // 未解決のみ表示
    if (filter.showOnlyUnresolved) {
      filtered = filtered.filter((alert) => !alert.resolved);
    }

    // 検索語でフィルタリング
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (alert) =>
          alert.paramName.toLowerCase().includes(searchLower) ||
          alert.description.toLowerCase().includes(searchLower) ||
          alert.lineId.toLowerCase().includes(searchLower) ||
          (alert.tankId && alert.tankId.toLowerCase().includes(searchLower))
      );
    }

    // 日付でフィルタリング
    if (filter.startDate) {
      filtered = filtered.filter(
        (alert) => new Date(alert.timestamp) >= filter.startDate!
      );
    }

    if (filter.endDate) {
      filtered = filtered.filter(
        (alert) => new Date(alert.timestamp) <= filter.endDate!
      );
    }

    setFilteredAlerts(filtered);
  }, [alerts, filter]);

  // アラート解決関数
  const resolveAlert = useCallback(
    (alertId: string) => {
      dataStore.resolveAlert(alertId);
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId
            ? { ...alert, resolved: true, resolvedAt: new Date().toISOString() }
            : alert
        )
      );
    },
    [dataStore]
  );

  return {
    isLoading,
    error,
    alerts: filteredAlerts,
    filter,
    setFilter,
    resolveAlert,
  };
}

// 設備データを取得するフック
export function useEquipmentData(lineId?: string) {
  const { isLoading, error, dataStore } = useDataStore();
  const [equipmentData, setEquipmentData] = useState<EquipmentData[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
  });

  useEffect(() => {
    if (!isLoading && !error) {
      let data = dataStore.data.equipmentData;

      // ラインIDが指定されていれば、そのラインのデータのみを取得
      if (lineId) {
        data = data.filter((item) => item.lineId === lineId);
      }

      // 日付範囲によるフィルタリング
      if (dateRange.startDate) {
        data = data.filter(
          (item) => new Date(item.timestamp) >= dateRange.startDate!
        );
      }

      if (dateRange.endDate) {
        data = data.filter(
          (item) => new Date(item.timestamp) <= dateRange.endDate!
        );
      }

      // 時系列でソート
      data = data.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      setEquipmentData(data);
    }
  }, [isLoading, error, dataStore, lineId, dateRange]);

  return {
    isLoading,
    error,
    equipmentData,
    dateRange,
    setDateRange,
  };
}

// 飼育データを取得するフック
export function useBreedingData(tankId?: string) {
  const { isLoading, error, dataStore } = useDataStore();
  const [breedingData, setBreedingData] = useState<BreedingPlcData[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
  });

  useEffect(() => {
    if (!isLoading && !error) {
      let data = dataStore.data.breedingPlcData;

      // タンクIDが指定されていれば、そのタンクのデータのみを取得
      if (tankId) {
        data = data.filter((item) => item.tankId === tankId);
      }

      // 日付範囲によるフィルタリング
      if (dateRange.startDate) {
        data = data.filter(
          (item) => new Date(item.timestamp) >= dateRange.startDate!
        );
      }

      if (dateRange.endDate) {
        data = data.filter(
          (item) => new Date(item.timestamp) <= dateRange.endDate!
        );
      }

      // 時系列でソート
      data = data.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      setBreedingData(data);
    }
  }, [isLoading, error, dataStore, tankId, dateRange]);

  return {
    isLoading,
    error,
    breedingData,
    dateRange,
    setDateRange,
  };
}

// 給餌データを取得するフック
export function useFeedingData(tankId?: string) {
  const { isLoading, error, dataStore } = useDataStore();
  const [feedingData, setFeedingData] = useState<FeedingData[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
  });

  useEffect(() => {
    if (!isLoading && !error) {
      let data = dataStore.data.feedingData;

      // タンクIDが指定されていれば、そのタンクのデータのみを取得
      if (tankId) {
        data = data.filter((item) => item.tankId === tankId);
      }

      // 日付範囲によるフィルタリング
      if (dateRange.startDate) {
        data = data.filter(
          (item) => new Date(item.timestamp) >= dateRange.startDate!
        );
      }

      if (dateRange.endDate) {
        data = data.filter(
          (item) => new Date(item.timestamp) <= dateRange.endDate!
        );
      }

      // 時系列でソート
      data = data.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      setFeedingData(data);
    }
  }, [isLoading, error, dataStore, tankId, dateRange]);

  // 新しい給餌データを追加
  const addFeedingData = useCallback(
    (data: Omit<FeedingData, "id">) => {
      const id = dataStore.addFeedingData(data);
      setFeedingData((prev) => [...prev, { id, ...data }]);
      return id;
    },
    [dataStore]
  );

  return {
    isLoading,
    error,
    feedingData,
    dateRange,
    setDateRange,
    addFeedingData,
  };
}

// 尾数データを取得するフック
export function useFishCountData(tankId?: string) {
  const { isLoading, error, dataStore } = useDataStore();
  const [fishCountData, setFishCountData] = useState<FishCountData[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
  });

  useEffect(() => {
    if (!isLoading && !error) {
      let data = dataStore.data.fishCountData;

      // タンクIDが指定されていれば、そのタンクのデータのみを取得
      if (tankId) {
        data = data.filter((item) => item.tankId === tankId);
      }

      // 日付範囲によるフィルタリング
      if (dateRange.startDate) {
        data = data.filter(
          (item) => new Date(item.timestamp) >= dateRange.startDate!
        );
      }

      if (dateRange.endDate) {
        data = data.filter(
          (item) => new Date(item.timestamp) <= dateRange.endDate!
        );
      }

      // 時系列でソート
      data = data.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      setFishCountData(data);
    }
  }, [isLoading, error, dataStore, tankId, dateRange]);

  // 新しい尾数データを追加
  const addFishCountData = useCallback(
    (data: Omit<FishCountData, "id">) => {
      const id = dataStore.addFishCountData(data);
      setFishCountData((prev) => [...prev, { id, ...data }]);
      return id;
    },
    [dataStore]
  );

  return {
    isLoading,
    error,
    fishCountData,
    dateRange,
    setDateRange,
    addFishCountData,
  };
}

// パックテストデータを取得するフック
export function usePackTestData(tankId?: string) {
  const { isLoading, error, dataStore } = useDataStore();
  const [packTestData, setPackTestData] = useState<PackTestData[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
  });

  useEffect(() => {
    if (!isLoading && !error) {
      let data = dataStore.data.packTestData;

      // タンクIDが指定されていれば、そのタンクのデータのみを取得
      if (tankId) {
        data = data.filter((item) => item.tankId === tankId);
      }

      // 日付範囲によるフィルタリング
      if (dateRange.startDate) {
        data = data.filter(
          (item) => new Date(item.timestamp) >= dateRange.startDate!
        );
      }

      if (dateRange.endDate) {
        data = data.filter(
          (item) => new Date(item.timestamp) <= dateRange.endDate!
        );
      }

      // 時系列でソート
      data = data.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      setPackTestData(data);
    }
  }, [isLoading, error, dataStore, tankId, dateRange]);

  // 新しいパックテストデータを追加
  const addPackTestData = useCallback(
    (data: Omit<PackTestData, "id">) => {
      const id = dataStore.addPackTestData(data);
      setPackTestData((prev) => [...prev, { id, ...data }]);
      return id;
    },
    [dataStore]
  );

  return {
    isLoading,
    error,
    packTestData,
    dateRange,
    setDateRange,
    addPackTestData,
  };
}

// 統計・チャート用のデータを集計するためのユーティリティフック
export function useChartData() {
  const { isLoading, error, dataStore } = useDataStore();

  // 時系列データを指定期間、指定パラメータでまとめる関数
  const getTimeSeriesData = useCallback(
    (options: {
      dataType: "equipment" | "breeding";
      paramId: string;
      startDate?: Date;
      endDate?: Date;
      lineId?: string;
      tankId?: string;
      interval?: "hour" | "day" | "week" | "month";
    }) => {
      if (isLoading || error) return [];

      const {
        dataType,
        paramId,
        startDate,
        endDate,
        lineId,
        tankId,
        interval = "hour",
      } = options;

      // データ取得
      let rawData: any[] = [];
      if (dataType === "equipment") {
        rawData = dataStore.data.equipmentData;
        if (lineId) {
          rawData = rawData.filter((item) => item.lineId === lineId);
        }
      } else if (dataType === "breeding") {
        rawData = dataStore.data.breedingPlcData;
        if (tankId) {
          rawData = rawData.filter((item) => item.tankId === tankId);
        } else if (lineId) {
          // タンクIDが指定されていない場合は、ライン全体のデータを取得
          const lineTanks = dataStore.data.masterData.tanks
            .filter(
              (tank) => tank.lineId === lineId && tank.type === "breeding"
            )
            .map((tank) => tank.id);
          rawData = rawData.filter((item) => lineTanks.includes(item.tankId));
        }
      }

      // 日付範囲でフィルタリング
      if (startDate) {
        rawData = rawData.filter(
          (item) => new Date(item.timestamp) >= startDate
        );
      }

      if (endDate) {
        rawData = rawData.filter((item) => new Date(item.timestamp) <= endDate);
      }

      // パラメータの値を取得し、時系列に整形
      interface ChartDataPoint {
        timestamp: string;
        value: number;
      }

      const chartData: ChartDataPoint[] = rawData
        .filter((item) => item[paramId] !== undefined)
        .map((item) => ({
          timestamp: item.timestamp,
          value: item[paramId],
        }))
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

      // 間隔に応じてデータを集計
      if (interval === "hour") {
        return chartData; // 時間単位ならそのまま返す
      }

      // 日・週・月単位の集計
      const aggregatedData: ChartDataPoint[] = [];
      const groupedData: Record<string, number[]> = {};

      chartData.forEach((point) => {
        const date = new Date(point.timestamp);
        let key: string;

        switch (interval) {
          case "day":
            key = date.toISOString().split("T")[0]; // YYYY-MM-DD
            break;
          case "week":
            // その週の月曜日を起点とする
            const dayOfWeek = date.getDay() || 7; // 0が日曜日なので、1-7に変換（月曜日が1）
            const monday = new Date(date);
            monday.setDate(date.getDate() - (dayOfWeek - 1));
            key = monday.toISOString().split("T")[0]; // 週の月曜日
            break;
          case "month":
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
              2,
              "0"
            )}`; // YYYY-MM
            break;
          default:
            key = date.toISOString();
        }

        if (!groupedData[key]) {
          groupedData[key] = [];
        }

        groupedData[key].push(point.value);
      });

      // グループごとに平均値を計算
      Object.entries(groupedData).forEach(([key, values]) => {
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;

        // キーを日付に戻す
        let timestamp: string;
        switch (interval) {
          case "day":
            timestamp = `${key}T12:00:00.000Z`; // その日の正午
            break;
          case "week":
            timestamp = `${key}T12:00:00.000Z`; // その週の月曜日の正午
            break;
          case "month":
            const [year, month] = key.split("-");
            timestamp = `${year}-${month}-15T12:00:00.000Z`; // その月の15日の正午
            break;
          default:
            timestamp = key;
        }

        aggregatedData.push({
          timestamp,
          value: Number(avg.toFixed(2)),
        });
      });

      return aggregatedData.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    },
    [isLoading, error, dataStore]
  );

  return {
    isLoading,
    error,
    getTimeSeriesData,
  };
}
