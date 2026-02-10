import { StringProperty } from '../../../shared/value-objects';

export enum ESTADO_ENUM {
  ESTADO_ACTIVO = 'Activo',
  ESTADO_INACTIVO = 'Inactivo',
}

export class Estado extends StringProperty {
  constructor(value: string) {
    super(value?.trim() ?? '');
    this.isValid();
  }

  private isValid(): void {
    const allowed = [ESTADO_ENUM.ESTADO_ACTIVO, ESTADO_ENUM.ESTADO_INACTIVO];
    if (!allowed.includes(this.value as ESTADO_ENUM)) {
      throw new Error(`Invalid status: ${this.value}`);
    }
  }
}
