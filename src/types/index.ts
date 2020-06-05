import moment from "moment";

export type FormResponse = {
  statusCode: number;
  body: string;
};

export type Step = {
  when: string;
  instruction: string;
};

export type BakeConfig = NoKneadConfig | KneadConfig;

type BaseConfig = {
  isFridged: boolean;
  numFeedsPerDay: number;
  target: moment.Moment;
  autolyse: moment.Duration | null;
  preheat: moment.Duration;
  baking: moment.Duration;
  cooling: moment.Duration;
};

interface NoKneadConfig extends BaseConfig {
  id: "noKnead";
  numFolds: number;
  coldFermentRange: {
    from: moment.Duration;
    to: moment.Duration;
  };
  timeBetweenFolds: moment.Duration;
}

interface KneadConfig extends BaseConfig {
  id: "knead";
  firstProof: moment.Duration;
  secondProof: moment.Duration;
}

const initBaseConfig: BaseConfig = {
  isFridged: true,
  numFeedsPerDay: 1,
  target: moment().add(3, "d").set({ hour: 12, minute: 0 }),
  autolyse: null,
  preheat: moment.duration(20, "minute"),
  baking: moment.duration(35, "minute"),
  cooling: moment.duration(2, "hour"),
};

export const initKneadConfig: KneadConfig = {
  id: "knead",
  firstProof: moment.duration(3, "hour"),
  secondProof: moment.duration(3, "hour"),
  ...initBaseConfig,
};

export const initNoKneadConfig: NoKneadConfig = {
  id: "noKnead",
  numFolds: 4,
  timeBetweenFolds: moment.duration(1, "hour"),
  coldFermentRange: {
    from: moment.duration(8, "hour"),
    to: moment.duration(24, "hour"),
  },
  ...initBaseConfig,
};

export const initState: BakeConfig = initKneadConfig;
