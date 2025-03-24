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
import { FilterPanel } from "../../components/ui/filter-panel";
import { exportTableDataToCsv } from "../../lib/export-utils";

// 選択可能なテーブル列の定義
const AVAILABLE_COLUMNS = [
  { id: "date", label: "日付", required: true, unit: "" },
  { id: "lineName", label: "ライン名", required: true, unit: "" },
  { id: "residualChlorine1", label: "残留塩素計値①", unit: "mg/L" },
  { id: "residualChlorine2", label: "残留塩素計値②", unit: "mg/L" },
  { id: "ammonia", label: "アンモニア濃度", unit: "ppm" },
  { id: "temperature", label: "水温", unit: "℃" },
  { id: "current", label: "電解電流値", unit: "A" },
  { id: "polarity", label: "電解極性", unit: "" },
  { id: "ph", label: "pH", unit: "" },
  { id: "do", label: "DO", unit: "ppm" },
  { id: "flowRate", label: "ろ過流量", unit: "L/min" },
  { id: "voltage", label: "電圧量", unit: "V" },
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
    exportTableDataToCsv(
      AVAILABLE_COLUMNS,
      filteredData,
      selectedColumns,
      "ろ過部data"
    );
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
          <FilterPanel
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="ライン名で検索"
            startDate={startDate}
            endDate={endDate}
            onDateChange={(type, date) => {
              if (type === "start") {
                setStartDate(date);
              } else {
                setEndDate(date);
              }
            }}
            selectOptions={[
              { value: "all", label: "全てのライン" },
              ...masterData.lines
                .filter((line) => line.active)
                .map((line) => ({ value: line.id, label: line.name })),
            ]}
            selectedValue={selectedLineId}
            onSelectChange={setSelectedLineId}
            selectPlaceholder="全てのライン"
          />

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
          <div className="overflow-x-auto overflow-y-auto border rounded-lg relative max-h-[70vh]">
            <Table className="min-w-full">
              <TableHeader className="sticky top-0 z-20 bg-white shadow-sm">
                <TableRow>
                  {AVAILABLE_COLUMNS.filter((col) =>
                    selectedColumns.includes(col.id)
                  ).map((column) => (
                    <TableHead
                      key={column.id}
                      className="bg-gray-50 whitespace-nowrap py-3"
                      style={{ position: "sticky", top: 0 }}
                    >
                      {column.label}
                      {column.unit ? ` (${column.unit})` : ""}
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
                          {row.residualChlorine1.toFixed(1)}
                        </TableCell>
                      )}

                      {selectedColumns.includes("residualChlorine2") && (
                        <TableCell>
                          {row.residualChlorine2.toFixed(1)}
                        </TableCell>
                      )}

                      {selectedColumns.includes("ammonia") && (
                        <TableCell>{row.ammonia.toFixed(2)}</TableCell>
                      )}

                      {selectedColumns.includes("temperature") && (
                        <TableCell>{row.temperature.toFixed(1)}</TableCell>
                      )}

                      {selectedColumns.includes("current") && (
                        <TableCell>{row.current.toFixed(1)}</TableCell>
                      )}

                      {selectedColumns.includes("polarity") && (
                        <TableCell>{row.polarity}</TableCell>
                      )}

                      {selectedColumns.includes("ph") && (
                        <TableCell>{row.ph}</TableCell>
                      )}

                      {selectedColumns.includes("do") && (
                        <TableCell>{row.do}</TableCell>
                      )}

                      {selectedColumns.includes("flowRate") && (
                        <TableCell>{row.flowRate.toFixed(1)}</TableCell>
                      )}

                      {selectedColumns.includes("voltage") && (
                        <TableCell>{row.voltage}</TableCell>
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
