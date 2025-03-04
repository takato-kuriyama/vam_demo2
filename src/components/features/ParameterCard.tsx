import React from "react";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { StatusType } from "../../constants/ui";

interface ParameterCardProps {
  name: string;
  value: number;
  unit: string;
  status: StatusType;
  statusText: string;
  normalMin?: number;
  normalMax?: number;
  onClick?: () => void;
}

export const ParameterCard: React.FC<ParameterCardProps> = ({
  name,
  value,
  unit,
  status,
  statusText,
  normalMin,
  normalMax,
  onClick,
}) => {
  // ステータスに応じたスタイルとアイコン
  const getStatusStyle = (status: StatusType) => {
    switch (status) {
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-emerald-50 border-emerald-200";
    }
  };

  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <TrendingUp className="h-5 w-5 text-emerald-500" />;
    }
  };

  return (
    <div
      className={`
        relative p-6 rounded-2xl border 
        ${getStatusStyle(status)}
        transition-all duration-300 hover:shadow-md cursor-pointer
      `}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-slate-700">{name}</h3>
          <p className="text-sm text-slate-500">{statusText}</p>
        </div>
        {getStatusIcon(status)}
      </div>

      <div className="flex items-baseline">
        <span className="text-4xl font-bold text-slate-800">
          {value.toFixed(1)}
        </span>
        <span className="ml-2 text-slate-600">{unit}</span>
      </div>

      {normalMin !== undefined && normalMax !== undefined && (
        <div className="mt-2 flex items-center text-xs text-slate-500">
          <span>
            基準値: {normalMin} ~ {normalMax}
            {unit}
          </span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl overflow-hidden">
        <div
          className={`
            h-full transition-all duration-300
            ${status === "error" ? "bg-red-500" : ""}
            ${status === "warning" ? "bg-yellow-500" : ""}
            ${status === "normal" ? "bg-emerald-500" : ""}
          `}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
};
