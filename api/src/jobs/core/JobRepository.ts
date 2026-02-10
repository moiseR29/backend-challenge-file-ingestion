import { Chunk } from './Chunk';
import { Job } from './Job';

export interface JobRepository {
  saveJob(job: Job): Promise<void>;
  saveChunks(chunks: Chunk[]): Promise<void>;
}

