import { ClienteRecord } from '../core/ClienteRecord';
import { ClienteRepository } from '../core/ClienteRepository';
import { SqlServer } from '../../services/db';

const BATCH_SIZE = 100;

export class ClienteSqlRepository implements ClienteRepository {
  private sqlServer: SqlServer;

  constructor() {
    this.sqlServer = new SqlServer();
  }

  async insertMany(records: ClienteRecord[]): Promise<void> {
    const pool = await this.sqlServer.connect();

    if (records.length === 0) return;
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);
      const request = pool.request();
      const values: string[] = [];
      batch.forEach((r, j) => {
        const k = i + j;
        request
          .input(`NombreCompleto_${k}`, r.nombreCompleto)
          .input(`DNI_${k}`, r.dni.value)
          .input(`Estado_${k}`, r.estado.value)
          .input(`FechaIngreso_${k}`, r.fechaIngreso.toISOString())
          .input(`EsPEP_${k}`, r.esPep.value)
          .input(`EsSujetoObligado_${k}`, r.esSujetoObligado.value);
        values.push(
          `(@NombreCompleto_${k}, @DNI_${k}, @Estado_${k}, @FechaIngreso_${k}, @EsPEP_${k}, @EsSujetoObligado_${k}, GETDATE())`
        );
      });
      await request.query(
        `INSERT INTO clientes (NombreCompleto, DNI, Estado, FechaIngreso, EsPEP, EsSujetoObligado, FechaCreacion) VALUES ${values.join(
          ', '
        )}`
      );
    }

    await this.sqlServer.disconnect();
  }
}
