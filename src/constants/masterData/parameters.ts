// src/constants/masterData/parameters.ts
import { ParameterDefinition } from "../../types/dataModels";

// パラメータ定義
export const PARAMETERS: ParameterDefinition[] = [
  // 設備（ろ過槽）パラメータ
  {
    id: "residualChlorine1",
    name: "残留塩素計値①",
    unit: "mg/L",
    normalMin: 3.0,
    normalMax: 4.0,
    warningMin: 2.5,
    warningMax: 4.5,
    dangerMin: 2.0,
    dangerMax: 5.0,
  },
  {
    id: "residualChlorine2",
    name: "残留塩素計値②",
    unit: "mg/L",
    normalMin: 0.0,
    normalMax: 0.3,
    warningMin: 0.0,
    warningMax: 0.5,
    dangerMin: 0.0,
    dangerMax: 1.0,
  },
  {
    id: "ammonia",
    name: "アンモニア",
    unit: "ppm",
    normalMin: 0.1,
    normalMax: 0.5,
    warningMin: 0.0,
    warningMax: 0.8,
    dangerMin: 0.0,
    dangerMax: 1.0,
  },
  {
    id: "current",
    name: "電解電流値aa",
    unit: "A",
    normalMin: 11.0,
    normalMax: 13.0,
    warningMin: 10.0,
    warningMax: 14.0,
    dangerMin: 9.0,
    dangerMax: 15.0,
  },
  {
    id: "flowRate",
    name: "流量値",
    unit: "L/min",
    normalMin: 28,
    normalMax: 32,
    warningMin: 26,
    warningMax: 34,
    dangerMin: 24,
    dangerMax: 36,
  },

  // 飼育槽パラメータ
  {
    id: "oxygenSaturation",
    name: "酸素飽和度",
    unit: "%",
    normalMin: 75,
    normalMax: 95,
    warningMin: 70,
    warningMax: 100,
    dangerMin: 65,
    dangerMax: 110,
  },
  {
    id: "ph",
    name: "pH",
    unit: "",
    normalMin: 6.8,
    normalMax: 7.5,
    warningMin: 6.5,
    warningMax: 8.0,
    dangerMin: 6.0,
    dangerMax: 8.5,
  },
  {
    id: "temperature",
    name: "水温",
    unit: "℃",
    normalMin: 24,
    normalMax: 27,
    warningMin: 23,
    warningMax: 28,
    dangerMin: 22,
    dangerMax: 29,
  },

  // パックテスト項目
  {
    id: "no2",
    name: "亜硝酸",
    unit: "mg/L",
    normalMin: 0.0,
    normalMax: 0.05,
    warningMin: 0.0,
    warningMax: 0.1,
    dangerMin: 0.0,
    dangerMax: 0.2,
  },
  {
    id: "no3",
    name: "硝酸",
    unit: "mg/L",
    normalMin: 0.0,
    normalMax: 10.0,
    warningMin: 0.0,
    warningMax: 15.0,
    dangerMin: 0.0,
    dangerMax: 20.0,
  },
  {
    id: "nh4",
    name: "アンモニウム",
    unit: "mg/L",
    normalMin: 0.0,
    normalMax: 0.5,
    warningMin: 0.0,
    warningMax: 1.0,
    dangerMin: 0.0,
    dangerMax: 2.0,
  },
];

// 餌種類の定義
export const FEED_TYPES = [
  { id: "type0", name: "" },
  { id: "type1", name: "おとひめ8" },
  { id: "type2", name: "おとひめ10" },
  { id: "type3", name: "桜モジャコ3" },
];

// // 摂餌活性
// export const FEEDING_ACTIVITY = [
//   { value: 1, label: "1: 良くない" },
//   { value: 2, label: "2: あまり良くない" },
//   { value: 3, label: "3: 普通" },
//   { value: 4, label: "4: 良い" },
//   { value: 5, label: "5: とても良い" },
// ] as const;

// ヘルパー関数
export const getParameterById = (id: string) =>
  PARAMETERS.find((param) => param.id === id);
export const getEquipmentParameters = () =>
  PARAMETERS.filter((param) =>
    [
      "residualChlorine1",
      "residualChlorine2",
      "ammonia",
      "current",
      "flowRate",
    ].includes(param.id)
  );
export const getBreedingParameters = () =>
  PARAMETERS.filter((param) =>
    ["oxygenSaturation", "ph", "temperature"].includes(param.id)
  );
export const getPackTestParameters = () =>
  PARAMETERS.filter((param) => ["no2", "no3", "nh4"].includes(param.id));

export const getFeedTypeName = (id: string): string => {
  const feed = FEED_TYPES.find((type) => type.id === id);
  return feed ? feed.name : "-";
};

export type FeedType = (typeof FEED_TYPES)[number];
export type FeedTypeId = FeedType["id"];

// export type FeedingActivity = (typeof FEEDING_ACTIVITY)[number];
// export type FeedingActivityValue = FeedingActivity["value"];

// export const getFeedingActivityLabel = (value: string): string => {
//   const activity = FEEDING_ACTIVITY.find(
//     (a) => String(a.value) === String(value)
//   );
//   return activity ? activity.label : "-";
// };
