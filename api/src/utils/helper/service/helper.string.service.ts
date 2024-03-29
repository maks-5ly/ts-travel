import { Injectable } from '@nestjs/common';

const slugify = async (text: string) =>
  // cspell:disable-next-line
  (await import('@sindresorhus/slugify')).default(text);

@Injectable()
export class HelperStringService {
  slugify(text: string) {
    return slugify(text);
  }
}
