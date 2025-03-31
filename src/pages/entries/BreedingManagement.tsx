import React, { useState, useEffect } from "react";
import { isValid } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { PageContainer } from "../../components/layouts/PageContainer";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input"; // 追加: Input コンポーネントをインポート
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
import { PAGE_TITLES } from "../../constants/routes";
import {
  BreedingFormData,
  FeedEntry,
  MortalityRecord,
  CustomField,
} from "../../types/dataManagement";
import { useMasterData } from "../../hooks/useDataStore";

// 分割したコンポーネントのインポート
import FeedEntryForm from "../../components/features/breeding/FeedEntryForm";
import MortalityRecordList from "../../components/features/breeding/MortalityRecordList";
import MortalityRecordDialog from "../../components/features/breeding/MortalityRecordDialog";
// カスタム項目関連のインポートを削除

// ユーティリティ関数のインポート
import {
  formatDateForInput,
  formatDateForDisplay,
  createDefaultFeedEntry,
  loadPersistedCustomFields,
  saveCustomFieldsToStorage,
  loadLastFeedEntries,
  saveFeedEntriesToStorage,
  createEmptyMortalityRecord,
  createCustomField,
} from "../../lib/breedingForm-utils";

const BreedingManagement: React.FC = () => {
  const { masterData, isLoading } = useMasterData();
  //const { dataStore } = useDataStore();
  const [selectedTank, setSelectedTank] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // フォームデータ
  const [formData, setFormData] = useState<BreedingFormData>({
    dateTime: formatDateForInput(new Date()),
    tankId: "",
    waterTemp: "",
    feedingActivity: "",
    mortality: 0, // 総斃死数
    transferIn: "",
    transferOut: "",
    culling: "",
    memo: "",
    // 新規追加フィールド
    averageWeight: "",
    nh4: "",
    no2: "",
    no3: "",
    tClo: "",
    cloDp: "",
    ph: "",
    csvExportData: {}, // CSV出力用データ
  });

  // 給餌情報
  const [feedEntries, setFeedEntries] = useState<FeedEntry[]>([]);

  // 斃死記録
  const [mortalityRecords, setMortalityRecords] = useState<MortalityRecord[]>(
    []
  );

  // 斃死記録ダイアログ関連
  const [isAddMortalityOpen, setIsAddMortalityOpen] = useState(false);
  const [mortalityModalData, setMortalityModalData] = useState<MortalityRecord>(
    createEmptyMortalityRecord()
  );

  // カスタム項目関連の状態を削除

  // タンクオプションの取得 (アクティブなもののみ)
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

  // 初期化処理
  useEffect(() => {
    // 利用可能なタンクがあれば最初のものを選択
    if (tankOptions.length > 0 && !selectedTank) {
      setSelectedTank(tankOptions[0].id);
      setFormData((prev) => ({ ...prev, tankId: tankOptions[0].id }));
    }
    // カスタム項目の読み込み処理を削除
  }, [tankOptions, selectedTank]);

  // 前回の給餌情報をロード
  useEffect(() => {
    const lastFeedEntries = loadLastFeedEntries();
    if (lastFeedEntries && lastFeedEntries.length > 0) {
      setFeedEntries(lastFeedEntries);
    } else {
      // デフォルトの給餌エントリ
      setFeedEntries([createDefaultFeedEntry()]);
    }
  }, []);

  // 日付変更時の処理
  useEffect(() => {
    // 日付が変わったら、その日のデータを取得する処理などをここに記述
    setFormData((prev) => ({
      ...prev,
      dateTime: formatDateForInput(currentDate),
    }));

    // データベースから該当日のデータを取得する (未実装)
    // loadDailyData(selectedTank, currentDate);
  }, [currentDate, selectedTank]);

  // タンク選択変更時の処理
  const handleTankChange = (tankId: string) => {
    setSelectedTank(tankId);
    setFormData((prev) => ({ ...prev, tankId }));

    // タンクが変わったら、その日のデータを再取得
    // loadDailyData(tankId, currentDate);
  };

  // 日付を前日に移動
  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  // 日付を翌日に移動
  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  // 日付選択ハンドラ
  const handleDateChange = (date: Date | undefined) => {
    if (date && isValid(date)) {
      setCurrentDate(date);
    }
  };

  // 斃死記録ダイアログを開く
  const openAddMortalityDialog = () => {
    setMortalityModalData(createEmptyMortalityRecord());
    setIsAddMortalityOpen(true);
  };

  // 斃死記録を編集
  const editMortalityRecord = (id: string) => {
    const record = mortalityRecords.find((r) => r.id === id);
    if (record) {
      setMortalityModalData({ ...record });
      setIsAddMortalityOpen(true);
    }
  };

  // 斃死記録を削除
  const removeMortalityRecord = (id: string) => {
    setMortalityRecords((prev) => prev.filter((record) => record.id !== id));
  };

  // 斃死記録の追加・更新を確定
  const saveMortalityRecord = (record: MortalityRecord) => {
    // 新規作成か更新かを判定
    const isNewRecord = !record.id;

    if (isNewRecord) {
      // 新規作成
      const newRecord = {
        ...record,
        id: Date.now().toString(),
      };
      setMortalityRecords([...mortalityRecords, newRecord]);
    } else {
      // 更新
      setMortalityRecords((prev) =>
        prev.map((item) => (item.id === record.id ? record : item))
      );
    }

    setIsAddMortalityOpen(false);
  };

  // カスタム項目関連のメソッドを削除

  // フォーム入力ハンドラ
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // フォームの送信処理
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 前回の給餌情報を保存
    saveFeedEntriesToStorage(feedEntries);

    // ここでデータベースに保存する処理を実装（未実装）
    // saveBreedingData(formData, feedEntries, mortalityRecords, customFields);

    alert("データが保存されました");

    // カスタム項目関連の処理を削除
  };

  if (isLoading) {
    return (
      <PageContainer title={PAGE_TITLES.BREEDING_MANAGEMENT}>
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">データを読み込み中...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={PAGE_TITLES.BREEDING_MANAGEMENT}>
      <div>
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 水槽選択 */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="w-full sm:w-1/2">
                  <Label htmlFor="tankId">水槽</Label>
                  <Select value={selectedTank} onValueChange={handleTankChange}>
                    <SelectTrigger id="tankId">
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
              </div>

              {/* 日付ナビゲーター */}
              <div className="flex items-center justify-center space-x-4 mb-6">
                <button
                  type="button"
                  onClick={goToPreviousDay}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                      <h2 className="text-xl font-medium">
                        {formatDateForDisplay(currentDate)}
                      </h2>
                      <CalendarIcon className="h-4 w-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-white w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={currentDate}
                      onSelect={handleDateChange}
                    />
                  </PopoverContent>
                </Popover>

                <button
                  type="button"
                  onClick={goToNextDay}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              {/* 給餌情報フォーム */}
              <FeedEntryForm
                feedEntries={feedEntries}
                onChange={setFeedEntries}
              />

              {/* 総斃死数フィールド - 新規追加 */}
              <div className="space-y-2">
                <Label htmlFor="mortality">総斃死数（匹）</Label>
                <Input
                  id="mortality"
                  name="mortality"
                  type="number"
                  inputMode="numeric"
                  value={formData.mortality || ""}
                  onChange={handleInputChange}
                  placeholder="総斃死数を入力"
                  className="w-full max-w-[200px]"
                />
              </div>

              {/* 斃死情報リスト - mortalityは渡さないように変更 */}
              <MortalityRecordList
                mortalityRecords={mortalityRecords}
                onAddClick={openAddMortalityDialog}
                onEditRecord={editMortalityRecord}
                onRemoveRecord={removeMortalityRecord}
              />

              {/* 平均魚体重フィールド - 新規追加 */}
              <div className="space-y-2">
                <Label htmlFor="averageWeight">平均魚体重 (g)</Label>
                <Input
                  id="averageWeight"
                  name="averageWeight"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  value={formData.averageWeight || ""}
                  onChange={handleInputChange}
                  placeholder="平均魚体重を入力"
                  className="w-full max-w-[200px]"
                />
              </div>

              {/* 水質情報セクション - 新規追加 */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nh4">NH4 (mg/L)</Label>
                    <Input
                      id="nh4"
                      name="nh4"
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      value={formData.nh4 || ""}
                      onChange={handleInputChange}
                      placeholder="NH4を入力"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="no2">NO2 (mg/L)</Label>
                    <Input
                      id="no2"
                      name="no2"
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      value={formData.no2 || ""}
                      onChange={handleInputChange}
                      placeholder="NO2を入力"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="no3">NO3 (mg/L)</Label>
                    <Input
                      id="no3"
                      name="no3"
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      value={formData.no3 || ""}
                      onChange={handleInputChange}
                      placeholder="NO3を入力"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tClo">T-ClO (mg/L)</Label>
                    <Input
                      id="tClo"
                      name="tClo"
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      value={formData.tClo || ""}
                      onChange={handleInputChange}
                      placeholder="T-ClOを入力"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cloDp">ClO-DP (mg/L)</Label>
                    <Input
                      id="cloDp"
                      name="cloDp"
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      value={formData.cloDp || ""}
                      onChange={handleInputChange}
                      placeholder="ClO-DPを入力"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ph">pH</Label>
                    <Input
                      id="ph"
                      name="ph"
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      value={formData.ph || ""}
                      onChange={handleInputChange}
                      placeholder="pHを入力"
                    />
                  </div>
                </div>
              </div>

              {/* カスタム項目リスト
              <CustomFieldsList
                customFields={customFields}
                onAddClick={() => setIsCustomFieldModalOpen(true)}
                onRemoveField={removeCustomField}
                onChangeField={handleCustomFieldChange}
              /> */}

              {/* メモ */}
              <div className="space-y-2">
                <Label htmlFor="memo">メモ</Label>
                <Textarea
                  id="memo"
                  name="memo"
                  rows={3}
                  value={formData.memo}
                  onChange={handleInputChange}
                  placeholder="特記事項があればご記入ください"
                />
              </div>

              <Button type="submit" className="w-full">
                保存
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* 斃死記録ダイアログ */}
      <MortalityRecordDialog
        isOpen={isAddMortalityOpen}
        onClose={() => setIsAddMortalityOpen(false)}
        initialData={mortalityModalData}
        onSave={saveMortalityRecord}
      />

      {/* カスタム項目追加ダイアログ
      <CustomFieldDialog
        isOpen={isCustomFieldModalOpen}
        onClose={() => setIsCustomFieldModalOpen(false)}
        onAdd={addCustomField}
      /> */}
    </PageContainer>
  );
};

export default BreedingManagement;
