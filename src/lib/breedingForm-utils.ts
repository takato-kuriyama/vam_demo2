import { format, isValid } from "date-fns";
import {
  FeedEntry,
  CustomField,
  MortalityRecord,
} from "../types/dataManagement";

// LocalStorageキー
export const LAST_FEED_STORAGE_KEY = "lastFeedEntries";
export const CUSTOM_FIELDS_STORAGE_KEY = "customFields";

// 日付をYYYY-MM-DDThh:mm形式に変換
export function formatDateForInput(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

// 日付表示用のフォーマット (YYYY/M/D(曜日))
export function formatDateForDisplay(date: Date): string {
  return format(date, "yyyy/M/d(EEE)");
}

// 時刻をHH:MM形式に変換する関数
export function formatTimeForInput(date: Date): string {
  // 明示的にローカル時間を取得
  const hours = date.getHours();
  const minutes = date.getMinutes();
  console.log(`フォーマット前の時間: ${hours}:${minutes}`); // デバッグ用
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

// デフォルトの給餌エントリを初期化
export function createDefaultFeedEntry(): FeedEntry {
  const now = new Date();

  return {
    id: Date.now().toString(),
    time: formatTimeForInput(now), // 現在時刻をHH:MM形式の文字列として設定
    feed1Type: "type2", // EP2をデフォルト設定
    feed1Amount: "",
    feed2Type: "type3", // EP3をデフォルト設定
    feed2Amount: "",
  };
}

// 永続的なカスタム項目をローカルストレージから読み込み
export function loadPersistedCustomFields(): CustomField[] {
  try {
    const savedCustomFields = localStorage.getItem(CUSTOM_FIELDS_STORAGE_KEY);
    if (savedCustomFields) {
      const parsedFields = JSON.parse(savedCustomFields);
      // 永続的なもののみをロード
      return parsedFields.filter((field: CustomField) => field.isPermanent);
    }
  } catch (e) {
    console.error("カスタム項目の読み込みに失敗しました", e);
  }
  return [];
}

// 永続的なカスタム項目をローカルストレージに保存
export function saveCustomFieldsToStorage(customFields: CustomField[]): void {
  const permanentFields = customFields.filter((field) => field.isPermanent);
  localStorage.setItem(
    CUSTOM_FIELDS_STORAGE_KEY,
    JSON.stringify(permanentFields)
  );
}

// 前回の給餌情報をローカルストレージから読み込み
export function loadLastFeedEntries(): FeedEntry[] | null {
  try {
    const lastFeed = localStorage.getItem(LAST_FEED_STORAGE_KEY);
    if (lastFeed) {
      return JSON.parse(lastFeed);
    }
  } catch (e) {
    console.error("前回の給餌情報の読み込みに失敗しました", e);
  }
  return null;
}

// 給餌情報をローカルストレージに保存
export function saveFeedEntriesToStorage(feedEntries: FeedEntry[]): void {
  localStorage.setItem(LAST_FEED_STORAGE_KEY, JSON.stringify(feedEntries));
}

// 新しい斃死記録を作成する関数
export function createEmptyMortalityRecord(): MortalityRecord {
  return {
    id: "",
    weight: "",
    symptoms: "",
    photos: [],
    notes: "",
  };
}

// 総斃死数を計算する関数
export function calculateTotalMortality(records: MortalityRecord[]): number {
  return records.length;
}

// 新しいカスタム項目を作成する関数
export function createCustomField(
  name: string,
  isPermanent: boolean
): CustomField {
  return {
    id: `custom-${Date.now()}`,
    name,
    value: "",
    isPermanent,
  };
}

// Feed エントリーから給餌量の合計を計算
export function calculateTotalFeedAmount(entry: FeedEntry): number {
  const amount1 = parseFloat(entry.feed1Amount) || 0;
  const amount2 = parseFloat(entry.feed2Amount) || 0;
  return amount1 + amount2;
}

// 日付が今日かどうかをチェック
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
