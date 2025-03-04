import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { PAGE_TITLES } from "../../constants/routes";
import { COLORS, STATUS, STATUS_DISPLAY, StatusType } from "../../constants/ui";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent } from "../../components/ui/card";
import { PageContainer } from "../../components/layouts/PageContainer";
import { useMasterData, useEquipmentData } from "../../hooks/useDataStore";
import { EquipmentData, ParameterDefinition } from "../../types/dataModels";
import ParameterTrendChart from "../../components/charts/ParameterTrendChart";

const DashboardEquipment = () => {
  // 詳細ダイアログの表示状態
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedParameter, setSelectedParameter] =
    useState<ParameterDefinition | null>(null);

  // 選択中のライン
  const [selectedLineId, setSelectedLineId] = useState<string>("");

  // データフックから最新データを取得
  const { masterData, isLoading: isMasterLoading } = useMasterData();
  const { equipmentData, isLoading: isEquipmentLoading } = useEquipmentData();

  // パラメータステータスの状態管理
  const [statuses, setStatuses] = useState<Record<string, StatusType>>({});

  // 最新のろ過部データを取得
  const [latestEquipmentData, setLatestEquipmentData] = useState<
    Record<string, EquipmentData | null>
  >({});

  // ページ読み込み時に最初のラインを選択
  useEffect(() => {
    if (!isMasterLoading && masterData.lines.length > 0) {
      const activeLine = masterData.lines.find((line) => line.active);
      if (activeLine && !selectedLineId) {
        setSelectedLineId(activeLine.id);
      }
    }
  }, [isMasterLoading, masterData.lines, selectedLineId]);

  // 最新データの取得
  useEffect(() => {
    if (isEquipmentLoading) return;

    // 各ライン別に最新のデータを取得する
    const latestData: Record<string, EquipmentData | null> = {};

    masterData.lines.forEach((line) => {
      const lineData = equipmentData
        .filter((data) => data.lineId === line.id)
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

      latestData[line.id] = lineData.length > 0 ? lineData[0] : null;
    });

    setLatestEquipmentData(latestData);

    // 選択中のラインのデータからステータスを計算
    if (selectedLineId && latestData[selectedLineId]) {
      calculateStatuses(latestData[selectedLineId]!);
    }
  }, [isEquipmentLoading, equipmentData, selectedLineId, masterData.lines]);

  // パラメータの状態を計算
  const calculateStatuses = (data: EquipmentData) => {
    const newStatuses: Record<string, StatusType> = {};

    // パラメータ定義を取得
    masterData.parameters.forEach((param) => {
      // パラメータに対応するデータの値を取得
      const value = data[param.id as keyof EquipmentData];

      // 数値のパラメータのみチェック
      if (typeof value === "number") {
        if (value < param.dangerMin || value > param.dangerMax) {
          newStatuses[param.id] = STATUS.ERROR;
        } else if (value < param.warningMin || value > param.warningMax) {
          newStatuses[param.id] = STATUS.WARNING;
        } else {
          newStatuses[param.id] = STATUS.NORMAL;
        }
      }
    });

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
  const handleParameterClick = (param: ParameterDefinition) => {
    setSelectedParameter(param);
    setIsDialogOpen(true);
  };

  // ローディング表示
  if (isMasterLoading || isEquipmentLoading) {
    return (
      <PageContainer title={PAGE_TITLES.DASHBOARD_EQUIPMENT}>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-gray-500">データをロード中...</p>
        </div>
      </PageContainer>
    );
  }

  // データ表示対象のパラメータを定義
  const displayParameters = masterData.parameters
    .filter((param) =>
      [
        "residualChlorine1",
        "residualChlorine2",
        "ammonia",
        "current",
        "flowRate",
      ].includes(param.id)
    )
    .sort((a, b) => a.id.localeCompare(b.id));

  // 現在のラインのデータ
  const currentLineData = selectedLineId
    ? latestEquipmentData[selectedLineId]
    : null;

  console.log("masterData parameters:", masterData.parameters);

  return (
    <PageContainer title={PAGE_TITLES.DASHBOARD_EQUIPMENT}>
      {/* ライン選択タブ */}
      <div
        className={`bg-white rounded-2xl shadow-sm border ${COLORS.border.primary} mb-8 p-2`}
      >
        <Tabs
          value={selectedLineId}
          onValueChange={setSelectedLineId}
          className="w-full"
        >
          <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden">
            <TabsList className="flex justify-start space-x-2">
              {masterData.lines
                .filter((line) => line.active)
                .sort((a, b) => a.order - b.order)
                .map((line) => (
                  <TabsTrigger
                    key={line.id}
                    value={line.id}
                    className="data-[state=active]:bg-blue-500 data-[state=active]:text-white 
                             px-4 py-2 rounded-xl bg-slate-100 text-slate-600 
                             hover:bg-slate-200 transition-all duration-200"
                  >
                    {line.name}
                  </TabsTrigger>
                ))}
            </TabsList>
          </div>
        </Tabs>
      </div>

      {/* ライン情報表示 */}
      {currentLineData ? (
        <>
          {/* 極性と最終更新時間情報 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 px-2">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="px-4 py-2 bg-blue-50 rounded-lg">
                <span className="font-medium">極性: </span>
                <span className="font-semibold">
                  {currentLineData.polarity}
                </span>
              </div>
              <div className="px-4 py-2 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">
                  最終更新:{" "}
                  {new Date(currentLineData.timestamp).toLocaleString("ja-JP")}
                </span>
              </div>
            </div>
          </div>

          {/* パラメータグリッド */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayParameters.map((param) => {
              const status = statuses[param.id] || STATUS.NORMAL;
              const statusInfo = STATUS_DISPLAY[status];
              const value = currentLineData[param.id as keyof EquipmentData];
              const isNumericValue = typeof value === "number";

              return (
                <div
                  key={param.id}
                  className={`
                    relative p-6 rounded-2xl border 
                    ${getStatusStyle(status)}
                    transition-all duration-300 hover:shadow-md cursor-pointer
                  `}
                  onClick={() => handleParameterClick(param)}
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
                    {isNumericValue ? (
                      <>
                        <span className="text-4xl font-bold text-slate-800">
                          {param.id === "ammonia"
                            ? (value as number).toFixed(2)
                            : (value as number).toFixed(1)}
                        </span>
                        <span className="ml-2 text-slate-600">
                          {param.unit}
                        </span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold text-slate-800">
                        {String(value)}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex items-center text-xs text-slate-500">
                    <span>
                      基準値: {param.normalMin} ~ {param.normalMax}
                      {param.unit}
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

            {/* 水温表示カード */}
            {currentLineData &&
              typeof currentLineData.temperature === "number" && (
                <div
                  className={`
                  relative p-6 rounded-2xl border 
                  ${getStatusStyle(statuses["temperature"] || STATUS.NORMAL)}
                  transition-all duration-300 hover:shadow-md cursor-pointer
                `}
                  onClick={() => {
                    const tempParam = masterData.parameters.find(
                      (p) => p.id === "temperature"
                    );
                    if (tempParam) {
                      handleParameterClick(tempParam);
                    }
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-slate-700">
                        水温
                      </h3>
                      <p className="text-sm text-slate-500">
                        {
                          STATUS_DISPLAY[
                            statuses["temperature"] || STATUS.NORMAL
                          ].text
                        }
                      </p>
                    </div>
                    {getStatusIcon(statuses["temperature"] || STATUS.NORMAL)}
                  </div>

                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-slate-800">
                      {currentLineData.temperature.toFixed(1)}
                    </span>
                    <span className="ml-2 text-slate-600">℃</span>
                  </div>

                  <div className="mt-2 flex items-center text-xs text-slate-500">
                    <span>
                      基準値:{" "}
                      {masterData.parameters.find((p) => p.id === "temperature")
                        ?.normalMin || "-"}{" "}
                      ~{" "}
                      {masterData.parameters.find((p) => p.id === "temperature")
                        ?.normalMax || "-"}
                      ℃
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl overflow-hidden">
                    <div
                      className={`
                      h-full transition-all duration-300
                      ${
                        statuses["temperature"] === STATUS.ERROR
                          ? "bg-red-500"
                          : ""
                      }
                      ${
                        statuses["temperature"] === STATUS.WARNING
                          ? "bg-yellow-500"
                          : ""
                      }
                      ${
                        statuses["temperature"] === STATUS.NORMAL
                          ? "bg-emerald-500"
                          : ""
                      }
                    `}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              )}
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-lg text-gray-500">
              選択されたラインのデータがありません
            </p>
          </CardContent>
        </Card>
      )}

      {/* パラメータトレンドチャートモーダル */}
      {selectedParameter && isDialogOpen && (
        <ParameterTrendChart
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedParameter(null);
          }}
          parameter={selectedParameter}
          lineId={selectedLineId}
          equipmentData={equipmentData}
        />
      )}
    </PageContainer>
  );
};

export default DashboardEquipment;
