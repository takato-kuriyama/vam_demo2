import { useEffect, useState } from "react";
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
import { COLORS, PAGE_TITLES } from "../constants/constants";
import { PageContainer } from "../components/PageContainer";

// 飼育槽データの型定義
interface BreedingTank {
  id: string;
  name: string;
}

const TankMaster = () => {
  // 飼育槽の初期データ
  const [tanks, setTanks] = useState<BreedingTank[]>([
    { id: "A1", name: "A1水槽" },
    { id: "A2", name: "A2水槽" },
    { id: "A3", name: "A3水槽" },
    { id: "A4", name: "A4水槽" },
    { id: "A5", name: "A5水槽" },
    { id: "B1", name: "B1水槽" },
    { id: "B2", name: "B2水槽" },
  ]);

  const [selectedTank, setSelectedTank] = useState<BreedingTank | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 検索機能の実装
  const filteredTanks = tanks.filter((tank) =>
    tank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        onUpdate={(updatedName) => {
          setTanks(
            tanks.map((t) =>
              t.id === selectedTank?.id ? { ...t, name: updatedName } : t
            )
          );
          setIsEditDialogOpen(false);
          setSelectedTank(null);
        }}
      />
    </PageContainer>
  );
};

// 編集ダイアログコンポーネント
interface BreedingTankEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tank: BreedingTank | null;
  onUpdate: (name: string) => void;
}

const BreedingTankEditDialog: React.FC<BreedingTankEditDialogProps> = ({
  isOpen,
  onClose,
  tank,
  onUpdate,
}) => {
  const [tankName, setTankName] = useState("");

  // 選択された水槽が変更されたら名前を更新
  useEffect(() => {
    if (tank) {
      setTankName(tank.name);
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

export default TankMaster;
