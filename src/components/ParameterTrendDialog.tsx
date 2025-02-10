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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="flex flex-row items-center justify-between pr-4">
          <DialogTitle className="text-xl font-semibold text-gray-300">
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
              <Tooltip
                formatter={(value: number) => [
                  `${value.toFixed(2)} ${parameter.unit}`,
                  parameter.name,
                ]}
                labelFormatter={(label) => `時刻: ${label}`}
              />
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
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
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
