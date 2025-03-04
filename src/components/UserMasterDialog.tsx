import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./dialog";
import { X } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

// ユーザーの型定義
interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

// コンポーネントのプロパティ型
interface UserMasterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit?: boolean;
  userData?: UserData;
}

export const UserMasterDialog: React.FC<UserMasterDialogProps> = ({
  isOpen,
  onClose,
  isEdit = false,
  userData,
}) => {
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
    password: "",
    confirmPassword: "",
    role: userData?.role || "user", // デフォルトは一般ユーザー
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 実際のアプリではここでAPIを呼び出します
    console.log("保存データ:", formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white max-h-[90vh] overflow-y-auto w-[95vw] md:w-full">
        <DialogHeader className="flex flex-row items-center justify-between p-0">
          <DialogTitle className="text-xl font-bold">
            {isEdit ? "ユーザー編集" : "ユーザー新規作成"}
          </DialogTitle>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">名前：</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="名前を入力"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス：</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="メールアドレスを入力"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">パスワード：</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder={isEdit ? "変更する場合のみ入力" : "パスワードを入力"}
              required={!isEdit}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">パスワード（確認）：</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder={
                isEdit ? "変更する場合のみ入力" : "パスワードを再入力"
              }
              required={!isEdit}
            />
          </div>

          <div className="space-y-2">
            <Label>権限：</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="権限を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">管理者</SelectItem>
                <SelectItem value="user">一般</SelectItem>
                <SelectItem value="viewer">閲覧のみ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              キャンセル
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              保存
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
