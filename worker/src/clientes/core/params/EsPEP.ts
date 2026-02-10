import { BooleanProperty } from '../../../shared/value-objects';

export class EsPEP extends BooleanProperty {
  constructor(value: string | boolean) {
    const b = EsPEP.parse(value);
    super(b);
  }

  static parse(value: string | boolean): boolean {
    if (typeof value === 'boolean') return value;
    const s = String(value).trim().toLowerCase();
    if (s === 'true' || s === '1') return true;
    if (s === 'false' || s === '0' || s === '') return false;
    throw new Error(`Invalid boolean: ${value}`);
  }
}
