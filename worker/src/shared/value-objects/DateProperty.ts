import { ValidatorProperty } from './ValidatorProperty';

/** Fecha en formato MM/DD/YYYY según formato del archivo. */
export class DateProperty extends ValidatorProperty<Date> {
  constructor(value: string) {
    const parsed = DateProperty.parse(value);
    super(parsed);
    this.isValid();
  }

  private isValid(): void {
    const d = this._value;
    if (isNaN(d.getTime())) throw new Error(`Invalid date: ${d}`);
    if (d.getFullYear() < 1900 || d.getFullYear() > 2100) {
      throw new Error(`Date year out of range: ${d.getFullYear()}`);
    }
  }

  /** Parsea MM/DD/YYYY. Lanza si la cadena es inválida. */
  static parse(value: string): Date {
    if (!value || value.trim() === '') throw new Error('Date string is empty');
    const parts = value.trim().split('/');
    if (parts.length !== 3) throw new Error(`Invalid date format: ${value}`);
    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    if (isNaN(month) || isNaN(day) || isNaN(year)) {
      throw new Error(`Invalid date numbers: ${value}`);
    }
    const d = new Date(year, month - 1, day);
    if (d.getMonth() !== month - 1 || d.getDate() !== day || d.getFullYear() !== year) {
      throw new Error(`Invalid date: ${value}`);
    }
    return d;
  }

  toISOString(): string {
    return this._value.toISOString().slice(0, 10);
  }
}
