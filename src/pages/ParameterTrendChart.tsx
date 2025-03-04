import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/dialog";
import { Button } from "../components/button";
import { Popover, PopoverContent, PopoverTrigger } from "../components/popover";
import { Calendar } from "../components/calendar";
import { CalendarIcon } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import {
  format,
  subDays,
  subWeeks,
  subMonths,
  isBefore,
  isAfter,
} from "date-fns";
import { ja } from "date-fns/locale";
import { EquipmentData, ParameterDefinition } from "../types/dataModels";

// 時間範囲の定義
type TimeRange = "24h" | "1w" | "1m" | "3m" | "custom";

interface ParameterTrendChartProps {
  isOpen: boolean;
  onClose: () => void;
  parameter: ParameterDefinition;
  lineId: string;
  equipmentData: EquipmentData[];
}

const ParameterTrendChart: React.FC<ParameterTrendChartProps> = ({
  isOpen,
  onClose,
  parameter,
  lineId,
  equipmentData,
}) => {
  // 表示用の期間設定
  const [timeRange, setTimeRange] = useState<TimeRange>("1w");

  // カスタム日付範囲の状態
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(
    subWeeks(new Date(), 1)
  );
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(
    new Date()
  );

  // グラフ用のデータ
  const [chartData, setChartData] = useState<any[]>([]);

  // グラフデータの準備
  useEffect(() => {
    if (!lineId || !parameter) return;

    prepareChartData();
  }, [
    lineId,
    parameter,
    timeRange,
    customStartDate,
    customEndDate,
    equipmentData,
  ]);

  // グラフデータの準備
  const prepareChartData = () => {
    // 日付範囲の設定
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (timeRange) {
      case "24h":
        startDate = subDays(now, 1);
        break;
      case "1w":
        startDate = subWeeks(now, 1);
        break;
      case "1m":
        startDate = subMonths(now, 1);
        break;
      case "3m":
        startDate = subMonths(now, 3);
        break;
      case "custom":
        startDate = customStartDate || subWeeks(now, 1);
        endDate = customEndDate || now;
        break;
      default:
        startDate = subWeeks(now, 1);
    }

    // 選択されたラインのデータをフィルタリング
    const filteredData = equipmentData
      .filter((data) => {
        const dataDate = new Date(data.timestamp);
        return (
          data.lineId === lineId &&
          isAfter(dataDate, startDate) &&
          isBefore(dataDate, endDate)
        );
      })
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

    // グラフ表示用にデータを加工
    const formattedData = filteredData.map((data) => {
      const timestamp = new Date(data.timestamp);
      // 表示形式を期間に応じて調整
      let displayFormat = "MM/dd";
      if (timeRange === "24h") {
        displayFormat = "HH:mm";
      }

      return {
        timestamp,
        displayTime: format(timestamp, displayFormat, { locale: ja }),
        value: data[parameter.id as keyof EquipmentData],
      };
    });

    // データの欠損を検出するための処理を追加
    // 正常な時間間隔を算出
    if (formattedData.length >= 2) {
      const gapDetectionData = [...formattedData];
      const expectedIntervals: number[] = [];

      // 最初の5つのデータポイント間の時間間隔を計算して平均を取る
      for (let i = 1; i < Math.min(6, gapDetectionData.length); i++) {
        const timeDiff =
          gapDetectionData[i].timestamp.getTime() -
          gapDetectionData[i - 1].timestamp.getTime();
        expectedIntervals.push(timeDiff);
      }

      // 期待される時間間隔（平均）
      const avgInterval =
        expectedIntervals.reduce((sum, val) => sum + val, 0) /
        expectedIntervals.length;
      // 異常とみなす間隔（平均の2倍以上）
      const gapThreshold = avgInterval * 2;

      // 大きなギャップを検出して、そこにマーカーを追加
      const dataWithGaps = [];

      for (let i = 0; i < gapDetectionData.length; i++) {
        dataWithGaps.push(gapDetectionData[i]);

        // 次のデータポイントがあり、時間差が閾値を超えている場合、ギャップを挿入
        if (i < gapDetectionData.length - 1) {
          const currentTime = gapDetectionData[i].timestamp.getTime();
          const nextTime = gapDetectionData[i + 1].timestamp.getTime();
          const timeDiff = nextTime - currentTime;

          if (timeDiff > gapThreshold) {
            // ギャップの開始位置にマーカーを追加
            dataWithGaps.push({
              timestamp: new Date(currentTime + 1), // 現在のデータポイントの直後
              displayTime: gapDetectionData[i].displayTime,
              value: null, // nullを使用してデータの欠損を示す
              isGapStart: true,
            });

            // ギャップの終了位置にマーカーを追加
            dataWithGaps.push({
              timestamp: new Date(nextTime - 1), // 次のデータポイントの直前
              displayTime: gapDetectionData[i + 1].displayTime,
              value: null,
              isGapEnd: true,
            });
          }
        }
      }

      setChartData(dataWithGaps);
    } else {
      setChartData(formattedData);
    }
  };

  // カスタム日付選択時、自動的にカスタム期間に切り替え
  const handleDateChange = (date: Date | undefined, type: "start" | "end") => {
    if (type === "start") {
      setCustomStartDate(date);
    } else {
      setCustomEndDate(date);
    }
    setTimeRange("custom");
  };

  // この関数は不要になったので削除

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <span>{parameter.name}の推移</span>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Button
                variant={timeRange === "24h" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("24h")}
              >
                24時間
              </Button>
              <Button
                variant={timeRange === "1w" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("1w")}
              >
                1週間
              </Button>
              <Button
                variant={timeRange === "1m" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("1m")}
              >
                1ヶ月
              </Button>
              <Button
                variant={timeRange === "3m" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("3m")}
              >
                3ヶ月
              </Button>
              {/* カスタム期間選択 */}
              <div className="flex items-center gap-2">
                {/* 開始日 */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={timeRange === "custom" ? "default" : "outline"}
                      size="sm"
                      className="gap-1"
                    >
                      {timeRange === "custom"
                        ? customStartDate
                          ? format(customStartDate, "MM/dd", { locale: ja })
                          : "開始日"
                        : "開始日"}
                      <CalendarIcon className="h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="p-0 bg-white">
                    <div className="p-2">
                      <Calendar
                        mode="single"
                        selected={customStartDate}
                        onSelect={(date) => handleDateChange(date, "start")}
                        initialFocus
                        className="rounded border shadow"
                      />
                    </div>
                  </PopoverContent>
                </Popover>

                <span className="text-sm">～</span>

                {/* 終了日 */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={timeRange === "custom" ? "default" : "outline"}
                      size="sm"
                      className="gap-1"
                    >
                      {timeRange === "custom"
                        ? customEndDate
                          ? format(customEndDate, "MM/dd", { locale: ja })
                          : "終了日"
                        : "終了日"}
                      <CalendarIcon className="h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="p-0 bg-white">
                    <div className="p-2">
                      <Calendar
                        mode="single"
                        selected={customEndDate}
                        onSelect={(date) => handleDateChange(date, "end")}
                        initialFocus
                        className="rounded border shadow"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 bg-white">
          <div className="w-full h-[400px] bg-white">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 10,
                }}
                style={{ backgroundColor: "white" }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="displayTime"
                  label={{
                    value: "時間",
                    position: "insideBottomRight",
                    offset: -10,
                  }}
                />
                <YAxis
                  label={{
                    value: parameter.unit,
                    angle: -90,
                    position: "insideLeft",
                  }}
                  domain={[
                    // 最小値は警告下限値・危険下限値・データ最小値のうち最も小さい値よりさらに10%小さく
                    (dataMin) => {
                      const minThreshold = Math.min(
                        parameter.warningMin,
                        parameter.dangerMin
                      );
                      const lowerBound = Math.min(dataMin, minThreshold);
                      return Math.floor(lowerBound - lowerBound * 0.1);
                    },
                    // 最大値は警告上限値・危険上限値・データ最大値のうち最も大きい値よりさらに10%大きく
                    (dataMax) => {
                      const maxThreshold = Math.max(
                        parameter.warningMax,
                        parameter.dangerMax
                      );
                      const upperBound = Math.max(dataMax, maxThreshold);
                      return Math.ceil(upperBound + upperBound * 0.1);
                    },
                  ]}
                />
                <Tooltip
                  formatter={(value) => [
                    `${value} ${parameter.unit}`,
                    parameter.name,
                  ]}
                  labelFormatter={(label) => `時刻: ${label}`}
                />
                <Legend />

                {/* 警告値ライン */}
                <ReferenceLine
                  y={parameter.warningMin}
                  label="警告下限"
                  stroke="#FFB020"
                  strokeDasharray="3 3"
                />
                <ReferenceLine
                  y={parameter.warningMax}
                  label="警告上限"
                  stroke="#FFB020"
                  strokeDasharray="3 3"
                />

                {/* 危険値ライン */}
                <ReferenceLine
                  y={parameter.dangerMin}
                  label="危険下限"
                  stroke="#FF4842"
                  strokeDasharray="3 3"
                />
                <ReferenceLine
                  y={parameter.dangerMax}
                  label="危険上限"
                  stroke="#FF4842"
                  strokeDasharray="3 3"
                />

                {/* データライン */}
                <Line
                  type="monotone"
                  dataKey="value"
                  name={parameter.name}
                  stroke="#2196F3"
                  strokeWidth={2}
                  connectNulls={false}
                  dot={(props) => {
                    // データ欠損ポイントには何も表示しない
                    if (props.payload.value === null) return null;

                    // 期間によってドット表示を切り替え
                    if (timeRange === "24h") {
                      return (
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={3}
                          fill="#2196F3"
                          stroke="#2196F3"
                        />
                      );
                    }
                    // 1ヶ月以上の期間ではドットを非表示
                    return null;
                  }}
                  activeDot={(props: any) => {
                    // データ欠損マーカーの場合は何も表示しない
                    if (props.payload.value === null) return null;

                    return (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={5}
                        fill="#2196F3"
                        stroke="white"
                        strokeWidth={2}
                      />
                    );
                  }}
                />

                {/* データ欠損マーカー（縦線） */}
                {chartData.map((point, index) =>
                  point.isGapStart || point.isGapEnd ? (
                    <ReferenceLine
                      key={`gap-${index}`}
                      x={point.displayTime}
                      stroke="#FF4842"
                      strokeWidth={2}
                      strokeDasharray="3 3"
                      label={{
                        value: "データ欠損",
                        position: "top",
                        fill: "#FF4842",
                        fontSize: 12,
                      }}
                    />
                  ) : null
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {chartData.length === 0 && (
            <div className="flex justify-center items-center mt-4">
              <p className="text-gray-500">
                選択された期間にデータがありません
              </p>
            </div>
          )}

          <div className="mt-4 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-yellow-500"></div>
              <span className="text-sm text-gray-600">
                警告値: {parameter.warningMin} ~ {parameter.warningMax}{" "}
                {parameter.unit}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-red-500"></div>
              <span className="text-sm text-gray-600">
                危険値: {parameter.dangerMin} ~ {parameter.dangerMax}{" "}
                {parameter.unit}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParameterTrendChart;
