import sql from 'mssql';
import { Environment } from '../config';

interface SqlServerCredentials {
  user: string;
  password: string;
  server: string;
  database: string;
}

const config: sql.config = {
  ...Environment.sqlServer(),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export class SqlServer {
  private _pool: sql.ConnectionPool;

  constructor() {
    this._pool = new sql.ConnectionPool(config);
  }

  async connect(): Promise<sql.ConnectionPool> {
    try {
      if (!this._pool.connected) {
        await this._pool.connect();
      }
    } catch (error) {
      console.error(error.message);
    }

    return this._pool;
  }

  async disconnect(): Promise<void> {
    await this._pool.close();
  }
}
