import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Plus } from "lucide-react";
import { PageContainer } from "../../components/layouts/PageContainer";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../components/ui/dialog";
import { useMasterData } from "../../hooks/useDataStore";
import { DatePicker } from "../../components/ui/date-picker";
import { FormField } from "../../components/ui/form-field";

// 池入れ記録の型定義 (実際のアプリではストックから取得)
interface StockingRecord {
  id: string;
  date: Date;
  supplierId: string;
  speciesId: string;
  seedName: string;
  tankId: string;
  quantity: number;
}

// 移動記録の型定義
interface TransferRecord {
  id: string;
  date: Date;
  sourceTankId: string;
  seedName: string;
  targetTankId: string;
  quantity: number;
  memo?: string;
}

// サンプルデータ (実際のアプリではAPIから取得)
const sampleStockingRecords: StockingRecord[] = [
  {
    id: "stock1",
    date: new Date("2025-01-15"),
    supplierId: "supplier1",
    speciesId: "species1",
    seedName: "202501MTカワハギ",
    tankId: "A-1",
    quantity: 500,
  },
  {
    id: "stock2",
    date: new Date("2025-02-20"),
    supplierId: "supplier2",
    speciesId: "species2",
    seedName: "202502KUクエタマ",
    tankId: "A-2",
    quantity: 800,
  },
  {
    id: "stock3",
    date: new Date("2025-02-28"),
    supplierId: "supplier3",
    speciesId: "species3",
    seedName: "202502MTカワハギ",
    tankId: "B-1",
    quantity: 300,
  },
];

