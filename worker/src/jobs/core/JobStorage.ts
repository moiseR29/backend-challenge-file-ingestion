export interface FileStorage {
  getContent(key: string): Promise<Buffer>;
}
