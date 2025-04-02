import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { X, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { AlertMaster } from "../../types/dataModels";
import { ALERT_TARGET_DATA } from "../../constants/masterData/alerts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMasterData } from "../../hooks/useDataStore";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";

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
  const { masterData } = useMasterData();
  const [formData, setFormData] = useState({
    targetParam: alertData?.targetParam || ALERT_TARGET_DATA[0]?.id || "",
    thresholdMin: alertData?.thresholdMin || 0.5,
    thresholdMax: alertData?.thresholdMax || 3.0,
    dangerMin: alertData?.dangerMin || 0.5,
    dangerMax: alertData?.dangerMax || 3.0,
  });

  // 水槽選択の状態
  const [selectedTanks, setSelectedTanks] = useState<Record<string, boolean>>(
    {}
  );

  // 初期化時に水槽設定をセットアップ
  useEffect(() => {
    if (isOpen) {
      const initialTankSettings: Record<string, boolean> = {};
      masterData.tanks
        .filter((tank) => tank.type === "breeding" && tank.active)
        .forEach((tank) => {
          initialTankSettings[tank.id] = false;
        });
      setSelectedTanks(initialTankSettings);
    }
  }, [isOpen, masterData.tanks]);

  // 選択したパラメータに基づいてアラート名を自動生成
  const getAlertName = () => {
    const param = ALERT_TARGET_DATA.find((p) => p.id === formData.targetParam);
    return param ? `${param.name}アラート` : "";
  };

  // すべての水槽を選択/解除
  const handleSelectAllTanks = (checked: boolean) => {
    const newSettings = { ...selectedTanks };
    Object.keys(newSettings).forEach((tankId) => {
      newSettings[tankId] = checked;
    });
    setSelectedTanks(newSettings);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // アラート名は選択したパラメータから自動生成
    const alertName = getAlertName();

    console.log({
      name: alertName,
      ...formData,
      selectedTanks,
    });
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
            <p className="text-sm text-gray-500">
              アラート名: {getAlertName()}
            </p>
          </div>

          <div className="space-y-2">
            <Label>閾値設定（正常値）：</Label>
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
            <Label>警告値設定：</Label>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <span className="hidden sm:inline">～</span>
              <span className="sm:hidden text-center w-full">～</span>
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
              <span className="hidden sm:inline">/</span>
              <span className="sm:hidden text-center w-full">/</span>
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
              <span className="hidden sm:inline">～</span>
              <span className="sm:hidden text-center w-full">～</span>
            </div>
          </div>

          {/* 水槽選択セクション */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between items-center mb-2">
              <Label>設定を適用する水槽：</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="selectAllTanks"
                  onCheckedChange={(checked) => handleSelectAllTanks(!!checked)}
                  checked={Object.values(selectedTanks).every((v) => v)}
                />
                <Label htmlFor="selectAllTanks" className="text-sm">
                  すべて選択
                </Label>
              </div>
            </div>

            <ScrollArea className="h-40 pr-4 border rounded-md p-2">
              <div className="space-y-1 p-1">
                {masterData.tanks
                  .filter((tank) => tank.type === "breeding" && tank.active)
                  .map((tank) => (
                    <div
                      key={tank.id}
                      className="flex items-center space-x-2 py-1"
                    >
                      <Checkbox
                        id={`tank-${tank.id}`}
                        checked={selectedTanks[tank.id] || false}
                        onCheckedChange={(checked) => {
                          setSelectedTanks((prev) => ({
                            ...prev,
                            [tank.id]: !!checked,
                          }));
                        }}
                      />
                      <Label htmlFor={`tank-${tank.id}`} className="text-sm">
                        {tank.name}
                      </Label>
                    </div>
                  ))}
              </div>
            </ScrollArea>
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
