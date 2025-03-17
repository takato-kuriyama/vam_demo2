import { useState } from "react";
import { PageContainer } from "../../components/layouts/PageContainer";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "../../components/ui/dialog";
import { AreaChart, XAxis, Area, YAxis, ResponsiveContainer } from "recharts";

const DashboardTest = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [feeding1, setFeeding1] = useState(100);
  const [feeding2, setFeeding2] = useState(50);
  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");

  const handleInputChange1 = (e: any) => {
    setInputValue1(e.target.value);
  };

  const handleInputChange2 = (e: any) => {
    setInputValue2(e.target.value);
  };

  const handleSave1 = () => {
    setFeeding1(Number(inputValue1));
  };

  const handleSave2 = () => {
    setFeeding2(Number(inputValue2));
  };

  const a = 5;
  const data = [];

  const chartData: Date[] = [];
  const days: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 10; i++) {
    const randomNum = Math.floor(Math.random() * 21) - 10;
    data.push(a + randomNum);

    const newDate = new Date();
    newDate.setDate(today.getDate() + i);
    days.push(newDate);
  }

  const chartTest: any = [
    { date: "3/16", value: 9 },
    { date: "3/17", value: 12 },
    { date: "3/18", value: 5 },
    { date: "3/19", value: 11 },
    { date: "3/20", value: 7 },
  ];

  return (
    <PageContainer title="TEST">
      <div className="flex justify-between items-center mb-10 bg-red-200">
        <p>本日の給餌量</p>
        <p>
          餌①[{feeding1}] + 餌②[{feeding2}] = [{feeding1 + feeding2}]
        </p>
        <Dialog>
          <DialogTrigger>
            <Button>ダイアログを開く</Button>
          </DialogTrigger>
          <DialogContent className="bg-white">ダイアログが開いた</DialogContent>
        </Dialog>
      </div>
      <div className="flex-col space-y-2 mb-5">
        <p>餌①の変更</p>
        <div className="flex justify-between gap-4">
          <Input
            className="h-10"
            type="number"
            placeholder="給餌①"
            value={inputValue1}
            onChange={handleInputChange1}
          />
          <Button onClick={handleSave1} className="w-20 h-10">
            保存
          </Button>
        </div>
      </div>
      <div className="flex-col space-y-2 mb-5">
        <p>餌②の変更</p>
        <div className="flex justify-between gap-4">
          <Input
            className="h-10"
            type="number"
            placeholder="給餌②"
            value={inputValue2}
            onChange={handleInputChange2}
          />
          <Button onClick={handleSave2} className="w-20 h-10">
            保存
          </Button>
        </div>
      </div>
      <div>
        {data.map((value, index) =>
          index >= 0 ? (
            <p key={index}>
              データ{days[index].toLocaleDateString("ja-JP")}：{value}
            </p>
          ) : null
        )}
      </div>
      <div>
        <AreaChart data={chartTest}>
          <XAxis dataKey="date" />
          <YAxis />
          <Area type="monotone" dataKey="value" />
        </AreaChart>
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartTest}>
            <XAxis dataKey="date" />
            <YAxis />
            <Area type="monotone" dataKey="value" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </PageContainer>
  );
};
export default DashboardTest;
