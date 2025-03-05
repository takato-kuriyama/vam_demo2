import React, { useEffect } from "react";
import { Plus, X, Clock } from "lucide-react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { FeedEntry } from "../../../types/dataManagement";
import { FEED_TYPES } from "../../../constants/masterData/parameters";
import { formatTimeForInput } from "../../../lib/breedingForm-utils";

interface FeedEntryFormProps {
  feedEntries: FeedEntry[];
  onChange: (entries: FeedEntry[]) => void;
}

const FeedEntryForm: React.FC<FeedEntryFormProps> = ({
  feedEntries,
  onChange,
}) => {
  // コンポーネントがマウントされたときに、初期データがない場合は現在時刻を設定
  useEffect(() => {
    if (feedEntries.length > 0) {
      const currentTime = formatTimeForInput(new Date());

      const updatedEntries = feedEntries.map((entry) => {
        // timeの部分だけ現在時刻に更新し、他の項目はそのまま維持
        return {
          ...entry,
          time: currentTime,
        };
      });

      // 変更があった場合のみ更新
      if (JSON.stringify(updatedEntries) !== JSON.stringify(feedEntries)) {
        onChange(updatedEntries);
      }
    }
  }, []);

  // 給餌情報の行を追加
  const addFeedEntry = () => {
    // 現在時刻をHH:MM形式に整形
    const currentTime = formatTimeForInput(new Date());

    // 前回のエントリの餌タイプを引き継ぐ
    let lastFeed1Type = "type2";
    let lastFeed2Type = "type3";

    if (feedEntries.length > 0) {
      const lastEntry = feedEntries[feedEntries.length - 1];
      lastFeed1Type = lastEntry.feed1Type;
      lastFeed2Type = lastEntry.feed2Type;
    }

    const newEntry: FeedEntry = {
      id: Date.now().toString(),
      time: currentTime,
      feed1Type: lastFeed1Type,
      feed1Amount: "",
      feed2Type: lastFeed2Type,
      feed2Amount: "",
    };

    onChange([...feedEntries, newEntry]);
  };

  // 給餌情報の行を削除
  const removeFeedEntry = (id: string) => {
    // 最低1つは残す
    if (feedEntries.length <= 1) return;

    onChange(feedEntries.filter((entry) => entry.id !== id));
  };

  // 給餌情報の入力を処理
  const handleFeedEntryChange = (
    id: string,
    field: keyof FeedEntry,
    value: string
  ) => {
    onChange(
      feedEntries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">給餌情報</h3>
      </div>

      <div className="space-y-3">
        {feedEntries.map((entry) => (
          <div
            key={entry.id}
            className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-3 border rounded-lg bg-gray-50 relative"
          >
            <div className="space-y-1">
              <Label htmlFor={`time-${entry.id}`}>時刻</Label>
              <div className="relative">
                <Input
                  id={`time-${entry.id}`}
                  type="time"
                  className="w-full"
                  value={
                    typeof entry.time === "string"
                      ? entry.time
                      : formatTimeForInput(new Date())
                  }
                  onChange={(e) => {
                    handleFeedEntryChange(entry.id, "time", e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor={`feed1Type-${entry.id}`}>餌種類①</Label>
              <Select
                value={entry.feed1Type}
                onValueChange={(value) =>
                  handleFeedEntryChange(entry.id, "feed1Type", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="餌種類を選択" />
                </SelectTrigger>
                <SelectContent>
                  {FEED_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor={`feed1Amount-${entry.id}`}>給餌量 (g)</Label>
              <Input
                type="number"
                inputMode="numeric"
                value={entry.feed1Amount}
                onChange={(e) => {
                  handleFeedEntryChange(
                    entry.id,
                    "feed1Amount",
                    e.target.value
                  );
                }}
                className="w-full"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor={`feed2Type-${entry.id}`}>餌種類②</Label>
              <Select
                value={entry.feed2Type}
                onValueChange={(value) => {
                  handleFeedEntryChange(entry.id, "feed2Type", value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="餌種類を選択" />
                </SelectTrigger>
                <SelectContent>
                  {FEED_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor={`feed2Amount-${entry.id}`}>給餌量 (g)</Label>
              <div className="flex">
                <Input
                  type="number"
                  inputMode="numeric"
                  value={entry.feed2Amount}
                  onChange={(e) => {
                    handleFeedEntryChange(
                      entry.id,
                      "feed2Amount",
                      e.target.value
                    );
                  }}
                  className="w-full"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    removeFeedEntry(entry.id);
                  }}
                  className="ml-2 hover:bg-gray-200 rounded-full p-2"
                  title="削除"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              addFeedEntry();
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            記録追加
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedEntryForm;
