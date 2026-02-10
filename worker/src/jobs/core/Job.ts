import { FilePath, JobId } from './params';

export class Job {
  private _id: JobId;
  private _filePath: FilePath;

  constructor(id: JobId, filePath: FilePath) {
    this._id = id;
    this._filePath = filePath;
  }

  get id(): JobId {
    return this._id;
  }

  get filePath(): FilePath {
    return this._filePath;
  }
}
