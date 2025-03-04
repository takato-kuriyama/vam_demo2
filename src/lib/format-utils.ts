// 数値を単位付きでフォーマット
export function formatValueWithUnit(
  value: number,
  unit: string,
  precision: number = 1
): string {
  if (value === undefined || value === null) return "-";
  return `${value.toFixed(precision)}${unit}`;
}

// パラメータ値を状態に応じたスタイルのクラス名で返す
export function getStatusStyleClass(
  value: number,
  warningMin: number,
  warningMax: number,
  dangerMin: number,
  dangerMax: number
): string {
  if (value < dangerMin || value > dangerMax) {
    return "bg-red-50 border-red-200";
  }
  if (value < warningMin || value > warningMax) {
    return "bg-yellow-50 border-yellow-200";
  }
  return "bg-emerald-50 border-emerald-200";
}

// PLCデータの特定パラメータの状態を判定
export function getParameterStatus(
  value: number,
  paramDefinition: {
    warningMin: number;
    warningMax: number;
    dangerMin: number;
    dangerMax: number;
  }
): "normal" | "warning" | "error" {
  if (value < paramDefinition.dangerMin || value > paramDefinition.dangerMax) {
    return "error";
  }
  if (
    value < paramDefinition.warningMin ||
    value > paramDefinition.warningMax
  ) {
    return "warning";
  }
  return "normal";
}
