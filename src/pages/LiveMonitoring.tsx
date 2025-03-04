import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/tabs";
import { PAGE_TITLES } from "../constants/routes";
import { COLORS } from "../constants/ui";
import { PageContainer } from "../components/PageContainer";

const LiveMonitoring = () => {
  const [selectedLine, setSelectedLine] = useState<string>();
  const Line = ["Aライン", "Bライン"];

  return (
    <PageContainer title={PAGE_TITLES.LIVE_MONITORING}>
      <div
        className={`p-2 border ${COLORS.border.primary} rounded-xl shadow mb-4`}
      >
        <Tabs defaultValue={Line[0]}>
          <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden">
            <TabsList className="flex justify-start space-x-2">
              {Line.map((line) => (
                <TabsTrigger
                  key={line}
                  value={line}
                  onClick={() => setSelectedLine(line)}
                  className={`data-[state=active]:bg-blue-100 px-4 py-2 rounded-xl shadow bg-gray-50`}
                >
                  {line}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div>
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
          </div>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default LiveMonitoring;
