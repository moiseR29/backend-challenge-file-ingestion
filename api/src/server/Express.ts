import express, {
  Application,
  json,
  Router,
  urlencoded,
  Request,
  Response,
  NextFunction,
} from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

export class ExpressServer {
  private _app: Application;

  constructor(routes: Array<Router>) {
    this._app = express();
    this.configServer();
    this.configRouters(routes);
  }

  private configServer(): ExpressServer {
    this._app.use(helmet());
    this._app.use(json());
    this._app.use(urlencoded({ extended: true }));
    this._app.use(morgan('tiny'));
    return this;
  }

  private configRouters(routes: Array<Router>) {
    this._app.use(routes);

    // TODO: then create some error class to handler this case
    this._app.use('/*splat', (req: Request, res: Response) =>
      res.status(400).send('Endpoint Not Found'),
    );
    this._app.use(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (err: any, req: Request, res: Response, next: NextFunction) => {
        return res.status(400).send({ message: err.message });
      },
    );
    return this;
  }

  get app(): Application {
    return this._app;
  }

  static createServer(routes: Array<Router>): Application {
    const server = new ExpressServer(routes);
    return server.app;
  }
}
