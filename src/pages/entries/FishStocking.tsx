import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { CalendarIcon, Plus } from "lucide-react";
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
import { InputField } from "../../components/ui/form-field";

// 仕入れ先の定義
const SUPPLIERS = [
  { id: "supplier1", name: "マリンテック" },
  { id: "supplier2", name: "バイオ愛媛" },
  { id: "supplier3", name: "近畿大学" },
];

// 魚種の定義
const FISH_SPECIES = [
  { id: "species1", name: "クエタマ" },
  { id: "species2", name: "カワハギ" },
];

// 池入れ記録の型定義
interface StockingRecord {
  id: string;
  date: Date;
  supplierId: string;
  speciesId: string;
  seedName: string;
  tankId: string;
  quantity: number;
  memo?: string;
}

const FishStocking: React.FC = () => {
  const { masterData, isLoading } = useMasterData();
  const [records, setRecords] = useState<StockingRecord[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // フォームデータ
  const [formData, setFormData] = useState<
    Omit<StockingRecord, "id" | "seedName">
  >({
    date: new Date(),
    supplierId: "",
    speciesId: "",
    tankId: "",
    quantity: 0,
    memo: "",
  });

  // 種苗名（自動生成）
  const [seedName, setSeedName] = useState("");

  // 種苗名の自動生成
  useEffect(() => {
    if (formData.supplierId && formData.speciesId) {
      const supplier = SUPPLIERS.find((s) => s.id === formData.supplierId);
      const species = FISH_SPECIES.find((s) => s.id === formData.speciesId);

      if (supplier && species) {
        const dateStr = format(formData.date, "yyyyMM", { locale: ja });
        setSeedName(`${dateStr}${supplier.name}${species.name}`);
      }
    }
  }, [formData.date, formData.supplierId, formData.speciesId]);

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

  // レコードの追加処理
  const addRecord = () => {
    // バリデーション
    if (
      !formData.supplierId ||
      !formData.speciesId ||
      !formData.tankId ||
      formData.quantity <= 0
    ) {
      alert("必須項目を入力してください");
      return;
    }

    const newRecord: StockingRecord = {
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
      supplierId: "",
      speciesId: "",
      tankId: "",
      quantity: 0,
      memo: "",
    });

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

  // サプライヤー名を取得
  const getSupplierName = (id: string) => {
    const supplier = SUPPLIERS.find((s) => s.id === id);
    return supplier ? supplier.name : id;
  };

  // 魚種名を取得
  const getSpeciesName = (id: string) => {
    const species = FISH_SPECIES.find((s) => s.id === id);
    return species ? species.name : id;
  };

  // 水槽名を取得
  const getTankName = (id: string) => {
    const tank = masterData.tanks.find((t) => t.id === id);
    return tank ? tank.name : id;
  };

  if (isLoading) {
    return (
      <PageContainer title="池入れ記録">
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">データを読み込み中...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="池入れ記録">
      <div className="space-y-6">
        {/* アクションボタン */}
        <div className="flex justify-end">
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            新規池入れ記録
          </Button>
        </div>

        {/* 記録一覧 */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">池入れ記録一覧</h2>

            {records.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>日付</TableHead>
                      <TableHead>仕入れ先</TableHead>
                      <TableHead>魚種</TableHead>
                      <TableHead>種苗名</TableHead>
                      <TableHead>池入れ先</TableHead>
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
                          {getSupplierName(record.supplierId)}
                        </TableCell>
                        <TableCell>
                          {getSpeciesName(record.speciesId)}
                        </TableCell>
                        <TableCell>{record.seedName}</TableCell>
                        <TableCell>{getTankName(record.tankId)}</TableCell>
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
                池入れ記録がありません。「新規池入れ記録」ボタンをクリックして記録を追加してください。
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 池入れ記録追加ダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>新規池入れ記録</DialogTitle>
            <DialogDescription>
              新しい池入れの情報を入力してください
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* 日付選択 */}
            <FormField id="date" label="日付" required>
              <DatePicker
                date={selectedDate}
                onSelect={handleDateChange}
                placeholder="日付を選択"
              />
            </FormField>

            {/* 仕入れ先選択 */}
            <div className="space-y-2">
              <Label htmlFor="supplierId">仕入れ先 *</Label>
              <Select
                value={formData.supplierId}
                onValueChange={(value) =>
                  handleSelectChange("supplierId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="仕入れ先を選択" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPLIERS.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 魚種選択 */}
            <div className="space-y-2">
              <Label htmlFor="speciesId">魚種 *</Label>
              <Select
                value={formData.speciesId}
                onValueChange={(value) =>
                  handleSelectChange("speciesId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="魚種を選択" />
                </SelectTrigger>
                <SelectContent>
                  {FISH_SPECIES.map((species) => (
                    <SelectItem key={species.id} value={species.id}>
                      {species.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 種苗名（自動生成） */}
            <div className="space-y-2">
              <Label htmlFor="seedName">種苗名（自動生成）</Label>
              <Input
                id="seedName"
                value={seedName}
                readOnly
                className="bg-gray-100"
              />
            </div>

            {/* 池入れ先選択 */}
            <div className="space-y-2">
              <Label htmlFor="tankId">池入れ先 *</Label>
              <Select
                value={formData.tankId}
                onValueChange={(value) => handleSelectChange("tankId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="水槽を選択" />
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

            {/* 尾数入力 */}
            <InputField
              id="quantity"
              label="尾数"
              name="quantity"
              type="number"
              value={formData.quantity || ""}
              onChange={handleInputChange}
              min={1}
              required
            />

            {/* メモ入力 */}
            <InputField
              id="memo"
              label="メモ"
              name="memo"
              value={formData.memo || ""}
              onChange={handleInputChange}
              placeholder="特記事項があれば入力してください"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={addRecord}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default FishStocking;
