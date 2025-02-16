import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { CheckCircle, XCircle } from "lucide-react";
import { AlertField } from "../constants/constants";

interface AlertDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  alert: AlertField;
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
      <DialogContent className="!rounded-xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">アラート詳細</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">{alert.date}</p>
            <div className="border border-gray-300 flex p-1 px-2 gap-2">
              <p className="text-sm">{alert.line}</p>
              <p className="text-sm">{alert.tank}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">{alert.name}</h3>
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

          <div className="flex justify-between items-center pt-4">
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
              >
                {alert.resolved ? "未解決にする" : "解決済みにする"}
              </Button>
              <Button variant="outline" onClick={onClose}>
                閉じる
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
