export enum ResourceIncrementType {
  NONE = 0,
  STATIC = 1,
  DYNAMIC = 2
}

export interface ClassConfig {
  name: string;
  initialPlayers: number;
  formulas: [string, string]; // [0]: vs Self, [1]: vs Other
}

export interface MatrixConfig {
  resourceGain: number;
  resourceCost: number;
  initialResources: number;
  timePenalty: number;
  initialFitness: number;
  maxFitness: number;
  simulationSpeed: number;
  maxInteractions: number;
  resourceIncrementType: ResourceIncrementType;
  resourceIncrementFormula: string;
  class1: ClassConfig;
  class2: ClassConfig;
}
