import React from "react";
import { Plus, Settings, X } from "lucide-react";
import { Button } from "../../ui/button";
import { MortalityRecord } from "../../../types/dataManagement";

interface MortalityRecordListProps {
  mortalityRecords: MortalityRecord[];
  totalMortality: number;
  onAddClick: () => void;
  onEditRecord: (id: string) => void;
  onRemoveRecord: (id: string) => void;
}

const MortalityRecordList: React.FC<MortalityRecordListProps> = ({
  mortalityRecords,
  totalMortality,
  onAddClick,
  onEditRecord,
  onRemoveRecord,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">斃死情報</h3>

      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-3 border-b">
          <div className="flex justify-between items-center">
            <span className="font-medium">総斃死数: {totalMortality}匹</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddClick}
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
                      魚体重: {record.weight ? `${record.weight}g` : "未記録"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditRecord(record.id)}
                      className="text-blue-500 hover:bg-blue-50 rounded p-1"
                      title="編集"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveRecord(record.id)}
                      className="text-red-500 hover:bg-red-50 rounded p-1"
                      title="削除"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">症状:</span> {record.symptoms}
                  </div>
                  {record.notes && (
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">備考:</span> {record.notes}
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
  );
};

export default MortalityRecordList;
