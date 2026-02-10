import { ClienteRecord } from '../../clientes/core/ClienteRecord';
import { JobRepository, MessageData, FileStorage } from '../core';
import { InsertarClienteApp } from '../../clientes/app/InsertarClienteApp';
import { ClienteRepository } from '../../clientes/core/ClienteRepository';

export interface processJobDeps {
  jobRepository: JobRepository;
  fileStorage: FileStorage;
  clienteRepository: ClienteRepository;
}

export interface processJobResult {
  processed: number;
  skipped: number;
}

export class processJob {
  private jobRepository: JobRepository;
  private fileStorage: FileStorage;
  private insertarClientesApp: InsertarClienteApp;
  private BATCH_SIZE = 100;

  constructor(deps: processJobDeps) {
    this.jobRepository = deps.jobRepository;
    this.fileStorage = deps.fileStorage;

    this.insertarClientesApp = new InsertarClienteApp(deps);
  }

  async execute(message: MessageData): Promise<processJobResult> {
    try {
      const chunk = await this.jobRepository.getChunkById(message.chunkId);
      if (!chunk) throw new Error(`Chunk not found: ${message.chunkId}`);
      if (chunk.status.isDone())
        throw new Error(`Chunk already processed: ${message.chunkId}`);

      // TODO: es necesario esto ? para este entonces el job existe, si no el chunk seria un huerfano, seria responsabilidad db ?
      // const job = await this.deps.getJobById(chunk.jobId.value);
      // if (!job) throw new Error(`Job not found: ${chunk.jobId.value}`);

      const buffer = await this.fileStorage.getContent(message.path);
      const content = buffer.toString('utf-8');
      const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);

      const fromLine = chunk.fromLine.value;
      const toLine = chunk.toLine.value;

      let processed = 0;
      let skipped = 0;

      let batch: Array<ClienteRecord> = [];

      const flush = async (): Promise<void> => {
        if (batch.length > 0) {
          await this.insertarClientesApp.executeBatch(batch);
          batch = [];
        }
      };

      // TODO: podria ser un promise.all, en este caso no opte ya que podria saturar la db.
      for (let i = fromLine - 1; i < toLine && i < lines.length; i++) {
        try {
          const record = ClienteRecord.fromLine(lines[i]);
          batch.push(record);
          processed++;
          if (batch.length >= this.BATCH_SIZE) {
            await flush();
          }
        } catch {
          skipped++;
        }
      }

      await flush();
      await this.jobRepository.updateDoneChunk(message.chunkId);

      return {
        processed,
        skipped,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
