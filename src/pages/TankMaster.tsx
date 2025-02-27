import React, { useState } from "react";
import { Card, CardContent } from "../components/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/dialog";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Button } from "../components/button";
import { Settings, Search } from "lucide-react";
import { PageContainer } from "../components/PageContainer";
import { COLORS } from "../constants/ui";
import { PAGE_TITLES } from "../constants/routes";
import { useMasterData } from "../hooks/useDataStore";
import { TankMaster } from "../types/dataModels";

const TankMasterPage = () => {
  const { masterData, isLoading, updateTank } = useMasterData();
  const [selectedTank, setSelectedTank] = useState<TankMaster | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 検索機能の実装
  const filteredTanks = masterData.tanks.filter((tank) =>
    tank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTankUpdate = (updatedName: string) => {
    if (selectedTank) {
      updateTank(selectedTank.id, { name: updatedName });
      setIsEditDialogOpen(false);
      setSelectedTank(null);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer title={PAGE_TITLES.TANK_MASTER}>
      {/* 検索バー */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="飼育槽が検索できます"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 飼育槽一覧 */}
      <div className="grid grid-cols-1 gap-3">
        {filteredTanks.map((tank) => (
          <Card
            key={tank.id}
            className={`transition-all duration-300 hover:shadow-lg hover:scale-102 ${COLORS.border.primary} rounded-xl`}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="font-semibold text-lg">{tank.name}</p>
                  <p className="text-sm text-gray-500">
                    ライン:{" "}
                    {masterData.lines.find((line) => line.id === tank.lineId)
                      ?.name || tank.lineId}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedTank(tank);
                    setIsEditDialogOpen(true);
                  }}
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

      {/* 編集ダイアログ */}
      <BreedingTankEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedTank(null);
        }}
        tank={selectedTank}
        onUpdate={handleTankUpdate}
      />
    </PageContainer>
  );
};

// 編集ダイアログコンポーネント
interface BreedingTankEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tank: TankMaster | null;
  onUpdate: (name: string) => void;
}

const BreedingTankEditDialog: React.FC<BreedingTankEditDialogProps> = ({
  isOpen,
  onClose,
  tank,
  onUpdate,
}) => {
  const [tankName, setTankName] = useState("");
  const [lineName, setLineName] = useState("");

  // 選択された水槽が変更されたら情報を更新
  React.useEffect(() => {
    if (tank) {
      setTankName(tank.name);
      setLineName(tank.lineId); // これは変更できないので、そのまま保持
    }
  }, [tank]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(tankName);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">飼育槽編集</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">水槽名</Label>
            <Input
              id="name"
              value={tankName}
              onChange={(e) => setTankName(e.target.value)}
              placeholder="水槽名を入力"
            />
          </div>

          <div className="space-y-2">
            <Label>ライン</Label>
            <Input
              value={lineName}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="flex justify-end space-x-2">
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

export default TankMasterPage;
