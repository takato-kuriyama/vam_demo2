import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

interface CustomFieldDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, isPermanent: boolean) => void;
}

const CustomFieldDialog: React.FC<CustomFieldDialogProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [fieldName, setFieldName] = useState("");
  const [isPermanent, setIsPermanent] = useState(false);

  const handleSubmit = () => {
    if (!fieldName.trim()) {
      alert("項目名を入力してください");
      return;
    }

    onAdd(fieldName, isPermanent);
    setFieldName("");
    setIsPermanent(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>カスタム項目追加</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="newFieldName">項目名</Label>
            <Input
              id="newFieldName"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="例: パックテスト"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="newFieldPermanent"
              checked={isPermanent}
              onChange={(e) => setIsPermanent(e.target.checked)}
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
          <Button variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button onClick={handleSubmit}>追加</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomFieldDialog;
