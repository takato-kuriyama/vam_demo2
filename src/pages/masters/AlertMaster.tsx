import React from "react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Settings, Search, PlusCircle } from "lucide-react";
import { AlertMasterDialog } from "../../components/dialogs/AlertMasterDialog";
import { Input } from "../../components/ui/input";
import { PageContainer } from "../../components/layouts/PageContainer";
import { PAGE_TITLES } from "../../constants/routes";
import { AlertMaster as AlertMasterType } from "../../types/dataModels";
import { DataCard } from "../../components/ui/data-card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { PARAMETERS } from "../../constants/masterData/parameters";
import {
  ALERT_TARGET_DATA,
  ALERT_DUPLICATE_CONTROLS,
} from "../../constants/masterData/alerts";
import { useMasterData } from "../../hooks/useDataStore";

// サンプルデータ
const SAMPLE_ALERT_MASTER_DATA: AlertMasterType[] = [
  {
    id: "1",
    name: "残留塩素アラート",
    targetParam: "residualChlorine1",
    thresholdMin: 0.5,
    thresholdMax: 3.0,
    dangerMin: 0.5,
    dangerMax: 3.0,
    duplicateControl: "1h",
    solution:
      "・残留塩素計の値を確認してください\n・装置の動作状況を確認してください",
    active: true,
  },
  {
    id: "2",
    name: "アンモニアアラート",
    targetParam: "ammonia",
    thresholdMin: 0.0,
    thresholdMax: 2.0,
    dangerMin: 0.0,
    dangerMax: 1.0,
    duplicateControl: "3h",
    solution: "・アンモニア濃度を確認してください\n・給餌量を調整してください",
    active: true,
  },
  {
    id: "3",
    name: "酸素濃度アラート",
    targetParam: "oxygenSaturation",
    thresholdMin: 70,
    thresholdMax: 100,
    dangerMin: 65,
    dangerMax: 110,
    duplicateControl: "2h",
    solution:
      "・酸素供給装置を確認してください\n・水槽の状態を確認してください",
    active: true,
  },
  {
    id: "4",
    name: "pHアラート",
    targetParam: "ph",
    thresholdMin: 6.5,
    thresholdMax: 8.0,
    dangerMin: 6.0,
    dangerMax: 8.5,
    duplicateControl: "3h",
    solution: "・水質を確認してください\n・給餌量を確認してください",
    active: true,
  },
  {
    id: "5",
    name: "水温アラート",
    targetParam: "temperature",
    thresholdMin: 23,
    thresholdMax: 28,
    dangerMin: 22,
    dangerMax: 29,
    duplicateControl: "3h",
    solution: "・温度調節装置を確認してください",
    active: true,
  },
];

