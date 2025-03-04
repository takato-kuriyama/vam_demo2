import { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import { PAGE_TITLES } from "../../constants/routes";
import { COLORS } from "../../constants/ui";
import { PageContainer } from "../../components/layouts/PageContainer";
import { TabContainer } from "../../components/ui/tab-container";

const LiveMonitoring = () => {
  const [selectedLine, setSelectedLine] = useState<string>();
  const Line = ["Aライン", "Bライン"];

  return (
    <PageContainer title={PAGE_TITLES.LIVE_MONITORING}>
      <div className={`border ${COLORS.border.primary} rounded-xl shadow mb-4`}>
        <TabContainer
          items={Line.map((line) => ({
            id: line,
            label: line,
          }))}
          activeTab={selectedLine || Line[0]}
          onTabChange={setSelectedLine}
        />
        <div className="p-4">
          <Tabs value={selectedLine || Line[0]}>
            <TabsContent value="Aライン">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="flex flex-col items-center">
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center border">
                      <span className="text-gray-600">映像 A-{num}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="Bライン">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="flex flex-col items-center">
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center border">
                      <span className="text-gray-600">映像 B-{num}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
};

export default LiveMonitoring;
