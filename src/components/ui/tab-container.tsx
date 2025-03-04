import { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "./tabs";

interface TabItem {
  id: string;
  label: ReactNode;
}

interface TabContainerProps {
  items: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export function TabContainer({
  items,
  activeTab,
  onTabChange,
  className = "",
}: TabContainerProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-2 ${className}`}
    >
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <TabsList className="flex justify-start space-x-2">
            {items.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.id}
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white 
                         px-4 py-2 rounded-xl bg-slate-100 text-slate-600 
                         hover:bg-slate-200 transition-all duration-200"
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
}
