// src/constants/masterData/tanks.ts
import { LineMaster, TankMaster } from "../../types/dataModels";

// ライン定義
export const LINES: LineMaster[] = [
  { id: "A", name: "Aライン", order: 1, active: true },
  { id: "B", name: "Bライン", order: 2, active: true },
  { id: "C", name: "Cライン", order: 3, active: false }, // 将来的に追加予定など
];

// 飼育槽・ろ過槽定義
export const TANKS: TankMaster[] = [
  // Aラインの飼育槽
  {
    id: "A-1",
    name: "A1水槽",
    lineId: "A",
    type: "breeding",
    order: 1,
    active: true,
  },
  {
    id: "A-2",
    name: "A2水槽",
    lineId: "A",
    type: "breeding",
    order: 2,
    active: true,
  },
  {
    id: "A-3",
    name: "A3水槽",
    lineId: "A",
    type: "breeding",
    order: 3,
    active: true,
  },
  {
    id: "A-4",
    name: "A4水槽",
    lineId: "A",
    type: "breeding",
    order: 4,
    active: true,
  },
  {
    id: "A-5",
    name: "A5水槽",
    lineId: "A",
    type: "breeding",
    order: 5,
    active: true,
  },

  // Bラインの飼育槽
  {
    id: "B-1",
    name: "B1水槽",
    lineId: "B",
    type: "breeding",
    order: 1,
    active: true,
  },
  {
    id: "B-2",
    name: "B2水槽",
    lineId: "B",
    type: "breeding",
    order: 2,
    active: true,
  },
  {
    id: "B-3",
    name: "B3水槽",
    lineId: "B",
    type: "breeding",
    order: 3,
    active: true,
  },
  {
    id: "B-4",
    name: "B4水槽",
    lineId: "B",
    type: "breeding",
    order: 4,
    active: true,
  },
  {
    id: "B-5",
    name: "B5水槽",
    lineId: "B",
    type: "breeding",
    order: 5,
    active: true,
  },

  // ろ過槽
  {
    id: "A-F",
    name: "Aろ過槽",
    lineId: "A",
    type: "filter",
    order: 1,
    active: true,
  },
  {
    id: "B-F",
    name: "Bろ過槽",
    lineId: "B",
    type: "filter",
    order: 1,
    active: true,
  },
  {
    id: "C-F",
    name: "Cろ過槽",
    lineId: "C",
    type: "filter",
    order: 1,
    active: false,
  },
];

// 利便性のためのヘルパー関数
export const getActiveTanks = () => TANKS.filter((tank) => tank.active);
export const getActiveTanksByLine = (lineId: string) =>
  TANKS.filter((tank) => tank.active && tank.lineId === lineId);
export const getActiveBreedingTanks = () =>
  TANKS.filter((tank) => tank.active && tank.type === "breeding");
export const getActiveBreedingTanksByLine = (lineId: string) =>
  TANKS.filter(
    (tank) => tank.active && tank.lineId === lineId && tank.type === "breeding"
  );
export const getActiveFilterTanks = () =>
  TANKS.filter((tank) => tank.active && tank.type === "filter");
export const getActiveLines = () => LINES.filter((line) => line.active);
