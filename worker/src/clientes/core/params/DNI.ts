import { ValidatorProperty } from '../../../shared/value-objects';

export class DNI extends ValidatorProperty<number> {
  constructor(value: string | number) {
    const n = typeof value === 'string' ? parseInt(value.trim(), 10) : value;
    super(n);
    this.isValid();
  }

  private isValid(): void {
    if (Number.isNaN(this._value)) throw new Error('DNI must be a number');
    if (!Number.isInteger(this._value)) throw new Error('DNI must be an integer');
    if (this._value < 1 || this._value > 999999999) {
      throw new Error('DNI out of valid range');
    }
  }

  get value(): number {
    return this._value;
  }
}
