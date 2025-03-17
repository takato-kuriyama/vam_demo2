import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { ExternalLink, Search } from "lucide-react";
import { FixedPointMonitoringDialog } from "../../components/dialogs/FixedPointMonitoringDialog";
import { PageContainer } from "../../components/layouts/PageContainer";
import { COLORS } from "../../constants/ui";
import { PAGE_TITLES } from "../../constants/routes";
import { useDataStore } from "../../hooks/useDataStore";
import { format, subMonths } from "date-fns";
import { useMasterData } from "../../hooks/useDataStore";
import { ja } from "date-fns/locale";
import { FixedPointData } from "../../types/dataModels";
import { Switch } from "../../components/ui/switch";
import { Badge } from "../../components/ui/badge";
import { DatePicker } from "../../components/ui/date-picker";
import { Pagination } from "../../components/ui/pagination";
import { Tabs, TabsContent } from "../ui/tabs";

const FixedPointMonitoring = () => {
  // 選択した定点観測データ
  const [selectedData, setSelectedData] = useState<FixedPointData | null>(null);

  // ページネーション用の状態
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // フィルタリング用の状態
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyAbnormal, setShowOnlyAbnormal] = useState(false);
  const [selectedLineId, setSelectedLineId] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: subMonths(new Date(), 3), // デフォルトで3ヶ月前から
    endDate: new Date(), // 今日まで
  });

  // データ取得用のフック
  const { isLoading, error, dataStore } = useDataStore();
  const { masterData } = useMasterData();
  const [fixedPointData, setFixedPointData] = useState<FixedPointData[]>([]);

  // 異常値の有無を判定する関数
  const hasAbnormalValue = (data: FixedPointData): boolean => {
    // パラメータ定義がない場合は早期リターン
    if (!masterData.parameters.length) return false;

    // 設備データのチェック
    if (data.equipmentData) {
      const equipment = data.equipmentData;

      // 各パラメータに対してチェック
      for (const param of masterData.parameters) {
        const value = equipment[param.id as keyof typeof equipment];

        // 数値パラメータの場合のみチェック
        if (typeof value === "number") {
          if (value < param.dangerMin || value > param.dangerMax) {
            return true;
          }
        }
      }
    }

    // 飼育データのチェック
    for (const tankId in data.breedingData) {
      const tankData = data.breedingData[tankId];
      if (!tankData) continue;

      // 酸素飽和度、pH、水温をチェック
      const oxygenParam = masterData.parameters.find(
        (p) => p.id === "oxygenSaturation"
      );
      const phParam = masterData.parameters.find((p) => p.id === "ph");
      const tempParam = masterData.parameters.find(
        (p) => p.id === "temperature"
      );

      if (
        oxygenParam &&
        (tankData.oxygenSaturation < oxygenParam.dangerMin ||
          tankData.oxygenSaturation > oxygenParam.dangerMax)
      ) {
        return true;
      }

      if (
        phParam &&
        (tankData.ph < phParam.dangerMin || tankData.ph > phParam.dangerMax)
      ) {
        return true;
      }

      if (
        tempParam &&
        (tankData.temperature < tempParam.dangerMin ||
          tankData.temperature > tempParam.dangerMax)
      ) {
        return true;
      }
    }

    return false;
  };

  const hasWarningValue = (data: FixedPointData): boolean => {
    // パラメータ定義がない場合は早期リターン
    if (!masterData.parameters.length) return false;

    // 設備データのチェック
    if (data.equipmentData) {
      const equipment = data.equipmentData;

      // 各パラメータに対してチェック
      for (const param of masterData.parameters) {
        const value = equipment[param.id as keyof typeof equipment];

        // 数値パラメータの場合のみチェック
        if (typeof value === "number") {
          if (
            (value < param.warningMin || value > param.warningMax) &&
            !(value < param.dangerMin || value > param.dangerMax)
          ) {
            return true;
          }
        }
      }
    }

    // 飼育データのチェック
    for (const tankId in data.breedingData) {
      const tankData = data.breedingData[tankId];
      if (!tankData) continue;

      // 酸素飽和度、pH、水温をチェック
      const oxygenParam = masterData.parameters.find(
        (p) => p.id === "oxygenSaturation"
      );
      const phParam = masterData.parameters.find((p) => p.id === "ph");
      const tempParam = masterData.parameters.find(
        (p) => p.id === "temperature"
      );

      if (
        oxygenParam &&
        (tankData.oxygenSaturation < oxygenParam.warningMin ||
          tankData.oxygenSaturation > oxygenParam.warningMax) &&
        !(
          tankData.oxygenSaturation < oxygenParam.dangerMin ||
          tankData.oxygenSaturation > oxygenParam.dangerMax
        )
      ) {
        return true;
      }

      if (
        phParam &&
        (tankData.ph < phParam.warningMin ||
          tankData.ph > phParam.warningMax) &&
        !(tankData.ph < phParam.dangerMin || tankData.ph > phParam.dangerMax)
      ) {
        return true;
      }

      if (
        tempParam &&
        (tankData.temperature < tempParam.warningMin ||
          tankData.temperature > tempParam.warningMax) &&
        !(
          tankData.temperature < tempParam.dangerMin ||
          tankData.temperature > tempParam.dangerMax
        )
      ) {
        return true;
      }
    }

    return false;
  };

  //異常値フィルタリングスイッチ
  const filteredFixedPointData = showOnlyAbnormal
    ? fixedPointData.filter(
        (data) => hasAbnormalValue(data) || hasWarningValue(data)
      )
    : fixedPointData;

  // データロード（DataStoreから取得）
  useEffect(() => {
    if (!isLoading && !error) {
      // DataStoreから定点観測データを取得
      const data = dataStore.getFixedPointData({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        lineId: selectedLineId,
        searchTerm: searchTerm,
      });

      setFixedPointData(data);
    }
  }, [isLoading, error, dataStore, dateRange, selectedLineId, searchTerm]);

  // ページネーション
  const totalPages = Math.ceil(filteredFixedPointData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedData = filteredFixedPointData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ページが変わったときに先頭に戻す
  useEffect(() => {
    setCurrentPage(1);
  }, [dateRange, selectedLineId, searchTerm]);

  // ページ変更ハンドラ
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // ラインオプションを取得
  const lineOptions = dataStore.data?.masterData?.lines || [];

  // 日付選択ハンドラ
  const handleDateRangeChange = (type: "start" | "end", date: Date | null) => {
    setDateRange((prev) => ({
      ...prev,
      [type === "start" ? "startDate" : "endDate"]: date,
    }));
  };

  // 検索ハンドラ
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // ローディング表示
  if (isLoading) {
    return (
      <PageContainer title={PAGE_TITLES.FIXED_POINT}>
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">データを読み込み中...</p>
        </div>
      </PageContainer>
    );
  }

  // エラー表示
  if (error) {
    return (
      <PageContainer title={PAGE_TITLES.FIXED_POINT}>
        <div className="flex justify-center items-center h-40">
          <p className="text-red-500">データの読み込みに失敗しました</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={PAGE_TITLES.FIXED_POINT}>
      {/* 検索・フィルタリングエリア */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 検索バー */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="日付やラインで検索"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* ライン選択 */}
          <div className="w-full md:w-64">
            <Select value={selectedLineId} onValueChange={setSelectedLineId}>
              <SelectTrigger>
                <SelectValue placeholder="全てのライン" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全てのライン</SelectItem>
                {lineOptions.map((line) => (
                  <SelectItem key={line.id} value={line.id}>
                    {line.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 border rounded-lg p-2 bg-white">
            <Switch
              id="abnormal-filter"
              checked={showOnlyAbnormal}
              onCheckedChange={setShowOnlyAbnormal}
            />
            <Label
              htmlFor="abnormal-filter"
              className="cursor-pointer flex items-center gap-2"
            >
              異常値のみ表示
              {filteredFixedPointData.filter(
                (data) => hasAbnormalValue(data) || hasWarningValue(data)
              ).length > 0 && (
                <Badge variant="secondary">
                  {
                    filteredFixedPointData.filter(
                      (data) => hasAbnormalValue(data) || hasWarningValue(data)
                    ).length
                  }
                </Badge>
              )}
            </Label>
          </div>
        </div>

        {/* 日付範囲選択 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            {/* 開始日 */}
            <DatePicker
              date={dateRange.startDate || undefined}
              onSelect={(date) => handleDateRangeChange("start", date)}
              placeholder="開始日"
            />

            <span>～</span>

            {/* 終了日 */}
            <DatePicker
              date={dateRange.endDate || undefined}
              onSelect={(date) => handleDateRangeChange("end", date)}
              placeholder="終了日"
            />
          </div>
        </div>
      </div>

      {/* データ一覧 */}
      <div className="grid grid-cols-1 gap-3">
        {displayedData.length > 0 ? (
          displayedData.map((fixedData) => (
            <Card
              key={fixedData.id}
              className={`h-full transition-all duration-300 hover:shadow-lg hover:scale-102 ${COLORS.border.primary} rounded-xl`}
            >
              <CardContent className="p-4">
                <div
                  onClick={() => setSelectedData(fixedData)}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <p className="font-semibold text-lg">
                      {format(fixedData.date, "yyyy/MM/dd (EEE) HH:mm", {
                        locale: ja,
                      })}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-lg">
                        {fixedData.lineName}：定点観測
                      </p>
                      {hasAbnormalValue(fixedData) && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 font-medium">
                          異常値あり
                        </span>
                      )}
                      {!hasAbnormalValue(fixedData) &&
                        hasWarningValue(fixedData) && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 font-medium">
                            注意値あり
                          </span>
                        )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedData(fixedData)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 self-start sm:self-auto"
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
            該当する定点観測データがありません
          </div>
        )}
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={itemsPerPage}
          totalItems={filteredFixedPointData.length}
          onPageChange={handlePageChange}
          onPageSizeChange={() => {}} // この画面ではページサイズ変更なし
        />
      )}

      {/* 詳細ダイアログ */}
      {selectedData && (
        <FixedPointMonitoringDialog
          isOpen={!!selectedData}
          onClose={() => setSelectedData(null)}
          data={selectedData}
        />
      )}
    </PageContainer>
  );
};

export default FixedPointMonitoring;
