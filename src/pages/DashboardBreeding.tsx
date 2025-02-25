import { useState, useEffect } from "react";
import { Menu, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import {
  PAGE_TITLES,
  STATUS,
  STATUS_DISPLAY,
  BR_TANKS,
  type StatusType,
} from "../constants/constants";
import { Tabs, TabsList, TabsTrigger } from "../components/tabs";
import { PageContainer } from "../components/PageContainer";
import DashboardSidebar from "../components/DashboardSlidebar";

// 飼育槽パラメータの定義
const BREEDING_PARAMETERS = [
  {
    id: "oxygenSaturation",
    name: "酸素飽和度",
    unit: "%",
    warningThreshold: 75,
    errorThreshold: 70,
  },
  {
    id: "ph",
    name: "pH",
    unit: "",
    warningThreshold: 7.8,
    errorThreshold: 8.2,
  },
  {
    id: "temperature",
    name: "水温",
    unit: "℃",
    warningThreshold: 26.5,
    errorThreshold: 27.5,
  },
] as const;

// サンプルデータ生成関数
const generateSampleData = () => ({
  oxygenSaturation: 80 + (Math.random() * 20 - 10),
  ph: 7.0 + Math.random(),
  temperature: 25 + (Math.random() * 4 - 2),
});

const DashboardBreeding = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState(generateSampleData());
  const [statuses, setStatuses] = useState<Record<string, StatusType>>({});
  const [selectedTank, setSelectedTank] = useState(BR_TANKS[0].id);

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateSampleData();
      setData(newData);

      // ステータスの更新
      const newStatuses: Record<string, StatusType> = {};
      BREEDING_PARAMETERS.forEach((param) => {
        const value = newData[param.id as keyof typeof newData];
        if (value >= param.errorThreshold) {
          newStatuses[param.id] = STATUS.ERROR;
        } else if (value >= param.warningThreshold) {
          newStatuses[param.id] = STATUS.WARNING;
        } else {
          newStatuses[param.id] = STATUS.NORMAL;
        }
      });
      setStatuses(newStatuses);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case STATUS.WARNING:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case STATUS.ERROR:
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <TrendingUp className="h-5 w-5 text-emerald-500" />;
    }
  };

  const getStatusStyle = (status: StatusType) => {
    switch (status) {
      case STATUS.WARNING:
        return "bg-yellow-100 border-yellow-200";
      case STATUS.ERROR:
        return "bg-red-100 border-red-200";
      default:
        return "bg-emerald-50 border-emerald-200";
    }
  };

  return (
    <PageContainer
      title={PAGE_TITLES.DASHBOARD_BREEDING}
      action={
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      }
    >
      {/* 水槽選択 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8 p-2">
        <Tabs
          defaultValue={BR_TANKS[0].id}
          value={selectedTank}
          className="w-full"
        >
          <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden">
            <TabsList className="flex justify-start space-x-2">
              {BR_TANKS.map((tank) => (
                <TabsTrigger
                  key={tank.id}
                  value={tank.id}
                  onClick={() => setSelectedTank(tank.id)}
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white 
                             px-4 py-2 rounded-xl bg-slate-100 text-slate-600 
                             hover:bg-slate-200 transition-all duration-200"
                >
                  {tank.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      </div>

      {/* パラメータグリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BREEDING_PARAMETERS.map((param) => {
          const status = statuses[param.id] || STATUS.NORMAL;
          const statusInfo = STATUS_DISPLAY[status];
          const value = data[param.id as keyof typeof data];

          return (
            <div
              key={param.id}
              className={`
                  relative p-6 rounded-2xl border 
                  ${getStatusStyle(status)}
                  transition-all duration-300 hover:shadow-md
                `}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-slate-700">
                    {param.name}
                  </h3>
                  <p className="text-sm text-slate-500">{statusInfo.text}</p>
                </div>
                {getStatusIcon(status)}
              </div>

              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-slate-800">
                  {typeof value === "number" ? value.toFixed(1) : value}
                </span>
                <span className="ml-2 text-slate-600">{param.unit}</span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl overflow-hidden">
                <div
                  className={`
                      h-full transition-all duration-300
                      ${status === STATUS.ERROR ? "bg-red-500" : ""}
                      ${status === STATUS.WARNING ? "bg-yellow-500" : ""}
                      ${status === STATUS.NORMAL ? "bg-emerald-500" : ""}
                    `}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <DashboardSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </PageContainer>
  );
};

export default DashboardBreeding;
