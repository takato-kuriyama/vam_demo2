import { Card, CardContent } from "../components/card";
import {
  SAMPLE_ALERT_MASTER_DATA,
  AlertMasterField,
} from "../constants/constants";
import { useState } from "react";
import { Button } from "../components/button";
import { Settings, Search, PlusCircle } from "lucide-react";
import { AlertMasterDialog } from "../components/AlertMasterDialog";
import { Input } from "../components/input";

const AlertMaster = () => {
  const [selectedAlert, setSelectedAlert] = useState<AlertMasterField | null>(
    null
  );
  const [alerts] = useState(SAMPLE_ALERT_MASTER_DATA);
  const [isNewAlertDialogOpen, setIsNewAlertDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.targetData.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">アラートマスタ</h1>
          <Button
            onClick={() => setIsNewAlertDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            新規作成
          </Button>
        </div>

        {/* 検索バー */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="アラートが検索できます"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* アラート一覧 */}
        <div className="grid grid-cols-1 gap-3">
          {filteredAlerts.map((alert) => (
            <Card
              key={alert.id}
              className="transition-all duration-300 hover:shadow-lg hover:scale-102 border-none bg-white rounded-xl"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="font-semibold text-lg">{alert.name}</p>
                    <p className="text-sm text-gray-500">
                      閾値: {alert.thresholdMin}mg ～ {alert.thresholdMax}mg
                    </p>
                    <p className="text-sm text-gray-500">
                      重複抑制: {alert.duplicateControl}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedAlert(alert)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50"
                  >
                    <Settings className="h-4 w-4" />
                    編集
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 新規作成ダイアログ */}
      <AlertMasterDialog
        isOpen={isNewAlertDialogOpen}
        onClose={() => setIsNewAlertDialogOpen(false)}
      />

      {/* 編集ダイアログ */}
      {selectedAlert && (
        <AlertMasterDialog
          isOpen={!!selectedAlert}
          onClose={() => setSelectedAlert(null)}
          isEdit
          alertData={selectedAlert}
        />
      )}
    </div>
  );
};

export default AlertMaster;
