import { useState, useEffect } from "react";
import { PAGE_TITLES } from "../../constants/routes";
import { COLORS, STATUS, STATUS_DISPLAY, StatusType } from "../../constants/ui";
import { PageContainer } from "../../components/layouts/PageContainer";
import { useMasterData, useBreedingData } from "../../hooks/useDataStore";
import { BreedingPlcData, ParameterDefinition } from "../../types/dataModels";
import BreedingParameterTrendDialog from "../../components/charts/BreedingParameterTrendDialog";
// 手入力データ用のダイアログをインポート
import ManualParameterTrendDialog from "../../components/charts/ManualParameterTrendDialog";
import { ParameterCard } from "../../components/features/ParameterCard";
import { TabContainer } from "../../components/ui/tab-container";
import {
  MANUAL_PARAMETERS,
  getManualParameterById,
} from "../../constants/masterData/parameters";
// 成長推移・飼料効率グラフコンポーネントをインポート
import GrowthEfficiencyCharts from "../../components/charts/GrowthEfficiencyCharts";

// 飼育槽パラメータの定義
const BREEDING_PARAMETERS = [
  {
    id: "do",
    name: "DO",
    unit: "mg/L",
  },
  {
    id: "temperature",
    name: "水温",
    unit: "℃",
  },
] as const;

// 手入力パラメータの定義
const MANUAL_PARAMETERS_UI = [
  {
    id: "nh4",
    name: "NH4",
    unit: "mg/L",
  },
  {
    id: "no2",
    name: "NO2",
    unit: "mg/L",
  },
  {
    id: "no3",
    name: "NO3",
    unit: "mg/L",
  },
  {
    id: "tClo",
    name: "T-ClO",
    unit: "mg/L",
  },
  {
    id: "cloDp",
    name: "ClO-DP",
    unit: "mg/L",
  },
  {
    id: "ph",
    name: "pH",
    unit: "",
  },
] as const;

// テスト用の手入力データを生成する関数
const generateMockManualData = (tankIds: string[]) => {
  const data = [];
  const now = new Date();

  // 過去30日分のデータを生成
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // 各タンクごとにデータを生成
    for (const tankId of tankIds) {
      // 1日1回のデータを想定
      data.push({
        id: `manual-${tankId}-${i}`,
        timestamp: date.toISOString(),
        tankId: tankId,
        nh4: Math.random() * 0.1 + 0.02,
        no2: Math.random() * 0.08 + 0.01,
        no3: Math.random() * 10 + 2,
        tClo: Math.random() * 0.15 + 0.05,
        cloDp: Math.random() * 0.1 + 0.02,
        ph: Math.random() * 1 + 6.8,
      });
    }
  }

  return data;
};

