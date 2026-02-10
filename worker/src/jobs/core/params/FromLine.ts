import { NumberProperty } from '@shared/value-objects';

export class FromLine extends NumberProperty {
  constructor(value: number) {
    super(value);
    this.isValid();
  }

  private isValid(): void {
    if (this.value < 1 || !Number.isInteger(this.value)) {
      throw new Error(`FromLine must be an integer >= 1, got ${this.value}`);
    }
  }
}
