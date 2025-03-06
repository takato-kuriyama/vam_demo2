import { useState } from "react";
import { Search, PlusCircle, Settings } from "lucide-react";
import { PageContainer } from "../../components/layouts/PageContainer";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { DataCard } from "../../components/ui/data-card";
import { FEED_TYPES } from "../../constants/masterData/parameters";
import { FeedMasterDialog } from "../../components/dialogs/FeedMasterDialog";

// 投入物（餌）の型定義
interface FeedType {
  id: string;
  name: string;
  active: boolean;
}

const FeedMaster = () => {
  // 検索語句の状態管理
  const [searchTerm, setSearchTerm] = useState("");
  // ダイアログの状態管理
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // 選択された項目の状態管理
  const [selectedFeed, setSelectedFeed] = useState<FeedType | null>(null);

  // 仮の餌データ
  // 実際のアプリではAPIから取得する形になります
  const [feeds, setFeeds] = useState<FeedType[]>(
    FEED_TYPES.filter((type) => type.id !== "type0").map((type) => ({
      id: type.id,
      name: type.name,
      active: true,
    }))
  );

  // 検索フィルタリング
  const filteredFeeds = feeds.filter((feed) =>
    feed.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ダイアログを開く処理
  const openDialog = (feed: FeedType | null = null) => {
    setSelectedFeed(feed);
    setIsDialogOpen(true);
  };

  // 新規追加処理
  const handleAddFeed = (feed: Omit<FeedType, "id">) => {
    const newFeed: FeedType = {
      id: `type${Date.now()}`, // 一時的なID生成方法
      ...feed,
    };
    setFeeds([...feeds, newFeed]);
  };

  // 編集処理
  const handleUpdateFeed = (id: string, updates: Partial<FeedType>) => {
    setFeeds(
      feeds.map((feed) => (feed.id === id ? { ...feed, ...updates } : feed))
    );
  };

  return (
    <PageContainer
      title="投入物マスタ"
      action={
        <Button
          onClick={() => openDialog()}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <PlusCircle className="h-4 w-4" />
          新規作成
        </Button>
      }
    >
      {/* 検索バー */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="餌の名称で検索"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 投入物一覧 */}
      <div className="grid grid-cols-1 gap-3">
        {filteredFeeds.length > 0 ? (
          filteredFeeds.map((feed) => (
            <DataCard
              key={feed.id}
              onAction={() => openDialog(feed)}
              actionLabel="編集"
              actionIcon={<Settings className="h-4 w-4" />}
            >
              <div className="space-y-1">
                <p className="font-semibold text-lg">{feed.name}</p>
                {!feed.active && (
                  <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">
                    無効
                  </span>
                )}
              </div>
            </DataCard>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            該当する投入物がありません
          </div>
        )}
      </div>

      {/* 餌編集ダイアログ */}
      <FeedMasterDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        feed={selectedFeed}
        isEdit={!!selectedFeed}
        onSave={(feedData) => {
          if (selectedFeed) {
            // 編集の場合
            handleUpdateFeed(selectedFeed.id, feedData);
          } else {
            // 新規作成の場合
            handleAddFeed(feedData);
          }
        }}
      />
    </PageContainer>
  );
};

export default FeedMaster;