const DashboardBreeding = () => {
  const [statuses, setStatuses] = useState<Record<string, StatusType>>({});
  const [selectedTank, setSelectedTank] = useState("");

  // データフックから飼育槽データを取得
  const { masterData, isLoading: isMasterLoading } = useMasterData();
  const { breedingData, isLoading: isBreedingLoading } = useBreedingData();

  // 選択されたタンクの最新データ
  const [latestTankData, setLatestTankData] = useState<
    Record<string, BreedingPlcData | null>
  >({});

  // 手入力データ（ダミー）
  const [manualInputData, setManualInputData] = useState<
    Record<string, number>
  >({
    nh4: 0.05,
    no2: 0.02,
    no3: 5.1,
    tClo: 0.12,
    cloDp: 0.08,
    ph: 7.2,
  });

  // モック手入力データ
  const [mockManualData, setMockManualData] = useState<any[]>([]);

  // PLCパラメータトレンドダイアログの状態
  const [isPlcDialogOpen, setIsPlcDialogOpen] = useState(false);
  const [selectedPlcParameter, setSelectedPlcParameter] =
    useState<ParameterDefinition | null>(null);

  // 手入力パラメータトレンドダイアログの状態
  const [isManualDialogOpen, setIsManualDialogOpen] = useState(false);
  const [selectedManualParameter, setSelectedManualParameter] =
    useState<any>(null);

  // ページ読み込み時に最初のタンクを選択
  useEffect(() => {
    if (!isMasterLoading && masterData.tanks.length > 0) {
      const breedingTanks = masterData.tanks.filter(
        (tank) => tank.type === "breeding" && tank.active
      );

      if (breedingTanks.length > 0 && !selectedTank) {
        setSelectedTank(breedingTanks[0].id);

        // モック手入力データを生成
        const tankIds = breedingTanks.map((tank) => tank.id);
        setMockManualData(generateMockManualData(tankIds));
      }
    }
  }, [isMasterLoading, masterData.tanks, selectedTank]);

  // 飼育槽データの処理
  useEffect(() => {
    if (isBreedingLoading) return;

    // 各タンク別に最新のデータを取得する
    const latestData: Record<string, BreedingPlcData | null> = {};

    // 飼育槽タンクをフィルタリング
    const breedingTanks = masterData.tanks.filter(
      (tank) => tank.type === "breeding" && tank.active
    );

    breedingTanks.forEach((tank) => {
      const tankData = breedingData
        .filter((data) => data.tankId === tank.id)
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

      latestData[tank.id] = tankData.length > 0 ? tankData[0] : null;
    });

    setLatestTankData(latestData);

    // パラメータステータスの計算
    calculateStatuses();
  }, [isBreedingLoading, breedingData, masterData.tanks, selectedTank]);

  // パラメータの状態を計算
  const calculateStatuses = () => {
    const newStatuses: Record<string, StatusType> = {};

    // 各パラメータの定義を取得
    for (const paramId of ["do", "temperature"]) {
      const param = masterData.parameters.find((p) => p.id === paramId);
      if (!param) continue;

      // 選択中のタンクのデータを取得
      const tankData = selectedTank ? latestTankData[selectedTank] : null;
      if (!tankData) continue;

      // パラメータの値を取得
      const value = tankData[paramId as keyof BreedingPlcData];
      if (typeof value !== "number") continue;

      // ステータスの判定
      if (value < param.dangerMin || value > param.dangerMax) {
        newStatuses[paramId] = STATUS.ERROR;
      } else if (value < param.warningMin || value > param.warningMax) {
        newStatuses[paramId] = STATUS.WARNING;
      } else {
        newStatuses[paramId] = STATUS.NORMAL;
      }
    }

    // 手入力パラメータのステータス（ダミー）
    MANUAL_PARAMETERS_UI.forEach((param) => {
      const value = manualInputData[param.id];
      // ダミーのステータス判定（実際にはマスターデータから基準値を取得）
      newStatuses[param.id] =
        Math.random() > 0.7
          ? STATUS.NORMAL
          : Math.random() > 0.5
          ? STATUS.WARNING
          : STATUS.ERROR;
    });

    setStatuses(newStatuses);
  };

  // PLCパラメータカードクリック時のハンドラ
  const handlePlcParameterClick = (paramId: string) => {
    const param = masterData.parameters.find((p) => p.id === paramId);
    if (param) {
      setSelectedPlcParameter(param);
      setIsPlcDialogOpen(true);
    }
  };

  // 手入力パラメータカードクリック時のハンドラ
  const handleManualParameterClick = (paramId: string) => {
    const param = getManualParameterById(paramId);
    if (param) {
      setSelectedManualParameter(param);
      setIsManualDialogOpen(true);
    }
  };

  // ローディング表示
  if (isMasterLoading || isBreedingLoading) {
    return (
      <PageContainer title={PAGE_TITLES.DASHBOARD_BREEDING}>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-gray-500">データをロード中...</p>
        </div>
      </PageContainer>
    );
  }

  // 飼育槽タンクをフィルタリングして取得
  const breedingTanks = masterData.tanks
    .filter((tank) => tank.type === "breeding" && tank.active)
    .sort((a, b) => {
      // ラインIDでソート（A, B, ...）
      const lineComparison = a.lineId.localeCompare(b.lineId);
      if (lineComparison !== 0) return lineComparison;

      // 同じラインなら順序番号でソート
      return a.order - b.order;
    });

  // 現在のタンクのデータ
  const currentTankData = selectedTank ? latestTankData[selectedTank] : null;

  return (
    <PageContainer title={PAGE_TITLES.DASHBOARD_BREEDING}>
      {/* 水槽選択 */}
      <TabContainer
        items={breedingTanks.map((tank) => ({
          id: tank.id,
          label: tank.name,
        }))}
        activeTab={selectedTank}
        onTabChange={setSelectedTank}
        className="mb-6"
      />

      {currentTankData ? (
        <>
          {/* 最終更新時間情報 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 px-2">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="px-4 py-2 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">
                  最終更新:{" "}
                  {new Date(currentTankData.timestamp).toLocaleString("ja-JP")}
                </span>
              </div>
            </div>
          </div>

          {/* PLCパラメータグリッド */}
          <h3 className="text-lg font-medium mb-4">PLCデータ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {BREEDING_PARAMETERS.map((param) => {
              const status = statuses[param.id] || STATUS.NORMAL;
              const statusInfo = STATUS_DISPLAY[status];
              // DOデータは現在持っていないのでダミーで表示
              const value =
                param.id === "do"
                  ? 7.5 // DOはダミーデータ
                  : (currentTankData[
                      param.id as keyof BreedingPlcData
                    ] as number);
              const paramDef = masterData.parameters.find(
                (p) => p.id === param.id
              );

              return (
                <ParameterCard
                  key={param.id}
                  name={param.name}
                  value={value}
                  unit={param.unit}
                  status={status}
                  statusText={statusInfo.text}
                  normalMin={paramDef?.normalMin}
                  normalMax={paramDef?.normalMax}
                  onClick={() => handlePlcParameterClick(param.id)}
                />
              );
            })}
          </div>

          {/* 手入力パラメータグリッド */}
          <h3 className="text-lg font-medium mb-4">手入力データ</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {MANUAL_PARAMETERS_UI.map((param) => {
              const status = statuses[param.id] || STATUS.NORMAL;
              const statusInfo = STATUS_DISPLAY[status];
              const value = manualInputData[param.id];
              const paramDef = getManualParameterById(param.id);

              return (
                <ParameterCard
                  key={param.id}
                  name={param.name}
                  value={value}
                  unit={param.unit}
                  status={status}
                  statusText={statusInfo.text}
                  normalMin={paramDef?.normalMin}
                  normalMax={paramDef?.normalMax}
                  onClick={() => handleManualParameterClick(param.id)}
                />
              );
            })}
          </div>

          {/* 成長推移・飼料効率グラフエリア - 新規追加 */}
          <div className="mt-8 mb-6">
            <GrowthEfficiencyCharts tankId={selectedTank} />
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-40 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-lg text-gray-500">
            選択された水槽のデータがありません
          </p>
        </div>
      )}

      {/* PLCパラメータトレンドチャートダイアログ */}
      {selectedPlcParameter && isPlcDialogOpen && (
        <BreedingParameterTrendDialog
          isOpen={isPlcDialogOpen}
          onClose={() => {
            setIsPlcDialogOpen(false);
            setSelectedPlcParameter(null);
          }}
          parameter={selectedPlcParameter}
          tankId={selectedTank}
          breedingData={breedingData}
          tanks={breedingTanks}
        />
      )}

      {/* 手入力パラメータトレンドチャートダイアログ */}
      {selectedManualParameter && isManualDialogOpen && (
        <ManualParameterTrendDialog
          isOpen={isManualDialogOpen}
          onClose={() => {
            setIsManualDialogOpen(false);
            setSelectedManualParameter(null);
          }}
          parameter={selectedManualParameter}
          tankId={selectedTank}
          manualData={mockManualData}
          tanks={breedingTanks}
        />
      )}
    </PageContainer>
  );
};

export default DashboardBreeding;
