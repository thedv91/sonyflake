export type Snowflake = string;

export interface SonyflakeOptions {
  epoch?: number;

  machineId?: number;
}

export interface SonyflakeGenerateCustomIdOptions {
  timestamp: number;
  sequence: number;
}

export interface SonyflakeDecomposeOptions {
  epoch: number;
}

export interface DecomposedSonyflake {
  timestamp: number;
  machineId: number;
  sequence: number;
}
