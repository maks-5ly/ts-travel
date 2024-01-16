import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import cors, { CorsOptions } from 'cors';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const isProduction = this.configService.get<boolean>('app.isProduction');

    const allowOriginProduction = this.configService.get<string[]>(
      'middleware.cors.allowOriginProduction',
    );

    const allowMethod = this.configService.get<string[]>(
      'middleware.cors.allowMethod',
    );
    const allowHeader = this.configService.get<string[]>(
      'middleware.cors.allowHeader',
    );

    const corsOptions: CorsOptions = {
      origin: (origin, callback) => {
        if (isProduction) {
          callback(null, allowOriginProduction);
        } else {
          callback(null, true);
        }
      },
      methods: allowMethod,
      allowedHeaders: allowHeader,
      preflightContinue: false,
      credentials: true,
      optionsSuccessStatus: HttpStatus.NO_CONTENT,
    };

    cors(corsOptions)(req, res, next);
  }
}
