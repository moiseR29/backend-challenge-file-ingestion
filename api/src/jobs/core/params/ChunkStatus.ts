import { StringProperty } from '@shared/value-objects';

export enum ChunkStatusEnum {
  PENDING = 'PENDING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

export class ChunkStatus extends StringProperty {
  constructor(value: ChunkStatusEnum) {
    super(value);
    this.isValid();
  }

  private isValid(): void {
    const allowed = [
      ChunkStatusEnum.PENDING,
      ChunkStatusEnum.DONE,
      ChunkStatusEnum.ERROR,
    ];
    if (!allowed.includes(this.value as ChunkStatusEnum)) {
      throw new Error(`Invalid chunk status: ${this.value}`);
    }
  }

  static pending(): ChunkStatus {
    return new ChunkStatus(ChunkStatusEnum.PENDING);
  }
}
