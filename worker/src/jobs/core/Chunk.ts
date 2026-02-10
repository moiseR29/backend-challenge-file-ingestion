import { ChunkId, JobId, FromLine, ToLine, ChunkStatus } from './params';

export class Chunk {
  private _id: ChunkId;
  private _jobId: JobId;
  private _fromLine: FromLine;
  private _toLine: ToLine;
  private _status: ChunkStatus;

  private constructor(
    id: ChunkId,
    jobId: JobId,
    fromLine: FromLine,
    toLine: ToLine,
    status: ChunkStatus
  ) {
    this._id = id;
    this._jobId = jobId;
    this._fromLine = fromLine;
    this._toLine = toLine;
    this._status = status;
  }

  static create(
    id: ChunkId,
    jobId: JobId,
    fromLine: FromLine,
    toLine: ToLine,
    status: ChunkStatus = ChunkStatus.pending()
  ): Chunk {
    return new Chunk(id, jobId, fromLine, toLine, status);
  }

  static createMany(
    jobId: JobId,
    totalLines: number,
    chunkSize: number
  ): Chunk[] {
    const chunks: Chunk[] = [];

    for (let from = 1; from <= totalLines; from += chunkSize) {
      const to = Math.min(from + chunkSize - 1, totalLines);
      const fromLine = new FromLine(from);
      const toLine = new ToLine(to, fromLine);
      const id = ChunkId.new();
      chunks.push(
        Chunk.create(id, jobId, fromLine, toLine, ChunkStatus.pending())
      );
    }

    return chunks;
  }

  get id(): ChunkId {
    return this._id;
  }

  get jobId(): JobId {
    return this._jobId;
  }

  get fromLine(): FromLine {
    return this._fromLine;
  }

  get toLine(): ToLine {
    return this._toLine;
  }

  get status(): ChunkStatus {
    return this._status;
  }
}
