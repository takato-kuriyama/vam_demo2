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
  const [photoPreviews, setPhotoPreviews] = useState<(string | null)[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // コンポーネントの初期化時に写真のプレビューを設定
  React.useEffect(() => {
    // initialDataからphotosが存在する場合、プレビューを生成
    if (initialData.photos) {
      const previews = initialData.photos.map((photo) =>
        photo ? URL.createObjectURL(photo) : null
      );
      setPhotoPreviews(previews);
    } else {
      setPhotoPreviews([]);
    }

    // モーダルが開かれるたびに初期データをセット
    setMortalityData(initialData);
  }, [initialData, isOpen]);

  // キーボードショートカットの処理
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+Enter が押されたら保存処理を実行
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  // 写真の選択
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 写真の最大数をチェック
      if (mortalityData.photos.filter((p) => p !== null).length >= 3) {
        alert("写真は最大3枚までです");
        return;
      }

      // 写真データを追加
      const newPhotos = [...mortalityData.photos];
      newPhotos.push(file);
      setMortalityData((prev) => ({
        ...prev,
        photos: newPhotos,
      }));

      // プレビュー表示を追加
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  // 写真の削除
  const removePhoto = (index: number) => {
    // 写真データを削除
    const newPhotos = [...mortalityData.photos];
    newPhotos.splice(index, 1);
    setMortalityData((prev) => ({
      ...prev,
      photos: newPhotos,
    }));

    // プレビュー表示を削除
    const newPreviews = [...photoPreviews];
    newPreviews.splice(index, 1);
    setPhotoPreviews(newPreviews);
  };

  // 写真のキャプチャボタンをクリック
  const triggerPhotoCapture = () => {
    fileInputRef.current?.click();
  };

  // 保存処理
  const handleSubmit = () => {
    // バリデーション写真...?

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

        <form
          onKeyDown={handleKeyDown}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4 py-4"
        >
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
              <Label>写真 (最大3枚)</Label>
              <div className="space-y-3">
                {/* 写真のプレビュー表示エリア */}
                <div className="flex flex-wrap gap-2">
                  {photoPreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative w-20 h-20 bg-gray-100 rounded overflow-hidden"
                    >
                      {preview && (
                        <>
                          <img
                            src={preview}
                            alt={`プレビュー ${index + 1}`}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm"
                            title="削除"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* 写真追加ボタン - 3枚未満の場合のみ表示 */}
                {photoPreviews.length < 3 && (
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={triggerPhotoCapture}
                      className="flex items-center gap-2"
                    >
                      <Camera className="h-4 w-4" />
                      写真を追加 ({photoPreviews.length}/3)
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>

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
