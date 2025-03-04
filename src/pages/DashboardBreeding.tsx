import { useState, useEffect } from "react";
import { Menu, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { PAGE_TITLES } from "../constants/routes";
import { COLORS, STATUS, STATUS_DISPLAY, StatusType } from "../constants/ui";
import { Tabs, TabsList, TabsTrigger } from "../components/tabs";
import { PageContainer } from "../components/PageContainer";
import { useMasterData, useBreedingData } from "../hooks/useDataStore";
import { BreedingPlcData, ParameterDefinition } from "../types/dataModels";
import BreedingParameterTrendDialog from "./BreedingParameterTrendDialog";

// 飼育槽パラメータの定義
const BREEDING_PARAMETERS = [
  {
    id: "oxygenSaturation",
    name: "酸素飽和度",
    unit: "%",
  },
  {
    id: "ph",
    name: "pH",
    unit: "",
  },
  {
    id: "temperature",
    name: "水温",
    unit: "℃",
  },
] as const;

const DashboardBreeding = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, StatusType>>({});
  const [selectedTank, setSelectedTank] = useState("");

  // データフックから飼育槽データを取得
  const { masterData, isLoading: isMasterLoading } = useMasterData();
  const { breedingData, isLoading: isBreedingLoading } = useBreedingData();

  // 選択されたタンクの最新データ
  const [latestTankData, setLatestTankData] = useState<
    Record<string, BreedingPlcData | null>
  >({});

  // パラメータトレンドダイアログの状態
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedParameter, setSelectedParameter] =
    useState<ParameterDefinition | null>(null);

  // ページ読み込み時に最初のタンクを選択
  useEffect(() => {
    if (!isMasterLoading && masterData.tanks.length > 0) {
      const breedingTanks = masterData.tanks.filter(
        (tank) => tank.type === "breeding" && tank.active
      );

      if (breedingTanks.length > 0 && !selectedTank) {
        setSelectedTank(breedingTanks[0].id);
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
    for (const paramId of ["oxygenSaturation", "ph", "temperature"]) {
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

    setStatuses(newStatuses);
  };

  // ステータスアイコンを取得
  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case STATUS.WARNING:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case STATUS.ERROR:
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <TrendingUp className="h-5 w-5 text-emerald-500" />;
    }
  };

  // ステータスに応じたスタイルを取得
  const getStatusStyle = (status: StatusType) => {
    switch (status) {
      case STATUS.WARNING:
        return "bg-yellow-50 border-yellow-200";
      case STATUS.ERROR:
        return "bg-red-50 border-red-200";
      default:
        return "bg-emerald-50 border-emerald-200";
    }
  };

  // パラメータカードクリック時のハンドラ
  const handleParameterClick = (paramId: string) => {
    const param = masterData.parameters.find((p) => p.id === paramId);
    if (param) {
      setSelectedParameter(param);
      setIsDialogOpen(true);
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
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8 p-2">
        <Tabs value={selectedTank} className="w-full">
          <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden">
            <TabsList className="flex justify-start space-x-2">
              {breedingTanks.map((tank) => (
                <TabsTrigger
                  key={tank.id}
                  value={tank.id}
                  onClick={() => setSelectedTank(tank.id)}
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white 
                             px-4 py-2 rounded-xl bg-slate-100 text-slate-600 
                             hover:bg-slate-200 transition-all duration-200"
                >
                  {tank.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      </div>

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

          {/* パラメータグリッド */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BREEDING_PARAMETERS.map((param) => {
              const status = statuses[param.id] || STATUS.NORMAL;
              const statusInfo = STATUS_DISPLAY[status];
              const value = currentTankData[
                param.id as keyof BreedingPlcData
              ] as number;

              return (
                <div
                  key={param.id}
                  className={`
                    relative p-6 rounded-2xl border 
                    ${getStatusStyle(status)}
                    transition-all duration-300 hover:shadow-md cursor-pointer
                  `}
                  onClick={() => handleParameterClick(param.id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-slate-700">
                        {param.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {statusInfo.text}
                      </p>
                    </div>
                    {getStatusIcon(status)}
                  </div>

                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-slate-800">
                      {value.toFixed(1)}
                    </span>
                    <span className="ml-2 text-slate-600">{param.unit}</span>
                  </div>

                  <div className="mt-2 flex items-center text-xs text-slate-500">
                    <span>
                      {/* パラメータ定義を取得して基準値を表示 */}
                      {(() => {
                        const paramDef = masterData.parameters.find(
                          (p) => p.id === param.id
                        );
                        if (paramDef) {
                          return `基準値: ${paramDef.normalMin} ~ ${paramDef.normalMax}${param.unit}`;
                        }
                        return "基準値: -";
                      })()}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl overflow-hidden">
                    <div
                      className={`
                        h-full transition-all duration-300
                        ${status === STATUS.ERROR ? "bg-red-500" : ""}
                        ${status === STATUS.WARNING ? "bg-yellow-500" : ""}
                        ${status === STATUS.NORMAL ? "bg-emerald-500" : ""}
                      `}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-40 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-lg text-gray-500">
            選択された水槽のデータがありません
          </p>
        </div>
      )}

      {/* パラメータトレンドチャートダイアログ */}
      {selectedParameter && isDialogOpen && (
        <BreedingParameterTrendDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedParameter(null);
          }}
          parameter={selectedParameter}
          tankId={selectedTank}
          breedingData={breedingData}
          tanks={breedingTanks}
        />
      )}
    </PageContainer>
  );
};

export default DashboardBreeding;
