import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Settings, Search, PlusCircle } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { PageContainer } from "../../components/layouts/PageContainer";
import { COLORS } from "../../constants/ui";
import { PAGE_TITLES } from "../../constants/routes";
import { useDataStore } from "../../hooks/useDataStore";
import { InputField } from "../../components/ui/form-field";
import { DataCard } from "../../components/ui/data-card";

// ユーザーデータの型定義（data/mockDataStore.tsから参照するのがベターですが、
// このページでだけ使用するのでここで定義）
interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

// ユーザマスタダイアログのProps型
interface UserMasterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit?: boolean;
  userData?: UserData;
}

// ユーザマスタダイアログコンポーネント
const UserMasterDialog: React.FC<UserMasterDialogProps> = ({
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
      <DialogContent className="max-w-md bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEdit ? "ユーザー編集" : "ユーザー新規作成"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <InputField
            id="name"
            label="名前："
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="名前を入力"
            required
          />

          <InputField
            id="email"
            label="メールアドレス："
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="メールアドレスを入力"
            required
          />

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

// メインのユーザマスタコンポーネント
const UserMaster = () => {
  const { isLoading, error, dataStore } = useDataStore();
  const [selectedUserData, setSelectedUserData] = useState<UserData | null>(
    null
  );
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // モックのユーザデータ
  // 実際のアプリではdataStoreから取得するか、APIを呼び出します
  const userDataList: UserData[] = [
    {
      id: "1",
      name: "サンプル太郎",
      email: "sample@example.com",
      role: "admin",
      active: true,
    },
    {
      id: "2",
      name: "テスト花子",
      email: "test@example.com",
      role: "user",
      active: true,
    },
    {
      id: "3",
      name: "閲覧者一郎",
      email: "viewer@example.com",
      role: "viewer",
      active: true,
    },
  ];

  // 検索フィルタリング
  const filteredUsers = userDataList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ローディング表示
  if (isLoading) {
    return (
      <PageContainer title={PAGE_TITLES.USER_MASTER}>
        <div className="flex justify-center items-center h-40">
          <p>データをロード中...</p>
        </div>
      </PageContainer>
    );
  }

  // エラー表示
  if (error) {
    return (
      <PageContainer title={PAGE_TITLES.USER_MASTER}>
        <div className="flex justify-center items-center h-40">
          <p className="text-red-500">データの読み込みに失敗しました</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={PAGE_TITLES.USER_MASTER}>
      {/* 検索バーと新規作成ボタン */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="ユーザーが検索できます"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={() => setIsNewUserDialogOpen(true)}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <PlusCircle className="h-4 w-4" />
          新規作成
        </Button>
      </div>

      {/* ユーザー一覧 */}
      <div className="grid grid-cols-1 gap-3">
        {filteredUsers.map((userData) => (
          <DataCard
            key={userData.id}
            onAction={() => setSelectedUserData(userData)}
            actionLabel="編集"
            actionIcon={<Settings className="h-4 w-4" />}
          >
            <div className="space-y-1">
              <p className="font-semibold text-lg">{userData.name}</p>
              <p className="text-sm text-gray-500">{userData.email}</p>
              <p className="text-sm text-gray-500">
                権限:{" "}
                {userData.role === "admin"
                  ? "管理者"
                  : userData.role === "user"
                  ? "一般"
                  : "閲覧のみ"}
              </p>
            </div>
          </DataCard>
        ))}
      </div>

      {/* 新規作成ダイアログ */}
      <UserMasterDialog
        isOpen={isNewUserDialogOpen}
        onClose={() => setIsNewUserDialogOpen(false)}
      />

      {/* 編集ダイアログ */}
      {selectedUserData && (
        <UserMasterDialog
          isOpen={!!selectedUserData}
          onClose={() => setSelectedUserData(null)}
          isEdit
          userData={selectedUserData}
        />
      )}
    </PageContainer>
  );
};

export default UserMaster;
