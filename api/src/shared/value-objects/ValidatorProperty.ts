export class ValidatorProperty<T> {
  protected _value: T;

  constructor(value: any) {
    this._value = value;
    this.validate();
  }

  get value(): T {
    return this._value;
  }

  protected validate() {
    if (this.value === undefined || this.value === null) {
      throw new Error(`Value must be defined`);
    }
  }
}
