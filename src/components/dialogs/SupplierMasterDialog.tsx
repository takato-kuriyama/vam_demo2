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

// 仕入れ先の型定義
interface Supplier {
  id: string;
  name: string;
  shortName: string;
  active: boolean;
}

// コンポーネントのプロパティ型
interface SupplierMasterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  supplier?: Supplier | null;
  isEdit?: boolean;
  onSave?: (supplier: Omit<Supplier, "id">) => void;
}

export const SupplierMasterDialog: React.FC<SupplierMasterDialogProps> = ({
  isOpen,
  onClose,
  supplier,
  isEdit = false,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    active: true,
  });

  // 編集時は既存データを表示
  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        shortName: supplier.shortName,
        active: supplier.active,
      });
    } else {
      // 新規作成時はフォームをリセット
      setFormData({
        name: "",
        shortName: "",
        active: true,
      });
    }
  }, [supplier, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 入力バリデーション
    if (!formData.name) {
      alert("仕入れ先名を入力してください");
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
            {isEdit ? "仕入れ先編集" : "仕入れ先新規作成"}
          </DialogTitle>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <FormField id="name" label="仕入れ先名" required>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="仕入れ先の名前を入力"
            />
          </FormField>

          <FormField id="shortName" label="略記">
            <Input
              id="shortName"
              value={formData.shortName}
              onChange={(e) =>
                setFormData({ ...formData, shortName: e.target.value })
              }
              placeholder="略記を入力（例: MT）"
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
