import { StringProperty } from '@shared/value-objects';
import { v4 } from 'uuid';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class ChunkId extends StringProperty {
  constructor(value: string) {
    super(value);
    this.isValid();
  }

  private isValid(): void {
    if (this.value.trim().length === 0) {
      throw new Error('ChunkId must not be empty');
    }
    if (!UUID_REGEX.test(this.value)) {
      throw new Error(`ChunkId must be a valid UUID, got: ${this.value}`);
    }
  }

  static new(): ChunkId {
    return new ChunkId(v4());
  }
}
