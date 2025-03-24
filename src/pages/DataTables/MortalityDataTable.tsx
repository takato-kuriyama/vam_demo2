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
  Image,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Calendar } from "../../components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useMasterData, useFishCountData } from "../../hooks/useDataStore";
import { FilterPanel } from "../../components/ui/filter-panel";
import { Pagination } from "../../components/ui/pagination";
import { exportTableDataToCsv } from "../../lib/export-utils";

// 選択可能なテーブル列の定義
const AVAILABLE_COLUMNS = [
  {
    id: "date",
    label: "日付",
    required: true,
    unit: "",
    excludeFromCsv: false,
  },
  {
    id: "tankName",
    label: "水槽名",
    required: true,
    unit: "",
    excludeFromCsv: false,
  },
  { id: "seedName", label: "種苗名", unit: "", excludeFromCsv: false },
  { id: "weight", label: "魚体重", unit: "g", excludeFromCsv: false },
  { id: "symptom", label: "症状", unit: "", excludeFromCsv: false },
  { id: "notes", label: "備考", unit: "", excludeFromCsv: false },
  { id: "photo", label: "写真", unit: "", excludeFromCsv: true }, // 写真列を追加、CSVからは除外
];

const MortalityDataTable = () => {
  // マスターデータとデータフック
  const { masterData, isLoading: isMasterLoading } = useMasterData();
  const {
    fishCountData,
    dateRange,
    setDateRange,
    isLoading: isFishCountLoading,
  } = useFishCountData();

  // UI状態
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    AVAILABLE_COLUMNS.map((col) => col.id) // デフォルトですべての列を表示
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTankId, setSelectedTankId] = useState<string>("all");
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  // 写真ダイアログ用の状態
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

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

  // 斃死データを加工してテーブルデータを作成
  useEffect(() => {
    if (isFishCountLoading || isMasterLoading) return;

    // 水槽名のマッピングを作成
    const tankMap = new Map();
    masterData.tanks.forEach((tank) => {
      tankMap.set(tank.id, tank.name);
    });

    // 斃死データのみをフィルタリング（mortality > 0）
    const mortalityRecords = fishCountData.filter((data) => data.mortality > 0);

    // 斃死データを加工
    const processedData = mortalityRecords.map((data) => {
      const date = new Date(data.timestamp);

      // 実際のアプリではより詳細な斃死情報を持つと想定
      // ここではダミーデータで補完
      return {
        id: data.id,
        date: date,
        tankId: data.tankId,
        tankName: tankMap.get(data.tankId) || data.tankId,
        seedName: "20241223近畿大学カワハギ",
        weight: Math.floor(Math.random() * 200 + 50), // ダミーデータ: 50-250g
        symptom: data.symptom || "食欲不振", // データがなければダミー値
        notes: data.memo || "-",
        hasPhoto: Math.random() > 0.3, // 70%の確率で写真あり（デモ用）
      };
    });

    setTableData(processedData);
  }, [fishCountData, masterData.tanks, isFishCountLoading, isMasterLoading]);

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
        (row.symptom && row.symptom.toLowerCase().includes(searchLower)) ||
        (row.notes && row.notes.toLowerCase().includes(searchLower))
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

  // CSVダウンロード機能（写真列を除外）
  const downloadCSV = () => {
    // CSVから除外するべき列をフィルタリング
    const csvColumns = AVAILABLE_COLUMNS.filter((col) => !col.excludeFromCsv);

    exportTableDataToCsv(
      csvColumns,
      filteredData,
      selectedColumns.filter((col) => col !== "photo"), // 写真列を除外
      "斃死data"
    );
  };

  if (isFishCountLoading || isMasterLoading) {
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
            searchPlaceholder="水槽名や症状で検索"
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
              { value: "all", label: "全ての水槽" },
              ...masterData.tanks
                .filter((tank) => tank.type === "breeding" && tank.active)
                .map((tank) => ({ value: tank.id, label: tank.name })),
            ]}
            selectedValue={selectedTankId}
            onSelectChange={setSelectedTankId}
            selectPlaceholder="全ての水槽"
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
          <div className="overflow-x-auto border rounded-lg">
            <Table className="min-w-full">
              <TableHeader className="sticky top-0 z-10 bg-white shadow-sm">
                <TableRow>
                  {AVAILABLE_COLUMNS.filter((col) =>
                    selectedColumns.includes(col.id)
                  ).map((column) => (
                    <TableHead
                      key={column.id}
                      className="bg-gray-50 whitespace-nowrap"
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

                      {selectedColumns.includes("tankName") && (
                        <TableCell>{row.tankName}</TableCell>
                      )}

                      {selectedColumns.includes("seedName") && (
                        <TableCell>{row.seedName}</TableCell>
                      )}

                      {selectedColumns.includes("weight") && (
                        <TableCell>{row.weight}</TableCell>
                      )}

                      {selectedColumns.includes("symptom") && (
                        <TableCell>{row.symptom}</TableCell>
                      )}

                      {selectedColumns.includes("notes") && (
                        <TableCell>{row.notes}</TableCell>
                      )}

                      {selectedColumns.includes("photo") && (
                        <TableCell>
                          {row.hasPhoto ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() =>
                                setSelectedPhoto(`斃死写真_${row.id}`)
                              }
                            >
                              <Image className="h-3 w-3" />
                              表示
                            </Button>
                          ) : (
                            <span className="text-gray-400 text-sm">なし</span>
                          )}
                        </TableCell>
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredData.length}
              onPageChange={(page) => setCurrentPage(page)}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              pageSizeOptions={[10, 20, 50, 100]}
            />
          )}
        </div>
      </CardContent>

      {/* 写真表示用ダイアログ */}
      {selectedPhoto && (
        <Dialog
          open={!!selectedPhoto}
          onOpenChange={() => setSelectedPhoto(null)}
        >
          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle>斃死写真</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center p-4">
              <div className="relative w-full aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-500 text-lg">{selectedPhoto}</div>
                  <div className="mt-2 text-gray-400">(デモ用画像)</div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setSelectedPhoto(null)}>閉じる</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default MortalityDataTable;
