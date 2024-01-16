import { Injectable, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';

@Injectable()
export class HelmetMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    helmet({
      contentSecurityPolicy: {
        directives: {
          scriptSrc: [`'self'`],
          frameAncestors: [`'none'`],
        },
      },
      xssFilter: false,
    })(req, res, next);
    res.setHeader('X-XSS-Protection', '1; mode=block');
  }
}