const FishTransfer: React.FC = () => {
  const { masterData, isLoading } = useMasterData();
  const [records, setRecords] = useState<TransferRecord[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // フォームデータ
  const [formData, setFormData] = useState<
    Omit<TransferRecord, "id" | "seedName">
  >({
    date: new Date(),
    sourceTankId: "",
    targetTankId: "",
    quantity: 0,
    memo: "",
  });

  // 選択されたタンクの種苗名
  const [seedName, setSeedName] = useState("");
  const [availableSeeds, setAvailableSeeds] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedSeedId, setSelectedSeedId] = useState("");

  // タンクオプションの取得 (アクティブな飼育槽のみ)
  const tankOptions = masterData.tanks
    .filter((tank) => tank.active && tank.type === "breeding")
    .sort((a, b) => {
      // ラインID（A, B, ...）で最初にソート
      const lineComparison = a.lineId.localeCompare(b.lineId);
      if (lineComparison !== 0) return lineComparison;

      // 同じラインの場合は番号でソート
      const aNumber = parseInt(a.id.split("-")[1]);
      const bNumber = parseInt(b.id.split("-")[1]);
      return aNumber - bNumber;
    });

  // 元のタンクが変更されたときに利用可能な種苗を更新
  useEffect(() => {
    if (formData.sourceTankId) {
      // 実際のアプリではAPIから取得する
      // ここではサンプルデータを使用
      const availableSeeds = sampleStockingRecords
        .filter((record) => record.tankId === formData.sourceTankId)
        .map((record) => ({
          id: record.id,
          name: record.seedName,
        }));

      setAvailableSeeds(availableSeeds);

      // 最初の種苗を選択
      if (availableSeeds.length > 0) {
        setSelectedSeedId(availableSeeds[0].id);
        setSeedName(availableSeeds[0].name);
      } else {
        setSelectedSeedId("");
        setSeedName("");
      }
    } else {
      setAvailableSeeds([]);
      setSelectedSeedId("");
      setSeedName("");
    }
  }, [formData.sourceTankId]);

  // 選択された種苗が変更されたとき
  useEffect(() => {
    if (selectedSeedId) {
      const seed = availableSeeds.find((s) => s.id === selectedSeedId);
      if (seed) {
        setSeedName(seed.name);
      }
    }
  }, [selectedSeedId, availableSeeds]);

  // レコードの追加処理
  const addRecord = () => {
    // バリデーション
    if (
      !formData.sourceTankId ||
      !formData.targetTankId ||
      !seedName ||
      formData.quantity <= 0
    ) {
      alert("必須項目を入力してください");
      return;
    }

    if (formData.sourceTankId === formData.targetTankId) {
      alert("移動元と移動先が同じです");
      return;
    }

    const newRecord: TransferRecord = {
      id: Date.now().toString(), // 簡易的なID生成
      ...formData,
      seedName,
      date: new Date(formData.date), // 日付のコピーを作成
    };

    // レコードを追加
    setRecords([...records, newRecord]);

    // フォームをリセット
    setFormData({
      date: new Date(),
      sourceTankId: "",
      targetTankId: "",
      quantity: 0,
      memo: "",
    });
    setSeedName("");
    setSelectedSeedId("");

    // ダイアログを閉じる
    setIsDialogOpen(false);

    // TODO: 実際のアプリケーションではデータを保存する処理を追加
  };

  // 入力変更ハンドラ
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  // 日付変更ハンドラ
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setFormData((prev) => ({ ...prev, date }));
    }
  };

  // セレクト変更ハンドラ
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 水槽名を取得
  const getTankName = (id: string) => {
    if (id === "shipping") return "出荷";
    const tank = masterData.tanks.find((t) => t.id === id);
    return tank ? tank.name : id;
  };

  if (isLoading) {
    return (
      <PageContainer title="水槽間移動記録">
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">データを読み込み中...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="水槽間移動記録">
      <div className="space-y-6">
        {/* アクションボタン */}
        <div className="flex justify-end">
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            新規移動記録
          </Button>
        </div>

        {/* 記録一覧 */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">水槽間移動記録一覧</h2>

            {records.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>日付</TableHead>
                      <TableHead>移動元水槽</TableHead>
                      <TableHead>種苗名</TableHead>
                      <TableHead>移動先水槽</TableHead>
                      <TableHead>尾数</TableHead>
                      <TableHead>メモ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          {format(record.date, "yyyy/MM/dd", { locale: ja })}
                        </TableCell>
                        <TableCell>
                          {getTankName(record.sourceTankId)}
                        </TableCell>
                        <TableCell>{record.seedName}</TableCell>
                        <TableCell>
                          {getTankName(record.targetTankId)}
                        </TableCell>
                        <TableCell>
                          {record.quantity.toLocaleString()}
                        </TableCell>
                        <TableCell>{record.memo || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                水槽間移動記録がありません。「新規移動記録」ボタンをクリックして記録を追加してください。
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 移動記録追加ダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-white max-h-[70vh] overflow-y-auto w-[95vw] md:w-full">
          <DialogHeader>
            <DialogTitle>新規水槽間移動記録</DialogTitle>
            <DialogDescription>
              水槽間の魚の移動情報を入力してください
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 overflow-y-auto">
            {/* 日付選択 */}
            <FormField id="date" label="日付" required>
              <DatePicker
                date={selectedDate}
                onSelect={handleDateChange}
                placeholder="日付を選択"
              />
            </FormField>

            {/* 移動元水槽選択 */}
            <div className="space-y-2">
              <Label htmlFor="sourceTankId">移動元水槽 *</Label>
              <Select
                value={formData.sourceTankId}
                onValueChange={(value) =>
                  handleSelectChange("sourceTankId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="移動元水槽を選択" />
                </SelectTrigger>
                <SelectContent>
                  {tankOptions.map((tank) => (
                    <SelectItem key={tank.id} value={tank.id}>
                      {tank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 種苗選択 */}
            <div className="space-y-2">
              <Label htmlFor="seedId">種苗名 *</Label>
              {availableSeeds.length > 0 ? (
                <Select
                  value={selectedSeedId}
                  onValueChange={setSelectedSeedId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="種苗を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSeeds.map((seed) => (
                      <SelectItem key={seed.id} value={seed.id}>
                        {seed.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value="選択した水槽に種苗がありません"
                  readOnly
                  className="bg-gray-100 text-gray-500"
                />
              )}
            </div>

            {/* 移動先水槽選択 */}
            <div className="space-y-2">
              <Label htmlFor="targetTankId">移動先水槽 *</Label>
              <Select
                value={formData.targetTankId}
                onValueChange={(value) =>
                  handleSelectChange("targetTankId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="移動先水槽を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shipping">出荷</SelectItem>

                  {/* 水槽の選択肢 */}
                  <SelectItem
                    value="tankSeparator"
                    disabled
                    className="py-2 font-semibold text-gray-500"
                  >
                    ― 水槽 ―
                  </SelectItem>

                  {tankOptions
                    .filter((tank) => tank.id !== formData.sourceTankId) // 移動元と同じ水槽は除外
                    .map((tank) => (
                      <SelectItem key={tank.id} value={tank.id}>
                        {tank.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* 尾数入力 */}
            <div className="space-y-2">
              <Label htmlFor="quantity">尾数 *</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                inputMode="numeric"
                value={formData.quantity || ""}
                onChange={handleInputChange}
                min={1}
                required
              />
            </div>

            {/* メモ入力 */}
            <div className="space-y-2">
              <Label htmlFor="memo">メモ</Label>
              <Input
                id="memo"
                name="memo"
                value={formData.memo || ""}
                onChange={handleInputChange}
                placeholder="特記事項があれば入力してください"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              キャンセル
            </Button>
            <Button
              onClick={addRecord}
              disabled={
                !formData.sourceTankId ||
                !formData.targetTankId ||
                !seedName ||
                formData.quantity <= 0
              }
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default FishTransfer;
