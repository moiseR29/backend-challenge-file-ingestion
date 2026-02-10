import { StringProperty } from '../../../shared/value-objects';

const MAX_LENGTH = 50;

export class Apellido extends StringProperty {
  constructor(value: string) {
    super(value?.trim() ?? '');
    this.isValid();
  }

  private isValid(): void {
    if (this.value.length === 0) throw new Error('Apellido must not be empty');
    if (this.value.length > MAX_LENGTH) {
      throw new Error(`Apellido length must be <= ${MAX_LENGTH}`);
    }
  }
}
