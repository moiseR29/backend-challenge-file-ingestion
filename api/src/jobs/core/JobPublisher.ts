export interface MessageData {
  chunkId: string;
  jobId: string;
  from_line: number;
  to_line: number;
  path: string;
}

export interface MessagePublisher {
  sendMessage(message: MessageData): Promise<void>;
}
