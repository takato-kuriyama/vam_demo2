import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FormField } from "../ui/form-field";

// 魚種の型定義
interface FishSpecies {
  id: string;
  name: string;
  active: boolean;
}

// コンポーネントのプロパティ型
interface SpeciesMasterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  species?: FishSpecies | null;
  isEdit?: boolean;
  onSave?: (species: Omit<FishSpecies, "id">) => void;
}

export const SpeciesMasterDialog: React.FC<SpeciesMasterDialogProps> = ({
  isOpen,
  onClose,
  species,
  isEdit = false,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    active: true,
  });

  // 編集時は既存データを表示
  useEffect(() => {
    if (species) {
      setFormData({
        name: species.name,
        active: species.active,
      });
    } else {
      // 新規作成時はフォームをリセット
      setFormData({
        name: "",
        active: true,
      });
    }
  }, [species, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 入力バリデーション
    if (!formData.name) {
      alert("魚種名を入力してください");
      return;
    }

    // 親コンポーネントへのコールバック
    if (onSave) {
      onSave(formData);
    }

    // 実際のアプリではここでAPIを呼び出します
    console.log("保存データ:", formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between p-0">
          <DialogTitle className="text-xl font-bold">
            {isEdit ? "魚種編集" : "魚種新規作成"}
          </DialogTitle>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <FormField id="name" label="魚種名" required>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="魚種の名前を入力"
            />
          </FormField>

          <div className="space-y-2">
            <Label htmlFor="active">ステータス</Label>
            <Select
              value={formData.active ? "active" : "inactive"}
              onValueChange={(value) =>
                setFormData({ ...formData, active: value === "active" })
              }
            >
              <SelectTrigger id="active">
                <SelectValue placeholder="ステータスを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">有効</SelectItem>
                <SelectItem value="inactive">無効</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit">保存</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
