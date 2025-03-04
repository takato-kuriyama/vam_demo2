import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { ParameterDefinition } from "../../types/dataModels";
import { DataLoader } from "../ui/data-loader";

interface ParameterDashboardProps {
  title: string;
  isLoading: boolean;
  error: Error | null;
  tabs: { id: string; name: string }[];
  selectedTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
}

export function ParameterDashboard({
  title,
  isLoading,
  error,
  tabs,
  selectedTab,
  onTabChange,
  children,
}: ParameterDashboardProps) {
  return (
    <div className="space-y-8">
      {/* タブ選択 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2">
        <Tabs
          value={selectedTab}
          onValueChange={onTabChange}
          className="w-full"
        >
          <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden">
            <TabsList className="flex justify-start space-x-2">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white 
                             px-4 py-2 rounded-xl bg-slate-100 text-slate-600 
                             hover:bg-slate-200 transition-all duration-200"
                >
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      </div>

      {/* データローディングラッパー */}
      <DataLoader isLoading={isLoading} error={error} height="h-64">
        {children}
      </DataLoader>
    </div>
  );
}
