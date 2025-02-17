import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/tabs";

const LiveMonitoring = () => {
  const [selectedLine, setSelectedLine] = useState<string>();
  const Line = ["Aライン", "Bライン"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">LIVE映像</h1>

        <div className="bg-white p-2 rounded-xl shadow mb-4">
          <Tabs defaultValue={Line[0]}>
            <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden">
              <TabsList className="flex justify-start space-x-2">
                {Line.map((line) => (
                  <TabsTrigger
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
                <div className="grid grid-cols-3 gap-4">
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
                <div className="grid grid-cols-3 gap-4">
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
      </div>
    </div>
  );
};

export default LiveMonitoring;
