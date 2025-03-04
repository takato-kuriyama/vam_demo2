import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

type StatusType = "normal" | "warning" | "error" | "success";

interface StatusBadgeProps {
  status: StatusType;
  text?: string;
  showIcon?: boolean;
  size?: "sm" | "md";
}

export function StatusBadge({
  status,
  text,
  showIcon = true,
  size = "md",
}: StatusBadgeProps) {
  // ステータスに応じた色とアイコンを決定
  const getStatusStyles = () => {
    switch (status) {
      case "normal":
      case "success":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-200",
          icon: (
            <CheckCircle
              className={`${
                size === "sm" ? "h-3 w-3" : "h-4 w-4"
              } text-green-500`}
            />
          ),
        };
      case "warning":
        return {
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          borderColor: "border-yellow-200",
          icon: (
            <AlertTriangle
              className={`${
                size === "sm" ? "h-3 w-3" : "h-4 w-4"
              } text-yellow-500`}
            />
          ),
        };
      case "error":
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          borderColor: "border-red-200",
          icon: (
            <XCircle
              className={`${
                size === "sm" ? "h-3 w-3" : "h-4 w-4"
              } text-red-500`}
            />
          ),
        };
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-200",
          icon: null,
        };
    }
  };

  const { bgColor, textColor, borderColor, icon } = getStatusStyles();
  const textValue =
    text ||
    {
      normal: "正常",
      success: "正常",
      warning: "警告",
      error: "異常",
    }[status];

  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full 
      ${bgColor} ${textColor} ${borderColor} border
      ${size === "sm" ? "text-xs" : "text-sm"}`}
    >
      {showIcon && icon && <span className="mr-1">{icon}</span>}
      {textValue}
    </div>
  );
}
