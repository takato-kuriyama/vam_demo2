import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Settings } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { PageContainer } from "../layouts/PageContainer";
import { PAGE_TITLES } from "../constants/routes";
import { TANKS } from "../constants/masterData/tanks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";

// アクティブなタンクのみフィルタリング
const EQ_TANKS = TANKS.filter((tank) => tank.type === "filter" && tank.active);

const RemoteControl = () => {
  const [selectedTank, setSelectedTank] = useState(
    EQ_TANKS.length > 0 ? EQ_TANKS[0].id : ""
  );
  const [controlValues, setControlValues] = useState({
    filterSystem: "ON",
    current: 12.1,
    feedAmount: 650,
    polarity: "A",
  });

  // 電流値計算のための係数設定
  const [currentCalculationSettings, setCurrentCalculationSettings] = useState({
    coefficient: 0.0072, // 係数（旧: 傾き）
    adjustment: 7.391, // 調整値（旧: 切片）
  });

  // 設定ダイアログの状態
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [tempCurrent, setTempCurrent] = useState(controlValues.current);
  const [tempFeedAmount, setTempFeedAmount] = useState(
    controlValues.feedAmount
  );

  // 給餌量変更時に電流値も自動計算
  useEffect(() => {
    const calculatedCurrent =
      controlValues.feedAmount * currentCalculationSettings.coefficient +
      currentCalculationSettings.adjustment;

    // 小数点第1位に丸める
    const roundedCurrent = Math.round(calculatedCurrent * 10) / 10;

    setTempCurrent(roundedCurrent);
  }, [controlValues.feedAmount, currentCalculationSettings]);

  const handleConfirmCurrentChange = () => {
    setControlValues((prev) => ({
      ...prev,
      current: tempCurrent,
    }));
  };

  const handleConfirmFeedAmountChange = () => {
    setControlValues((prev) => ({
      ...prev,
      feedAmount: tempFeedAmount,
    }));

    // 給餌量が変更されたら、電流値も連動して計算
    const calculatedCurrent =
      tempFeedAmount * currentCalculationSettings.coefficient +
      currentCalculationSettings.adjustment;

    // 小数点第1位に丸める
    const roundedCurrent = Math.round(calculatedCurrent * 10) / 10;

    setControlValues((prev) => ({
      ...prev,
      current: roundedCurrent,
    }));
  };

  const handleToggle = (paramId: string, currentValue: string) => {
    const nextValue =
      paramId === "filterSystem"
        ? currentValue === "ON"
          ? "OFF"
          : "ON"
        : currentValue === "A"
        ? "B"
        : "A";

    setControlValues((prev) => ({
      ...prev,
      [paramId]: nextValue,
    }));
  };

  // 計算式設定の保存
  const saveCalculationSettings = (
    newSettings: typeof currentCalculationSettings
  ) => {
    setCurrentCalculationSettings(newSettings);
    setIsSettingsOpen(false);

    // 新しい設定で電流値を再計算
    const calculatedCurrent =
      controlValues.feedAmount * newSettings.coefficient +
      newSettings.adjustment;

    // 小数点第1位に丸める
    const roundedCurrent = Math.round(calculatedCurrent * 10) / 10;

    setTempCurrent(roundedCurrent);
    setControlValues((prev) => ({
      ...prev,
      current: roundedCurrent,
    }));
  };

  return (
    <PageContainer title={PAGE_TITLES.REMOTE_CONTROLL}>
      {/* ライン選択タブ */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 p-1.5">
        <Tabs
          defaultValue={EQ_TANKS.length > 0 ? EQ_TANKS[0].id : ""}
          value={selectedTank}
          className="w-full"
        >
          <TabsList className="flex justify-start w-full bg-transparent gap-1">
            {EQ_TANKS.map((tank) => (
              <TabsTrigger
                key={tank.id}
                value={tank.id}
                onClick={() => setSelectedTank(tank.id)}
                className="data-[state=active]:bg-blue-100 px-4 py-2 rounded-xl shadow bg-gray-50"
              >
                {tank.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* 制御パネルグリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* ろ過装置 */}
        <Card className="bg-white border-gray-100 shadow-sm">
          <div className="p-5 flex flex-col h-full">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-medium text-slate-700">ろ過装置</h3>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-slate-800 mb-6">
                {controlValues.filterSystem}
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full max-w-[200px] bg-white hover:bg-slate-50 min-w-[70px]"
                  >
                    {controlValues.filterSystem === "ON"
                      ? "OFFにする"
                      : "ONにする"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {controlValues.filterSystem === "ON"
                        ? "ろ過装置をOFFにします。本当によろしいですか？"
                        : "ろ過装置をONにします。本当によろしいですか？"}
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        handleToggle("filterSystem", controlValues.filterSystem)
                      }
                    >
                      実行
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </Card>

        {/* 電流値 */}
        <Card className="bg-white border-gray-100 shadow-sm">
          <div className="p-5 flex flex-col h-full">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-medium text-slate-700">電流値</h3>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center">
              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-bold text-slate-800">
                  {controlValues.current}
                </span>
                <span className="ml-2 text-xl text-slate-600">A</span>
              </div>
              <div className="flex w-full max-w-[200px] space-x-2">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={tempCurrent}
                  onChange={(e) => setTempCurrent(parseFloat(e.target.value))}
                  className="text-center h-10"
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-white hover:bg-slate-50 min-w-[70px]"
                    >
                      変更
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        電流値を [{controlValues.current}A] から [{tempCurrent}
                        A] に変更します。
                        <br />
                        本当によろしいですか？
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <AlertDialogAction onClick={handleConfirmCurrentChange}>
                        実行
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </Card>

        {/* 給餌量 */}
        <Card className="bg-white border-gray-100 shadow-sm">
          <div className="p-5 flex flex-col h-full">
            <div className="flex justify-between items-center mb-3 h-6">
              <h3 className="text-base font-medium text-slate-700">給餌量</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSettingsOpen(true)}
                className="p-1"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center">
              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-bold text-slate-800">
                  {controlValues.feedAmount}
                </span>
                <span className="ml-2 text-xl text-slate-600">g</span>
              </div>
              <div className="flex w-full max-w-[200px] space-x-2">
                <Input
                  type="number"
                  min={0}
                  max={1000}
                  step={10}
                  value={tempFeedAmount}
                  onChange={(e) =>
                    setTempFeedAmount(parseFloat(e.target.value))
                  }
                  className="text-center h-10"
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-white hover:bg-slate-50 min-w-[70px] whitespace-nowrap"
                    >
                      変更
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        給餌量を [{controlValues.feedAmount}g] から [
                        {tempFeedAmount}
                        g] に変更します。
                        <br />
                        本当によろしいですか？
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleConfirmFeedAmountChange}
                      >
                        実行
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </Card>

        {/* 電解極性 */}
        <Card className="bg-white border-gray-100 shadow-sm">
          <div className="p-5 flex flex-col h-full">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-medium text-slate-700">電解極性</h3>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-slate-800 mb-6">
                {controlValues.polarity}
              </div>
              <Button
                onClick={() => handleToggle("polarity", controlValues.polarity)}
                variant="outline"
                className="w-full max-w-[200px] bg-white hover:bg-slate-50 min-w-[70px]"
              >
                {controlValues.polarity === "A" ? "Bにする" : "Aにする"}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* 電流計算式設定ダイアログ */}
      <CalculationSettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={currentCalculationSettings}
        onSave={saveCalculationSettings}
      />
    </PageContainer>
  );
};

// 電流計算式設定ダイアログ
interface CalculationSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    slope: number;
    intercept: number;
  };
  onSave: (settings: { slope: number; intercept: number }) => void;
}

