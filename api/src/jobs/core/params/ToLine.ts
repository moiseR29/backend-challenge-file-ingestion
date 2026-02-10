import { NumberProperty } from '@shared/value-objects';
import type { FromLine } from './FromLine';

export class ToLine extends NumberProperty {
  constructor(value: number, fromLine?: FromLine) {
    super(value);
    this.isValid(fromLine);
  }

  private isValid(fromLine?: FromLine): void {
    if (this.value < 1 || !Number.isInteger(this.value)) {
      throw new Error(`ToLine must be an integer >= 1, got ${this.value}`);
    }
    if (fromLine != null && this.value < fromLine.value) {
      throw new Error(
        `ToLine (${this.value}) must be >= FromLine (${fromLine.value})`,
      );
    }
  }
}
