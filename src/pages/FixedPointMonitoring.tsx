import { Card, CardContent } from "../components/card";
import {
  SAMPLE_FIXED_POINT_DATA,
  MonitoringDataField,
} from "../constants/constants";
import { useState } from "react";
import { Button } from "../components/button";
import { FixedPointMonitoringDialog } from "../components/FixedPointMonitoringDialog";
import { ExternalLink } from "lucide-react";

const FixedPointMonitoring = () => {
  const [selectedFixedData, setSelectedFixedData] =
    useState<MonitoringDataField | null>(null);
  const [fixedDatas] = useState(SAMPLE_FIXED_POINT_DATA);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">定点観測一覧</h1>

        <div className="grid grid-cols-1 gap-3">
          {fixedDatas.map((fixedData) => (
            <Card
              key={fixedData.id}
              className="h-full transition-all duration-300 hover:shadow-lg hover:scale-102 border-none bg-white rounded-xl"
            >
              <CardContent
                onClick={() => setSelectedFixedData(fixedData)}
                className="p-4"
              >
                <div className="flex justify-between">
                  <div className="flex items-center space-x-4">
                    <p className="font-semibold text-lg flex">
                      {fixedData.date}
                    </p>
                    <p className="font-semibold text-lg flex">
                      {fixedData.line}：定点観測
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedFixedData(fixedData)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50"
                  >
                    詳細
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedFixedData && (
        <FixedPointMonitoringDialog
          isOpen={!!selectedFixedData}
          onClose={() => setSelectedFixedData(null)}
          data={selectedFixedData}
        />
      )}
    </div>
  );
};

export default FixedPointMonitoring;
