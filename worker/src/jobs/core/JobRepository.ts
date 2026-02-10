import { Chunk } from './Chunk';
import { Job } from './Job';

export interface JobRepository {
  getChunkById(chunkId: string): Promise<Chunk>;
  getJobId(jobId: string): Promise<Job>;
  updateDoneChunk(chunkId: string): Promise<void>;
}
