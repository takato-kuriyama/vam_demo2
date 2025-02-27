// src/data/mockDataStore.ts
import { generateYearData } from "./generateData";
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

// 実際のアプリケーションでは、以下のようなデータはAPI呼び出し等で取得する
// ここではモックデータを使用
interface MockDataStore {
  equipmentData: EquipmentData[];
  breedingPlcData: BreedingPlcData[];
  feedingData: FeedingData[];
  fishCountData: FishCountData[];
  packTestData: PackTestData[];
  alerts: AlertData[];
  masterData: {
    lines: LineMaster[];
    tanks: TankMaster[];
    parameterDefinitions: ParameterDefinition[];
    alertMasters: AlertMaster[];
  };
  isLoaded: boolean;
}

// シングルトンパターンで実装したデータストア
class DataStoreImpl {
  private static instance: DataStoreImpl;
  private _data: MockDataStore = {
    equipmentData: [],
    breedingPlcData: [],
    feedingData: [],
    fishCountData: [],
    packTestData: [],
    alerts: [],
    masterData: {
      lines: [],
      tanks: [],
      parameterDefinitions: [],
      alertMasters: [],
    },
    isLoaded: false,
  };

  private constructor() {
    // シングルトンなのでプライベートコンストラクタ
  }

  public static getInstance(): DataStoreImpl {
    if (!DataStoreImpl.instance) {
      DataStoreImpl.instance = new DataStoreImpl();
    }
    return DataStoreImpl.instance;
  }

  // データの遅延ロード
  public async loadData(): Promise<void> {
    if (this._data.isLoaded) return;

    console.log("データを生成中...");
    // 実際にはここでAPIリクエストを行う
    // ここではモックデータを生成
    try {
      const generatedData = generateYearData();
      this._data = {
        ...generatedData,
        isLoaded: true,
      };
      console.log("データ生成完了:", {
        equipment: this._data.equipmentData.length,
        breeding: this._data.breedingPlcData.length,
        feeding: this._data.feedingData.length,
        fishCount: this._data.fishCountData.length,
        packTest: this._data.packTestData.length,
        alerts: this._data.alerts.length,
      });
    } catch (error) {
      console.error("データ生成エラー:", error);
      throw error;
    }
  }

  // データへのアクセサ
  get data(): MockDataStore {
    return this._data;
  }

  // アラートを解決済みとしてマーク
  resolveAlert(alertId: string): void {
    const alertIndex = this._data.alerts.findIndex(
      (alert) => alert.id === alertId
    );
    if (alertIndex !== -1) {
      this._data.alerts[alertIndex] = {
        ...this._data.alerts[alertIndex],
        resolved: true,
        resolvedAt: new Date().toISOString(),
      };
    }
  }

  // 単純なデータ更新メソッド (実際にはもっと複雑なロジックが必要)
  updateMasterData<T extends keyof MockDataStore["masterData"]>(
    type: T,
    id: string,
    updates: Partial<MockDataStore["masterData"][T][0]>
  ): void {
    const index = this._data.masterData[type].findIndex(
      (item) => item.id === id
    );
    if (index !== -1) {
      this._data.masterData[type][index] = {
        ...this._data.masterData[type][index],
        ...updates,
      };
    }
  }

  // 新しい手入力データの追加 (例: 給餌データ)
  addFeedingData(data: Omit<FeedingData, "id">): string {
    const id = `feeding_${Date.now()}`;
    this._data.feedingData.push({
      id,
      ...data,
    });
    return id;
  }

  // 尾数データの追加
  addFishCountData(data: Omit<FishCountData, "id">): string {
    const id = `fishcount_${Date.now()}`;
    this._data.fishCountData.push({
      id,
      ...data,
    });
    return id;
  }

  // パックテストデータの追加
  addPackTestData(data: Omit<PackTestData, "id">): string {
    const id = `packtest_${Date.now()}`;
    this._data.packTestData.push({
      id,
      ...data,
    });
    return id;
  }

  // データ検索用のユーティリティメソッド

  // 日付範囲でフィルタリングする汎用関数
  private filterByDateRange<T extends { timestamp: string }>(
    data: T[],
    startDate?: Date,
    endDate?: Date
  ): T[] {
    if (!startDate && !endDate) return data;

    return data.filter((item) => {
      const itemDate = new Date(item.timestamp);
      if (startDate && itemDate < startDate) return false;
      if (endDate && itemDate > endDate) return false;
      return true;
    });
  }