const CalculationSettingsDialog: React.FC<CalculationSettingsDialogProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [tempSettings, setTempSettings] = useState(settings);

  // ダイアログが開かれたときに現在の設定を反映
  useEffect(() => {
    setTempSettings(settings);
  }, [settings, isOpen]);

  const handleChange = (field: "coefficient" | "adjustment", value: string) => {
    setTempSettings((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  const handleSave = () => {
    onSave(tempSettings);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            電流計算式の設定
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              電流値 = 係数 × 給餌量(g) + 調整値
            </p>
            <p className="text-sm text-gray-600 mb-4">
              現在の設定: 電流値 = {settings.coefficient} × 給餌量 +{" "}
              {settings.adjustment}
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="coefficient">係数</Label>
              <Input
                id="coefficient"
                type="number"
                step="0.0001"
                value={tempSettings.coefficient}
                onChange={(e) => handleChange("coefficient", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="adjustment">調整値</Label>
              <Input
                id="adjustment"
                type="number"
                step="0.001"
                value={tempSettings.adjustment}
                onChange={(e) => handleChange("adjustment", e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <p className="text-xs text-gray-500">
              例: 給餌量650gの場合、電流値は{" "}
              {(
                tempSettings.coefficient * 650 +
                tempSettings.adjustment
              ).toFixed(1)}
              A になります
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="min-w-[70px]">
            キャンセル
          </Button>
          <Button onClick={handleSave} className="min-w-[70px]">
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoteControl;
