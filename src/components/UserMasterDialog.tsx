import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Input } from "./input";
import { Label } from "./label";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Checkbox } from "./checkbox";
import { X } from "lucide-react";
import { useState } from "react";
import { UserDataField } from "../constants/constants";

interface UserMasterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit?: boolean;
  userData?: UserDataField;
}

export const UserMasterDialog: React.FC<UserMasterDialogProps> = ({
  isOpen,
  onClose,
  isEdit = false,
  userData,
}) => {
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    password: userData?.password || "",
    mail: userData?.mail || "",
    authority: userData?.authority || "一般",
    alertSetting: false,
    graphSetting: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 未実装
    console.log(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader className="flex flex-row items-center justify-between pr-4">
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
            <Label htmlFor="name">ユーザー名：</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="ユーザー名を入力"
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス：</Label>
            <Input
              id="email"
              type="email"
              value={formData.mail}
              onChange={(e) =>
                setFormData({ ...formData, mail: e.target.value })
              }
              placeholder="sample@va.co.jp"
            />
          </div>

          <div className="space-y-2">
            <Label>種類：</Label>
            <Select
              value={formData.authority}
              onValueChange={(value) =>
                setFormData({ ...formData, authority: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="権限を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="管理者">管理者</SelectItem>
                <SelectItem value="一般">一般</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="alertSetting"
                checked={formData.alertSetting}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, alertSetting: checked as boolean })
                }
              />
              <Label htmlFor="alertSetting">アラート設定変更</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="graphSetting"
                checked={formData.graphSetting}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, graphSetting: checked as boolean })
                }
              />
              <Label htmlFor="graphSetting">グラフの設定</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit">{isEdit ? "更新" : "作成"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
