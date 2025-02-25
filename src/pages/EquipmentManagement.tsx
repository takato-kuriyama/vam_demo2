import { useState } from "react";
import { Card, CardContent } from "../components/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/tabs";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { EQ_TANKS, COLORS, PAGE_TITLES } from "../constants/constants";
import { PageContainer } from "../components/PageContainer";

// サンプルデータの生成
const generateSampleData = () => {
  const data = [];
  let time = new Date();
  time.setMinutes(30);
  time.setSeconds(0);

  for (let i = 0; i < 13; i++) {
    time = new Date(time.getTime() - 10 * 60000); // 10分ずつ遡る
    data.push({
      time: time
        .toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })
        .replace(":", ":"),
      residualChlorine1: (2700 + Math.random() * 300).toFixed(0) + "ppm",
      residualChlorine2: (Math.random() * 8).toFixed(0) + "ppm",
      ammonia: (2.9 + Math.random() * 0.7).toFixed(3) + "ppm",
      current: (17 + Math.random()).toFixed(1) + "A",
      polarity: Math.random() > 0.5 ? "A" : "B",
      ph: (6.5 + Math.random() * 0.3).toFixed(1),
      do: (6.8 + Math.random() * 0.1).toFixed(2) + "ppm",
      flowRate: "29L/min",
      voltage: (1.0 + Math.random() * 0.2).toFixed(2) + "V",
    });
  }
  return data;
};

const EquipmentManagement = () => {
  const sampleData = generateSampleData();
  const [selectedTank, setSelectedTank] = useState(EQ_TANKS[0].id);

  return (
    <PageContainer title={PAGE_TITLES.EQUIPMENT_MANAGEMENT}>
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
      <Card>
        <CardContent className="p-6">
          <div className="relative overflow-x-auto border rounded-lg">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-gray-100 p-3 text-left border-b border-r font-medium text-gray-700">
                    日時
                  </th>
                  <th className="bg-gray-100 p-3 text-left border-b border-r font-medium text-gray-700">
                    残留塩素計値①
                  </th>
                  <th className="bg-gray-100 p-3 text-left border-b border-r font-medium text-gray-700">
                    残留塩素計値②
                  </th>
                  <th className="bg-gray-100 p-3 text-left border-b border-r font-medium text-gray-700">
                    アンモニア濃度
                  </th>
                  <th className="bg-gray-100 p-3 text-left border-b border-r font-medium text-gray-700">
                    電解電流値
                  </th>
                  <th className="bg-gray-100 p-3 text-left border-b border-r font-medium text-gray-700">
                    電解極性
                  </th>
                  <th className="bg-gray-100 p-3 text-left border-b border-r font-medium text-gray-700">
                    pH
                  </th>
                  <th className="bg-gray-100 p-3 text-left border-b border-r font-medium text-gray-700">
                    DO
                  </th>
                  <th className="bg-gray-100 p-3 text-left border-b border-r font-medium text-gray-700">
                    ろ過流量
                  </th>
                  <th className="bg-gray-100 p-3 text-left border-b border-r font-medium text-gray-700">
                    電圧量
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sampleData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="sticky left-0 z-10 bg-white p-3 border-r font-medium text-gray-700">
                      2025/02/18 {row.time}
                    </td>
                    <td className="p-3 border-r text-gray-600">
                      {row.residualChlorine1}
                    </td>
                    <td className="p-3 border-r text-gray-600">
                      {row.residualChlorine2}
                    </td>
                    <td className="p-3 border-r text-gray-600">
                      {row.ammonia}
                    </td>
                    <td className="p-3 border-r text-gray-600">
                      {row.current}
                    </td>
                    <td className="p-3 border-r text-gray-600">
                      {row.polarity}
                    </td>
                    <td className="p-3 border-r text-gray-600">{row.ph}</td>
                    <td className="p-3 border-r text-gray-600">{row.do}</td>
                    <td className="p-3 border-r text-gray-600">
                      {row.flowRate}
                    </td>
                    <td className="p-3 border-r text-gray-600">
                      {row.voltage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default EquipmentManagement;
