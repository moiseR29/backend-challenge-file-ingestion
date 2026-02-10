import { processJob } from '../jobs/app/ProcessJob';
import { S3JobStorage } from '../jobs/infra/S3JobStorage';
import { SqlServerJobRepository } from '../jobs/infra/SqlServerJobRepository';
import { ClienteSqlRepository } from '../clientes/infra/ClienteSqlRepository';

export interface ProcessChunkMessageBody {
  chunkId: string;
  jobId?: string;
  from_line?: number;
  to_line?: number;
  path: string;
}

export async function handleProcessChunk(
  body: any,
): Promise<{ processed: number; skipped: number }> {
  try {
    const parsed = JSON.parse(body) as ProcessChunkMessageBody;

    const chunkId = parsed.chunkId;
    if (!chunkId) {
      throw new Error('Message without chunkId');
    }
    const job = new processJob({
      clienteRepository: new ClienteSqlRepository(),
      fileStorage: new S3JobStorage(),
      jobRepository: new SqlServerJobRepository(),
    });

    const result = await job.execute({
      chunkId: parsed.chunkId,
      from_line: parsed.from_line!,
      jobId: parsed.jobId!,
      to_line: parsed.to_line!,
      path: parsed.path,
    });

    // TODO: que hay con los skipped ?
    // TODO: aca donde se deberia manejar el error de negocio.
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}
