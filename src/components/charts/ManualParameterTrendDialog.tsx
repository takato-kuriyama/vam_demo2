import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Calendar } from "../ui/calendar";
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
import { TankMaster } from "../../types/dataModels";

// 時間範囲の定義 - 手入力データ用に1週間、1ヶ月、カスタム期間
type TimeRange = "1w" | "1m" | "custom";

// チャートの色パレット
const CHART_COLORS = [
  "#2196F3", // メインの水槽 (青)
  "#FF9800", // オレンジ
  "#4CAF50", // 緑
  "#9C27B0", // 紫
  "#F44336", // 赤
  "#3F51B5", // インディゴ
  "#009688", // ティール
  "#795548", // ブラウン
  "#607D8B", // ブルーグレー
];

// 手入力データの型定義
interface ManualInputData {
  id: string;
  timestamp: string;
  tankId: string;
  nh4?: number;
  no2?: number;
  no3?: number;
  tClo?: number;
  cloDp?: number;
  ph?: number;
}

// パラメータ定義
interface ManualParameter {
  id: string;
  name: string;
  unit: string;
  warningMin: number;
  warningMax: number;
  dangerMin: number;
  dangerMax: number;
}

interface ManualParameterTrendDialogProps {
  isOpen: boolean;
  onClose: () => void;
  parameter: ManualParameter;
  tankId: string;
  manualData: ManualInputData[];
  tanks: TankMaster[];
}

