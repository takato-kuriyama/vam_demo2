import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Input } from "./input";
import { Label } from "./label";
import { Button } from "./button";
import { Textarea } from "./textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { X } from "lucide-react";
import { useState } from "react";
import { AlertMaster } from "../types/dataModels";
import {
  ALERT_TARGET_DATA,
  ALERT_DUPLICATE_CONTROLS,
} from "../constants/masterData/alerts";

interface AlertMasterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit?: boolean;
  alertData?: AlertMaster;
}

export const AlertMasterDialog: React.FC<AlertMasterDialogProps> = ({
  isOpen,
  onClose,
  isEdit = false,
  alertData,
}) => {
  const [formData, setFormData] = useState({
    name: alertData?.name || "",
    targetParam: alertData?.targetParam || ALERT_TARGET_DATA[0]?.id || "",
    thresholdMin: alertData?.thresholdMin || 0.5,
    thresholdMax: alertData?.thresholdMax || 3.0,
    dangerMin: alertData?.dangerMin || 0.5,
    dangerMax: alertData?.dangerMax || 3.0,
    duplicateControl:
      alertData?.duplicateControl || ALERT_DUPLICATE_CONTROLS[0]?.id || "",
    solution: alertData?.solution || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 未実装
    console.log(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white max-h-[90vh] overflow-y-auto w-[95vw] md:w-full">
        <DialogHeader className="flex flex-row items-center justify-between p-0">
          <DialogTitle className="text-xl font-bold">
            {isEdit ? "アラート編集" : "アラート新規作成"}
          </DialogTitle>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">アラート名：</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="アラート名を入力"
            />
          </div>

          <div className="space-y-2">
            <Label>対象データ：</Label>
            <Select
              value={formData.targetParam}
              onValueChange={(value) =>
                setFormData({ ...formData, targetParam: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="対象データを選択" />
              </SelectTrigger>
              <SelectContent>
                {ALERT_TARGET_DATA.map((target) => (
                  <SelectItem key={target.id} value={target.id}>
                    {target.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>閾値設定：</Label>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                type="number"
                step="0.1"
                value={formData.thresholdMin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    thresholdMin: parseFloat(e.target.value),
                  })
                }
                className="w-full"
              />
              <span className="hidden sm:inline">～</span>
              <span className="sm:hidden text-center w-full">～</span>
              <Input
                type="number"
                step="0.1"
                value={formData.thresholdMax}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    thresholdMax: parseFloat(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>危険値設定：</Label>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                type="number"
                step="0.1"
                value={formData.dangerMin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dangerMin: parseFloat(e.target.value),
                  })
                }
                className="w-full"
              />
              <span className="hidden sm:inline">～</span>
              <span className="sm:hidden text-center w-full">～</span>
              <Input
                type="number"
                step="0.1"
                value={formData.dangerMax}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dangerMax: parseFloat(e.target.value),
                  })
                }
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>重複アラート抑制：</Label>
            <Select
              value={formData.duplicateControl}
              onValueChange={(value) =>
                setFormData({ ...formData, duplicateControl: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="重複アラート抑制を選択" />
              </SelectTrigger>
              <SelectContent>
                {ALERT_DUPLICATE_CONTROLS.map((control) => (
                  <SelectItem key={control.id} value={control.id}>
                    {control.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="solution">対応方法：</Label>
            <Textarea
              id="solution"
              value={formData.solution}
              onChange={(e) =>
                setFormData({ ...formData, solution: e.target.value })
              }
              placeholder="アラート通知で表示する文章を入力できます"
              rows={4}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              キャンセル
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              保存
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
