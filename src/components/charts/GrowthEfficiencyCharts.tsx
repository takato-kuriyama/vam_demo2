import React, { useState, useEffect } from "react";
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

interface GrowthEfficiencyChartsProps {
  tankId: string;
}

// 成長推移・飼料効率グラフコンポーネント
const GrowthEfficiencyCharts: React.FC<GrowthEfficiencyChartsProps> = ({
  tankId,
}) => {
  const [weightData, setWeightData] = useState<any[]>([]);
  const [efficiencyData, setEfficiencyData] = useState<any[]>([]);

  // 日付をフォーマットする関数
  const formatDate = (date: Date): string => {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${month}/${day}`;
  };

  // 日付を指定日数分前にする関数
  const subtractDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  };

  // 日付を指定日数分後にする関数
  const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // 仮のデータを生成
  useEffect(() => {
    if (!tankId) return;

    // 池入れ日（90日前と仮定）
    const today = new Date();
    const stockingDate = subtractDays(today, 90);

    // 体重データの生成
    const weightPoints = [];
    // 給餌データと体重増加の記録
    const feedingPoints = [];

    // 初期体重（グラム）
    const initialWeight = 80;
    // 60日分のデータを生成
    for (let i = 0; i <= 60; i++) {
      const currentDate = addDays(stockingDate, i);
      const dateString = formatDate(currentDate);

      // 体重は徐々に増加（ランダム要素も加える）
      // 成長曲線を模した体重増加（初期は速く、後半は緩やかに）
      const growth = i < 30 ? 2.5 : 1.5; // 成長率（初期は早く、後半は遅く）
      const randomFactor = 0.9 + Math.random() * 0.2; // 0.9～1.1のランダム係数

      const weight = initialWeight + i * growth * randomFactor;

      // 1週間ごとにデータポイントを追加
      if (i % 7 === 0 || i === 60) {
        weightPoints.push({
          date: dateString,
          weight: Math.round(weight),
          timestamp: currentDate.toISOString(),
        });

        // 前回からの体重増加と累積給餌量から飼料効率を計算
        if (i > 0) {
          const prevWeight = initialWeight + (i - 7) * growth * randomFactor;
          const weightGain = weight - prevWeight;

          // 1週間の給餌量（g）- ランダム要素を入れる
          const weeklyFeed = 1.5 * weightGain * (0.95 + Math.random() * 0.2);

          // 飼料効率 = 体重増加分 / 給餌量
          const efficiency = (weightGain / weeklyFeed) * 100; // パーセント表示

          feedingPoints.push({
            date: dateString,
            efficiency: Math.round(efficiency * 10) / 10, // 小数点第1位まで
            timestamp: currentDate.toISOString(),
          });
        }
      }
    }

    setWeightData(weightPoints);
    setEfficiencyData(feedingPoints);
  }, [tankId]);

  return (
    <div className="space-y-8">
      {/* 平均体重推移グラフ */}
      <div>
        <h3 className="text-lg font-medium mb-4">平均体重推移</h3>
        <div className="w-full h-60 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          {weightData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={weightData}
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  label={{
                    value: "",
                    position: "insideBottomRight",
                    offset: 0,
                  }}
                />
                <YAxis
                  label={{
                    value: "体重 (g)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value) => [`${value} g`, "平均体重"]}
                  labelFormatter={(label) => `日付: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="weight"
                  name="平均体重"
                  stroke="#2196F3"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">データがありません</p>
            </div>
          )}
        </div>
      </div>

      {/* 飼料効率推移グラフ */}
      <div>
        <h3 className="text-lg font-medium mb-4">飼料効率推移</h3>
        <div className="w-full h-60 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          {efficiencyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={efficiencyData}
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  label={{
                    value: "",
                    position: "insideBottomRight",
                    offset: 0,
                  }}
                />
                <YAxis
                  label={{
                    value: "飼料効率 (%)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value) => [`${value} %`, "飼料効率"]}
                  labelFormatter={(label) => `日付: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  name="飼料効率"
                  stroke="#4CAF50"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">データがありません</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrowthEfficiencyCharts;
