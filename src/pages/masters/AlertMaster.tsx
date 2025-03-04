import { Card, CardContent } from "../../components/ui/card";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Settings, Search, PlusCircle } from "lucide-react";
import { AlertMasterDialog } from "../../components/dialogs/AlertMasterDialog";
import { Input } from "../../components/ui/input";
import { PageContainer } from "../../components/layouts/PageContainer";
import { COLORS } from "../../constants/ui";
import { PAGE_TITLES } from "../../constants/routes";
import { AlertMaster as AlertMasterType } from "../../types/dataModels";

// サンプルデータ
const SAMPLE_ALERT_MASTER_DATA: AlertMasterType[] = [
  {
    id: "1",
    name: "残留塩素異常アラート",
    targetParam: "residualChlorine1",
    thresholdMin: 0.5,
    thresholdMax: 3.0,
    dangerMin: 0.5,
    dangerMax: 3.0,
    duplicateControl: "1h",
    solution:
      "・残留塩素計の値を確認してください\n・装置の動作状況を確認してください",
    active: true,
  },
  {
    id: "2",
    name: "アンモニア異常アラート",
    targetParam: "ammonia",
    thresholdMin: 0.0,
    thresholdMax: 2.0,
    dangerMin: 0.0,
    dangerMax: 1.0,
    duplicateControl: "3h",
    solution: "・アンモニア濃度を確認してください\n・給餌量を調整してください",
    active: true,
  },
];

const AlertMaster = () => {
  const [selectedAlert, setSelectedAlert] = useState<AlertMasterType | null>(
    null
  );
  const [alerts] = useState(SAMPLE_ALERT_MASTER_DATA);
  const [isNewAlertDialogOpen, setIsNewAlertDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.targetParam.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer
      title={PAGE_TITLES.ALERT_MASTER}
      action={
        <Button
          onClick={() => setIsNewAlertDialogOpen(true)}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline">新規作成</span>
          <span className="sm:hidden">新規</span>
        </Button>
      }
    >
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
            className={`transition-all duration-300 hover:shadow-lg hover:scale-102 ${COLORS.border.primary} rounded-xl`}
          >
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div className="space-y-1">
                  <p className="font-semibold text-lg">{alert.name}</p>
                  <p className="text-sm text-gray-500">
                    閾値: {alert.thresholdMin} ～ {alert.thresholdMax}
                  </p>
                  <p className="text-sm text-gray-500">
                    重複抑制: {alert.duplicateControl}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedAlert(alert)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 self-end sm:self-auto"
                >
                  <Settings className="h-4 w-4" />
                  編集
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
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
    </PageContainer>
  );
};

export default AlertMaster;
