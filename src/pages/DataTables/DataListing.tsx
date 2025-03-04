import { useState } from "react";
import { PageContainer } from "../../components/layouts/PageContainer";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import { PAGE_TITLES } from "../../constants/routes";
import { COLORS } from "../../constants/ui";
import BreedingDataTable from "./BreedingDataTable";
import EquipmentDataTable from "./EquipmentDataTable";
import MortalityDataTable from "./MortalityDataTable";

// メインのデータ一覧ページコンポーネント
const DataListing = () => {
  // 現在選択されているタブを管理
  const [activeTab, setActiveTab] = useState<string>("breeding");

  return (
    <PageContainer title={PAGE_TITLES.DATA_LISTING}>
      <div className="space-y-6">
        {/* データ種類選択タブ */}
        <div
          className={`p-2 border ${COLORS.border.primary} rounded-xl shadow mb-4`}
        >
          <Tabs
            defaultValue="breeding"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden">
              <TabsList className="flex justify-start space-x-2">
                <TabsTrigger
                  value="breeding"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white 
                             px-4 py-2 rounded-xl bg-slate-100 text-slate-600 
                             hover:bg-slate-200 transition-all duration-200"
                >
                  飼育槽データ
                </TabsTrigger>
                <TabsTrigger
                  value="equipment"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white 
                             px-4 py-2 rounded-xl bg-slate-100 text-slate-600 
                             hover:bg-slate-200 transition-all duration-200"
                >
                  ろ過部データ
                </TabsTrigger>
                <TabsTrigger
                  value="mortality"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white 
                             px-4 py-2 rounded-xl bg-slate-100 text-slate-600 
                             hover:bg-slate-200 transition-all duration-200"
                >
                  斃死データ
                </TabsTrigger>
              </TabsList>
            </div>

            {/* タブコンテンツ */}
            <TabsContent value="breeding">
              <BreedingDataTable />
            </TabsContent>
            <TabsContent value="equipment">
              <EquipmentDataTable />
            </TabsContent>
            <TabsContent value="mortality">
              <MortalityDataTable />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
};

export default DataListing;
