// BreedingManagement.js
import React, { useState, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { Card, CardContent } from "../components/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/tabs";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Button } from "../components/button";
import { PageContainer } from "../components/PageContainer";
import { RadioGroup, RadioGroupItem } from "../components/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import {
  COLORS,
  PAGE_TITLES,
  FEED_TYPES,
  FEEDING_ACTIVITY,
  BR_TANKS,
  BREEDING_TABLE_COLUMNS,
  ADDITIONAL_BREEDING_FORM_FIELDS,
  BASE_BREEDING_FORM_INITIAL_VALUES,
  BreedingFormData,
} from "../constants/constants";

interface FormData {
  dateTime: string;
  waterTemp: string;
  feed1Type: string;
  feed1Amount: string;
  feed2Type: string;
  feed2Amount: string;
  feedingActivity: string;
  mortality: string;
  mortalityReason: string;
  transferIn: string;
  transferOut: string;
  culling: string;
  memo: string;
}

interface Record extends FormData {
  id: number;
  tankId: string;
  totalFeedAmount: number;
  createdAt: string;
}

const BreedingManagement: React.FC = () => {
  const [selectedTank, setSelectedTank] = useState<string>(BR_TANKS[0].id);
  const [records, setRecords] = useState<Record[]>(() => {
    const saved = localStorage.getItem(`breedingRecords_${selectedTank}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const saved = localStorage.getItem(`breedingRecords_${selectedTank}`);
    setRecords(saved ? JSON.parse(saved) : []);
  }, [selectedTank]);

  const getCurrentDateTime = () => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  const generateInitialFormData = (): BreedingFormData => {
    const initialData = { ...BASE_BREEDING_FORM_INITIAL_VALUES };
    initialData.dateTime = getCurrentDateTime();

    ADDITIONAL_BREEDING_FORM_FIELDS.forEach((field) => {
      (initialData as any)[field.id] = field.initialValue;
    });

    return initialData as BreedingFormData;
  };

  const [formData, setFormData] = useState<BreedingFormData>(
    generateInitialFormData()
  );

  const resetForm = () => {
    setFormData(generateInitialFormData());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getFeedTypeName = (id: string): string => {
    const feed = FEED_TYPES.find((type) => type.id === id);
    return feed ? feed.name : "-";
  };

  const getFeedingActivityLabel = (value: string): string => {
    const activity = FEEDING_ACTIVITY.find(
      (a) => String(a.value) === String(value)
    );
    return activity ? activity.label : "-";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const newRecord = {
      id: Date.now(),
      tankId: selectedTank,
      ...formData,
      totalFeedAmount:
        Number(formData.feed1Amount || 0) + Number(formData.feed2Amount || 0),
      createdAt: new Date().toISOString(),
    };

    const updatedRecords = [newRecord, ...records];
    setRecords(updatedRecords);

    localStorage.setItem(
      `breedingRecords_${selectedTank}`,
      JSON.stringify(updatedRecords)
    );

    resetForm();
  };

  const handleDelete = (recordId: number): void => {
    if (window.confirm("このデータを削除してもよろしいですか？")) {
      const updatedRecords = records.filter((record) => record.id !== recordId);
      setRecords(updatedRecords);
      localStorage.setItem(
        `breedingRecords_${selectedTank}`,
        JSON.stringify(updatedRecords)
      );
    }
  };

  return (
    <PageContainer title={PAGE_TITLES.BREEDING_MANAGEMENT}>
      {/* 水槽選択タブ */}
      <div
        className={`border ${COLORS.border.primary} p-2 rounded-xl shadow mb-4`}
      >
        <Tabs defaultValue={BR_TANKS[0].id}>
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
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* 日時 */}
                      <div className="space-y-2">
                        <Label htmlFor="dateTime">日時</Label>
                        <Input
                          type="datetime-local"
                          id="dateTime"
                          name="dateTime"
                          value={formData.dateTime}
                          onChange={handleInputChange}
                        />
                      </div>

                      {/* 水温 */}
                      <div className="space-y-2">
                        <Label htmlFor="waterTemp">水温 (℃)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          id="waterTemp"
                          name="waterTemp"
                          value={formData.waterTemp}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* 餌種類1と給餌量 */}
                      <div className="space-y-2">
                        <Label>餌種類①</Label>
                        <div className="flex gap-2">
                          <Select
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                feed1Type: value,
                              }))
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
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="給餌量 (g)"
                            name="feed1Amount"
                            value={formData.feed1Amount}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      {/* 餌種類2と給餌量 */}
                      <div className="space-y-2">
                        <Label>餌種類②</Label>
                        <div className="flex gap-2">
                          <Select
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                feed2Type: value,
                              }))
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
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="給餌量 (g)"
                            name="feed2Amount"
                            value={formData.feed2Amount}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 摂餌活性 */}
                    <div className="space-y-2">
                      <Label>摂餌活性</Label>
                      <RadioGroup
                        value={formData.feedingActivity}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            feedingActivity: value,
                          }))
                        }
                      >
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {FEEDING_ACTIVITY.map((activity) => (
                            <div
                              key={activity.value}
                              className="flex items-center space-x-2 p-2 rounded-lg"
                            >
                              <RadioGroupItem value={String(activity.value)} />
                              <Label className="cursor-pointer">
                                {activity.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* 斃死数と理由 */}
                      <div className="grid grid-cols-2 gap-2">
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
                            name="mortalityReason"
                            value={formData.mortalityReason}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      {/* 水槽間移動数 */}
                      <div className="space-y-2">
                        <Label>水槽間移動数</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="IN"
                            name="transferIn"
                            value={formData.transferIn}
                            onChange={handleInputChange}
                          />
                          <Input
                            type="number"
                            placeholder="OUT"
                            name="transferOut"
                            value={formData.transferOut}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 間引き */}
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

                    {/* 追加項目 */}
                    {ADDITIONAL_BREEDING_FORM_FIELDS.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id}>{field.label}</Label>
                        <Input
                          type={field.type}
                          id={field.id}
                          name={field.id}
                          value={formData[field.id] || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    ))}

                    {/* メモ */}
                    <div className="space-y-2 col-span-2">
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
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        {BREEDING_TABLE_COLUMNS.map((column) => (
                          <th
                            key={column.id}
                            className={`p-3 text-left text-sm font-semibold text-gray 900
                              ${
                                column.sticky === "left"
                                  ? "sticky left-0 bg-gray-50"
                                  : ""
                              }
                              ${
                                column.sticky === "top"
                                  ? "sticky top-0 bg-gray-50"
                                  : ""
                              }`}
                          >
                            {column.label}
                          </th>
                        ))}
                        <th className="p-3 text-left text-sm font-semibold text-gray-900 sticky right-0 bg-gray-50">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {records.map((record) => (
                        <tr
                          key={record.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-3 text-sm text-gray900 sticky left-0 bg-white">
                            {new Date(record.dateTime).toLocaleString()}
                          </td>
                          <td className="p-3 text-sm text-gray-900">
                            {record.waterTemp}
                          </td>
                          <td className="p-3 text-sm text-gray-900">
                            {getFeedTypeName(record.feed1Type)}
                          </td>
                          <td className="p-3 text-sm text-gray-900">
                            {record.feed1Amount}g
                          </td>
                          <td className="p-3 text-sm text-gray-900">
                            {getFeedTypeName(record.feed2Type)}
                          </td>
                          <td className="p-3 text-sm text-gray-900">
                            {record.feed2Amount}g
                          </td>
                          <td className="p-3 text-sm text-gray-900">
                            {record.totalFeedAmount}g
                          </td>
                          <td className="p-3 text-sm text-gray-900">
                            {getFeedingActivityLabel(record.feedingActivity)}
                          </td>
                          <td className="p-3 text-sm text-gray-900">
                            {record.mortality}
                          </td>
                          <td className="p-3 text-sm text-gray-900">
                            {record.mortalityReason || "-"}
                          </td>
                          <td className="p-3 text-sm text-gray-900">
                            {record.transferIn}
                          </td>
                          <td className="p-3 text-sm text-gray-900">
                            {record.transferOut}
                          </td>
                          <td className="p-3 text-sm text-gray-900">
                            {record.culling}
                          </td>
                          <td className="p-3 text-sm text-gray-900">
                            {record.memo || "-"}
                          </td>
                          <td className="p-3 text-sm text-gray-900 sticky right-0 bg-white">
                            <button
                              onClick={() => handleDelete(record.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {records.length === 0 && (
                        <tr>
                          <td
                            colSpan={15}
                            className="p-3 text-sm text-gray-500 text-center"
                          >
                            データがありません
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
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
