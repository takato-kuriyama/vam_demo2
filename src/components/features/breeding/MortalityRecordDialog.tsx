import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Camera, X } from "lucide-react";
import { MortalityRecord } from "../../../types/dataManagement";

interface MortalityRecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: MortalityRecord;
  onSave: (record: MortalityRecord) => void;
}

const MortalityRecordDialog: React.FC<MortalityRecordDialogProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
}) => {
  const [mortalityData, setMortalityData] =
    useState<MortalityRecord>(initialData);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 写真の選択
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 写真データをセット
      setMortalityData((prev) => ({
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

  // 保存処理
  const handleSubmit = () => {
    // バリデーション
    if (!mortalityData.symptoms) {
      alert("症状を入力してください");
      return;
    }

    onSave(mortalityData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
                value={mortalityData.weight}
                onChange={(e) =>
                  setMortalityData((prev) => ({
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
                value={mortalityData.symptoms}
                onChange={(e) =>
                  setMortalityData((prev) => ({
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
                value={mortalityData.notes}
                onChange={(e) =>
                  setMortalityData((prev) => ({
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
                        setMortalityData((prev) => ({
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
          <Button variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button onClick={handleSubmit}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MortalityRecordDialog;
