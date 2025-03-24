import { v4 as uuidv4 } from "uuid";
import {
  EquipmentData,
  BreedingPlcData,
  FeedingData,
  FishCountData,
  PackTestData,
  AlertData,
  ParameterDefinition,
  AlertMaster,
} from "../types/dataModels";

// 日付範囲内のデータを生成する関数
export function generateDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

// 乱数を指定範囲内で生成する関数
export function randomInRange(
  min: number,
  max: number,
  precision: number = 2
): number {
  const value = Math.random() * (max - min) + min;
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
}

// 飼育槽データ生成 - 時間ごとのデータパターン（24時間分）
export function dailyPattern(
  baseValue: number,
  volatility: number = 0.2
): number[] {
  const values: number[] = [];

  for (let hour = 0; hour < 24; hour++) {
    // 時間帯による変動を表現（朝方低め、昼高め、夜また低め）
    let timeEffect = Math.sin(((hour - 6) * Math.PI) / 12) * 0.5;

    // ランダムノイズを加える
    let noise = (Math.random() * 2 - 1) * volatility;

    // 基本値に時間効果とノイズを加味
    let value = baseValue * (1 + timeEffect + noise);
    values.push(Number(value.toFixed(2)));
  }

  return values;
}

//各データのランダムな値を作る
export function generateNaturalVariation(
  baseValue: number,
  normalVariationPercent: number = 0.05,
  anomalyChance: number = 0.01,
  anomalyVariationPercent: number = 0.3,
  precision: number = 1,
  paramId?: string
): number {
  //アンモニア用の特別な処理（デモ用）
  if (paramId === "ammonia") {
    // アンモニアの場合は異常値の発生確率を高くする（1週間で1-2個程度出るように調整）
    // 例えば7日間×24時間で168データ点があるとして、1-2個の異常値なら約1%の確率
    anomalyChance = 0.01;

    // 異常値が出た場合は、警告値や危険値を超えるように大きな変動を加える
    if (Math.random() < anomalyChance) {
      // 50%の確率で警告値を超える値（0.8-1.0）
      // 50%の確率で危険値を超える値（1.0-1.2）
      if (Math.random() < 0.5) {
        // 警告値域：0.8-1.0のランダムな値
        return 0.8 + Math.random() * 0.2;
      } else {
        // 危険値域：1.0-1.2のランダムな値
        return 1.0 + Math.random() * 0.2;
      }
    }
  }

  // ステップ①②: 正常値にわずかな変動を加える（-5%〜+5%）
  const normalVariation =
    baseValue * (1 + (Math.random() * 2 - 1) * normalVariationPercent);

  // ステップ③: 稀に大きな変動を加える
  let result;
  if (Math.random() < anomalyChance) {
    // -30%〜+30%の範囲で異常値を生成
    const anomalyFactor = 1 + (Math.random() * 2 - 1) * anomalyVariationPercent;
    result = normalVariation * anomalyFactor;
  } else {
    result = normalVariation;
  }

  const multiplier = Math.pow(10, precision);
  return Math.round(result * multiplier) / multiplier;
}

