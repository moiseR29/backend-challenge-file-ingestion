import { Router, Request, Response } from 'express';
import multer from 'multer';
import { countLines } from '../services/fileUtils';
import { ProcessJobApp } from '../jobs/app/ProcessJobApp';
import { S3FileStorage } from '../jobs/infra/S3FileStorage';
import { SqsMessagePublisher } from '../jobs/infra/SqsMessagePublisher';
import { SqlServerRepository } from '../jobs/infra/SqlServerRepository';

const router = Router();
const upload = multer();

const ingestJobApp = new ProcessJobApp({
  jobRepository: new SqlServerRepository(),
  fileStorage: new S3FileStorage(),
  messagePublisher: new SqsMessagePublisher(),
  countLines,
});

router.post(
  '/process',
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const result = await ingestJobApp.execute(file.buffer);

      res.json(result);
    } catch (error: any) {
      console.error('Error in process route:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  },
);

export const IngestRouter = router;
