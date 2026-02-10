import { Chunk } from '../core/Chunk';
import { Job } from '../core/Job';
import { JobRepository } from '../core/JobRepository';
import { SqlServer } from '../../services/db';

export class SqlServerRepository implements JobRepository {
  private sqlServer: SqlServer;

  constructor() {
    this.sqlServer = new SqlServer();
  }

  async saveJob(job: Job): Promise<void> {
    const pool = await this.sqlServer.connect();
    await pool
      .request()
      .input('job_id', job.id.value)
      .input('file_path', job.filePath.value)
      .query(`INSERT INTO jobs(job_id, file_path) VALUES(@job_id,@file_path)`);

    await this.sqlServer.disconnect();
  }
  async saveChunks(chunks: Chunk[]): Promise<void> {
    const pool = await this.sqlServer.connect();
    for (const chunk of chunks) {
      await pool
        .request()
        .input('chunk_id', chunk.id.value)
        .input('job_id', chunk.jobId.value)
        .input('from_line', chunk.fromLine.value)
        .input('to_line', chunk.toLine.value)
        .input('status', chunk.status.value)
        .query(
          `INSERT INTO job_chunks(chunk_id, job_id, from_line, to_line, status)
           VALUES(@chunk_id,@job_id,@from_line,@to_line,@status)`,
        );
    }

    await this.sqlServer.disconnect();
  }
}
