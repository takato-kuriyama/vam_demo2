import { Card, CardContent } from "../components/card";
import {
  SAMPLE_ALERT_HISTORY,
  AlertField,
  COLORS,
  PAGE_TITLES,
} from "../constants/constants";
import { useState } from "react";
import { Button } from "../components/button";
import { PageContainer } from "../components/PageContainer";
import { AlertDetailDialog } from "../components/AlertDetailDialog";
import { CheckCircle, XCircle, ExternalLink, Search } from "lucide-react";
import { Input } from "../components/input";
import { Checkbox } from "../components/checkbox";
import { Badge } from "../components/badge";
import { Switch } from "../components/switch";
import { Label } from "../components/label";

const AlertHistory = () => {
  const [selectedAlert, setSelectedAlert] = useState<AlertField | null>(null);
  const [alerts, setAlerts] = useState(SAMPLE_ALERT_HISTORY);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyUnresolved, setShowOnlyUnresolved] = useState(false);
  const [checkedAlerts, setCheckedAlerts] = useState<number[]>([]);

  // 検索フィルター
  const filteredAlerts = alerts.filter(
    (alert) =>
      (showOnlyUnresolved ? !alert.resolved : true) &&
      (alert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.line.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.tank.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.date.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleStatusChange = (resolved: boolean) => {
    if (selectedAlert) {
      const updatedAlerts = alerts.map((alert) =>
        alert.id === selectedAlert.id ? { ...alert, resolved } : alert
      );
      setAlerts(updatedAlerts);
      setSelectedAlert({ ...selectedAlert, resolved });
    }
  };

  const handleBulkResolve = () => {
    if (checkedAlerts.length === 0) return;

    const updatedAlerts = alerts.map((alert) =>
      checkedAlerts.includes(alert.id) ? { ...alert, resolved: true } : alert
    );

    setAlerts(updatedAlerts);
    setCheckedAlerts([]);
  };

  const handleCheckboxChange = (alertId: number) => {
    setCheckedAlerts((prev) => {
      if (prev.includes(alertId)) {
        return prev.filter((id) => id !== alertId);
      } else {
        return [...prev, alertId];
      }
    });
  };

  const toggleFilter = () => {
    setShowOnlyUnresolved(!showOnlyUnresolved);
  };

  const unresolvedCount = alerts.filter((alert) => !alert.resolved).length;

  return (
    <PageContainer title={PAGE_TITLES.ALERT_HISTORY}>
      {/* 検索バーとフィルター */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="アラートが検索できます"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 items-center">
          <div className="flex items-center space-x-2 border rounded-lg p-2 bg-white">
            <Switch
              id="unresolved-filter"
              checked={showOnlyUnresolved}
              onCheckedChange={toggleFilter}
            />
            <Label
              htmlFor="unresolved-filter"
              className="cursor-pointer flex items-center gap-2"
            >
              未解決のみ
              {unresolvedCount > 0 && (
                <Badge variant="secondary">{unresolvedCount}</Badge>
              )}
            </Label>
          </div>

          {checkedAlerts.length > 0 && (
            <Button onClick={handleBulkResolve} className="whitespace-nowrap">
              一括解決 ({checkedAlerts.length})
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredAlerts.map((alert) => (
          <Card
            key={alert.id}
            className={`h-full border ${
              COLORS.border.primary
            } transition-all duration-300 hover:shadow-lg rounded-xl
              ${!alert.resolved ? "bg-red-100" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div className="flex items-center gap-4">
                  <Checkbox
                    id={`alert-${alert.id}`}
                    checked={checkedAlerts.includes(alert.id)}
                    onCheckedChange={() => handleCheckboxChange(alert.id)}
                    disabled={alert.resolved}
                    className="h-5 w-5"
                  />

                  <div
                    className={`flex items-center flex-wrap space-x-4 cursor-pointer 
                      ${!alert.resolved ? "text-red-800" : "text-gray-800"}`}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <p className="font-semibold text-lg">{alert.date}</p>
                    <p className="font-semibold text-lg">{alert.name}</p>
                    <div className="border border-gray-300 flex p-1 px-2 gap-2">
                      <p className="text-sm text-gray-800">{alert.line}</p>
                      <p className="text-sm text-gray-800">{alert.tank}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {alert.resolved ? (
                        <CheckCircle className="text-green-500 h-4 w-4" />
                      ) : (
                        <XCircle className="text-red-500 h-4 w-4" />
                      )}
                      <span
                        className={`text-sm ${
                          alert.resolved ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {alert.resolved ? "解決済み" : "未解決"}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => setSelectedAlert(alert)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50"
                >
                  詳細
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            表示するアラートがありません
          </div>
        )}
      </div>

      {selectedAlert && (
        <AlertDetailDialog
          isOpen={!!selectedAlert}
          onClose={() => setSelectedAlert(null)}
          alert={selectedAlert}
          onStatusChange={handleStatusChange}
        />
      )}
    </PageContainer>
  );
};

export default AlertHistory;
