import { ClienteRecord } from '../core/ClienteRecord';
import { ClienteRepository } from '../core/ClienteRepository';

export interface InsertarClienteAppDeps {
  clienteRepository: ClienteRepository;
}

export class InsertarClienteApp {
  constructor(private deps: InsertarClienteAppDeps) {}

  async executeBatch(records: ClienteRecord[]): Promise<void> {
    if (records.length === 0) return;
    await this.deps.clienteRepository.insertMany(records);
  }
}