// 一日分の設備データを生成（1時間おき）
export function generateDailyEquipmentData(
  date: Date,
  lineId: string
): EquipmentData[] {
  const data: EquipmentData[] = [];
  const baseDate = new Date(date);

  // 一日のベースとなる値を決定（日々の変動を表現）
  const dayIndex = Math.floor(baseDate.getTime() / (24 * 60 * 60 * 1000));

  const baseResidualChlorine1 = 3.8;
  const baseResidualChlorine2 = 0.0;
  const baseAmmonia = 0.45;
  const baseCurrent = 12.0;
  const baseFlowRate = 30.53;
  const baseTemperature = 25.0;

  // 極性は3日に1回程度切り替わると仮定
  const polarityChange = dayIndex % 3 === 0;
  const polarity: "A" | "B" = polarityChange
    ? dayIndex % 6 < 3
      ? "A"
      : "B"
    : dayIndex % 6 < 3
    ? "B"
    : "A";

  // 24時間分のデータを生成
  for (let hour = 0; hour < 24; hour++) {
    const timestamp = new Date(baseDate);
    timestamp.setHours(hour, 0, 0, 0);

    data.push({
      id: uuidv4(),
      timestamp: timestamp.toISOString(),
      lineId,
      residualChlorine1: generateNaturalVariation(
        baseResidualChlorine1,
        0.05,
        0.01,
        0.3,
        1,
        "residualChlorine1"
      ),
      residualChlorine2: generateNaturalVariation(
        baseResidualChlorine2,
        0.05,
        0.01,
        0.3,
        1,
        "residualChlorine2"
      ),
      ammonia: generateNaturalVariation(
        baseAmmonia,
        0.05,
        0.01,
        0.3,
        2,
        "ammonia"
      ),
      current: generateNaturalVariation(
        baseCurrent,
        0.05,
        0.01,
        0.3,
        1,
        "current"
      ),
      flowRate: generateNaturalVariation(
        baseFlowRate,
        0.05,
        0.01,
        0.3,
        1,
        "flowRate"
      ),
      polarity,
      temperature: generateNaturalVariation(
        baseTemperature,
        0.05,
        0.01,
        0.3,
        1,
        "temperature"
      ),
    });
  }

  return data;
}

// 一日分のPLC飼育データを生成（1時間おき）
export function generateDailyBreedingPlcData(
  date: Date,
  lineId: string,
  tankIds: string[]
): BreedingPlcData[] {
  const data: BreedingPlcData[] = [];
  const baseDate = new Date(date);

  // 各タンクごとに生成
  for (const tankId of tankIds) {
    const baseOxygen = 80;
    const basePh = 7.0;
    const baseTemperature = 26.0;

    // 24時間分のデータを生成
    for (let hour = 0; hour < 24; hour++) {
      const timestamp = new Date(baseDate);
      timestamp.setHours(hour, 0, 0, 0);

      const oxygen = generateNaturalVariation(baseOxygen);
      const ph = generateNaturalVariation(basePh);
      const temperature = generateNaturalVariation(baseTemperature);

      data.push({
        id: uuidv4(),
        timestamp: timestamp.toISOString(),
        lineId,
        tankId,
        oxygenSaturation: oxygen,
        ph,
        temperature,
      });
    }
  }

  return data;
}

// 一日分の給餌データを生成
export function generateDailyFeedingData(
  date: Date,
  lineId: string,
  tankIds: string[]
): FeedingData[] {
  const data: FeedingData[] = [];
  const baseDate = new Date(date);

  // 朝と夕方の2回給餌
  const feedingHours = [8, 16]; // 8時、16時に給餌

  // 各タンクごとに生成
  for (const tankId of tankIds) {
    // タンクサイズによって給餌量を変える
    const tankIndex = parseInt(tankId.split("-")[1]);
    const baseAmount = 100 + tankIndex * 10; // タンク番号によって給餌量を変える

    // 毎日の変動を付ける（週末は少し多めに与えるなど）
    const day = baseDate.getDay();
    const dayFactor = day === 0 || day === 6 ? 1.1 : 1.0;

    // 2回分の給餌データを生成
    for (const hour of feedingHours) {
      const feedingTime = new Date(baseDate);
      feedingTime.setHours(hour, 0, 0, 0);

      // 餌種類はタンクによって異なる（小さいタンクはEP1、大きいタンクはEP3など）
      const feedType1 =
        tankIndex <= 2 ? "type1" : tankIndex <= 4 ? "type2" : "type3";
      const feedType2 = tankIndex <= 3 ? "type2" : "type3";

      // 給餌量は時間帯と日によって変動
      const amountFactor = hour === 8 ? 0.9 : 1.1; // 朝は少なめ、夕方は多め
      const feedAmount1 = Math.round(
        baseAmount * dayFactor * amountFactor * (0.8 + Math.random() * 0.4)
      );
      const feedAmount2 = Math.round(
        baseAmount *
          0.6 *
          dayFactor *
          amountFactor *
          (0.8 + Math.random() * 0.4)
      );

      data.push({
        id: uuidv4(),
        timestamp: feedingTime.toISOString(),
        lineId,
        tankId,
        feedingTime: feedingTime.toISOString(),
        feedType1,
        feedAmount1,
        feedType2,
        feedAmount2,
      });
    }
  }

  return data;
}

