import { ClienteRecord } from './ClienteRecord';

export interface ClienteRepository {
  insertMany(records: ClienteRecord[]): Promise<void>;
}
