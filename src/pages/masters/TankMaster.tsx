import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Settings, Search, PlusCircle } from "lucide-react";
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
import { useMasterData } from "../../hooks/useDataStore";
import { TankMaster as TankMasterType } from "../../types/dataModels";
import { FilterPanel } from "../../components/ui/filter-panel";

const TankMasterPage = () => {
  const { masterData, isLoading, error, updateTank } = useMasterData();
  const [selectedTank, setSelectedTank] = useState<TankMasterType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  // 新規作成は不要なので削除
  const [searchTerm, setSearchTerm] = useState("");
  const [activeOnly, setActiveOnly] = useState(true);

  // 検索機能とフィルタリングの実装
  const filteredTanks = masterData.tanks.filter(
    (tank) =>
      (activeOnly ? tank.active : true) &&
      (tank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tank.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        masterData.lines
          .find((line) => line.id === tank.lineId)
          ?.name.toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  // ライン別にグルーピング
  const tanksByLine: Record<string, TankMasterType[]> = {};

  // アクティブなラインのみを表示
  const activeLines = masterData.lines.filter((line) => line.active);

  // ラインごとにタンクをグループ化
  activeLines.forEach((line) => {
    tanksByLine[line.id] = filteredTanks.filter(
      (tank) => tank.lineId === line.id
    );
  });

  // タンク更新ハンドラ
  const handleTankUpdate = (
    tankId: string,
    updates: Partial<TankMasterType>
  ) => {
    updateTank(tankId, updates);
    setIsEditDialogOpen(false);
    setSelectedTank(null);
  };

  // 新規作成機能は不要

  if (isLoading) {
    return (
      <PageContainer title={PAGE_TITLES.TANK_MASTER}>
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">データを読み込み中...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={PAGE_TITLES.TANK_MASTER}>
      {/* 検索バーと追加ボタン */}
      <FilterPanel
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="飼育槽を検索"
      >
        <Button
          variant="outline"
          onClick={() => setActiveOnly(!activeOnly)}
          className="whitespace-nowrap"
        >
          {activeOnly ? "すべて表示" : "有効のみ表示"}
        </Button>
      </FilterPanel>

      {/* ライン別にタンク一覧を表示 */}
      <div className="space-y-6">
        {Object.entries(tanksByLine).map(([lineId, tanks]) => {
          const line = masterData.lines.find((l) => l.id === lineId);

          if (!line || tanks.length === 0) return null;

          return (
            <div key={lineId} className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
                {line.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {tanks.map((tank) => (
                  <Card
                    key={tank.id}
                    className={`transition-all duration-300 hover:shadow-lg ${
                      COLORS.border.primary
                    } rounded-xl ${!tank.active ? "bg-gray-50" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-lg">{tank.name}</p>
                            {!tank.active && (
                              <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">
                                無効
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">ID: {tank.id}</p>
                          <p className="text-sm text-gray-500">
                            タイプ:{" "}
                            {tank.type === "breeding" ? "飼育槽" : "ろ過槽"}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSelectedTank(tank);
                            setIsEditDialogOpen(true);
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50"
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
          );
        })}

        {/* タンクが見つからない場合 */}
        {Object.values(tanksByLine).flat().length === 0 && (
          <div className="text-center py-10 text-gray-500">
            条件に一致する飼育槽が見つかりません
          </div>
        )}
      </div>

      {/* 編集ダイアログ */}
      {selectedTank && (
        <BreedingTankEditDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedTank(null);
          }}
          tank={selectedTank}
          lines={masterData.lines}
          onUpdate={(updates) => handleTankUpdate(selectedTank.id, updates)}
        />
      )}

      {/* 追加ダイアログは不要なので削除 */}
    </PageContainer>
  );
};

// 編集ダイアログコンポーネント
interface BreedingTankEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tank: TankMasterType;
  lines: { id: string; name: string }[];
  onUpdate: (updates: Partial<TankMasterType>) => void;
}

const BreedingTankEditDialog: React.FC<BreedingTankEditDialogProps> = ({
  isOpen,
  onClose,
  tank,
  lines,
  onUpdate,
}) => {
  const [tankName, setTankName] = useState("");
  const [lineId, setLineId] = useState("");
  const [active, setActive] = useState(true);

  // 選択された水槽が変更されたら情報を更新
  useEffect(() => {
    if (tank) {
      setTankName(tank.name);
      setLineId(tank.lineId);
      setActive(tank.active);
    }
  }, [tank]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      name: tankName,
      lineId,
      active,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            飼育槽編集: {tank.id}
          </DialogTitle>
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
            <Label htmlFor="line">ライン</Label>
            <Input
              id="line"
              value={lines.find((l) => l.id === lineId)?.name || lineId}
              readOnly
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="active">ステータス</Label>
            <Select
              value={active ? "active" : "inactive"}
              onValueChange={(value) => setActive(value === "active")}
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

          <div className="flex justify-end space-x-2 pt-2">
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
