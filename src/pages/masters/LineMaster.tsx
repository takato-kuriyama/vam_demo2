import React, { useState } from "react";
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
import { Settings, Search } from "lucide-react";
import { PageContainer } from "../../components/layouts/PageContainer";
import { COLORS } from "../../constants/ui";
import { PAGE_TITLES } from "../../constants/routes";
import { useMasterData } from "../../hooks/useDataStore";
import { LineMaster } from "../../types/dataModels";

const LineMasterPage = () => {
  const { masterData, isLoading, updateLine } = useMasterData();
  const [selectedLine, setSelectedLine] = useState<LineMaster | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 検索機能の実装
  const filteredLines = masterData.lines.filter((line) =>
    line.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLineUpdate = (updatedName: string) => {
    if (selectedLine) {
      updateLine(selectedLine.id, { name: updatedName });
      setIsEditDialogOpen(false);
      setSelectedLine(null);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer title={PAGE_TITLES.LINE_MASTER}>
      {/* 検索バー */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="ろ過ラインが検索できます"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ろ過ライン一覧 */}
      <div className="grid grid-cols-1 gap-3">
        {filteredLines.map((line) => (
          <Card
            key={line.id}
            className={`transition-all duration-300 hover:shadow-lg hover:scale-102 ${COLORS.border.primary} rounded-xl`}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="font-semibold text-lg">{line.name}</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedLine(line);
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
      <FilterLineEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedLine(null);
        }}
        line={selectedLine}
        onUpdate={handleLineUpdate}
      />
    </PageContainer>
  );
};

// 編集ダイアログコンポーネント
interface FilterLineEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  line: LineMaster | null;
  onUpdate: (name: string) => void;
}

const FilterLineEditDialog: React.FC<FilterLineEditDialogProps> = ({
  isOpen,
  onClose,
  line,
  onUpdate,
}) => {
  const [lineName, setLineName] = useState("");
  const [lineId, setLineId] = useState("");

  // 選択されたラインが変更されたら名前を更新
  React.useEffect(() => {
    if (line) {
      setLineName(line.name);
      setLineId(line.id);
    }
  }, [line]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(lineName);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            ろ過ライン編集
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">ライン名</Label>
            <Input
              id="name"
              value={lineName}
              onChange={(e) => setLineName(e.target.value)}
              placeholder="ライン名を入力"
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

export default LineMasterPage;
