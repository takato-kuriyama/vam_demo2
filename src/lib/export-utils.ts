import { format } from "date-fns";
import { ja } from "date-fns/locale";

// CSVエクスポート用関数
export function exportToCsv(
  headers: string[],
  data: string[][],
  filename: string
) {
  // CSVデータをダブルクォートで囲む処理
  const escapeCsv = (data: string) => `"${data.replace(/"/g, '""')}"`;

  // CSVデータの作成（各フィールドをダブルクォートで囲む）
  const csvContent = [
    headers.map(escapeCsv).join(","),
    ...data.map((row) => row.map(escapeCsv).join(",")),
  ].join("\n");

  // UTF-8 BOMを追加
  const BOM = "\uFEFF";
  const csvWithBOM = BOM + csvContent;

  // ダウンロード処理
  const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // 数秒後にBlob URLをクリーンアップ
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

// データテーブル用のCSVエクスポート関数
export function exportTableDataToCsv(
  columns: { id: string; label: string; unit?: string }[],
  data: any[],
  selectedColumns: string[],
  filename: string
) {
  // 選択された列のヘッダー
  const headers = columns
    .filter((col) => selectedColumns.includes(col.id))
    .map((col) => (col.unit ? `${col.label} (${col.unit})` : col.label));

  // データ行の作成
  const rows = data.map((row) => {
    return selectedColumns.map((colId) => {
      if (colId === "date" && row.date instanceof Date) {
        return format(row.date, "yyyy/MM/dd", { locale: ja });
      }
      return row[colId] !== undefined
        ? String(row[colId]).replace(/,/g, "、")
        : ""; // カンマをリプレース
    });
  });

  // 現在の日付をファイル名に含める
  const dateStr = format(new Date(), "yyyyMMdd");
  const fullFilename = `${filename}_${dateStr}.csv`;

  exportToCsv(headers, rows, fullFilename);
}
