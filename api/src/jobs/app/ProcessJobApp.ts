import { Job } from '../core/Job';
import { Chunk } from '../core/Chunk';
import { JobRepository, FileStorage, MessagePublisher } from '../core';

interface ProcessJobDeps {
  jobRepository: JobRepository;
  fileStorage: FileStorage;
  messagePublisher: MessagePublisher;
  countLines: (buffer: Buffer) => number;
}

export class ProcessJobApp {
  private jobRepository: JobRepository;
  private fileStorage: FileStorage;
  private messagePublisher: MessagePublisher;
  private deps: ProcessJobDeps;
  private static CHUNK_SIZE = 10000; // TODO: cambiar aca por cuanto procesar al mismo tiempo, depende mucho de lo que el pod pueda aguantar con el seguimiento de la infra. lo idea seria poder configurarlo sin entrar al codigo, por eso lo aclaro.

  constructor(deps: ProcessJobDeps) {
    this.deps = deps;
    this.jobRepository = deps.jobRepository;
    this.fileStorage = deps.fileStorage;
    this.messagePublisher = deps.messagePublisher;
  }

  async execute(fileBuffer: Buffer) {
    const job = Job.create();

    await this.fileStorage.upload(fileBuffer, job.filePath.value);

    const totalLines = this.deps.countLines(fileBuffer);
    if (totalLines === 0) {
      throw new Error('File is empty');
    }

    const chunks = Chunk.createMany(
      job.id,
      totalLines,
      ProcessJobApp.CHUNK_SIZE,
    );

    await this.jobRepository.saveJob(job);
    await this.jobRepository.saveChunks(chunks);

    for (const chunk of chunks) {
      await this.messagePublisher.sendMessage({
        chunkId: chunk.id.value,
        jobId: job.id.value,
        from_line: chunk.fromLine.value,
        to_line: chunk.toLine.value,
        path: job.filePath.value,
      });
    }

    return {
      jobId: job.id.value,
      totalLines,
      chunksCreated: chunks.length,
      chunkSize: ProcessJobApp.CHUNK_SIZE,
    };
  }
}
