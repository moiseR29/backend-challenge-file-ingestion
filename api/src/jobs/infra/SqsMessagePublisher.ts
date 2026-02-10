import { MessagePublisher, MessageData } from '../core/JobPublisher';
import { Aws } from '../../services/aws';

export class SqsMessagePublisher implements MessagePublisher {
  async sendMessage({
    chunkId,
    from_line,
    jobId,
    to_line,
    path,
  }: MessageData): Promise<void> {
    const aws = new Aws();
    await aws.sqs().sendMessage({
      messageBody: JSON.stringify({ chunkId, jobId, from_line, to_line, path }),
    });
  }
}
