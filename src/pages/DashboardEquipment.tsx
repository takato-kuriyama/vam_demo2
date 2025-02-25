import { useState, useEffect } from "react";
import { Menu, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import {
  COLORS,
  PAGE_TITLES,
  SAMPLE_FILTER_DATA,
  FILTER_PARAMETERS,
  STATUS,
  STATUS_DISPLAY,
  EQ_TANKS,
  type StatusType,
  type FilterParameter,
} from "../constants/constants";
import { Tabs, TabsList, TabsTrigger } from "../components/tabs";
import DashboardSidebar from "../components/DashboardSlidebar";
import ParameterTrendDialog from "../components/ParameterTrendDialog";
import { PageContainer } from "../components/PageContainer";

const DashboardEquipment = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState(SAMPLE_FILTER_DATA);
  const [statuses, setStatuses] = useState<Record<string, StatusType>>({});
  const [, setSelectedTank] = useState(EQ_TANKS[0].id);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedParameter, setSelectedParameter] =
    useState<FilterParameter | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setData({
        resClIdx1: data.resClIdx1 + (Math.random() < 0.5 ? -1 : 1),
        resClIdx2: data.resClIdx2 + (Math.random() < 0.5 ? -1 : 1),
        ammonia: data.ammonia + (Math.random() < 0.5 ? -1 : 1),
        current: data.current + (Math.random() < 0.5 ? -1 : 1),
        flowRate: data.flowRate + (Math.random() < 0.5 ? -1 : 1),
        polarity: data.polarity === "Positive" ? "Negative" : "Positive",
      });

      const newStatuses: Record<string, StatusType> = {};
      FILTER_PARAMETERS.forEach((param) => {
        const rand = Math.random();
        if (rand < 0.7) newStatuses[param.id] = STATUS.NORMAL;
        else if (rand < 0.9) newStatuses[param.id] = STATUS.WARNING;
        else newStatuses[param.id] = STATUS.ERROR;
      });
      setStatuses(newStatuses);
    }, 10000);

    return () => clearInterval(interval);
  }, [data]);

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

  const handleParameterClick = (parameter: FilterParameter) => {
    // アンモニアのみに実装
    if (parameter.id === "ammonia") {
      setSelectedParameter(parameter);
      setIsDialogOpen(true);
    }
  };

  return (
    <PageContainer
      title={PAGE_TITLES.DASHBOARD_EQUIPMENT}
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
      <div
        className={`rounded-2xl shadow-sm border ${COLORS.border.primary} mb-8 p-2`}
      >
        <Tabs defaultValue={EQ_TANKS[0].id} className="w-full">
          <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden">
            <TabsList className="flex justify-start space-x-2">
              {EQ_TANKS.map((tank) => (
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
        {FILTER_PARAMETERS.map((param) => {
          const status = statuses[param.id] || STATUS.NORMAL;
          const statusInfo = STATUS_DISPLAY[status];

          return (
            <div
              key={param.id}
              className={`
                  relative p-6 rounded-2xl border 
                  ${getStatusStyle(status)}
                  transition-all duration-300 hover:shadow-md
                `}
              onClick={() => handleParameterClick(param)}
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
                  {param.type === "numeric"
                    ? Math.round(data[param.id] * 100) / 100
                    : data[param.id]}
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

      {selectedParameter && (
        <div className="relative z-50">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
          <ParameterTrendDialog
            isOpen={isDialogOpen}
            onClose={() => {
              setIsDialogOpen(false);
              setSelectedParameter(null);
            }}
            parameter={selectedParameter}
          />
        </div>
      )}
    </PageContainer>
  );
};

export default DashboardEquipment;
