import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Search,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "../../components/card";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import { Checkbox } from "../../components/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/popover";
import { Calendar } from "../../components/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/table";
import {
  useMasterData,
  useBreedingData,
  useFeedingData,
} from "../../hooks/useDataStore";

// 選択可能なテーブル列の定義
const AVAILABLE_COLUMNS = [
  { id: "date", label: "日付", required: true },
  { id: "tankName", label: "水槽名", required: true },
  { id: "seedName", label: "種苗名" },
  { id: "fishCount", label: "尾数" },
  { id: "waterTemp", label: "水温" },
  { id: "ph", label: "pH" },
  { id: "ammonia", label: "アンモニア" },
  { id: "feedAmount", label: "給餌量(合計)" },
];

const BreedingDataTable = () => {
  // マスターデータとデータフック
  const { masterData, isLoading: isMasterLoading } = useMasterData();
  const {
    breedingData,
    dateRange,
    setDateRange,
    isLoading: isBreedingLoading,
  } = useBreedingData();
  const { feedingData, isLoading: isFeedingLoading } = useFeedingData();

  // UI状態
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    AVAILABLE_COLUMNS.map((col) => col.id) // 全項目を初期選択状態にする
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTankId, setSelectedTankId] = useState<string>("all");
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  // フィルタリングと結合したテーブルデータ
  const [tableData, setTableData] = useState<any[]>([]);

  // 日付選択状態
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  // 日付範囲をフックに設定
  useEffect(() => {
    setDateRange({
      startDate: startDate || null,
      endDate: endDate || null,
    });
  }, [startDate, endDate, setDateRange]);

  // 飼育データと給餌データを結合してテーブルデータを作成
  useEffect(() => {
    if (isBreedingLoading || isFeedingLoading || isMasterLoading) return;

    // 水槽IDと名前のマッピングを作成
    const tankMap = new Map();
    masterData.tanks.forEach((tank) => {
      tankMap.set(tank.id, tank.name);
    });

    // 日ごとの給餌量合計を計算
    const feedingTotals = new Map();
    feedingData.forEach((feed) => {
      const date = new Date(feed.timestamp).toISOString().split("T")[0];
      const tankId = feed.tankId;
      const key = `${date}-${tankId}`;

      const amount1 = parseFloat(feed.feedAmount1) || 0;
      const amount2 = parseFloat(feed.feedAmount2) || 0;
      const total = amount1 + amount2;

      if (feedingTotals.has(key)) {
        feedingTotals.set(key, feedingTotals.get(key) + total);
      } else {
        feedingTotals.set(key, total);
      }
    });

    // 飼育データを加工
    const processedData = breedingData.map((data) => {
      const date = new Date(data.timestamp);
      const dateStr = date.toISOString().split("T")[0];
      const tankId = data.tankId;
      const key = `${dateStr}-${tankId}`;

      // 以下はダミーデータ - 実際のアプリでは適切なデータソースから取得
      return {
        id: `${dateStr}-${tankId}`,
        date: date,
        dateStr: dateStr, // 日付文字列を追加（グループ化に使用）
        tankId: tankId,
        tankName: tankMap.get(tankId) || tankId,
        seedName: "20250228マリンテックカワハギ", // ダミーデータ
        fishCount: Math.floor(Math.random() * 1000) + 100, // ダミーデータ
        waterTemp: data.temperature,
        ph: data.ph,
        ammonia: (Math.random() * 0.5 + 0.1).toFixed(2), // ダミーデータ
        feedAmount: feedingTotals.get(key) || 0,
      };
    });

    // 日付ごとにグループ化して1日1行にする
    const groupedByDate = new Map();

    processedData.forEach((data) => {
      const { dateStr, tankId } = data;
      const key = `${dateStr}-${tankId}`;

      // 同じ日付・水槽の組み合わせでまだデータがなければ追加
      if (!groupedByDate.has(key)) {
        groupedByDate.set(key, data);
      }
    });

    // グループ化されたデータを配列に変換
    const uniqueData = Array.from(groupedByDate.values());

    // 日付の新しい順にソート
    uniqueData.sort((a, b) => b.date.getTime() - a.date.getTime());

    setTableData(uniqueData);
  }, [
    breedingData,
    feedingData,
    masterData.tanks,
    isBreedingLoading,
    isFeedingLoading,
    isMasterLoading,
  ]);

  // 列の表示/非表示を切り替え
  const toggleColumn = (columnId: string) => {
    if (AVAILABLE_COLUMNS.find((col) => col.id === columnId)?.required) {
      return; // 必須列は切り替え不可
    }

    setSelectedColumns((prev) => {
      if (prev.includes(columnId)) {
        return prev.filter((id) => id !== columnId);
      } else {
        return [...prev, columnId];
      }
    });
  };

  // テーブルデータをフィルタリング
  const filteredData = tableData.filter((row) => {
    // 水槽IDでフィルタリング
    if (selectedTankId !== "all" && row.tankId !== selectedTankId) {
      return false;
    }

    // 検索語でフィルタリング
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (row.tankName && row.tankName.toLowerCase().includes(searchLower)) ||
        (row.seedName && row.seedName.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  // ページネーション用のデータ
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // CSVダウンロード機能
  const downloadCSV = () => {
    // 選択された列のヘッダー
    const headers = AVAILABLE_COLUMNS.filter((col) =>
      selectedColumns.includes(col.id)
    ).map((col) => col.label);

    // データ行の作成
    const rows = filteredData.map((row) => {
      return selectedColumns.map((colId) => {
        if (colId === "date") {
          return format(row.date, "yyyy/MM/dd", { locale: ja });
        }
        return row[colId] !== undefined
          ? String(row[colId]).replace(/,/g, "、")
          : ""; // カンマをリプレース
      });
    });

    // CSVデータをダブルクォートで囲む処理
    const escapeCsv = (data: string) => `"${data.replace(/"/g, '""')}"`;

    // CSVデータの作成（各フィールドをダブルクォートで囲む）
    const csvContent = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\n");

    // UTF-8 BOMを追加
    const BOM = "\uFEFF";
    const csvWithBOM = BOM + csvContent;

    // 別ウィンドウで開かせる（このアプローチではブラウザが文字エンコーディングを適切に処理する）
    const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    // Excelで開くために.xls拡張子を使用（Excelはこれを認識してインポートウィザードを起動する）
    const filename = `飼育槽data_${format(new Date(), "yyyyMMdd")}.csv`;

    if (navigator.msSaveBlob) {
      // IEとEdge用
      navigator.msSaveBlob(blob, filename);
    } else {
      // その他のブラウザ
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // 数秒後にBlob URLをクリーンアップ
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  if (isBreedingLoading || isFeedingLoading || isMasterLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-500">データを読み込み中...</p>
      </div>
    );
  }

  return (
    <Card className="mt-4">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* フィルタリングエリア */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* 検索 */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="水槽名や種苗で検索"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* 日付範囲 */}
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap">期間:</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-fit flex items-center gap-2"
                  >
                    {startDate
                      ? format(startDate, "yyyy/MM/dd", { locale: ja })
                      : "開始日"}
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <span>～</span>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-fit flex items-center gap-2"
                  >
                    {endDate
                      ? format(endDate, "yyyy/MM/dd", { locale: ja })
                      : "終了日"}
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* 水槽選択 */}
            <div className="w-40">
              <Select value={selectedTankId} onValueChange={setSelectedTankId}>
                <SelectTrigger>
                  <SelectValue placeholder="全ての水槽" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全ての水槽</SelectItem>
                  {masterData.tanks
                    .filter((tank) => tank.type === "breeding" && tank.active)
                    .map((tank) => (
                      <SelectItem key={tank.id} value={tank.id}>
                        {tank.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 列選択とCSVダウンロード */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    表示項目
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 bg-white">
                  <div className="space-y-2">
                    <h4 className="font-medium">表示する項目を選択</h4>
                    <div className="space-y-1">
                      {AVAILABLE_COLUMNS.map((column) => (
                        <div
                          key={column.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`column-${column.id}`}
                            checked={selectedColumns.includes(column.id)}
                            onCheckedChange={() => toggleColumn(column.id)}
                            disabled={column.required}
                          />
                          <Label
                            htmlFor={`column-${column.id}`}
                            className="cursor-pointer text-sm"
                          >
                            {column.label}
                            {column.required && (
                              <span className="text-xs text-gray-500 ml-1">
                                (必須)
                              </span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <Button
              onClick={downloadCSV}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              CSVダウンロード
            </Button>
          </div>

          {/* テーブル */}
          <div className="overflow-x-auto border rounded-lg">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  {AVAILABLE_COLUMNS.filter((col) =>
                    selectedColumns.includes(col.id)
                  ).map((column) => (
                    <TableHead
                      key={column.id}
                      className="bg-gray-50 whitespace-nowrap"
                    >
                      {column.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      {selectedColumns.includes("date") && (
                        <TableCell className="whitespace-nowrap">
                          {format(row.date, "yyyy/MM/dd", { locale: ja })}
                        </TableCell>
                      )}

                      {selectedColumns.includes("tankName") && (
                        <TableCell>{row.tankName}</TableCell>
                      )}

                      {selectedColumns.includes("seedName") && (
                        <TableCell>{row.seedName}</TableCell>
                      )}

                      {selectedColumns.includes("fishCount") && (
                        <TableCell>{row.fishCount}</TableCell>
                      )}

                      {selectedColumns.includes("waterTemp") && (
                        <TableCell>{row.waterTemp}℃</TableCell>
                      )}

                      {selectedColumns.includes("ph") && (
                        <TableCell>{row.ph}</TableCell>
                      )}

                      {selectedColumns.includes("ammonia") && (
                        <TableCell>{row.ammonia}ppm</TableCell>
                      )}

                      {selectedColumns.includes("feedAmount") && (
                        <TableCell>{row.feedAmount}g</TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={selectedColumns.length}
                      className="text-center py-6 text-gray-500"
                    >
                      データがありません
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="text-sm text-gray-600">
                  {currentPage} / {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">表示件数：</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    setPageSize(parseInt(value));
                    setCurrentPage(1); // ページサイズ変更時は1ページ目に戻る
                  }}
                >
                  <SelectTrigger className="w-16">
                    <SelectValue placeholder="20" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BreedingDataTable;
