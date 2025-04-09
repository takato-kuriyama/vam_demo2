import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, differenceInDays, subDays } from "date-fns";
import { ja } from "date-fns/locale";
import { TankMaster } from "../../types/dataModels";

// チャートの色パレット
const CHART_COLORS = [
  "#2196F3", // メインの水槽 (青)
  "#FF9800", // オレンジ
  "#4CAF50", // 緑
  "#9C27B0", // 紫
  "#F44336", // 赤
  "#3F51B5", // インディゴ
];

interface GrowthParameterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  parameterId: string;
  tankId: string;
  tanks: TankMaster[]; // 利用可能な水槽一覧
}

// 回帰分析の結果型
interface RegressionResult {
  slope: number;
  intercept: number;
  r2: number;
  regressionLineData: any[]; // 回帰直線のデータポイント
}

const GrowthParameterDialog: React.FC<GrowthParameterDialogProps> = ({
  isOpen,
  onClose,
  parameterId,
  tankId,
  tanks,
}) => {
  // 選択された水槽の管理
  const [selectedTanks, setSelectedTanks] = useState<string[]>([tankId]);
  // 各水槽のチャートデータ
  const [chartDataByTank, setChartDataByTank] = useState<Record<string, any[]>>(
    {}
  );
  // 各水槽の回帰分析結果
  const [regressionByTank, setRegressionByTank] = useState<
    Record<string, RegressionResult>
  >({});
  // 各水槽の池入れ日情報
  const [stockingDates, setStockingDates] = useState<Record<string, Date>>({});
  // 統合されたチャートデータ (経過日数ベース)
  const [combinedChartData, setCombinedChartData] = useState<any[]>([]);

  // タイトルと単位を決定
  const isWeightParam = parameterId === "averageWeight";
  const title = isWeightParam ? "平均魚体重推移" : "餌料効率推移";
  const unit = isWeightParam ? "g" : "%";

  // 水槽を選択/解除する処理
  const handleTankToggle = (toggledTankId: string) => {
    setSelectedTanks((prev) => {
      if (prev.includes(toggledTankId)) {
        // 主要タンク（最初の選択）は削除できないようにする
        if (toggledTankId === tankId && prev.length === 1) return prev;
        return prev.filter((id) => id !== toggledTankId);
      } else {
        return [...prev, toggledTankId];
      }
    });
  };

  // データ生成（本来はAPI等から取得）
  useEffect(() => {
    if (!isOpen) return;

    const newChartData: Record<string, any[]> = {};
    const newRegressionData: Record<string, RegressionResult> = {};
    const newStockingDates: Record<string, Date> = {};

    // 選択されたすべての水槽に対してデータを生成
    selectedTanks.forEach((currentTankId) => {
      // 水槽ごとに日付をずらす（データを変える）
      const dateDiff =
        currentTankId === tankId ? 90 : 70 + Math.floor(Math.random() * 40);

      // 池入れ日を計算
      const today = new Date();
      const stockingDate = subDays(today, dateDiff);
      newStockingDates[currentTankId] = stockingDate;

      // データポイント生成
      const data = [];

      // 成長曲線（初期は緩やかで、中盤で急成長、後半でまた緩やかに）
      for (let i = 0; i <= dateDiff; i += 5) {
        // 5日ごとのデータ
        const date = subDays(today, dateDiff - i);
        const dateString = format(date, "yyyy/MM/dd", { locale: ja });

        if (isWeightParam) {
          // 体重の場合：シグモイド状の成長曲線を模したデータ
          const baseWeight = 80; // 初期体重
          const maxWeight = 350; // 最終体重

          // 水槽ごとに少し成長曲線を変える
          const tankFactor =
            currentTankId === tankId ? 1 : 0.8 + Math.random() * 0.4;

          const growthRate = 1 / (1 + Math.exp(-0.1 * (i - dateDiff / 2))); // シグモイド関数
          const weight =
            baseWeight + (maxWeight - baseWeight) * growthRate * tankFactor;
          // ランダム変動を加える
          const randomFactor = 0.95 + Math.random() * 0.1; // 0.95～1.05のランダム係数

          data.push({
            day: i, // 経過日数
            date: dateString,
            timestamp: date.toISOString(),
            value: Math.round(weight * randomFactor),
            tankId: currentTankId,
          });
        } else {
          // 餌料効率の場合
          // 給餌量当たりの体重増加率（%）
          const baseEfficiency = 80; // 基本効率

          // 水槽ごとに少し効率を変える
          const tankFactor =
            currentTankId === tankId ? 1 : 0.9 + Math.random() * 0.2;

          // 初期は高く、時間とともに下がる傾向（成長とともに効率が下がる）
          const efficiency =
            baseEfficiency * (1 - i / (dateDiff * 2)) * tankFactor; // 徐々に効率が下がる
          // ランダム変動を加える
          const randomFactor = 0.9 + Math.random() * 0.2; // 0.9～1.1のランダム係数

          data.push({
            day: i, // 経過日数
            date: dateString,
            timestamp: date.toISOString(),
            value: Math.round(efficiency * randomFactor * 10) / 10, // 小数点第1位まで
            tankId: currentTankId,
          });
        }
      }

      // チャートデータを保存
      newChartData[currentTankId] = data;

      // 回帰分析
      const regression = calculateRegression(data);
      newRegressionData[currentTankId] = regression;
    });

    setChartDataByTank(newChartData);
    setRegressionByTank(newRegressionData);
    setStockingDates(newStockingDates);

    // 共通のデータセットを作成（経過日数をX軸とする）
    const allDayPoints = new Set<number>();

    // すべての経過日数ポイントを収集
    Object.values(newChartData).forEach((tankData) => {
      tankData.forEach((point) => {
        allDayPoints.add(point.day);
      });
    });

    // 経過日数でソートした配列に変換
    const sortedDays = Array.from(allDayPoints).sort((a, b) => a - b);

    // 各日数ポイントに対して、各水槽のデータを格納
    const combined = sortedDays.map((day) => {
      const point: any = { day };

      selectedTanks.forEach((tankId) => {
        if (newChartData[tankId]) {
          const tankPoint = newChartData[tankId].find((p) => p.day === day);
          if (tankPoint) {
            point[tankId] = tankPoint.value;

            // 回帰直線の値も計算
            if (newRegressionData[tankId]) {
              const { slope, intercept } = newRegressionData[tankId];
              point[`${tankId}-regression`] = slope * day + intercept;
            }
          }
        }
      });

      return point;
    });

    setCombinedChartData(combined);
  }, [isOpen, parameterId, selectedTanks, tankId]);

  // 回帰分析計算関数
  const calculateRegression = (data: any[]): RegressionResult => {
    // X軸を経過日数に変換
    const xValues = data.map((d) => d.day);
    const yValues = data.map((d) => d.value);

    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumX2 = 0,
      sumY2 = 0;
    const n = data.length;

    for (let i = 0; i < n; i++) {
      sumX += xValues[i];
      sumY += yValues[i];
      sumXY += xValues[i] * yValues[i];
      sumX2 += xValues[i] * xValues[i];
      sumY2 += yValues[i] * yValues[i];
    }

    // 傾き
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    // 切片
    const intercept = (sumY - slope * sumX) / n;

    // 決定係数（R²）の計算
    const yMean = sumY / n;
    let totalSS = 0,
      residualSS = 0;

    for (let i = 0; i < n; i++) {
      totalSS += Math.pow(yValues[i] - yMean, 2);
      const predictedY = slope * xValues[i] + intercept;
      residualSS += Math.pow(yValues[i] - predictedY, 2);
    }

    const r2 = 1 - residualSS / totalSS;

    // 回帰直線のデータポイント（最初と最後の日の値）
    const regressionLineData = [
      {
        day: 0,
        regressionValue: intercept,
      },
      {
        day: Math.max(...xValues),
        regressionValue: slope * Math.max(...xValues) + intercept,
      },
    ];

    return { slope, intercept, r2, regressionLineData };
  };

  // 水槽名を取得
  const getTankName = (id: string) => {
    const tank = tanks.find((t) => t.id === id);
    return tank ? tank.name : id;
  };

  // カラーコードの取得
  const getTankColor = (index: number) => {
    return CHART_COLORS[index % CHART_COLORS.length];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>

        <div className="p-4 bg-white">
          {/* 水槽選択エリア */}
          <div className="mb-4 p-3 border rounded-lg bg-gray-50">
            <h3 className="font-medium mb-2">表示水槽</h3>
            <div className="flex flex-wrap gap-2 items-center">
              {tanks
                .filter((tank) => tank.type === "breeding" && tank.active)
                .map((tank, index) => (
                  <div
                    key={tank.id}
                    className={`flex items-center space-x-2 p-2 rounded-lg ${
                      selectedTanks.includes(tank.id)
                        ? "bg-white shadow-sm border"
                        : "hover:bg-white"
                    }`}
                  >
                    <Checkbox
                      id={`tank-${tank.id}`}
                      checked={selectedTanks.includes(tank.id)}
                      onCheckedChange={() => handleTankToggle(tank.id)}
                      disabled={
                        tank.id === tankId && selectedTanks.length === 1
                      }
                    />
                    <Label
                      htmlFor={`tank-${tank.id}`}
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: selectedTanks.includes(tank.id)
                            ? getTankColor(selectedTanks.indexOf(tank.id))
                            : "#CCC",
                        }}
                      />
                      {tank.name}
                      {tank.id === tankId && (
                        <span className="text-xs text-gray-500">
                          (現在の水槽)
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
            </div>
          </div>

          <div className="w-full h-[400px] bg-white">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={combinedChartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  label={{
                    value: "池入れからの経過日数",
                    position: "insideBottomRight",
                    offset: -10,
                  }}
                />
                <YAxis
                  label={{
                    value: title,
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value, name, props) => {
                    if (name.includes("-regression")) {
                      const tankId = name.split("-")[0];
                      return [
                        `${value} ${unit}`,
                        `${getTankName(tankId)} (近似直線)`,
                      ];
                    }
                    return [`${value} ${unit}`, getTankName(name)];
                  }}
                  labelFormatter={(label) => `経過日数: ${label}日`}
                />
                <Legend
                  formatter={(value, entry) => {
                    if (value.includes("-regression")) {
                      return null; // 回帰直線はレジェンドに表示しない
                    }
                    return getTankName(value);
                  }}
                />

                {/* 選択された各水槽のデータラインとその回帰直線 */}
                {selectedTanks.map((tankId, index) => {
                  const color = getTankColor(index);

                  return (
                    <React.Fragment key={`tank-lines-${tankId}`}>
                      {/* 実際のデータライン */}
                      <Line
                        type="monotone"
                        dataKey={tankId}
                        name={tankId}
                        stroke={color}
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                        connectNulls={true}
                      />

                      {/* 近似直線 */}
                      <Line
                        type="monotone"
                        dataKey={`${tankId}-regression`}
                        name={`${tankId}-regression`}
                        stroke={color}
                        strokeDasharray="3 3"
                        strokeWidth={2}
                        dot={false}
                        activeDot={false}
                        connectNulls={true}
                      />
                    </React.Fragment>
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 回帰分析の結果表示 */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedTanks.map((tankId, index) => {
              if (!regressionByTank[tankId]) return null;

              const regression = regressionByTank[tankId];
              const color = getTankColor(index);
              const tankName = getTankName(tankId);
              const stockingDate = stockingDates[tankId];
              const days =
                chartDataByTank[tankId]?.length > 0
                  ? chartDataByTank[tankId][chartDataByTank[tankId].length - 1]
                      .day
                  : 0;

              return (
                <div
                  key={`regression-${tankId}`}
                  className="p-4 border rounded-lg bg-gray-50"
                  style={{ borderLeftColor: color, borderLeftWidth: "4px" }}
                >
                  <h4 className="font-semibold mb-2">
                    {tankName} 近似直線：y = {regression.slope.toFixed(4)} ×
                    日数 + {regression.intercept.toFixed(2)}
                  </h4>

                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">池入れ日:</span>{" "}
                    {stockingDate
                      ? format(stockingDate, "yyyy/MM/dd", { locale: ja })
                      : "不明"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">経過日数:</span> {days}日
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GrowthParameterDialog;
