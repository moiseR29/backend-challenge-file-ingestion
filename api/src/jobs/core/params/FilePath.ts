import { StringProperty } from '@shared/value-objects';

export class FilePath extends StringProperty {
  private static bucketPath = 'uploads';

  constructor(id: string) {
    super(`${FilePath.bucketPath}/${id}.csv`);
  }
}
