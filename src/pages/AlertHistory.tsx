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
import { CheckCircle, XCircle, ExternalLink } from "lucide-react";

const AlertHistory = () => {
  const [selectedAlert, setSelectedAlert] = useState<AlertField | null>(null);
  const [alerts, setAlerts] = useState(SAMPLE_ALERT_HISTORY);

  const handleStatusChange = (resolved: boolean) => {
    if (selectedAlert) {
      const updatedAlerts = alerts.map((alert) =>
        alert.id === selectedAlert.id ? { ...alert, resolved } : alert
      );
      setAlerts(updatedAlerts);
      setSelectedAlert({ ...selectedAlert, resolved });
    }
  };

  return (
    <PageContainer title={PAGE_TITLES.ALERT_HISTORY}>
      <div className="grid grid-cols-1 gap-3">
        {alerts.map((alert) => (
          <Card
            key={alert.id}
            onClick={() => setSelectedAlert(alert)}
            className={`h-full border ${
              COLORS.border.primary
            } transition-all duration-300 hover:shadow-lg hover:scale-102 rounded-xl
              ${!alert.resolved ? "bg-red-100" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div
                  className={`flex items-center space-x-4 
                    ${!alert.resolved ? "text-red-800" : "text-gray-800"}`}
                >
                  <p className="font-semibold text-lg flex">{alert.date}</p>
                  <p className="font-semibold text-lg flex">{alert.name}</p>
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
