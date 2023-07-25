import { Sonyflake } from '../src';

describe('Sonyflake', (): void => {
  const EPOCH = Date.UTC(2020, 4, 18, 0, 0, 0);
  const WORKER_ID = 2;

  describe('#nextId', (): void => {
    const sonyflake = new Sonyflake({
      epoch: EPOCH,
      machineId: WORKER_ID,
    });

    it('should be valid generation Sonyflake', (): void => {
      const snowflake = sonyflake.nextId();
      const result = sonyflake.decompose(snowflake);

      expect(result.timestamp - (result.timestamp - EPOCH)).toBe(EPOCH);
      expect(result.machineId).toBe(WORKER_ID);
    });
  });

  describe('#generateCustomId', (): void => {
    const sonyflake = new Sonyflake({
      epoch: EPOCH,
      machineId: WORKER_ID,
    });

    it('should be valid generate Sonyflake', (): void => {
      // 1 year
      const timestamp = EPOCH + 31536000000;

      const snowflake = sonyflake.generateCustomId({
        timestamp,
        sequence: 25,
      });

      const result = Sonyflake.decompose(snowflake, {
        epoch: EPOCH,
      });

      expect(result.timestamp).toBe(timestamp);
      expect(result.machineId).toBe(WORKER_ID);
      expect(result.sequence).toBe(25);
    });
  });

  describe('static #decomposeTimestamp', (): void => {
    it('should be valid decompose timestamp Snowflake', (): void => {
      const timestamp = Sonyflake.decomposeTimestamp('1211144891006978', EPOCH);

      expect(timestamp - (timestamp - EPOCH)).toBe(EPOCH);
    });
  });

  describe('static #decomposeMachineId', (): void => {
    it('should be valid decompose workerId Snowflake', (): void => {
      const workerId = Sonyflake.decomposeMachineId('1211144891006978');

      expect(workerId).toBe(WORKER_ID);
    });
  });

  describe('static #decomposeSequence', (): void => {
    it('should be valid decompose sequence Snowflake', (): void => {
      const sequence = Sonyflake.decomposeSequence('1223271496351746');

      expect(sequence).toBe(1);
    });
  });
});
