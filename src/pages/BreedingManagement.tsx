import React, { useState, useEffect } from "react";
import { PageContainer } from "../components/PageContainer";
import { Card, CardContent } from "../components/card";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { Label } from "../components/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import { Popover, PopoverContent, PopoverTrigger } from "../components/popover";
import { Calendar } from "../components/calendar";
import {
  BR_TANKS,
  FEED_TYPES,
  COLORS,
  PAGE_TITLES,
  BASE_BREEDING_FORM_INITIAL_VALUES,
  BreedingFormData,
} from "../constants/constants";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  XCircle,
} from "lucide-react";

const BreedingManagement: React.FC = () => {
  // 日付をYYYY-MM-DDThh:mm形式に変換
  function formatDateForInput(date: Date): string {
    return date.toISOString().slice(0, 16);
  }

  // 日付表示用のフォーマット (YYYY/M/D(曜日))
  function formatDateForDisplay(date: Date): string {
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = days[date.getDay()];

    return `${year}/${month}/${day}(${dayOfWeek})`;
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
      setFormData((prev) => ({ ...prev, dateTime: formatDateForInput(date) }));
    }
  };

  const [selectedTank, setSelectedTank] = useState<string>(BR_TANKS[0].id);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [feedEntries, setFeedEntries] = useState<
    Array<{
      time: string;
      feed1Type: string;
      feed1Amount: string;
      feed2Type: string;
      feed2Amount: string;
    }>
  >([
    {
      time: "12:00",
      feed1Type: "type2",
      feed1Amount: "",
      feed2Type: "type3",
      feed2Amount: "",
    },
  ]);

  // カスタム項目の管理
  const [customFields, setCustomFields] = useState<
    Array<{
      id: string;
      name: string;
      value: string;
      isPermanent: boolean;
    }>
  >([]);

  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldPermanent, setNewFieldPermanent] = useState(false);

  const [formData, setFormData] = useState<BreedingFormData>({
    ...BASE_BREEDING_FORM_INITIAL_VALUES,
    dateTime: formatDateForInput(new Date()),
  });

  // カスタム項目の追加
  const addCustomField = () => {
    if (!newFieldName.trim()) {
      alert("項目名を入力してください");
      return;
    }

    const newField = {
      id: `custom-${Date.now()}`,
      name: newFieldName,
      value: "",
      isPermanent: newFieldPermanent,
    };

    setCustomFields([...customFields, newField]);
    setNewFieldName("");
    setNewFieldPermanent(false);
  };

  // カスタム項目の値変更
  const handleCustomFieldChange = (id: string, value: string) => {
    setCustomFields(
      customFields.map((field) =>
        field.id === id ? { ...field, value } : field
      )
    );
  };

  // カスタム項目の削除
  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter((field) => field.id !== id));
  };

  // 日付を前日に移動
  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
    setFormData((prev) => ({ ...prev, dateTime: formatDateForInput(newDate) }));
  };

  // 日付を翌日に移動
  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
    setFormData((prev) => ({ ...prev, dateTime: formatDateForInput(newDate) }));
  };

  // 給餌情報の行を追加
  const addFeedEntry = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");

    setFeedEntries([
      ...feedEntries,
      {
        time: `${hours}:${minutes}`,
        feed1Type: "type2", // EP2をデフォルト設定
        feed1Amount: "",
        feed2Type: "type3", // EP3をデフォルト設定
        feed2Amount: "",
      },
    ]);
  };

  // 給餌情報の行を削除
  const removeFeedEntry = (index: number) => {
    // 最低1つは残す
    if (feedEntries.length <= 1) return;

    const updatedEntries = [...feedEntries];
    updatedEntries.splice(index, 1);
    setFeedEntries(updatedEntries);
  };

  // 給餌情報の入力を処理
  const handleFeedEntryChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedEntries = [...feedEntries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [field]: value,
    };
    setFeedEntries(updatedEntries);
  };

  // 尾数情報の入力を処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // フォーム送信処理
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // ここにデータ保存ロジックを実装
    console.log("Form data:", formData);
    console.log("Feed entries:", feedEntries);
    console.log("Custom fields:", customFields);

    // 成功メッセージまたはリセットロジックなど
    alert("データが保存されました");

    // 一時的な項目は消去
    setCustomFields(customFields.filter((field) => field.isPermanent));
  };

  return (
    <PageContainer title={PAGE_TITLES.BREEDING_MANAGEMENT}>
      {/* 水槽選択タブ */}
      <div
        className={`border ${COLORS.border.primary} p-2 rounded-xl shadow mb-4`}
      >
        <Tabs defaultValue={BR_TANKS[0].id} value={selectedTank}>
          <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden">
            <TabsList className="flex justify-start space-x-2">
              {BR_TANKS.map((tank) => (
                <TabsTrigger
                  key={tank.id}
                  value={tank.id}
                  onClick={() => setSelectedTank(tank.id)}
                  className={`data-[state=active]:bg-blue-100 px-4 py-2 rounded-xl shadow bg-gray-50`}
                >
                  {tank.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      </div>

      {/* メインコンテンツタブ */}
      <div className="bg-white p-2 rounded-xl shadow mb-4">
        <Tabs defaultValue="input" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">データ入力</TabsTrigger>
            <TabsTrigger value="list">データ一覧</TabsTrigger>
          </TabsList>

          <TabsContent value="input">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 日付ナビゲーター */}
                  <div className="flex items-center justify-center space-x-4">
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
                          onSelect={(date) => date && handleDateChange(date)}
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
                    <h3 className="text-lg font-medium">給餌情報</h3>

                    {feedEntries.map((entry, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-6 gap-3 p-3 border rounded-lg bg-gray-50 relative"
                      >
                        <div className="space-y-1">
                          <Label htmlFor={`time-${index}`}>時刻 ※</Label>
                          <Select
                            value={entry.time}
                            onValueChange={(value) =>
                              handleFeedEntryChange(index, "time", value)
                            }
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
                          <Label>餌種類①</Label>
                          <Select
                            value={entry.feed1Type}
                            onValueChange={(value) =>
                              handleFeedEntryChange(index, "feed1Type", value)
                            }
                          >
                            <SelectTrigger>
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
                          <Label htmlFor={`feed1Amount-${index}`}>
                            給餌量 (g)
                          </Label>
                          <Input
                            id={`feed1Amount-${index}`}
                            type="time"
                            value={entry.feed1Amount}
                            onChange={(e) =>
                              handleFeedEntryChange(
                                index,
                                "feed1Amount",
                                e.target.value
                              )
                            }
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label>餌種類②</Label>
                          <Select
                            value={entry.feed2Type}
                            onValueChange={(value) =>
                              handleFeedEntryChange(index, "feed2Type", value)
                            }
                          >
                            <SelectTrigger>
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
                          <Label htmlFor={`feed2Amount-${index}`}>
                            給餌量 (g)
                          </Label>
                          <Input
                            id={`feed2Amount-${index}`}
                            type="number"
                            value={entry.feed2Amount}
                            onChange={(e) =>
                              handleFeedEntryChange(
                                index,
                                "feed2Amount",
                                e.target.value
                              )
                            }
                            className="w-full"
                          />
                        </div>

                        <div className="flex items-end justify-center pb-2">
                          <button
                            type="button"
                            onClick={() => removeFeedEntry(index)}
                            className="hover:rounded-full hover:bg-gray-100"
                            title="削除"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addFeedEntry}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        記録追加
                      </Button>
                    </div>
                  </div>

                  {/* 尾数情報 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">尾数情報</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mortality">斃死数</Label>
                        <Input
                          type="number"
                          id="mortality"
                          name="mortality"
                          value={formData.mortality}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mortalityReason">斃死理由</Label>
                        <Input
                          type="text"
                          id="mortalityReason"
                          name="mortalityReason"
                          value={formData.mortalityReason}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>水槽間移動数</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label htmlFor="transferIn" className="text-xs">
                            IN
                          </Label>
                          <Input
                            type="number"
                            id="transferIn"
                            name="transferIn"
                            value={formData.transferIn}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="transferOut" className="text-xs">
                            OUT
                          </Label>
                          <Input
                            type="number"
                            id="transferOut"
                            name="transferOut"
                            value={formData.transferOut}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="culling">間引き</Label>
                      <Input
                        type="number"
                        id="culling"
                        name="culling"
                        value={formData.culling}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* 追加項目ボタン */}
                    <div className="flex justify-center my-4">
                      <div className="relative inline-block">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="flex items-center gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              記録項目の追加
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="bg-white w-72">
                            <div className="space-y-4 p-2">
                              <h4 className="font-medium">新規項目の追加</h4>
                              <div className="space-y-2">
                                <Label htmlFor="itemName">項目名</Label>
                                <Input
                                  id="itemName"
                                  placeholder="例：水質データ"
                                  value={newFieldName}
                                  onChange={(e) =>
                                    setNewFieldName(e.target.value)
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    id="todayOnly"
                                    name="itemType"
                                    checked={!newFieldPermanent}
                                    onChange={() => setNewFieldPermanent(false)}
                                  />
                                  <Label htmlFor="todayOnly">
                                    今日だけ追加
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    id="permanent"
                                    name="itemType"
                                    checked={newFieldPermanent}
                                    onChange={() => setNewFieldPermanent(true)}
                                  />
                                  <Label htmlFor="permanent">常に追加</Label>
                                </div>
                              </div>
                              <Button
                                className="w-full"
                                onClick={addCustomField}
                              >
                                追加
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* カスタム項目の表示 */}
                    {customFields.map((field) => (
                      <div key={field.id} className="space-y-2 relative">
                        <div className="flex justify-between items-center">
                          <Label htmlFor={field.id}>{field.name}</Label>
                          <button
                            type="button"
                            onClick={() => removeCustomField(field.id)}
                            className="hover:rounded-full hover:bg-gray-50"
                            title="削除"
                          >
                            <XCircle className="h-5 w-5" />
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

                    <div className="space-y-2">
                      <Label htmlFor="memo">メモ</Label>
                      <Input
                        type="text"
                        id="memo"
                        name="memo"
                        value={formData.memo}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    保存
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardContent className="p-4">
                <div className="text-center text-gray-500 py-8">
                  データ一覧ビューはこの実装では変更していません
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default BreedingManagement;
