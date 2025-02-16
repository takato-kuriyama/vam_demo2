import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { X } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { FilterParameter } from "../constants/constants";

interface ParameterTrendDialogProps {
  isOpen: boolean;
  onClose: () => void;
  parameter: FilterParameter;
}

// 24時間分のダミーデータを生成
const generateDummyData = () => {
  const data = [];
  const baseValue = 4;
  for (let i = 0; i < 24; i++) {
    data.push({
      hour: `${i}:00`,
      value: baseValue + Math.sin(i / 3) + (Math.random() - 0.5),
    });
  }
  return data;
};

const ParameterTrendDialog: React.FC<ParameterTrendDialogProps> = ({
  isOpen,
  onClose,
  parameter,
}) => {
  const data = generateDummyData();
  const warningThreshold = 5;
  const dangerThreshold = 7;

  //データの色を制御
  const getDotColor = (value: number) => {
    if (value >= dangerThreshold) return "#FF4842"; // 危険値以上は赤
    if (value >= warningThreshold) return "#FFB020"; // 警告値以上は黄色
    return "#2196F3"; // 通常値は青
  };

  //tooltipの色も制御
  const getTooltipStyle = (value: number) => {
    if (value >= dangerThreshold) {
      return {
        backgroundColor: "rgba(255, 72, 66, 0.1)", // 薄い赤
        border: "2px solid #FF4842",
        color: "#FF4842",
      };
    }
    if (value >= warningThreshold) {
      return {
        backgroundColor: "rgba(255, 176, 32, 0.1)", // 薄い黄
        border: "2px solid #FFB020",
        color: "#FFB020",
      };
    }
    return {
      backgroundColor: "white",
      border: "2px solid #2196F3",
      color: "#2196F3",
    };
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.[0]) return null;

    const value = payload[0].value;
    const style = getTooltipStyle(value);

    return (
      <div
        style={{
          backgroundColor: style.backgroundColor,
          border: style.border,
          borderRadius: "12px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
          padding: "12px 16px",
        }}
      >
        <p style={{ color: "#333333", fontWeight: 600, marginBottom: "4px" }}>
          時刻: {label}
        </p>
        <p>
          <span style={{ color: style.color, fontWeight: 600 }}>
            {`${value.toFixed(2)} ${parameter.unit}`}
          </span>
        </p>
        <p style={{ color: "#666666" }}>{parameter.name}</p>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white">
        <DialogHeader className="flex flex-row items-center justify-between pr-4">
          <DialogTitle className="text-xl font-semibold text-gray-600">
            {parameter.name} - 24時間推移
          </DialogTitle>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100 transition-colors bg-white"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="p-4">
          <div className="w-full h-[400px]">
            <LineChart
              width={700}
              height={400}
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="hour"
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
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {/* 閾値ライン */}
              <ReferenceLine
                y={warningThreshold}
                label="警告値"
                stroke="#FFB020"
                strokeDasharray="3 3"
              />
              <ReferenceLine
                y={dangerThreshold}
                label="危険値"
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
                dot={(props) => {
                  const value = props.payload.value;
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={4}
                      fill={getDotColor(value)}
                      stroke="none"
                    />
                  );
                }}
                activeDot={(props: any) => {
                  const value = props.payload.value;
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={8}
                      fill={getDotColor(value)}
                      stroke="white"
                      strokeWidth={2}
                    />
                  );
                }}
              />
            </LineChart>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-yellow-500"></div>
              <span className="text-sm text-gray-600">
                警告値: {warningThreshold}
                {parameter.unit}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-red-500"></div>
              <span className="text-sm text-gray-600">
                危険値: {dangerThreshold}
                {parameter.unit}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParameterTrendDialog;
