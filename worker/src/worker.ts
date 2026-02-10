import 'module-alias/register';
import { handleProcessChunk } from './routes/ProcessChunkRoute';
import { Aws } from './services/aws';

async function main(): Promise<void> {
  console.log('Worker started. Polling SQS...');

  const sqs = new Aws().sqs();

  while (true) {
    console.log('Polling SQS...');
    const msg = await sqs.receiveMessage();
    if (!msg) continue;

    try {
      const result = await handleProcessChunk(msg.body);

      await sqs.deleteMessage(msg.receiptHandle);
      console.log(
        `Chunk processed (message ${msg.messageId}): ${result.processed} inserted, ${result.skipped} skipped`,
      );
    } catch (err) {
      console.error(`Worker error processing message ${msg.messageId}:`, err);

      const attempts = msg.receiveCount ?? 1;
      if (attempts >= 3) {
        console.error(
          `Max retries reached for message ${msg.messageId} (attempt ${attempts}), deleting from queue`,
        );
        await sqs.deleteMessage(msg.receiptHandle);
      } else {
        console.log(
          `Will retry message ${msg.messageId}, attempt ${attempts} of 3 (message will return to queue after visibility timeout)`,
        );
        // TODO: no se deberia borrar, pero como es local y muestra, en este caso deberia ir a la dlq o alguna db para gestionar los casos de error
        // TODO: aca salta si hay un error de infra o mas grande que la logica de negocio.
        await sqs.deleteMessage(msg.receiptHandle);
      }
    }
  }
}

main();
