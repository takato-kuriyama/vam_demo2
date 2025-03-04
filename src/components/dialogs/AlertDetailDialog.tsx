import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { AlertData } from "../../types/dataModels";

interface AlertDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  alert: AlertData;
  onStatusChange: (resolved: boolean) => void;
}

export const AlertDetailDialog: React.FC<AlertDetailDialogProps> = ({
  isOpen,
  onClose,
  alert,
  onStatusChange,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!rounded-xl bg-white max-w-md w-[95vw] md:w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">アラート詳細</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-lg font-semibold">
              {new Date(alert.timestamp).toLocaleString()}
            </p>
            <div className="border border-gray-300 flex p-1 px-2 gap-2">
              <p className="text-sm">{alert.lineId}</p>
              {alert.tankId && <p className="text-sm">{alert.tankId}</p>}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">{alert.paramName}</h3>
            <p className="text-gray-600 whitespace-pre-wrap">
              {alert.description}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">対応方法</h3>
            <p className="text-gray-600 whitespace-pre-wrap">
              {alert.solution}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-2">
              {alert.resolved ? (
                <CheckCircle className="text-green-500 h-5 w-5" />
              ) : (
                <XCircle className="text-red-500 h-5 w-5" />
              )}
              <span
                className={alert.resolved ? "text-green-500" : "text-red-500"}
              >
                {alert.resolved ? "解決済み" : "未解決"}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onStatusChange(!alert.resolved)}
                className="flex-1 sm:flex-none"
              >
                {alert.resolved ? "未解決にする" : "解決済みにする"}
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 sm:flex-none"
              >
                閉じる
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
