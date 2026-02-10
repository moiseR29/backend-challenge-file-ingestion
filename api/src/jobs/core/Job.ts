import { FilePath, JobId } from './params';

export class Job {
  private _id: JobId;
  private _filePath: FilePath;

  private constructor(id: JobId, filePath: FilePath) {
    this._id = id;
    this._filePath = filePath;
  }

  static create(): Job {
    const id = JobId.new();
    const filePath = new FilePath(id.value);

    return new Job(id, filePath);
  }

  get id(): JobId {
    return this._id;
  }

  get filePath(): FilePath {
    return this._filePath;
  }
}
