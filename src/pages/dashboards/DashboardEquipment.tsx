import { useState, useEffect } from "react";
import { PAGE_TITLES } from "../../constants/routes";
import { COLORS, STATUS, STATUS_DISPLAY, StatusType } from "../../constants/ui";
import { Card, CardContent } from "../../components/ui/card";
import { PageContainer } from "../../components/layouts/PageContainer";
import { useMasterData, useEquipmentData } from "../../hooks/useDataStore";
import { EquipmentData, ParameterDefinition } from "../../types/dataModels";
import ParameterTrendChart from "../../components/charts/ParameterTrendChart";
import { ParameterCard } from "../../components/features/ParameterCard";
import { TabContainer } from "../../components/ui/tab-container";

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
      <TabContainer
        items={masterData.lines
          .filter((line) => line.active)
          .sort((a, b) => a.order - b.order)
          .map((line) => ({
            id: line.id,
            label: line.name,
          }))}
        activeTab={selectedLineId}
        onTabChange={setSelectedLineId}
        className="mb-6"
      />

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

              return isNumericValue ? (
                <ParameterCard
                  key={param.id}
                  name={param.name}
                  value={value as number}
                  unit={param.unit}
                  status={status}
                  statusText={statusInfo.text}
                  normalMin={param.normalMin}
                  normalMax={param.normalMax}
                  onClick={() => handleParameterClick(param)}
                />
              ) : null;
            })}

            {/* 水温表示カード */}
            {currentLineData &&
              typeof currentLineData.temperature === "number" && (
                <ParameterCard
                  key="temperature"
                  name="水温"
                  value={currentLineData.temperature}
                  unit="℃"
                  status={statuses["temperature"] || STATUS.NORMAL}
                  statusText={
                    STATUS_DISPLAY[statuses["temperature"] || STATUS.NORMAL]
                      .text
                  }
                  normalMin={
                    masterData.parameters.find((p) => p.id === "temperature")
                      ?.normalMin
                  }
                  normalMax={
                    masterData.parameters.find((p) => p.id === "temperature")
                      ?.normalMax
                  }
                  onClick={() => {
                    const tempParam = masterData.parameters.find(
                      (p) => p.id === "temperature"
                    );
                    if (tempParam) {
                      handleParameterClick(tempParam);
                    }
                  }}
                />
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
