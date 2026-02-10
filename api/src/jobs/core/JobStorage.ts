export interface FileStorage {
  upload(buffer: Buffer, key: string): Promise<void>;
}