  // 特定の飼育槽のPLCデータを取得
  getBreedingPlcDataForTank(
    tankId: string,
    startDate?: Date,
    endDate?: Date
  ): BreedingPlcData[] {
    const filteredByTank = this._data.breedingPlcData.filter(
      (data) => data.tankId === tankId
    );
    return this.filterByDateRange(filteredByTank, startDate, endDate);
  }

  // 特定のラインの設備データを取得
  getEquipmentDataForLine(
    lineId: string,
    startDate?: Date,
    endDate?: Date
  ): EquipmentData[] {
    const filteredByLine = this._data.equipmentData.filter(
      (data) => data.lineId === lineId
    );
    return this.filterByDateRange(filteredByLine, startDate, endDate);
  }

  // 特定の日のデータを取得するヘルパー
  getDataForDate(date: Date): {
    equipment: EquipmentData[];
    breedingPlc: BreedingPlcData[];
    feeding: FeedingData[];
    fishCount: FishCountData[];
    packTest: PackTestData[];
    alerts: AlertData[];
  } {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return {
      equipment: this.filterByDateRange(
        this._data.equipmentData,
        startOfDay,
        endOfDay
      ),
      breedingPlc: this.filterByDateRange(
        this._data.breedingPlcData,
        startOfDay,
        endOfDay
      ),
      feeding: this.filterByDateRange(
        this._data.feedingData,
        startOfDay,
        endOfDay
      ),
      fishCount: this.filterByDateRange(
        this._data.fishCountData,
        startOfDay,
        endOfDay
      ),
      packTest: this.filterByDateRange(
        this._data.packTestData,
        startOfDay,
        endOfDay
      ),
      alerts: this.filterByDateRange(this._data.alerts, startOfDay, endOfDay),
    };
  }

  // 特定のタンクの最新の測定値を取得
  getLatestBreedingDataForTank(tankId: string): BreedingPlcData | null {
    const tankData = this._data.breedingPlcData
      .filter((data) => data.tankId === tankId)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

    return tankData.length > 0 ? tankData[0] : null;
  }

  // 特定のラインの最新の設備データを取得
  getLatestEquipmentDataForLine(lineId: string): EquipmentData | null {
    const lineData = this._data.equipmentData
      .filter((data) => data.lineId === lineId)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

    return lineData.length > 0 ? lineData[0] : null;
  }

  // アラートの統計情報を取得
  getAlertStats(): {
    total: number;
    unresolved: number;
    byLine: Record<string, { total: number; unresolved: number }>;
  } {
    const stats = {
      total: this._data.alerts.length,
      unresolved: this._data.alerts.filter((alert) => !alert.resolved).length,
      byLine: {} as Record<string, { total: number; unresolved: number }>,
    };

    // ラインごとの統計
    this._data.masterData.lines.forEach((line) => {
      const lineAlerts = this._data.alerts.filter(
        (alert) => alert.lineId === line.id
      );
      stats.byLine[line.id] = {
        total: lineAlerts.length,
        unresolved: lineAlerts.filter((alert) => !alert.resolved).length,
      };
    });

    return stats;
  }

  // 本日の給餌合計
  getTodayFeedingTotal(): Record<string, number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayFeeding = this._data.feedingData.filter((data) => {
      const feedingDate = new Date(data.timestamp);
      feedingDate.setHours(0, 0, 0, 0);
      return feedingDate.getTime() === today.getTime();
    });

    const totals: Record<string, number> = {};

    // ラインごとに合計
    this._data.masterData.lines.forEach((line) => {
      const lineTanks = this._data.masterData.tanks
        .filter((tank) => tank.lineId === line.id && tank.type === "breeding")
        .map((tank) => tank.id);

      const lineFeedingData = todayFeeding.filter((data) =>
        lineTanks.includes(data.tankId)
      );

      // 各タンクの給餌量を合計
      const totalAmount = lineFeedingData.reduce((total, item) => {
        return total + item.feedAmount1 + item.feedAmount2;
      }, 0);

      totals[line.id] = totalAmount;
    });

    return totals;
  }
}

// エクスポート用のインスタンス
export const DataStore = DataStoreImpl.getInstance();

// クライアント側での使用例:
// await DataStore.loadData();
// const latestData = DataStore.getLatestBreedingDataForTank('A-1');