// 一日分の尾数データを生成
export function generateDailyFishCountData(
  date: Date,
  lineId: string,
  tankIds: string[]
): FishCountData[] {
  const data: FishCountData[] = [];
  const baseDate = new Date(date);

  // 10%の確率で何らかの変化があると仮定
  const hasChange = Math.random() < 0.1;

  if (hasChange) {
    // 変化があるタンクをランダムに選択
    const affectedTanks = tankIds.filter(() => Math.random() < 0.3);

    for (const tankId of affectedTanks) {
      // 80%の確率で斃死、20%の確率で間引きか移動
      const isMortality = Math.random() < 0.8;

      if (isMortality) {
        // 斃死数と症状を生成
        const mortality = Math.floor(Math.random() * 5) + 1; // 1-5匹

        // 症状のリスト
        const symptoms = ["原因不明", "飛び出し", "魚病"];
        const symptom = symptoms[Math.floor(Math.random() * symptoms.length)];

        data.push({
          id: uuidv4(),
          timestamp: baseDate.toISOString(),
          lineId,
          tankId,
          mortality,
          symptom,
          transferIn: 0,
          transferOut: 0,
          culling: 0,
          memo: mortality > 3 ? "監視強化" : "",
        });
      } else {
        // 間引きまたは移動
        const isCulling = Math.random() < 0.5;

        if (isCulling) {
          // 間引き
          const culling = Math.floor(Math.random() * 10) + 5; // 5-14匹

          data.push({
            id: uuidv4(),
            timestamp: baseDate.toISOString(),
            lineId,
            tankId,
            mortality: 0,
            symptom: "",
            transferIn: 0,
            transferOut: 0,
            culling,
            memo: "成長不良個体の間引き",
          });
        } else {
          // 移動
          const isTransferIn = Math.random() < 0.5;
          const transferCount = Math.floor(Math.random() * 20) + 10; // 10-29匹

          data.push({
            id: uuidv4(),
            timestamp: baseDate.toISOString(),
            lineId,
            tankId,
            mortality: 0,
            symptom: "",
            transferIn: isTransferIn ? transferCount : 0,
            transferOut: isTransferIn ? 0 : transferCount,
            culling: 0,
            memo: isTransferIn ? "別タンクから移動" : "別タンクへ移動",
          });
        }
      }
    }
  }

  return data;
}

// 毎週金曜日のパックテストデータを生成
export function generatePackTestData(
  date: Date,
  lineId: string,
  tankIds: string[]
): PackTestData[] {
  const data: PackTestData[] = [];
  const baseDate = new Date(date);

  // 金曜日のみ生成
  if (baseDate.getDay() === 5) {
    // 金曜日は5
    for (const tankId of tankIds) {
      // タンクごとの基準値
      const tankIndex = parseInt(tankId.split("-")[1]);
      const tankFactor = 1 + (tankIndex - 3) * 0.05;

      // 値の生成
      const no2 = randomInRange(0.01, 0.1, 2) * tankFactor;
      const no3 = randomInRange(5, 20, 1) * tankFactor;
      const nh4 = randomInRange(0.1, 0.8, 2) * tankFactor;

      data.push({
        id: uuidv4(),
        timestamp: baseDate.toISOString(),
        lineId,
        tankId,
        no2,
        no3,
        nh4,
      });
    }
  }

  return data;
}