const ManualParameterTrendDialog: React.FC<ManualParameterTrendDialogProps> = ({
  isOpen,
  onClose,
  parameter,
  tankId,
  manualData,
  tanks,
}) => {
  // 表示用の期間設定 - デフォルトを1週間に設定
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

  // 選択された水槽
  const [selectedTanks, setSelectedTanks] = useState<string[]>([tankId]);

  // チャート表示用のキー（水槽ID + パラメータ名）
  const getChartKey = (tankId: string) => `${tankId}_${parameter.id}`;

  // グラフデータの準備
  useEffect(() => {
    if (!selectedTanks.length) return;

    prepareChartData();
  }, [
    parameter,
    timeRange,
    customStartDate,
    customEndDate,
    selectedTanks,
    manualData,
    tankId,
  ]);

  // グラフデータの準備
  const prepareChartData = () => {
    // 日付範囲の設定
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (timeRange) {
      case "1w":
        startDate = subWeeks(now, 1);
        break;
      case "1m":
        startDate = subMonths(now, 1);
        break;
      case "custom":
        startDate = customStartDate || subWeeks(now, 1);
        endDate = customEndDate || now;
        break;
      default:
        startDate = subWeeks(now, 1);
    }

    // 選択されたタンクのデータをフィルタリング
    const filteredData = manualData
      .filter((data) => {
        // 選択された水槽のみフィルタリング
        if (!selectedTanks.includes(data.tankId)) return false;

        const dataDate = new Date(data.timestamp);
        return isAfter(dataDate, startDate) && isBefore(dataDate, endDate);
      })
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

    // データを水槽ごとに分類
    const dataByTank: Record<string, ManualInputData[]> = {};
    selectedTanks.forEach((tid) => {
      dataByTank[tid] = filteredData.filter((d) => d.tankId === tid);
    });

    // 時刻をキーにしたマップを作成 (すべての時刻をカバーするため)
    const allTimestamps = new Set<string>();
    filteredData.forEach((data) => {
      allTimestamps.add(data.timestamp);
    });

    // タイムスタンプをソート
    const sortedTimestamps = [...allTimestamps].sort();

    // すべてのタイムスタンプを含むデータを作成
    const formattedData = sortedTimestamps.map((timestamp) => {
      const displayTime = format(new Date(timestamp), "MM/dd", { locale: ja });

      // 基本のデータポイント
      const dataPoint: any = {
        timestamp,
        displayTime,
      };

      // 各水槽のデータを追加
      selectedTanks.forEach((tid) => {
        const tankData = dataByTank[tid].find((d) => d.timestamp === timestamp);
        if (tankData) {
          // パラメータの値を取得
          dataPoint[getChartKey(tid)] =
            tankData[parameter.id as keyof ManualInputData];
        } else {
          // データが欠けている場合はnull
          dataPoint[getChartKey(tid)] = null;
        }
      });

      return dataPoint;
    });

    setChartData(formattedData);
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

  // 水槽選択の切り替え
  const handleTankToggle = (tankId: string) => {
    setSelectedTanks((prev) => {
      if (prev.includes(tankId)) {
        // メイン水槽（最初に選択されたもの）は削除できない
        if (tankId === selectedTanks[0] && prev.length === 1) return prev;
        return prev.filter((t) => t !== tankId);
      } else {
        return [...prev, tankId];
      }
    });
  };

  // 水槽の表示名取得
  const getTankName = (tankId: string) => {
    const tank = tanks.find((t) => t.id === tankId);
    return tank ? tank.name : tankId;
  };

  // カラーコードの取得
  const getTankColor = (index: number) => {
    return CHART_COLORS[index % CHART_COLORS.length];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <span>{parameter.name}の推移</span>
            <div className="flex flex-wrap items-center gap-2 text-sm">
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
          {/* 水槽選択エリア */}
          <div className="mb-4 p-3 border rounded-lg bg-gray-50">
            <h3 className="font-medium mb-2">表示水槽</h3>
            <div className="flex flex-wrap gap-2 items-center">
              {tanks.map((tank, index) => (
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
                    disabled={tank.id === tankId && selectedTanks.length === 1}
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
                    value: "日付",
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
                    (dataMin: number) => {
                      const minThreshold = Math.min(
                        parameter.warningMin,
                        parameter.dangerMin
                      );
                      const lowerBound = Math.min(dataMin, minThreshold);
                      return Math.floor(lowerBound - lowerBound * 0.1);
                    },
                    // 最大値は警告上限値・危険上限値・データ最大値のうち最も大きい値よりさらに10%大きく
                    (dataMax: number) => {
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
                  formatter={(value, name) => {
                    // nameからタンクIDを抽出
                    const tankId = name.split("_")[0];
                    return [`${value} ${parameter.unit}`, getTankName(tankId)];
                  }}
                  labelFormatter={(label) => `日付: ${label}`}
                />
                <Legend />

                {/* 警告値ライン - warningMinが0より大きい場合のみ表示 */}
                {parameter.warningMin > 0 && (
                  <ReferenceLine
                    y={parameter.warningMin}
                    label="警告下限"
                    stroke="#FFB020"
                    strokeDasharray="3 3"
                  />
                )}

                {/* 警告値ライン - warningMaxが0より大きい場合のみ表示 */}
                {parameter.warningMax > 0 && (
                  <ReferenceLine
                    y={parameter.warningMax}
                    label="警告上限"
                    stroke="#FFB020"
                    strokeDasharray="3 3"
                  />
                )}

                {/* 危険値ライン - dangerMinが0より大きい場合のみ表示 */}
                {parameter.dangerMin > 0 && (
                  <ReferenceLine
                    y={parameter.dangerMin}
                    label="危険下限"
                    stroke="#FF4842"
                    strokeDasharray="3 3"
                  />
                )}

                {/* 危険値ライン - dangerMaxが0より大きい場合のみ表示 */}
                {parameter.dangerMax > 0 && (
                  <ReferenceLine
                    y={parameter.dangerMax}
                    label="危険上限"
                    stroke="#FF4842"
                    strokeDasharray="3 3"
                  />
                )}

                {/* 各水槽のデータライン */}
                {selectedTanks.map((tid, index) => (
                  <Line
                    key={tid}
                    type="monotone"
                    dataKey={getChartKey(tid)}
                    name={tid}
                    stroke={getTankColor(index)}
                    strokeWidth={2}
                    connectNulls={false}
                    dot={{
                      r: 4,
                      fill: getTankColor(index),
                      stroke: getTankColor(index),
                    }}
                    activeDot={{
                      r: 6,
                      fill: getTankColor(index),
                      stroke: "white",
                      strokeWidth: 2,
                    }}
                  />
                ))}
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

          {/* 水槽の凡例 */}
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t pt-4">
            {selectedTanks.map((tid, index) => (
              <div key={tid} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getTankColor(index) }}
                />
                <span className="text-sm">
                  {getTankName(tid)}
                  {tid === tankId && (
                    <span className="text-xs text-gray-500 ml-1">(現在)</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManualParameterTrendDialog;
