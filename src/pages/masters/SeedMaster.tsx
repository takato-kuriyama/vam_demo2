import { useState } from "react";
import { Card } from "../../components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Search, PlusCircle } from "lucide-react";
import { Input } from "../../components/ui/input";
import { PageContainer } from "../../components/layouts/PageContainer";
import { COLORS } from "../../constants/ui";
import { useMasterData } from "../../hooks/useDataStore";
import { DataCard } from "../../components/ui/data-card";
import { SupplierMasterDialog } from "../../components/dialogs/SupplierMasterDialog";
import { SpeciesMasterDialog } from "../../components/dialogs/SpeciesMasterDialog";

// 種苗マスタページのメイン
const SeedMaster = () => {
  // タブの状態管理
  const [activeTab, setActiveTab] = useState<string>("supplier");
  // 検索語句の状態管理
  const [searchTerm, setSearchTerm] = useState("");
  // ダイアログの状態管理
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [isSpeciesDialogOpen, setIsSpeciesDialogOpen] = useState(false);

  // 選択された項目の状態管理
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<any>(null);

  // マスターデータフックを使用
  const { masterData, isLoading, error } = useMasterData();

  // 仮のサプライヤーデータ（実際のアプリではAPIから取得）
  const suppliers = [
    { id: "supplier1", name: "マリンテック", shortName: "MT", active: true },
    { id: "supplier2", name: "バイオ愛媛", shortName: "BE", active: true },
    { id: "supplier3", name: "近畿大学", shortName: "KU", active: true },
  ];

  // 仮の魚種データ（実際のアプリではAPIから取得）
  const species = [
    { id: "species1", name: "クエタマ", active: true },
    { id: "species2", name: "カワハギ", active: true },
    { id: "species3", name: "スズキ", active: false },
  ];

  // 検索フィルタリング
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.shortName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSpecies = species.filter((specie) =>
    specie.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ダイアログを開く処理
  const openSupplierDialog = (supplier = null) => {
    setSelectedSupplier(supplier);
    setIsSupplierDialogOpen(true);
  };

  const openSpeciesDialog = (species = null) => {
    setSelectedSpecies(species);
    setIsSpeciesDialogOpen(true);
  };

  // ローディング表示
  if (isLoading) {
    return (
      <PageContainer title="種苗マスタ">
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">データを読み込み中...</p>
        </div>
      </PageContainer>
    );
  }

  // エラー表示
  if (error) {
    return (
      <PageContainer title="種苗マスタ">
        <div className="flex justify-center items-center h-40">
          <p className="text-red-500">データの読み込みに失敗しました</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="種苗マスタ"
      action={
        <Button
          onClick={() =>
            activeTab === "supplier"
              ? openSupplierDialog()
              : openSpeciesDialog()
          }
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <PlusCircle className="h-4 w-4" />
          新規作成
        </Button>
      }
    >
      {/* タブ切り替え */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="w-full bg-gray-100 p-1 rounded-xl">
          <TabsTrigger
            value="supplier"
            className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow rounded-lg"
          >
            仕入れ先管理
          </TabsTrigger>
          <TabsTrigger
            value="species"
            className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow rounded-lg"
          >
            魚種管理
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* 検索バー */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder={
                activeTab === "supplier"
                  ? "仕入れ先名または略記で検索"
                  : "魚種名で検索"
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 仕入れ先一覧 */}
          <TabsContent value="supplier" className="mt-0">
            <div className="grid grid-cols-1 gap-3">
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <DataCard
                    key={supplier.id}
                    onAction={() => openSupplierDialog(supplier)}
                    actionLabel="編集"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-lg">{supplier.name}</p>
                      <p className="text-sm text-gray-500">
                        略記: {supplier.shortName}
                      </p>
                      {!supplier.active && (
                        <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">
                          無効
                        </span>
                      )}
                    </div>
                  </DataCard>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  該当する仕入れ先がありません
                </div>
              )}
            </div>
          </TabsContent>

          {/* 魚種一覧 */}
          <TabsContent value="species" className="mt-0">
            <div className="grid grid-cols-1 gap-3">
              {filteredSpecies.length > 0 ? (
                filteredSpecies.map((specie) => (
                  <DataCard
                    key={specie.id}
                    onAction={() => openSpeciesDialog(specie)}
                    actionLabel="編集"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-lg">{specie.name}</p>
                      {!specie.active && (
                        <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">
                          無効
                        </span>
                      )}
                    </div>
                  </DataCard>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  該当する魚種がありません
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* 仕入れ先編集ダイアログ */}
      <SupplierMasterDialog
        isOpen={isSupplierDialogOpen}
        onClose={() => setIsSupplierDialogOpen(false)}
        supplier={selectedSupplier}
        isEdit={!!selectedSupplier}
      />

      {/* 魚種編集ダイアログ */}
      <SpeciesMasterDialog
        isOpen={isSpeciesDialogOpen}
        onClose={() => setIsSpeciesDialogOpen(false)}
        species={selectedSpecies}
        isEdit={!!selectedSpecies}
      />
    </PageContainer>
  );
};

export default SeedMaster;
