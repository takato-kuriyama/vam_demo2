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
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Calendar } from "../../components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useMasterData, useEquipmentData } from "../../hooks/useDataStore";

// 選択可能なテーブル列の定義
const AVAILABLE_COLUMNS = [
  { id: "date", label: "日付", required: true },
  { id: "lineName", label: "ライン名", required: true },
  { id: "residualChlorine1", label: "残留塩素計値①" },
  { id: "residualChlorine2", label: "残留塩素計値②" },
  { id: "ammonia", label: "アンモニア濃度" },
  { id: "temperature", label: "水温" },
  { id: "current", label: "電解電流値" },
  { id: "polarity", label: "電解極性" },
  { id: "ph", label: "pH" },
  { id: "do", label: "DO" },
  { id: "flowRate", label: "ろ過流量" },
  { id: "voltage", label: "電圧量" },
];

const EquipmentDataTable = () => {
  // マスターデータとデータフック
  const { masterData, isLoading: isMasterLoading } = useMasterData();
  const {
    equipmentData,
    dateRange,
    setDateRange,
    isLoading: isEquipmentLoading,
  } = useEquipmentData();

  // UI状態
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    AVAILABLE_COLUMNS.filter(
      (col) =>
        col.required ||
        [
          "residualChlorine1",
          "ammonia",
          "temperature",
          "current",
          "polarity",
          "flowRate",
        ].includes(col.id)
    ).map((col) => col.id)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLineId, setSelectedLineId] = useState<string>("all");
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

  // 設備データを加工してテーブルデータを作成
  useEffect(() => {
    if (isEquipmentLoading || isMasterLoading) return;

    // ライン名のマッピングを作成
    const lineMap = new Map();
    masterData.lines.forEach((line) => {
      lineMap.set(line.id, line.name);
    });

    // 設備データを加工
    const processedData = equipmentData.map((data) => {
      const date = new Date(data.timestamp);

      return {
        id: data.id,
        date: date,
        lineId: data.lineId,
        lineName: lineMap.get(data.lineId) || data.lineId,
        residualChlorine1: data.residualChlorine1,
        residualChlorine2: data.residualChlorine2,
        ammonia: data.ammonia,
        temperature: data.temperature,
        current: data.current,
        polarity: data.polarity,
        flowRate: data.flowRate,
        // 以下はダミーデータ - 実際のアプリでは適切なデータソースから取得
        ph: (Math.random() * 1 + 6.5).toFixed(1),
        do: (Math.random() * 2 + 6).toFixed(2),
        voltage: (Math.random() * 0.3 + 1).toFixed(2),
      };
    });

    setTableData(processedData);
  }, [equipmentData, masterData.lines, isEquipmentLoading, isMasterLoading]);

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
    // ラインIDでフィルタリング
    if (selectedLineId !== "all" && row.lineId !== selectedLineId) {
      return false;
    }

    // 検索語でフィルタリング
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return row.lineName && row.lineName.toLowerCase().includes(searchLower);
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
    const filename = `ろ過部data_${format(new Date(), "yyyyMMdd")}.csv`;

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

  if (isEquipmentLoading || isMasterLoading) {
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
                  placeholder="ライン名で検索"
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

            {/* ライン選択 */}
            <div className="w-40">
              <Select value={selectedLineId} onValueChange={setSelectedLineId}>
                <SelectTrigger>
                  <SelectValue placeholder="全てのライン" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全てのライン</SelectItem>
                  {masterData.lines
                    .filter((line) => line.active)
                    .map((line) => (
                      <SelectItem key={line.id} value={line.id}>
                        {line.name}
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

                      {selectedColumns.includes("lineName") && (
                        <TableCell>{row.lineName}</TableCell>
                      )}

                      {selectedColumns.includes("residualChlorine1") && (
                        <TableCell>
                          {row.residualChlorine1.toFixed(1)}mg/L
                        </TableCell>
                      )}

                      {selectedColumns.includes("residualChlorine2") && (
                        <TableCell>
                          {row.residualChlorine2.toFixed(1)}mg/L
                        </TableCell>
                      )}

                      {selectedColumns.includes("ammonia") && (
                        <TableCell>{row.ammonia.toFixed(2)}ppm</TableCell>
                      )}

                      {selectedColumns.includes("temperature") && (
                        <TableCell>{row.temperature.toFixed(1)}℃</TableCell>
                      )}

                      {selectedColumns.includes("current") && (
                        <TableCell>{row.current.toFixed(1)}A</TableCell>
                      )}

                      {selectedColumns.includes("polarity") && (
                        <TableCell>{row.polarity}</TableCell>
                      )}

                      {selectedColumns.includes("ph") && (
                        <TableCell>{row.ph}</TableCell>
                      )}

                      {selectedColumns.includes("do") && (
                        <TableCell>{row.do}ppm</TableCell>
                      )}

                      {selectedColumns.includes("flowRate") && (
                        <TableCell>{row.flowRate.toFixed(1)}L/min</TableCell>
                      )}

                      {selectedColumns.includes("voltage") && (
                        <TableCell>{row.voltage}V</TableCell>
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

export default EquipmentDataTable;
