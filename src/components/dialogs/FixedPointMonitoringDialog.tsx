import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { X, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { COLORS } from "../../constants/ui";
import { PARAMETERS } from "../../constants/masterData/parameters";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { EquipmentData, BreedingPlcData } from "../../types/dataModels";
import { useMasterData } from "../../hooks/useDataStore";

// 定点観測データの型定義
interface FixedPointData {
  id: string;
  date: Date;
  lineId: string;
  lineName: string;
  equipmentData: EquipmentData | null;
  breedingData: Record<string, BreedingPlcData | null>;
}

interface FixedPointMonitoringDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: FixedPointData;
}

export const FixedPointMonitoringDialog: React.FC<
  FixedPointMonitoringDialogProps
> = ({ isOpen, onClose, data }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { masterData, isLoading } = useMasterData();
  const [parameterThresholds, setParameterThresholds] = useState<
    Record<
      string,
      {
        warningMin: number;
        warningMax: number;
        dangerMin: number;
        dangerMax: number;
        unit: string;
      }
    >
  >({});
  //設備パラメータ
  const EQUIPMENT_PARAMETERS = PARAMETERS.filter((param) =>
    [
      "residualChlorine1",
      "residualChlorine2",
      "ammonia",
      "temperature",
      "current",
      "flowRate",
    ].includes(param.id)
  );

  // パラメータの基準値を設定
  useEffect(() => {
    if (!isLoading && masterData.parameters) {
      const thresholds: Record<string, any> = {};

      masterData.parameters.forEach((param) => {
        thresholds[param.id] = {
          warningMin: param.warningMin,
          warningMax: param.warningMax,
          dangerMin: param.dangerMin,
          dangerMax: param.dangerMax,
          unit: param.unit,
        };
      });

      setParameterThresholds(thresholds);
    }
  }, [isLoading, masterData]);

  const getTankOverallStatus = (tankData: BreedingPlcData) => {
    // すべての重要なパラメータをチェック
    const oxygenStatus = getStatusBackground(
      "oxygenSaturation",
      tankData.oxygenSaturation
    );
    const phStatus = getStatusBackground("ph", tankData.ph);
    const tempStatus = getStatusBackground("temperature", tankData.temperature);

    // 一つでも危険値があれば「異常値」
    if (
      oxygenStatus === "bg-red-200" ||
      phStatus === "bg-red-200" ||
      tempStatus === "bg-red-200"
    ) {
      return "danger";
    }

    // 一つでも警告値があれば「注意値」
    if (
      oxygenStatus === "bg-yellow-200" ||
      phStatus === "bg-yellow-200" ||
      tempStatus === "bg-yellow-200"
    ) {
      return "warning";
    }

    // それ以外は正常
    return "normal";
  };

  // 値の状態によって背景色を返す関数
  const getStatusBackground = (paramId: string, value: number) => {
    const thresholds = parameterThresholds[paramId];

    if (!thresholds) return "";

    if (value < thresholds.dangerMin || value > thresholds.dangerMax) {
      return "bg-red-200";
    } else if (value < thresholds.warningMin || value > thresholds.warningMax) {
      return "bg-yellow-200";
    }

    return "";
  };

  // 飼育槽のリストを取得
  const breedingTanks = Object.keys(data.breedingData)
    .map((tankId) => {
      const tank = masterData.tanks.find((t) => t.id === tankId);
      return {
        id: tankId,
        name: tank?.name || tankId,
        data: data.breedingData[tankId],
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between pr-4">
          <DialogTitle className="text-xl font-bold">
            {data.lineName} -{" "}
            {format(data.date, "yyyy/MM/dd (EEE)", { locale: ja })}
          </DialogTitle>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100 transition-colors bg-white"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="overview">概要</TabsTrigger>
            <TabsTrigger value="detail">詳細データ</TabsTrigger>
            <TabsTrigger value="images">水槽画像</TabsTrigger>
          </TabsList>

          {/* 概要タブ */}
          <TabsContent value="overview" className="space-y-6 p-1">
            <div className="space-y-6">
              {/* ろ過システムデータと飼育槽データの概要 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ろ過部データ概要 */}
                <div className="border rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">
                    ろ過部ステータス
                  </h3>
                  <div className="space-y-3">
                    {EQUIPMENT_PARAMETERS.map((param) => {
                      const value = data.equipmentData[param.id];
                      const statusBackground = getStatusBackground(
                        param.id,
                        value
                      );
                      const isWarning = statusBackground === "bg-yellow-200";
                      const isDanger = statusBackground === "bg-red-200";

                      return (
                        <div
                          key={param.id}
                          className="flex justify-between items-center"
                        >
                          <span className="font-medium w-1/3">
                            {param.name}
                          </span>
                          <span
                            className={`text-sm w-1/3 text-center ${
                              isDanger
                                ? "text-red-600 font-medium"
                                : isWarning
                                ? "text-yellow-600 font-medium"
                                : "text-gray-600"
                            }`}
                          >
                            {value.toFixed(param.id === "ammonia" ? 2 : 1)}
                            {param.unit}
                          </span>
                          <div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs w-1/3 text-right ${
                                isDanger
                                  ? "bg-red-100 text-red-800"
                                  : isWarning
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {isDanger
                                ? "異常値"
                                : isWarning
                                ? "注意値"
                                : "正常"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex justify-between items-center">
                      <span className="w-1/3">極性:</span>
                      <span className="w-1/3">
                        {data.equipmentData.polarity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 飼育槽のステータス概要 */}
                <div className="border rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">
                    飼育槽ステータス
                  </h3>
                  <div className="space-y-3">
                    {breedingTanks.map((tank) => (
                      <div key={tank.id} className="flex flex-col">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{tank.name}:</span>
                          {tank.data ? (
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                getTankOverallStatus(tank.data) === "danger"
                                  ? "bg-red-100 text-red-800"
                                  : getTankOverallStatus(tank.data) ===
                                    "warning"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {getTankOverallStatus(tank.data) === "danger"
                                ? "異常値"
                                : getTankOverallStatus(tank.data) === "warning"
                                ? "注意値"
                                : "正常"}
                            </span>
                          ) : (
                            <span className="text-gray-500 italic">
                              データなし
                            </span>
                          )}
                        </div>
                        {tank.data && (
                          <div className="text-sm text-gray-600 mt-1 pl-2 border-l-2 border-gray-200">
                            <span
                              className={
                                getTankOverallStatus(tank.data) === "danger"
                                  ? "text-red-600 font-medium"
                                  : getTankOverallStatus(tank.data) ===
                                    "warning"
                                  ? "text-yellow-600 font-medium"
                                  : ""
                              }
                            >
                              酸素: {tank.data.oxygenSaturation.toFixed(1)}%,
                              pH: {tank.data.ph.toFixed(1)}, 水温:{" "}
                              {tank.data.temperature.toFixed(1)}℃
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 現場写真サンプル */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">現場写真</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-500">ろ過部写真</span>
                    </div>
                  </div>
                  <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-500">水槽エリア写真</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("detail")}
                  className="flex items-center gap-1"
                >
                  詳細データを見る
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* 詳細データタブ */}
          <TabsContent value="detail" className="space-y-6 p-1">
            {/* ろ過システムデータ */}
            <div>
              <h3 className="text-lg font-semibold mb-4">ろ過部詳細データ</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 bg-gray-50 w-1/3">項目</th>
                      <th className="border p-2 bg-gray-50 w-1/3">測定値</th>
                      <th className="border p-2 bg-gray-50 w-1/3">基準値</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.equipmentData ? (
                      <>
                        <tr>
                          <td className="border p-2">残留塩素計値①</td>
                          <td
                            className={`border p-2 ${getStatusBackground(
                              "residualChlorine1",
                              data.equipmentData.residualChlorine1
                            )}`}
                          >
                            {data.equipmentData.residualChlorine1.toFixed(1)}
                            mg/L
                          </td>
                          <td className="border p-2">
                            {parameterThresholds["residualChlorine1"]
                              ?.warningMin || 2.5}
                            ～
                            {parameterThresholds["residualChlorine1"]
                              ?.warningMax || 4.5}
                            mg/L
                          </td>
                        </tr>
                        <tr>
                          <td className="border p-2">残留塩素計値②</td>
                          <td
                            className={`border p-2 ${getStatusBackground(
                              "residualChlorine2",
                              data.equipmentData.residualChlorine2
                            )}`}
                          >
                            {data.equipmentData.residualChlorine2.toFixed(1)}
                            mg/L
                          </td>
                          <td className="border p-2">
                            {parameterThresholds["residualChlorine2"]
                              ?.warningMin || 0.0}
                            ～
                            {parameterThresholds["residualChlorine2"]
                              ?.warningMax || 0.5}
                            mg/L
                          </td>
                        </tr>
                        <tr>
                          <td className="border p-2">アンモニア</td>
                          <td
                            className={`border p-2 ${getStatusBackground(
                              "ammonia",
                              data.equipmentData.ammonia
                            )}`}
                          >
                            {data.equipmentData.ammonia.toFixed(2)}ppm
                          </td>
                          <td className="border p-2">
                            {parameterThresholds["ammonia"]?.warningMin || 0.0}
                            ～
                            {parameterThresholds["ammonia"]?.warningMax || 0.8}
                            ppm
                          </td>
                        </tr>
                        <tr>
                          <td className="border p-2">電解電流値</td>
                          <td
                            className={`border p-2 ${getStatusBackground(
                              "current",
                              data.equipmentData.current
                            )}`}
                          >
                            {data.equipmentData.current.toFixed(1)}A
                          </td>
                          <td className="border p-2">
                            {parameterThresholds["current"]?.warningMin || 130}
                            ～
                            {parameterThresholds["current"]?.warningMax || 170}A
                          </td>
                        </tr>
                        <tr>
                          <td className="border p-2">流量値</td>
                          <td
                            className={`border p-2 ${getStatusBackground(
                              "flowRate",
                              data.equipmentData.flowRate
                            )}`}
                          >
                            {data.equipmentData.flowRate.toFixed(1)}L/min
                          </td>
                          <td className="border p-2">
                            {parameterThresholds["flowRate"]?.warningMin || 26}
                            ～
                            {parameterThresholds["flowRate"]?.warningMax || 34}
                            L/min
                          </td>
                        </tr>
                        <tr>
                          <td className="border p-2">水温</td>
                          <td
                            className={`border p-2 ${getStatusBackground(
                              "temperature",
                              data.equipmentData.temperature
                            )}`}
                          >
                            {data.equipmentData.temperature.toFixed(1)}℃
                          </td>
                          <td className="border p-2">
                            {parameterThresholds["temperature"]?.warningMin ||
                              23}
                            ～
                            {parameterThresholds["temperature"]?.warningMax ||
                              28}
                            ℃
                          </td>
                        </tr>
                        <tr>
                          <td className="border p-2">電解極性</td>
                          <td className="border p-2">
                            {data.equipmentData.polarity}
                          </td>
                          <td className="border p-2">-</td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="border p-2 text-center text-gray-500"
                        >
                          データがありません
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 飼育槽データ */}
            <div>
              <h3 className="text-lg font-semibold mb-4">飼育槽詳細データ</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 bg-gray-50">水槽</th>
                      {breedingTanks.map((tank) => (
                        <th key={tank.id} className="border p-2 bg-gray-50">
                          {tank.name}
                        </th>
                      ))}
                      <th className="border p-2 bg-gray-50">下限</th>
                      <th className="border p-2 bg-gray-50">上限</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">酸素飽和度</td>
                      {breedingTanks.map((tank) => (
                        <td
                          key={`${tank.id}-oxygen`}
                          className={`border p-2 ${
                            tank.data
                              ? getStatusBackground(
                                  "oxygenSaturation",
                                  tank.data.oxygenSaturation
                                )
                              : ""
                          }`}
                        >
                          {tank.data
                            ? `${tank.data.oxygenSaturation.toFixed(1)}%`
                            : "-"}
                        </td>
                      ))}
                      <td className="border p-2">
                        {parameterThresholds["oxygenSaturation"]?.warningMin ||
                          70}
                        %
                      </td>
                      <td className="border p-2">
                        {parameterThresholds["oxygenSaturation"]?.warningMax ||
                          100}
                        %
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2">pH</td>
                      {breedingTanks.map((tank) => (
                        <td
                          key={`${tank.id}-ph`}
                          className={`border p-2 ${
                            tank.data
                              ? getStatusBackground("ph", tank.data.ph)
                              : ""
                          }`}
                        >
                          {tank.data ? tank.data.ph.toFixed(1) : "-"}
                        </td>
                      ))}
                      <td className="border p-2">
                        {parameterThresholds["ph"]?.warningMin || 6.5}
                      </td>
                      <td className="border p-2">
                        {parameterThresholds["ph"]?.warningMax || 8.0}
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2">水温</td>
                      {breedingTanks.map((tank) => (
                        <td
                          key={`${tank.id}-temp`}
                          className={`border p-2 ${
                            tank.data
                              ? getStatusBackground(
                                  "temperature",
                                  tank.data.temperature
                                )
                              : ""
                          }`}
                        >
                          {tank.data
                            ? `${tank.data.temperature.toFixed(1)}℃`
                            : "-"}
                        </td>
                      ))}
                      <td className="border p-2">
                        {parameterThresholds["temperature"]?.warningMin || 23}℃
                      </td>
                      <td className="border p-2">
                        {parameterThresholds["temperature"]?.warningMax || 28}℃
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* 水槽画像タブ */}
          <TabsContent value="images" className="space-y-6 p-1">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-2">水槽画像一覧</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {breedingTanks.map((tank) => (
                  <div key={tank.id} className="flex flex-col">
                    <span className="font-medium mb-2">{tank.name}</span>
                    <div className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-gray-500">画像 {tank.name}</span>
                      </div>
                    </div>
                    {tank.data && (
                      <div className="mt-2 text-sm">
                        <div
                          className={`p-1 rounded ${
                            getStatusBackground(
                              "oxygenSaturation",
                              tank.data.oxygenSaturation
                            ) ||
                            getStatusBackground("ph", tank.data.ph) ||
                            getStatusBackground(
                              "temperature",
                              tank.data.temperature
                            )
                              ? "bg-red-50"
                              : "bg-green-50"
                          }`}
                        >
                          <span className="block">
                            酸素: {tank.data.oxygenSaturation.toFixed(1)}%
                          </span>
                          <span className="block">
                            pH: {tank.data.ph.toFixed(1)}
                          </span>
                          <span className="block">
                            水温: {tank.data.temperature.toFixed(1)}℃
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">ろ過システム</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-500">ろ過部全景</span>
                    </div>
                  </div>
                  <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-500">制御パネル</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
