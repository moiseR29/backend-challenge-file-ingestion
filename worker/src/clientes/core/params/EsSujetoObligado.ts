/** EsSujetoObligado: BIT NULL en la tabla; vacío en archivo = null. */
export class EsSujetoObligado {
  private readonly _value: boolean | null;

  constructor(value: string | boolean) {
    this._value = EsSujetoObligado.parse(value);
  }

  get value(): boolean | null {
    return this._value;
  }

  static parse(value: string | boolean): boolean | null {
    if (typeof value === 'boolean') return value;
    const s = String(value).trim().toLowerCase();
    if (s === 'true' || s === '1') return true;
    if (s === 'false' || s === '0') return false;
    if (s === '') return null;
    throw new Error(`Invalid EsSujetoObligado: ${value}`);
  }
}
