import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";

// 表示用日付フォーマット (YYYY/M/D(曜日))
export function formatDateForDisplay(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "yyyy/M/d(EEE)", { locale: ja });
}

// 入力用日付フォーマット (YYYY-MM-DDThh:mm)
export function formatDateForInput(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "yyyy-MM-dd'T'HH:mm");
}

// 時間表示用フォーマット (HH:mm)
export function formatTimeForDisplay(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "HH:mm");
}

// CSVファイル名用フォーマット (YYYYMMDD)
export function formatDateForFilename(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "yyyyMMdd");
}

// PLCデータのタイムスタンプ用フォーマット (可能性のある形式に対応)
export function formatPlcTimestamp(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return dateObj.toISOString();
}
