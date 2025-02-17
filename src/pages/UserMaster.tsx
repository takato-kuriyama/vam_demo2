import { Card, CardContent } from "../components/card";
import { SAMPLE_USER_DATA, UserDataField } from "../constants/constants";
import { useState } from "react";
import { Button } from "../components/button";
import { Settings, Search, PlusCircle } from "lucide-react";
import { UserMasterDialog } from "../components/UserMasterDialog";
import { Input } from "../components/input";

const UserMaster = () => {
  const [selectedUserData, setSelectedUserData] =
    useState<UserDataField | null>(null);
  const [userDatas] = useState(SAMPLE_USER_DATA);
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = userDatas.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">ユーザーマスタ</h1>
          <Button
            onClick={() => setIsNewUserDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            新規作成
          </Button>
        </div>

        {/* 検索バー */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="ユーザが検索できます"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* ユーザー一覧 */}
        <div className="grid grid-cols-1 gap-3">
          {filteredUsers.map((userData) => (
            <Card
              key={userData.id}
              className="transition-all duration-300 hover:shadow-lg hover:scale-102 border-none bg-white rounded-xl"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="font-semibold text-lg">{userData.name}</p>
                    <p className="text-sm text-gray-500">{userData.mail}</p>
                    <p className="text-sm text-gray-500">
                      権限: {userData.authority}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedUserData(userData)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50"
                  >
                    <Settings className="h-4 w-4" />
                    編集
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
    </div>
  );
};

export default UserMaster;
