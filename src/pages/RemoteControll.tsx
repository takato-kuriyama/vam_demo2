import { useState } from "react";
import { Card } from "../components/card";
import { Tabs, TabsList, TabsTrigger } from "../components/tabs";
import { Button } from "../components/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/alert-dialog";
import { Input } from "../components/input";
import { EQ_TANKS, PAGE_TITLES } from "../constants/constants";
import { PageContainer } from "../components/PageContainer";

const RemoteControl = () => {
  const [selectedTank, setSelectedTank] = useState(EQ_TANKS[0].id);
  const [controlValues, setControlValues] = useState({
    filterSystem: "ON",
    current: 1.0,
    feedAmount: 100,
    polarity: "A",
  });

  const [tempCurrent, setTempCurrent] = useState(controlValues.current);
  const [tempFeedAmount, setTempFeedAmount] = useState(
    controlValues.feedAmount
  );

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

  return (
    <PageContainer title={PAGE_TITLES.REMOTE_CONTROLL}>
      {/* ライン選択タブ */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 p-1.5">
        <Tabs
          defaultValue={EQ_TANKS[0].id}
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
          <div className="p-5">
            <div className="mb-3">
              <h3 className="text-base font-medium text-slate-700">ろ過装置</h3>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="text-5xl font-bold text-slate-800">
                {controlValues.filterSystem}
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full max-w-[200px] bg-white hover:bg-slate-50"
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
          <div className="p-5">
            <div className="mb-3">
              <h3 className="text-base font-medium text-slate-700">電流値</h3>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex items-baseline">
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
                      className="bg-white hover:bg-slate-50 flex-shrink-0 h-10"
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
          <div className="p-5">
            <div className="mb-3">
              <h3 className="text-base font-medium text-slate-700">給餌量</h3>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex items-baseline">
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
                      className="bg-white hover:bg-slate-50 flex-shrink-0 h-10"
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
          <div className="p-5">
            <div className="mb-3">
              <h3 className="text-base font-medium text-slate-700">電解極性</h3>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="text-5xl font-bold text-slate-800">
                {controlValues.polarity}
              </div>
              <Button
                onClick={() => handleToggle("polarity", controlValues.polarity)}
                variant="outline"
                className="w-full max-w-[200px] bg-white hover:bg-slate-50"
              >
                {controlValues.polarity === "A" ? "Bにする" : "Aにする"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default RemoteControl;
