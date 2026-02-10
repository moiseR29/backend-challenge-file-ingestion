import { StringProperty } from '@shared/value-objects';

const MAX_LENGTH = 50;

export class Nombre extends StringProperty {
  constructor(value: string) {
    super(value?.trim() ?? '');
    this.isValid();
  }

  private isValid(): void {
    if (this.value.length === 0) throw new Error('Nombre must not be empty');
    if (this.value.length > MAX_LENGTH) {
      throw new Error(`Nombre length must be <= ${MAX_LENGTH}`);
    }
  }
}