// アラート生成ロジック
export function generateAlerts(
  equipmentData: EquipmentData[],
  breedingData: BreedingPlcData[],
  alertMasters: AlertMaster[],
  paramDefs: ParameterDefinition[]
): AlertData[] {
  const alerts: AlertData[] = [];

  // 設備データからアラートを生成
  for (const data of equipmentData) {
    // 各パラメータをチェック
    const parameters = [
      { id: "residualChlorine1", value: data.residualChlorine1 },
      { id: "residualChlorine2", value: data.residualChlorine2 },
      { id: "ammonia", value: data.ammonia },
      { id: "current", value: data.current },
      { id: "flowRate", value: data.flowRate },
      { id: "temperature", value: data.temperature },
    ];

    for (const param of parameters) {
      // パラメータの定義を探す
      const paramDef = paramDefs.find((p) => p.id === param.id);
      if (!paramDef) continue;

      // アラートが必要かチェック
      if (
        param.value < paramDef.warningMin ||
        param.value > paramDef.warningMax
      ) {
        // アラートマスタを検索
        const alertMaster = alertMasters.find(
          (a) => a.targetParam === param.id
        );
        if (!alertMaster) continue;

        // アラートを生成
        alerts.push({
          id: uuidv4(),
          timestamp: data.timestamp,
          lineId: data.lineId,
          tankId: null, // 設備データなのでtankIdはnull
          alertMasterId: alertMaster.id,
          paramName: paramDef.name,
          paramValue: param.value,
          thresholdMin: alertMaster.thresholdMin,
          thresholdMax: alertMaster.thresholdMax,
          description: `${paramDef.name}が閾値を超えました: ${param.value}${paramDef.unit}`,
          solution: alertMaster.solution,
          resolved: Math.random() > 0.7, // 70%は未解決
          resolvedAt:
            Math.random() > 0.7
              ? null
              : new Date(
                  new Date(data.timestamp).getTime() +
                    Math.random() * 86400000 * 2
                ).toISOString(), // 解決済みの場合は2日以内に解決
        });
      }
    }
  }

  // 飼育データからアラートを生成
  for (const data of breedingData) {
    // 各パラメータをチェック
    const parameters = [
      { id: "oxygenSaturation", value: data.oxygenSaturation },
      { id: "ph", value: data.ph },
      { id: "temperature", value: data.temperature },
    ];

    for (const param of parameters) {
      // パラメータの定義を探す
      const paramDef = paramDefs.find((p) => p.id === param.id);
      if (!paramDef) continue;

      // アラートが必要かチェック
      if (
        param.value < paramDef.warningMin ||
        param.value > paramDef.warningMax
      ) {
        // アラートマスタを検索
        const alertMaster = alertMasters.find(
          (a) => a.targetParam === param.id
        );
        if (!alertMaster) continue;

        // アラートを生成
        alerts.push({
          id: uuidv4(),
          timestamp: data.timestamp,
          lineId: data.lineId,
          tankId: data.tankId,
          alertMasterId: alertMaster.id,
          paramName: paramDef.name,
          paramValue: param.value,
          thresholdMin: alertMaster.thresholdMin,
          thresholdMax: alertMaster.thresholdMax,
          description: `${data.tankId}の${paramDef.name}が閾値を超えました: ${param.value}${paramDef.unit}`,
          solution: alertMaster.solution,
          resolved: Math.random() > 0.6, // 60%は未解決
          resolvedAt:
            Math.random() > 0.6
              ? null
              : new Date(
                  new Date(data.timestamp).getTime() +
                    Math.random() * 86400000 * 2
                ).toISOString(), // 解決済みの場合は2日以内に解決
        });
      }
    }
  }

  return alerts;
}

