export class ValidatorProperty<T> {
  protected _value: T;

  constructor(value: unknown) {
    this._value = value as T;
    this.validate();
  }

  get value(): T {
    return this._value;
  }

  protected validate(): void {
    if (this._value === undefined || this._value === null) {
      throw new Error('Value must be defined');
    }
  }
}
