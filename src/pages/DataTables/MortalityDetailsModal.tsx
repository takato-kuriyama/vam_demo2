import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

// 斃死記録の型定義
interface MortalityRecord {
  id: string;
  date: Date;
  tankId: string;
  tankName: string;
  weight?: string;
  symptoms?: string;
  notes?: string;
  hasPhoto?: boolean;
}

interface MortalityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  tankName: string;
  mortalityCount: number;
  // 実際のアプリでは、この日の斃死記録を取得するための処理が必要
  // ここではダミーデータを使用
  records?: MortalityRecord[];
}

const MortalityDetailsModal: React.FC<MortalityDetailsModalProps> = ({
  isOpen,
  onClose,
  date,
  tankName,
  mortalityCount,
  records = [],
}) => {
  // ダミーデータの生成（実際では斃死記録を取得する処理を実装）
  const dummyRecords = Array.from({ length: mortalityCount }, (_, i) => ({
    id: `dummy-${i}`,
    date: date,
    tankId: "dummy-tank",
    tankName: tankName,
    weight: `${Math.floor(Math.random() * 200 + 50)}g`,
    symptoms: ["食欲不振", "飛び出し", "原因不明"][
      Math.floor(Math.random() * 3)
    ],
    notes: Math.random() > 0.5 ? "特記事項あり" : "",
    hasPhoto: Math.random() > 0.3,
  }));

  // 表示する記録（提供されたものまたはダミー）
  const displayRecords = records.length > 0 ? records : dummyRecords;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            斃死記録詳細 - {tankName} (
            {format(date, "yyyy/MM/dd", { locale: ja })})
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4 p-2 bg-gray-50 rounded-lg">
            <p className="font-medium">総斃死数: {mortalityCount}匹</p>
          </div>

          {displayRecords.length > 0 ? (
            <div className="space-y-4">
              {displayRecords.map((record) => (
                <div
                  key={record.id}
                  className="border rounded-lg p-4 bg-white shadow-sm"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">
                      魚体重: {record.weight || "未記録"}
                    </h3>
                  </div>

                  <div className="text-sm text-gray-700 space-y-2">
                    <p>
                      <span className="font-medium">症状:</span>{" "}
                      {record.symptoms || "記録なし"}
                    </p>
                    {record.notes && (
                      <p>
                        <span className="font-medium">備考:</span>{" "}
                        {record.notes}
                      </p>
                    )}
                  </div>

                  {record.hasPhoto && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">写真:</p>
                      <div className="flex flex-wrap gap-2">
                        {/* ダミー写真表示 */}
                        {Array.from(
                          { length: Math.floor(Math.random() * 3) + 1 },
                          (_, i) => (
                            <div
                              key={i}
                              className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center"
                            >
                              <span className="text-gray-500 text-xs">
                                写真 {i + 1}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              記録が見つかりません
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>閉じる</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MortalityDetailsModal;
