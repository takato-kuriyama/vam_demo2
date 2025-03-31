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
import { TabContainer } from "../../components/ui/tab-container";

// メインのデータ一覧ページコンポーネント
const DataListing = () => {
  // 現在選択されているタブを管理
  const [activeTab, setActiveTab] = useState<string>("breeding");

  return (
    <PageContainer title={PAGE_TITLES.DATA_LISTING}>
      <div className="space-y-6">
        {/* データ種類選択タブ */}
        <div
          className={`border ${COLORS.border.primary} rounded-xl shadow mb-4`}
        >
          <TabContainer
            items={[
              { id: "breeding", label: "飼育槽データ" },
              { id: "equipment", label: "ろ過部データ" },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="p-4">
            <Tabs value={activeTab}>
              <TabsContent value="breeding">
                <BreedingDataTable />
              </TabsContent>
              <TabsContent value="equipment">
                <EquipmentDataTable />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default DataListing;
