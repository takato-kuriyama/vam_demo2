import React, { useState, useEffect, useRef } from "react";
import { format, isValid } from "date-fns";
import { ja } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  X,
  Settings,
  Camera,
} from "lucide-react";
import { PageContainer } from "../../components/layouts/PageContainer";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
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
import { Textarea } from "../../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../components/ui/dialog";
import { PAGE_TITLES } from "../../constants/routes";
import { FEED_TYPES } from "../../constants/masterData/parameters";
import {
  BreedingFormData,
  FeedEntry,
  MortalityRecord,
  CustomField,
} from "../../types/dataManagement";
import { useDataStore, useMasterData } from "../../hooks/useDataStore";

// LocalStorageのキー
const LAST_FEED_STORAGE_KEY = "lastFeedEntries";
const CUSTOM_FIELDS_STORAGE_KEY = "customFields";

const BreedingManagement: React.FC = () => {
  const { masterData, isLoading } = useMasterData();
  const { dataStore } = useDataStore();
  const [selectedTank, setSelectedTank] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // フォームデータ
  const [formData, setFormData] = useState<BreedingFormData>({
    dateTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    tankId: "",
    waterTemp: "",
    feedingActivity: "",
    mortality: 0,
    transferIn: "",
    transferOut: "",
    culling: "",
    memo: "",
    csvExportData: {}, // CSV出力用データ
  });

  //現在時刻をデフォルトでセット

  // 給餌情報
  //const [feedEntries, setFeedEntries] = useState<FeedEntry[]>([]);
  const [feedEntries, setFeedEntries] = useState<FeedEntry[]>([
    {
      id: "fixed-entry-1",
      time: "00:00",
      feed1Type: "type2",
      feed1Amount: "100",
      feed2Type: "type3",
      feed2Amount: "50",
    },
  ]);

  // 斃死記録
  const [mortalityRecords, setMortalityRecords] = useState<MortalityRecord[]>(
    []
  );

  // 斃死記録ダイアログ関連
  const [isAddMortalityOpen, setIsAddMortalityOpen] = useState(false);
  const [mortalityModalData, setMortalityModalData] = useState<MortalityRecord>(
    {
      id: "",
      weight: "",
      symptoms: "",
      photo: null,
      notes: "",
    }
  );

  // 写真プレビューURL
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // カスタム項目
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldPermanent, setNewFieldPermanent] = useState(false);
  const [isCustomFieldModalOpen, setIsCustomFieldModalOpen] = useState(false);

  // 日付をYYYY-MM-DDThh:mm形式に変換
  function formatDateForInput(date: Date): string {
    return format(date, "yyyy-MM-dd'T'HH:mm");
  }

  // 日付表示用のフォーマット (YYYY/M/D(曜日))
  function formatDateForDisplay(date: Date): string {
    return format(date, "yyyy/M/d(EEE)", { locale: ja });
  }

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

    // 永続的なカスタム項目を読み込み
    const savedCustomFields = localStorage.getItem(CUSTOM_FIELDS_STORAGE_KEY);
    if (savedCustomFields) {
      try {
        const parsedFields = JSON.parse(savedCustomFields);
        // 永続的なもののみをロード
        const permanentFields = parsedFields.filter(
          (field: CustomField) => field.isPermanent
        );
        setCustomFields(permanentFields);
      } catch (e) {
        console.error("カスタム項目の読み込みに失敗しました", e);
      }
    }
  }, [tankOptions]);

  useEffect(() => {
    const lastFeed = localStorage.getItem(LAST_FEED_STORAGE_KEY);
    console.log("ローカルストレージの給餌データ:", lastFeed);

    if (lastFeed) {
      try {
        const parsedFeed = JSON.parse(lastFeed);
        console.log("パースした給餌データ:", parsedFeed);
        setFeedEntries(parsedFeed);
      } catch (e) {
        console.error("前回の給餌情報の読み込みに失敗しました", e);
        initializeDefaultFeedEntry();
      }
    } else {
      initializeDefaultFeedEntry();
    }
  }, []);

  // デフォルトの給餌エントリを初期化
  const initializeDefaultFeedEntry = () => {
    const now = new Date();

    setFeedEntries([
      {
        id: Date.now().toString(),
        time: now,
        feed1Type: "type2", // EP2をデフォルト設定
        feed1Amount: "",
        feed2Type: "type3", // EP3をデフォルト設定
        feed2Amount: "",
      },
    ]);
  };

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

  // 給餌情報の行を追加
  const addFeedEntry = () => {
    const now = new Date();

    // 前回のエントリの餌タイプを引き継ぐ
    let lastFeed1Type = "type2";
    let lastFeed2Type = "type3";

    if (feedEntries.length > 0) {
      const lastEntry = feedEntries[feedEntries.length - 1];
      lastFeed1Type = lastEntry.feed1Type;
      lastFeed2Type = lastEntry.feed2Type;
    }

    const newEntry: FeedEntry = {
      id: Date.now().toString(),
      time: new Date(),
      feed1Type: lastFeed1Type,
      feed1Amount: "",
      feed2Type: lastFeed2Type,
      feed2Amount: "",
    };

    setFeedEntries((prev) => [...prev, newEntry]);
  };

  // 給餌情報の行を削除
  const removeFeedEntry = (id: string) => {
    // 最低1つは残す
    if (feedEntries.length <= 1) return;

    setFeedEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  // 給餌情報の入力を処理
  const handleFeedEntryChange = (
    id: string,
    field: keyof FeedEntry,
    value: string
  ) => {
    console.log(`Updating ${field} for entry ${id} to ${value}`);
    setFeedEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  // 斃死記録ダイアログを開く
  const openAddMortalityDialog = () => {
    setMortalityModalData({
      id: "",
      weight: "",
      symptoms: "",
      photo: null,
      notes: "",
    });
    setPhotoPreview(null);
    setIsAddMortalityOpen(true);
  };

  // 斃死記録を編集
  const editMortalityRecord = (id: string) => {
    const record = mortalityRecords.find((r) => r.id === id);
    if (record) {
      setMortalityModalData({ ...record });

      // 写真のプレビュー設定
      if (record.photo) {
        const reader = new FileReader();
        reader.onload = () => {
          setPhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(record.photo);
      } else {
        setPhotoPreview(null);
      }

      setIsAddMortalityOpen(true);
    }
  };

  // 斃死記録を削除
  const removeMortalityRecord = (id: string) => {
    setMortalityRecords((prev) => prev.filter((record) => record.id !== id));
    // 総数も更新
    updateTotalMortality(
      mortalityRecords.filter((record) => record.id !== id).length
    );
  };

  // 斃死記録の追加・更新を確定
  const saveMortalityRecord = () => {
    // バリデーション
    if (!mortalityModalData.symptoms) {
      alert("症状を入力してください");
      return;
    }

    // 新規作成か更新かを判定
    const isNewRecord = !mortalityModalData.id;

    if (isNewRecord) {
      // 新規作成
      const newRecord = {
        ...mortalityModalData,
        id: Date.now().toString(),
      };
      setMortalityRecords([...mortalityRecords, newRecord]);
      updateTotalMortality(mortalityRecords.length + 1);
    } else {
      // 更新
      setMortalityRecords((prev) =>
        prev.map((record) =>
          record.id === mortalityModalData.id ? mortalityModalData : record
        )
      );
    }

    setIsAddMortalityOpen(false);
  };

  // 合計斃死数を更新
  const updateTotalMortality = (count: number) => {
    setFormData((prev) => ({
      ...prev,
      mortality: count,
    }));
  };

  // 写真の選択
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 写真データをセット
      setMortalityModalData((prev) => ({
        ...prev,
        photo: file,
      }));

      // プレビュー表示
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 写真のキャプチャボタンをクリック
  const triggerPhotoCapture = () => {
    fileInputRef.current?.click();
  };

  // カスタム項目の追加
  const addCustomField = () => {
    if (!newFieldName.trim()) {
      alert("項目名を入力してください");
      return;
    }

    const newField: CustomField = {
      id: `custom-${Date.now()}`,
      name: newFieldName,
      value: "",
      isPermanent: newFieldPermanent,
    };

    setCustomFields([...customFields, newField]);
    setNewFieldName("");
    setNewFieldPermanent(false);
    setIsCustomFieldModalOpen(false);

    // 永続的なフィールドなら保存
    if (newFieldPermanent) {
      const updatedFields = [...customFields, newField];
      const permanentFields = updatedFields.filter(
        (field) => field.isPermanent
      );
      localStorage.setItem(
        CUSTOM_FIELDS_STORAGE_KEY,
        JSON.stringify(permanentFields)
      );
    }
  };

  // カスタム項目の値を変更
  const handleCustomFieldChange = (id: string, value: string) => {
    setCustomFields(
      customFields.map((field) =>
        field.id === id ? { ...field, value } : field
      )
    );
  };

  // カスタム項目の削除
  const removeCustomField = (id: string) => {
    const updatedFields = customFields.filter((field) => field.id !== id);
    setCustomFields(updatedFields);

    // 永続的なフィールドの保存を更新
    const permanentFields = updatedFields.filter((field) => field.isPermanent);
    localStorage.setItem(
      CUSTOM_FIELDS_STORAGE_KEY,
      JSON.stringify(permanentFields)
    );
  };

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
    localStorage.setItem(LAST_FEED_STORAGE_KEY, JSON.stringify(feedEntries));

    // ここでデータベースに保存する処理を実装（未実装）
    // saveBreedingData(formData, feedEntries, mortalityRecords, customFields);

    alert("データが保存されました");

    // 一時的な項目は消去
    setCustomFields(customFields.filter((field) => field.isPermanent));
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

              {/* 給餌情報 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">給餌情報</h3>
                </div>

                <div className="space-y-3">
                  {feedEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-3 border rounded-lg bg-gray-50 relative"
                    >
                      <div className="space-y-1">
                        <Label htmlFor={`time-${entry.id}`}>時刻 ※</Label>
                        <Select
                          value={entry.time}
                          onValueChange={(value) => {
                            handleFeedEntryChange(entry.id, "time", value);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="時刻を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }).map((_, hour) => (
                              <React.Fragment key={hour}>
                                <SelectItem
                                  value={`${hour
                                    .toString()
                                    .padStart(2, "0")}:00`}
                                >
                                  {hour.toString().padStart(2, "0")}:00
                                </SelectItem>
                                <SelectItem
                                  value={`${hour
                                    .toString()
                                    .padStart(2, "0")}:30`}
                                >
                                  {hour.toString().padStart(2, "0")}:30
                                </SelectItem>
                              </React.Fragment>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor={`feed1Type-${entry.id}`}>餌種類①</Label>
                        <Select
                          value={entry.feed1Type}
                          onValueChange={(value) =>
                            handleFeedEntryChange(entry.id, "feed1Type", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="餌種類を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            {FEED_TYPES.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor={`feed1Amount-${entry.id}`}>
                          給餌量 (g)
                        </Label>
                        <Input
                          type="number"
                          inputMode="numeric"
                          value={entry.feed1Amount}
                          onChange={(e) => {
                            handleFeedEntryChange(
                              entry.id,
                              "feed1Amount",
                              e.target.value
                            );
                          }}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor={`feed2Type-${entry.id}`}>餌種類②</Label>
                        <Select
                          value={entry.feed2Type}
                          onValueChange={(value) => {
                            handleFeedEntryChange(entry.id, "feed2Type", value);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="餌種類を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            {FEED_TYPES.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor={`feed2Amount-${entry.id}`}>
                          給餌量 (g)
                        </Label>
                        <div className="flex">
                          <Input
                            type="number"
                            inputMode="numeric"
                            value={entry.feed2Amount}
                            onChange={(e) => {
                              handleFeedEntryChange(
                                entry.id,
                                "feed2Amount",
                                e.target.value
                              );
                            }}
                            className="w-full"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              removeFeedEntry(entry.id);
                            }}
                            className="ml-2 hover:bg-gray-200 rounded-full p-2"
                            title="削除"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        addFeedEntry();
                      }}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      記録追加
                    </Button>
                  </div>
                </div>
              </div>

              {/* 斃死情報 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">斃死情報</h3>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-3 border-b">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        総斃死数: {formData.mortality}匹
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={openAddMortalityDialog}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-4 w-4" />
                        斃死記録
                      </Button>
                    </div>
                  </div>

                  {mortalityRecords.length > 0 ? (
                    <div className="divide-y">
                      {mortalityRecords.map((record) => (
                        <div key={record.id} className="p-3 hover:bg-gray-50">
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                魚体重:{" "}
                                {record.weight ? `${record.weight}g` : "未記録"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => editMortalityRecord(record.id)}
                                className="text-blue-500 hover:bg-blue-50 rounded p-1"
                                title="編集"
                              >
                                <Settings className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeMortalityRecord(record.id)}
                                className="text-red-500 hover:bg-red-50 rounded p-1"
                                title="削除"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-700">
                              <span className="font-medium">症状:</span>{" "}
                              {record.symptoms}
                            </div>
                            {record.notes && (
                              <div className="text-sm text-gray-700">
                                <span className="font-medium">備考:</span>{" "}
                                {record.notes}
                              </div>
                            )}
                            {record.photo && (
                              <div className="mt-2 relative w-20 h-20 bg-gray-100 rounded overflow-hidden">
                                <img
                                  src={URL.createObjectURL(record.photo)}
                                  alt="斃死魚写真"
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      斃死記録がありません
                    </div>
                  )}
                </div>
              </div>

              {/* カスタム項目 */}
              {customFields.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">カスタム項目</h3>
                  {customFields.map((field) => (
                    <div key={field.id} className="space-y-2 relative">
                      <div className="flex justify-between items-center">
                        <Label htmlFor={field.id}>{field.name}</Label>
                        <button
                          type="button"
                          onClick={() => removeCustomField(field.id)}
                          className="hover:bg-gray-200 rounded-full p-1"
                          title="削除"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <Input
                        id={field.id}
                        value={field.value}
                        onChange={(e) =>
                          handleCustomFieldChange(field.id, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* カスタム項目追加ボタン */}
              <div className="flex justify-center mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCustomFieldModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  カスタム項目追加
                </Button>
              </div>

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
      <Dialog open={isAddMortalityOpen} onOpenChange={setIsAddMortalityOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>斃死記録</DialogTitle>
            <DialogDescription>
              斃死した魚の詳細情報を記録します
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mortality-weight">魚体重 (g)</Label>
                <Input
                  id="mortality-weight"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  value={mortalityModalData.weight}
                  onChange={(e) =>
                    setMortalityModalData((prev) => ({
                      ...prev,
                      weight: e.target.value,
                    }))
                  }
                  placeholder="例: 120.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mortality-symptoms">症状</Label>
                <Textarea
                  id="mortality-symptoms"
                  rows={2}
                  value={mortalityModalData.symptoms}
                  onChange={(e) =>
                    setMortalityModalData((prev) => ({
                      ...prev,
                      symptoms: e.target.value,
                    }))
                  }
                  placeholder="例: 飛び出し、魚病など"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mortality-notes">備考</Label>
                <Textarea
                  id="mortality-notes"
                  rows={2}
                  value={mortalityModalData.notes}
                  onChange={(e) =>
                    setMortalityModalData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="その他の特記事項"
                />
              </div>

              <div className="space-y-2">
                <Label>写真</Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={triggerPhotoCapture}
                    className="flex items-center gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    写真を撮影/選択
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                  {photoPreview && (
                    <div className="relative w-20 h-20 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={photoPreview}
                        alt="プレビュー"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPreview(null);
                          setMortalityModalData((prev) => ({
                            ...prev,
                            photo: null,
                          }));
                        }}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm"
                        title="削除"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddMortalityOpen(false)}
            >
              キャンセル
            </Button>
            <Button onClick={saveMortalityRecord}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* カスタム項目追加ダイアログ */}
      <Dialog
        open={isCustomFieldModalOpen}
        onOpenChange={setIsCustomFieldModalOpen}
      >
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>カスタム項目追加</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newFieldName">項目名</Label>
              <Input
                id="newFieldName"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder="例: パックテスト"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="newFieldPermanent"
                checked={newFieldPermanent}
                onChange={(e) => setNewFieldPermanent(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="newFieldPermanent" className="text-sm">
                この項目を永続的に使用する
                <span className="block text-xs text-gray-500">
                  (チェックすると、次回以降も自動的に表示されます)
                </span>
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCustomFieldModalOpen(false)}
            >
              キャンセル
            </Button>
            <Button onClick={addCustomField}>追加</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default BreedingManagement;