const AlertMaster = () => {
  const { masterData } = useMasterData();
  const [selectedAlert, setSelectedAlert] = useState<AlertMasterType | null>(
    null
  );
  const [alerts, setAlerts] = useState(SAMPLE_ALERT_MASTER_DATA);
  const [isNewAlertDialogOpen, setIsNewAlertDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("alerts");

  const filteredAlerts = alerts.filter((alert) =>
    alert.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 飼育槽パラメータ
  const breedingParams = PARAMETERS.filter((param) =>
    ["temperature", "ph", "oxygenSaturation"].includes(param.id)
  );

  // ろ過部パラメータ
  const equipmentParams = PARAMETERS.filter((param) =>
    [
      "residualChlorine1",
      "residualChlorine2",
      "ammonia",
      "current",
      "temperature",
      "flowRate",
    ].includes(param.id)
  );

  // 飼育槽タンク（A系列とB系列）
  const aTanks = masterData.tanks.filter(
    (tank) => tank.lineId === "A" && tank.type === "breeding" && tank.active
  );

  const bTanks = masterData.tanks.filter(
    (tank) => tank.lineId === "B" && tank.type === "breeding" && tank.active
  );

  // 重複アラート設定を変更（セレクトボックス）
  const handleDuplicateControlChange = (paramId: string, value: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.targetParam === paramId
          ? { ...alert, duplicateControl: value }
          : alert
      )
    );
  };

  // 対応方法を変更（テキストエリア）
  const handleSolutionChange = (paramId: string, value: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.targetParam === paramId ? { ...alert, solution: value } : alert
      )
    );
  };

  return (
    <PageContainer
      title={PAGE_TITLES.ALERT_MASTER}
      action={
        <Button
          onClick={() => setIsNewAlertDialogOpen(true)}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline">新規作成</span>
          <span className="sm:hidden">新規</span>
        </Button>
      }
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="alerts">アラート一覧</TabsTrigger>
          <TabsTrigger value="breeding-settings">飼育槽設定値</TabsTrigger>
          <TabsTrigger value="equipment-settings">ろ過部設定値</TabsTrigger>
        </TabsList>

        {/* アラート一覧タブ */}
        <TabsContent value="alerts">
          {/* 検索バー */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="アラートが検索できます"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* アラート一覧 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredAlerts.map((alert) => (
              <DataCard
                key={alert.id}
                onAction={() => setSelectedAlert(alert)}
                actionLabel="編集"
                actionIcon={<Settings className="h-4 w-4" />}
              >
                <div className="space-y-1">
                  <p className="font-semibold text-lg">{alert.name}</p>
                </div>
              </DataCard>
            ))}
          </div>
        </TabsContent>

        {/* 飼育槽設定値タブ */}
        <TabsContent value="breeding-settings">
          <div className="space-y-8">
            {/* パラメータ値設定テーブル */}
            <div>
              <h3 className="text-lg font-medium mb-4">
                飼育槽パラメータ設定値
              </h3>
              <div className="relative">
                <div className="overflow-x-auto" style={{ maxWidth: "100%" }}>
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="sticky left-0 z-20 bg-white w-[120px] min-w-[120px]">
                          パラメータ
                        </TableHead>
                        <TableHead className="sticky left-[120px] z-20 bg-white w-[80px] min-w-[80px]">
                          種別
                        </TableHead>
                        {/* Aタンク */}
                        {aTanks.map((tank) => (
                          <TableHead
                            key={tank.id}
                            className="w-[100px] min-w-[100px]"
                          >
                            {tank.name}
                          </TableHead>
                        ))}
                        {/* Bタンク */}
                        {bTanks.map((tank) => (
                          <TableHead
                            key={tank.id}
                            className="w-[100px] min-w-[100px]"
                          >
                            {tank.name}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {breedingParams.map((param) => (
                        <React.Fragment key={param.id}>
                          {/* 危険値の行 */}
                          <TableRow>
                            {/* 最初の行だけパラメータ名を表示し、rowspanで2行分結合 */}
                            <TableCell
                              className="font-medium sticky left-0 z-10 bg-white border-r"
                              rowSpan={2}
                            >
                              {param.name}
                            </TableCell>
                            <TableCell className="sticky left-[120px] z-10 bg-white border-r">
                              危険値
                            </TableCell>
                            {/* Aタンク */}
                            {aTanks.map((tank) => (
                              <TableCell key={`${param.id}-${tank.id}-danger`}>
                                {param.dangerMin}～{param.dangerMax}
                              </TableCell>
                            ))}
                            {/* Bタンク */}
                            {bTanks.map((tank) => (
                              <TableCell key={`${param.id}-${tank.id}-danger`}>
                                {param.dangerMin}～{param.dangerMax}
                              </TableCell>
                            ))}
                          </TableRow>

                          {/* 警告値の行 */}
                          <TableRow>
                            <TableCell className="sticky left-[120px] z-10 bg-white border-r">
                              警告値
                            </TableCell>
                            {/* Aタンク */}
                            {aTanks.map((tank) => (
                              <TableCell key={`${param.id}-${tank.id}-warning`}>
                                {param.warningMin}～{param.warningMax}
                              </TableCell>
                            ))}
                            {/* Bタンク */}
                            {bTanks.map((tank) => (
                              <TableCell key={`${param.id}-${tank.id}-warning`}>
                                {param.warningMin}～{param.warningMax}
                              </TableCell>
                            ))}
                          </TableRow>
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* アラート共通設定テーブル */}
            <div>
              <h3 className="text-lg font-medium mb-4">
                飼育槽アラート共通設定
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">
                        パラメータ
                      </TableHead>
                      <TableHead>アラート抑制</TableHead>
                      <TableHead>対応方法</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {breedingParams.map((param) => {
                      const alert = alerts.find(
                        (a) => a.targetParam === param.id
                      );
                      return (
                        <TableRow key={param.id}>
                          <TableCell className="font-medium">
                            {param.name}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={alert?.duplicateControl || "none"}
                              onValueChange={(value) =>
                                handleDuplicateControlChange(param.id, value)
                              }
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="アラート抑制を選択" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">なし</SelectItem>
                                {ALERT_DUPLICATE_CONTROLS.map((control) => (
                                  <SelectItem
                                    key={control.id}
                                    value={control.id}
                                  >
                                    {control.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Textarea
                              value={alert?.solution || ""}
                              onChange={(e) =>
                                handleSolutionChange(param.id, e.target.value)
                              }
                              className="min-h-[80px] text-sm"
                              placeholder="対応方法を入力"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ろ過部設定値タブ */}
        <TabsContent value="equipment-settings">
          <div className="space-y-8">
            {/* ろ過部設定値テーブル */}
            <div>
              <h3 className="text-lg font-medium mb-4">
                ろ過部パラメータ設定値
              </h3>
              <div className="relative">
                <div className="overflow-x-auto" style={{ maxWidth: "100%" }}>
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="sticky left-0 z-20 bg-white w-[150px] min-w-[150px]">
                          パラメータ
                        </TableHead>
                        <TableHead className="sticky left-[150px] z-20 bg-white w-[80px] min-w-[80px]">
                          種別
                        </TableHead>
                        {/* Aライン */}
                        <TableHead className="w-[130px] min-w-[130px]">
                          Aライン
                        </TableHead>
                        {/* Bライン */}
                        <TableHead className="w-[130px] min-w-[130px]">
                          Bライン
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {equipmentParams.map((param) => (
                        <React.Fragment key={param.id}>
                          <TableRow>
                            <TableCell
                              className="font-medium sticky left-0 z-10 bg-white border-r"
                              rowSpan={2}
                            >
                              {param.name}
                            </TableCell>
                            <TableCell className="sticky left-[150px] z-10 bg-white border-r">
                              危険値
                            </TableCell>
                            {/* Aライン */}
                            <TableCell>
                              {param.dangerMin}～{param.dangerMax}
                            </TableCell>
                            {/* Bライン */}
                            <TableCell>
                              {param.dangerMin}～{param.dangerMax}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="sticky left-[150px] z-10 bg-white border-r">
                              警告値
                            </TableCell>
                            {/* Aライン */}
                            <TableCell>
                              {param.warningMin}～{param.warningMax}
                            </TableCell>
                            {/* Bライン */}
                            <TableCell>
                              {param.warningMin}～{param.warningMax}
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* ろ過部アラート共通設定テーブル */}
            <div>
              <h3 className="text-lg font-medium mb-4">
                ろ過部アラート共通設定
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">
                        パラメータ
                      </TableHead>
                      <TableHead>アラート抑制</TableHead>
                      <TableHead>対応方法</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equipmentParams.map((param) => {
                      const alert = alerts.find(
                        (a) => a.targetParam === param.id
                      );
                      return (
                        <TableRow key={param.id}>
                          <TableCell className="font-medium">
                            {param.name}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={alert?.duplicateControl || "none"}
                              onValueChange={(value) =>
                                handleDuplicateControlChange(param.id, value)
                              }
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="アラート抑制を選択" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">なし</SelectItem>
                                {ALERT_DUPLICATE_CONTROLS.map((control) => (
                                  <SelectItem
                                    key={control.id}
                                    value={control.id}
                                  >
                                    {control.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Textarea
                              value={alert?.solution || ""}
                              onChange={(e) =>
                                handleSolutionChange(param.id, e.target.value)
                              }
                              className="min-h-[80px] text-sm"
                              placeholder="対応方法を入力"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* 新規作成ダイアログ */}
      <AlertMasterDialog
        isOpen={isNewAlertDialogOpen}
        onClose={() => setIsNewAlertDialogOpen(false)}
      />

      {/* 編集ダイアログ */}
      {selectedAlert && (
        <AlertMasterDialog
          isOpen={!!selectedAlert}
          onClose={() => setSelectedAlert(null)}
          isEdit
          alertData={selectedAlert}
        />
      )}
    </PageContainer>
  );
};

export default AlertMaster;
