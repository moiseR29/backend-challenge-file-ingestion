import 'module-alias/register';
import { ExpressServer } from './server/Express';
import { HealthRouter } from './routes/HealthRoute';
import { IngestRouter } from './routes/IngestRoute';
import { Environment } from './config';

const PORT = Environment.port();

const routes = [HealthRouter, IngestRouter];
const app = ExpressServer.createServer(routes);

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