// 全データ生成のメイン関数
export function generateAllData(startDate: Date, endDate: Date) {
  const dates = generateDateRange(startDate, endDate);

  // マスタデータを定義
  const lines = [
    { id: "A", name: "Aライン", order: 1, active: true },
    { id: "B", name: "Bライン", order: 2, active: true },
  ];

  const tanks = [
    ...Array(5)
      .fill(0)
      .map((_, i) => ({
        id: `A-${i + 1}`,
        name: `A${i + 1}水槽`,
        lineId: "A",
        type: "breeding" as const,
        order: i + 1,
        active: true,
      })),
    ...Array(5)
      .fill(0)
      .map((_, i) => ({
        id: `B-${i + 1}`,
        name: `B${i + 1}水槽`,
        lineId: "B",
        type: "breeding" as const,
        order: i + 1,
        active: true,
      })),
  ];

  const parameterDefinitions = [
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
      name: "電解電流値",
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
  ];

  const alertMasters = [
    {
      id: "1",
      name: "残留塩素異常アラート",
      targetParam: "residualChlorine1",
      thresholdMin: 2.5,
      thresholdMax: 4.5,
      dangerMin: 2.0,
      dangerMax: 5.0,
      duplicateControl: "1h",
      solution:
        "・残留塩素計の値を確認してください\n・装置の動作状況を確認してください",
      active: true,
    },
    {
      id: "2",
      name: "アンモニア異常アラート",
      targetParam: "ammonia",
      thresholdMin: 0.0,
      thresholdMax: 0.8,
      dangerMin: 0.0,
      dangerMax: 1.0,
      duplicateControl: "3h",
      solution:
        "・アンモニア濃度を確認してください\n・給餌量を調整してください",
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
      name: "pH異常アラート",
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
      name: "水温異常アラート",
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

  // データコンテナ
  const allEquipmentData: EquipmentData[] = [];
  const allBreedingPlcData: BreedingPlcData[] = [];
  const allFeedingData: FeedingData[] = [];
  const allFishCountData: FishCountData[] = [];
  const allPackTestData: PackTestData[] = [];

  // 各日付ごとにデータを生成
  for (const date of dates) {
    for (const line of lines) {
      // 設備データ
      const equipmentData = generateDailyEquipmentData(date, line.id);
      allEquipmentData.push(...equipmentData);

      // タンクごとのデータ
      const lineTanks = tanks
        .filter((tank) => tank.lineId === line.id)
        .map((tank) => tank.id);

      // PLC飼育データ
      const breedingPlcData = generateDailyBreedingPlcData(
        date,
        line.id,
        lineTanks
      );
      allBreedingPlcData.push(...breedingPlcData);

      // 給餌データ
      const feedingData = generateDailyFeedingData(date, line.id, lineTanks);
      allFeedingData.push(...feedingData);

      // 尾数データ
      const fishCountData = generateDailyFishCountData(
        date,
        line.id,
        lineTanks
      );
      allFishCountData.push(...fishCountData);

      // パックテストデータ
      const packTestData = generatePackTestData(date, line.id, lineTanks);
      allPackTestData.push(...packTestData);
    }
  }

  // アラートデータ生成
  const allAlerts = generateAlerts(
    allEquipmentData,
    allBreedingPlcData,
    alertMasters,
    parameterDefinitions
  );

  return {
    equipmentData: allEquipmentData,
    breedingPlcData: allBreedingPlcData,
    feedingData: allFeedingData,
    fishCountData: allFishCountData,
    packTestData: allPackTestData,
    alerts: allAlerts,
    masterData: {
      lines,
      tanks,
      parameterDefinitions,
      alertMasters,
    },
  };
}

// 実際に1年分のデータを生成するエクスポート関数
export function generateYearData() {
  const today = new Date();
  const startDate = new Date(today);
  //startDate.setFullYear(today.getFullYear() - 1);
  //重いので2カ月分のデータ
  //startDate.setMonth(today.getMonth() - 2);
  startDate.setDate(today.getDate() - 14);
  return generateAllData(startDate, today);
}
