import { SqlServer } from '../../services/db';
import { Chunk, Job, JobRepository } from '../core';
import {
  ChunkId,
  JobId,
  FromLine,
  ToLine,
  ChunkStatus,
  FilePath,
} from '../core/params';

interface ChunkRaw {
  chunk_id: string;
  job_id: string;
  from_line: number;
  to_line: number;
  status: string;
}

interface JobRaw {
  job_id: string;
  file_path: string;
}

export class SqlServerJobRepository implements JobRepository {
  private sqlServer: SqlServer;

  constructor() {
    this.sqlServer = new SqlServer();
  }

  async getChunkById(chunkId: string): Promise<Chunk> {
    const pool = await this.sqlServer.connect();

    const result = await pool
      .request()
      .input('chunk_id', chunkId)
      .query<ChunkRaw>(
        `SELECT chunk_id, job_id, from_line, to_line, status FROM job_chunks WHERE chunk_id = @chunk_id`
      );
    await this.sqlServer.disconnect();
    const rr = result.recordset[0] ?? null;
    if (!rr) throw new Error('');

    return Chunk.create(
      new ChunkId(rr.chunk_id),
      new JobId(rr.job_id),
      new FromLine(rr.from_line),
      new ToLine(rr.to_line),
      new ChunkStatus(rr.status)
    );
  }

  async getJobId(jobId: string): Promise<Job> {
    const pool = await this.sqlServer.connect();

    const result = await pool
      .request()
      .input('job_id', jobId)
      .query<JobRaw>(
        `SELECT job_id, file_path FROM jobs WHERE job_id = @job_id`
      );
    await this.sqlServer.disconnect();
    const rr = result.recordset[0] ?? null;
    if (!rr) throw new Error('');

    const id = new JobId(rr.job_id);
    const filePath = new FilePath(rr.file_path);

    return new Job(id, filePath);
  }

  async updateDoneChunk(chunkId: string): Promise<void> {
    const pool = await this.sqlServer.connect();
    await pool
      .request()
      .input('chunk_id', chunkId)
      .input('status', 'DONE')
      .query(
        `UPDATE job_chunks SET status = @status WHERE chunk_id = @chunk_id`
      );

    await this.sqlServer.disconnect();
  }
}
