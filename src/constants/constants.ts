//Route
export const ROUTES = {
  HOME: "/homepage",
  DASHBOARD: "/dashboard",
  DASHBOARD_EQUIPMENT: "/dashboardequipment",
  DASHBOARD_BREEDING: "/dashboardbreeding",
  BREEDING_MANAGEMENT: "/breedingmanagement",
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type RoutePaths = (typeof ROUTES)[RouteKeys];

//Dashboards
export const DASHBOARDS: Dashboard[] = [
  {
    id: "01",
    name: "ろ過槽ダッシュボード",
    path: ROUTES.DASHBOARD_EQUIPMENT,
  },
  {
    id: "02",
    name: "飼育槽ダッシュボード",
    path: ROUTES.DASHBOARD_BREEDING,
  },
  {
    id: "03",
    name: "TESTダッシュボード",
    path: ROUTES.DASHBOARD_EQUIPMENT,
  },
  {
    id: "04",
    name: "04ダッシュボード",
    path: ROUTES.DASHBOARD_EQUIPMENT,
  },
];

export type Dashboard = {
  id: string;
  name: string;
  path: RoutePaths;
};

//Param_Unit
export const PARAM_UNITS = {
  CHLORINE: "mg/L", //塩素
  AMMONIA: "ppm",
  CURRENT: "A",
  FLOW_RATE: "L/min",
  POLARITY: "",
} as const;

export type ParamUnitKeys = keyof typeof PARAM_UNITS;
export type ParamUnitValues = (typeof PARAM_UNITS)[ParamUnitKeys];

//ろ過槽の初期サンプルデータ
export const SAMPLE_FILTER_DATA: SampleFilterData = {
  resClIdx1: 7.05,
  resClIdx2: 7.01,
  ammonia: 0.45,
  current: 153.0,
  flowRate: 30.53,
  polarity: "Positive",
} as const;

export type SampleFilterData = {
  resClIdx1: number;
  resClIdx2: number;
  ammonia: number;
  current: number;
  flowRate: number;
  polarity: "Positive" | "Negative";
};

// ろ過槽のパラメータ定義
export const FILTER_PARAMETERS: FilterParameter[] = [
  {
    id: "resClIdx1",
    name: "残留塩素計値①",
    unit: PARAM_UNITS.CHLORINE,
    type: "numeric",
  },
  {
    id: "resClIdx2",
    name: "残留塩素計値②",
    unit: PARAM_UNITS.CHLORINE,
    type: "numeric",
  },
  {
    id: "ammonia",
    name: "アンモニア",
    unit: PARAM_UNITS.AMMONIA,
    type: "numeric",
  },
  {
    id: "current",
    name: "電解電流値",
    unit: PARAM_UNITS.CURRENT,
    type: "numeric",
  },
  {
    id: "flowRate",
    name: "流量値",
    unit: PARAM_UNITS.FLOW_RATE,
    type: "numeric",
  },
  {
    id: "polarity",
    name: "電解極性",
    unit: PARAM_UNITS.POLARITY,
    type: "string",
  },
] as const;

export type NumericFilterParameter = {
  id: "resClIdx1" | "resClIdx2" | "ammonia" | "current" | "flowRate";
  name: string;
  unit: ParamUnitValues;
  type: "numeric";
};

export type StringFilterParameter = {
  id: "polarity";
  name: string;
  unit: ParamUnitValues;
  type: "string";
};

export type FilterParameter = NumericFilterParameter | StringFilterParameter;

//パラメーターステータス
export const STATUS = {
  NORMAL: "normal",
  WARNING: "warning",
  ERROR: "error",
} as const;

export type StatusType = (typeof STATUS)[keyof typeof STATUS];

export const STATUS_DISPLAY: Record<
  StatusType,
  { text: string; color: string }
> = {
  [STATUS.NORMAL]: { text: "正常値", color: "bg-white" },
  [STATUS.WARNING]: { text: "危険値", color: "bg-yellow-50" },
  [STATUS.ERROR]: { text: "異常値", color: "bg-red-50" },
} as const;

//餌種類
export const FEED_TYPES = [
  { id: "type0", name: "" },
  { id: "type1", name: "EP1" },
  { id: "type2", name: "EP2" },
  { id: "type3", name: "EP3" },
] as const;

export type FeedType = (typeof FEED_TYPES)[number];
export type FeedTypeId = FeedType["id"];

//摂餌活性
export const FEEDING_ACTIVITY = [
  { value: 1, label: "1: 良くない" },
  { value: 2, label: "2: あまり良くない" },
  { value: 3, label: "3: 普通" },
  { value: 4, label: "4: 良い" },
  { value: 5, label: "5: とても良い" },
] as const;

export type FeedingActivity = (typeof FEEDING_ACTIVITY)[number];
export type FeedingActivityValue = FeedingActivity["value"];

//ろ過槽一覧
export const EQ_TANKS: Tank[] = [
  { id: "A", name: "Aライン" },
  { id: "B", name: "Bライン" },
  { id: "C", name: "Cライン" },
] as const;

//飼育水槽一覧
export const BR_TANKS: Tank[] = [
  { id: "A1", name: "A1水槽" },
  { id: "A2", name: "A2水槽" },
  { id: "A3", name: "A3水槽" },
  { id: "A4", name: "A4水槽" },
  { id: "A5", name: "A5水槽" },
  { id: "B1", name: "B1水槽" },
  { id: "B2", name: "B2水槽" },
  // { id: "B3", name: "B3水槽" },
  // { id: "B4", name: "B4水槽" },
  // { id: "B5", name: "B5水槽" },
] as const;

export type Tank = {
  id: string;
  name: string;
};

//飼育データ項目一覧
export const BREEDING_TABLE_COLUMNS = [
  {
    id: "dateTime",
    label: "日時",
    sticky: "left",
    render: (value: string) => new Date(value).toLocaleString(),
  },
  {
    id: "warterTemp",
    label: "水温",
    suffix: "℃",
    sticky: "top",
  },
  {
    id: "feed1Type",
    label: "餌種類①",
    sticky: "top",
    render: (value: string) => getFeedTypeName(value),
  },
  {
    id: "feed1Amount",
    label: "給餌量",
    suffix: "g",
    sticky: "top",
  },
  {
    id: "feed2Type",
    label: "餌種類②",
    sticky: "top",
    render: (value: string) => getFeedTypeName(value),
  },
  {
    id: "feed2Amount",
    label: "給餌量",
    suffix: "g",
    sticky: "top",
  },
  {
    id: "totalFeedAmount",
    label: "総給餌量",
    suffix: "g",
    sticky: "top",
  },
  {
    id: "feedingActivity",
    label: "摂餌活性",
    sticky: "top",
    render: (value: string) => getFeedingActivityLabel(value),
  },
  {
    id: "mortality",
    label: "斃死数",
    sticky: "top",
  },
  {
    id: "mortalityReason",
    label: "斃死理由",
    sticky: "top",
    render: (value: string) => value || "-",
  },
  {
    id: "transferIn",
    label: "移動IN",
    sticky: "top",
  },
  {
    id: "transferOut",
    label: "移動OUT",
    sticky: "top",
  },
  {
    id: "culling",
    label: "間引き",
    sticky: "top",
  },
  {
    id: "memo",
    label: "メモ",
    sticky: "top",
    render: (value: string) => value || "-",
  },
] as const;

const getFeedTypeName = (id: string): string => {
  const feed = FEED_TYPES.find((type) => type.id === id);
  return feed ? feed.name : "-";
};

const getFeedingActivityLabel = (value: string): string => {
  const activity = FEEDING_ACTIVITY.find(
    (a) => String(a.value) === String(value)
  );
  return activity ? activity.label : "-";
};

//飼育データフォームの初期値定義
export const BASE_BREEDING_FORM_INITIAL_VALUES = {
  dateTime: "", // getCurrentDateTime()で上書きされる
  waterTemp: "",
  feed1Type: "type0",
  feed1Amount: "",
  feed2Type: "type0",
  feed2Amount: "",
  feedingActivity: "",
  mortality: "",
  mortalityReason: "",
  transferIn: "",
  transferOut: "",
  culling: "",
  memo: "",
} as {
  dateTime: string;
  waterTemp: string;
  feed1Type: string;
  feed1Amount: string;
  feed2Type: string;
  feed2Amount: string;
  feedingActivity: string;
  mortality: string;
  mortalityReason: string;
  transferIn: string;
  transferOut: string;
  culling: string;
  memo: string;
};

//飼育データ入力フォーム追加項目一覧
export const ADDITIONAL_BREEDING_FORM_FIELDS = [
  {
    id: "test",
    label: "TEST",
    type: "text",
    initialValue: "", //初期値
  },
  //追加したいフィールドをここに追加していく
] as const;

export type BreedingFormData = typeof BASE_BREEDING_FORM_INITIAL_VALUES & {
  [Key in (typeof ADDITIONAL_BREEDING_FORM_FIELDS)[number]["id"]]: string;
};

export type AdditionalBreedingFormField = {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  initialValue: string;
};
