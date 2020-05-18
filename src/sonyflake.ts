import {
  DEFAULT_SEQUENCE,
  DEFAULT_VALUE,
  Epoch,
  MACHINE_ID_BITS,
  MACHINE_ID_MASK,
  MACHINE_ID_SHIFT,
  SEQUENCE_MASK,
  TIMESTAMP_LEFT_SHIFT,
  USIGNED_INCREASE,
} from './constants';

import type {
  DecomposedSonyflake,
  Snowflake,
  SonyflakeDecomposeOptions,
  SonyflakeGenerateCustomIdOptions,
  SonyflakeOptions,
} from './interfaces';

import { getNowBigInt } from './helpers';

export class Sonyflake {
  /**
   * Snowflake start epoch
   */
  public readonly epoch: number;

  /**
   * Internal worker ID
   */
  public readonly machineId: bigint;

  /**
   * Sequence increment for process
   */
  private sequence: bigint = BigInt(DEFAULT_SEQUENCE);

  /**
   * Latest timestamp
   */
  private latestTimestamp: bigint = getNowBigInt();

  /**
   * Constructor
   */
  public constructor({
    epoch = Epoch.UNIX,
    machineId = DEFAULT_VALUE,
  }: SonyflakeOptions = {}) {
    if (epoch > Number(getNowBigInt())) {
      throw new Error('Epoch must be less than current time');
    }
    this.epoch = epoch;

    this.machineId = BigInt(machineId) & MACHINE_ID_MASK;
  }

  /**
   * Generate a Snowflake
   */
  public nextId(): Snowflake {
    const timestamp = getNowBigInt();
    if (this.latestTimestamp === timestamp) {
      this.sequence = (this.sequence + USIGNED_INCREASE) & SEQUENCE_MASK;
    } else {
      this.sequence = BigInt(DEFAULT_SEQUENCE);

      this.latestTimestamp = timestamp;
    }

    return this.generateCustomId({
      timestamp: Number(timestamp),
      sequence: Number(this.sequence),
    });
  }

  /**
   * Decompose the Snowflake with local epoch
   */
  public decompose(snowflake: Snowflake): DecomposedSonyflake {
    return Sonyflake.decompose(snowflake, {
      epoch: this.epoch,
    });
  }

  /**
   * Generate a custom Snowflake
   */
  public generateCustomId({
    timestamp,
    sequence,
  }: SonyflakeGenerateCustomIdOptions): Snowflake {
    return (
      ((BigInt(timestamp) - BigInt(this.epoch)) << TIMESTAMP_LEFT_SHIFT) |
      (BigInt(sequence) << MACHINE_ID_SHIFT) |
      this.machineId
    ).toString();
  }

  /**
   * Decompose the Snowflake timestamp
   */
  public static decomposeTimestamp(
    snowflake: Snowflake,
    epoch: number,
  ): number {
    return Number((BigInt(snowflake) >> TIMESTAMP_LEFT_SHIFT) + BigInt(epoch));
  }

  /**
   * Decompose the Snowflake machineId
   */
  public static decomposeMachineId(snowflake: Snowflake): number {
    return Number(BigInt(snowflake) & MACHINE_ID_MASK);
  }

  /**
   * Decompose the Snowflake sequence
   */
  public static decomposeSequence(snowflake: Snowflake): number {
    return Number((BigInt(snowflake) >> MACHINE_ID_BITS) & SEQUENCE_MASK);
  }

  /**
   * Decompose the Snowflake
   */
  public static decompose(
    snowflake: Snowflake,
    { epoch }: SonyflakeDecomposeOptions,
  ): DecomposedSonyflake {
    return {
      timestamp: Sonyflake.decomposeTimestamp(snowflake, epoch),
      machineId: Sonyflake.decomposeMachineId(snowflake),
      sequence: Sonyflake.decomposeSequence(snowflake),
    };
  }
}
