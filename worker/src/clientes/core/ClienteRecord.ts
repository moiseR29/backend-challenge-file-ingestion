import {
  Nombre,
  Apellido,
  DNI,
  Estado,
  FechaIngreso,
  EsPEP,
  EsSujetoObligado,
} from './params';

const NOMBRE_COMPLETO_MAX = 100;

export class ClienteRecord {
  private _nombre: Nombre;
  private _apellido: Apellido;
  private _dni: DNI;
  private _estado: Estado;
  private _fechaIngreso: FechaIngreso;
  private _esPep: EsPEP;
  private _esSujetoObligado: EsSujetoObligado;

  private constructor(
    nombre: Nombre,
    apellido: Apellido,
    dni: DNI,
    estado: Estado,
    fechaIngreso: FechaIngreso,
    esPep: EsPEP,
    esSujetoObligado: EsSujetoObligado
  ) {
    this._nombre = nombre;
    this._apellido = apellido;
    this._dni = dni;
    this._estado = estado;
    this._fechaIngreso = fechaIngreso;
    this._esPep = esPep;
    this._esSujetoObligado = esSujetoObligado;
    this.assertNombreCompletoLength();
  }

  private assertNombreCompletoLength(): void {
    const full = this.nombreCompleto;
    if (full.length > NOMBRE_COMPLETO_MAX) {
      throw new Error(
        `NombreCompleto length ${full.length} exceeds ${NOMBRE_COMPLETO_MAX}`
      );
    }
  }

  get nombreCompleto(): string {
    return `${this._nombre.value} ${this._apellido.value}`.trim();
  }

  get nombre(): Nombre {
    return this._nombre;
  }
  get apellido(): Apellido {
    return this._apellido;
  }
  get dni(): DNI {
    return this._dni;
  }
  get estado(): Estado {
    return this._estado;
  }
  get fechaIngreso(): FechaIngreso {
    return this._fechaIngreso;
  }
  get esPep(): EsPEP {
    return this._esPep;
  }
  get esSujetoObligado(): EsSujetoObligado {
    return this._esSujetoObligado;
  }

  static fromLine(line: string): ClienteRecord {
    const parts = line.split('|').map((p) => p.trim());
    if (parts.length < 7) {
      throw new Error(`Line has fewer than 7 fields: ${line}`);
    }
    return new ClienteRecord(
      new Nombre(parts[0]),
      new Apellido(parts[1]),
      new DNI(parts[2]),
      new Estado(parts[3]),
      new FechaIngreso(parts[4]),
      new EsPEP(parts[5]),
      new EsSujetoObligado(parts[6])
    );
  }
}
