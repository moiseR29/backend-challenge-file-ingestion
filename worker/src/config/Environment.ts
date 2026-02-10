import Config from 'config';

interface SqlServerCredentials {
  user: string;
  password: string;
  server: string;
  database: string;
}

interface Aws {
  credentials: {
    region: string;
    accessKey: string;
    secretKey: string;
  };
  bucket: string;
  sqsQueueUrl: string;
  sqsEndpoint?: string;
}

class Environment {
  port(): number {
    const value = Number(Config.get('port'));
    return value;
  }

  sqlServer(): SqlServerCredentials {
    const value = Config.get('sqlServer') as SqlServerCredentials;
    return value;
  }

  aws(): Aws {
    const value = Config.get('aws') as Aws;
    return value;
  }
}

const i: Environment = new Environment();
export { i as Environment };
