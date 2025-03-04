import { useState } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  CheckCircle,
  XCircle,
  ExternalLink,
  Search,
  Calendar as CalendarIcon,
} from "lucide-react";
import { PageContainer } from "../components/PageContainer";
import { Card, CardContent } from "../components/card";
import { Button } from "../components/button";
import { Badge } from "../components/badge";
import { Input } from "../components/input";
import { Checkbox } from "../components/checkbox";
import { Switch } from "../components/switch";
import { Label } from "../components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import { Popover, PopoverContent, PopoverTrigger } from "../components/popover";
import { Calendar } from "../components/calendar";
import { PAGE_TITLES } from "../constants/routes";
import { COLORS } from "../constants/ui";
import { useAlertData, useMasterData } from "../hooks/useDataStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/dialog";
import { AlertData } from "../types/dataModels";

const AlertHistory = () => {
  // useAlertDataフックを使用してアラートデータとロード状態を取得
  const { alerts, isLoading, error, filter, setFilter, resolveAlert } =
    useAlertData();

  // マスターデータを取得（タンク名とライン名の表示に使用）
  const { masterData } = useMasterData();

  // UI状態
  const [selectedAlert, setSelectedAlert] = useState<AlertData | null>(null);
  const [checkedAlerts, setCheckedAlerts] = useState<string[]>([]);

  // 日付フィルター用
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // フィルター更新時の処理
  const handleFilterChange = (updates: Partial<typeof filter>) => {
    setFilter({ ...filter, ...updates });
  };

  // 日付選択時の処理
  const handleDateChange = (type: "start" | "end", date: Date | undefined) => {
    if (type === "start") {
      setStartDate(date);
      handleFilterChange({ startDate: date || null });
    } else {
      setEndDate(date);
      handleFilterChange({ endDate: date || null });
    }
  };

  // 複数アラートを一括で解決済みに変更
  const handleBulkResolve = () => {
    if (checkedAlerts.length === 0) return;

    // 選択されたすべてのアラートを解決済みに変更
    checkedAlerts.forEach((alertId) => {
      resolveAlert(alertId);
    });

    // 選択をクリア
    setCheckedAlerts([]);
  };

  // チェックボックスの状態変更処理
  const handleCheckboxChange = (alertId: string) => {
    setCheckedAlerts((prev) => {
      if (prev.includes(alertId)) {
        return prev.filter((id) => id !== alertId);
      } else {
        return [...prev, alertId];
      }
    });
  };

  // アラートの状態変更処理
  const handleStatusChange = (resolved: boolean) => {
    if (selectedAlert) {
      resolveAlert(selectedAlert.id);
      setSelectedAlert((prev) => (prev ? { ...prev, resolved } : null));
    }
  };

  // タンク名を取得する関数
  const getTankName = (tankId: string | null): string => {
    if (!tankId) return "なし";
    const tank = masterData.tanks.find((t) => t.id === tankId);
    return tank ? tank.name : tankId;
  };

  // ライン名を取得する関数
  const getLineName = (lineId: string): string => {
    const line = masterData.lines.find((l) => l.id === lineId);
    return line ? line.name : lineId;
  };

  // 未解決のアラート数を計算
  const unresolvedCount = alerts.filter((alert) => !alert.resolved).length;

  // ローディング表示
  if (isLoading) {
    return (
      <PageContainer title={PAGE_TITLES.ALERT_HISTORY}>
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">データを読み込み中...</p>
        </div>
      </PageContainer>
    );
  }

  // エラー表示
  if (error) {
    return (
      <PageContainer title={PAGE_TITLES.ALERT_HISTORY}>
        <div className="flex justify-center items-center h-40">
          <p className="text-red-500">データの読み込みに失敗しました</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={PAGE_TITLES.ALERT_HISTORY}>
      {/* 検索バーとフィルター */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="アラートが検索できます"
            value={filter.searchTerm}
            onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center space-x-2 border rounded-lg p-2 bg-white">
            <Switch
              id="unresolved-filter"
              checked={filter.showOnlyUnresolved}
              onCheckedChange={(checked) =>
                handleFilterChange({ showOnlyUnresolved: checked })
              }
            />
            <Label
              htmlFor="unresolved-filter"
              className="cursor-pointer flex items-center gap-2 whitespace-nowrap"
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

      {/* 日付範囲フィルター */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Label>期間：</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-fit flex items-center gap-2">
              {startDate
                ? format(startDate, "yyyy/MM/dd", { locale: ja })
                : "開始日"}
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => handleDateChange("start", date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <span>～</span>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-fit flex items-center gap-2">
              {endDate
                ? format(endDate, "yyyy/MM/dd", { locale: ja })
                : "終了日"}
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => handleDateChange("end", date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* ライン選択フィルター */}
        <div className="flex-1 sm:flex-initial sm:ml-auto">
          <Select
            value={filter.lineId || "all"}
            onValueChange={(value) =>
              handleFilterChange({
                lineId: value === "all" ? undefined : value,
              })
            }
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="全てのライン" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全てのライン</SelectItem>
              {masterData.lines.map((line) => (
                <SelectItem key={line.id} value={line.id}>
                  {line.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* アラート一覧 */}
      <div className="grid grid-cols-1 gap-3">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <Card
              key={alert.id}
              className={`h-full transition-all duration-300 hover:shadow-lg hover:scale-102 ${
                COLORS.border.primary
              } rounded-xl
                ${!alert.resolved ? "bg-red-50" : ""}`}
            >
              <CardContent
                className="p-4 cursor-pointer"
                onClick={() => setSelectedAlert(alert)}
              >
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <div onClick={(e) => e.stopPropagation()} className="mt-1">
                      <Checkbox
                        id={`alert-${alert.id}`}
                        checked={checkedAlerts.includes(alert.id)}
                        onCheckedChange={() => handleCheckboxChange(alert.id)}
                        disabled={alert.resolved}
                        className="h-5 w-5"
                      />
                    </div>

                    <div
                      className={`flex flex-col space-y-2
                        ${!alert.resolved ? "text-red-800" : "text-gray-800"}`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-lg">
                          {format(
                            new Date(alert.timestamp),
                            "yyyy/MM/dd HH:mm",
                            { locale: ja }
                          )}
                        </p>
                        <p className="font-semibold text-lg">
                          {alert.paramName}
                        </p>
                        <div className="border border-gray-300 flex p-1 px-2 gap-2 rounded">
                          <p className="text-sm text-gray-800">
                            {getLineName(alert.lineId)}
                          </p>
                          {alert.tankId && (
                            <p className="text-sm text-gray-800">
                              {getTankName(alert.tankId)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">
                          検知値: {alert.paramValue.toFixed(2)}
                        </span>
                        <span className="text-gray-600">
                          基準値: {alert.thresholdMin.toFixed(2)}～
                          {alert.thresholdMax.toFixed(2)}
                        </span>
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
                        {alert.resolvedAt && (
                          <span className="text-sm text-gray-500">
                            (
                            {format(new Date(alert.resolvedAt), "MM/dd HH:mm", {
                              locale: ja,
                            })}
                            )
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAlert(alert);
                    }}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 self-end sm:self-auto"
                  >
                    詳細
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            表示するアラートがありません
          </div>
        )}
      </div>

      {/* アラート詳細ダイアログ */}
      {selectedAlert && (
        <Dialog
          open={!!selectedAlert}
          onOpenChange={(open) => !open && setSelectedAlert(null)}
        >
          <DialogContent className="!rounded-xl bg-white max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                アラート詳細
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">
                  {format(
                    new Date(selectedAlert.timestamp),
                    "yyyy/MM/dd HH:mm:ss",
                    { locale: ja }
                  )}
                </p>
                <div className="border border-gray-300 flex p-1 px-2 gap-2">
                  <p className="text-sm">{getLineName(selectedAlert.lineId)}</p>
                  {selectedAlert.tankId && (
                    <p className="text-sm">
                      {getTankName(selectedAlert.tankId)}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  {selectedAlert.paramName}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm bg-gray-50 p-3 rounded-lg">
                  <div>
                    <p className="text-gray-500">検知値</p>
                    <p className="font-semibold">
                      {selectedAlert.paramValue.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">下限閾値</p>
                    <p className="font-semibold">
                      {selectedAlert.thresholdMin.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">上限閾値</p>
                    <p className="font-semibold">
                      {selectedAlert.thresholdMax.toFixed(2)}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 whitespace-pre-wrap mt-3">
                  {selectedAlert.description}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">対応方法</h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {selectedAlert.solution}
                </p>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div className="flex items-center gap-2">
                  {selectedAlert.resolved ? (
                    <CheckCircle className="text-green-500 h-5 w-5" />
                  ) : (
                    <XCircle className="text-red-500 h-5 w-5" />
                  )}
                  <span
                    className={
                      selectedAlert.resolved ? "text-green-500" : "text-red-500"
                    }
                  >
                    {selectedAlert.resolved ? "解決済み" : "未解決"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange(!selectedAlert.resolved)}
                  >
                    {selectedAlert.resolved ? "未解決にする" : "解決済みにする"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedAlert(null)}
                  >
                    閉じる
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </PageContainer>
  );
};

export default AlertHistory;
