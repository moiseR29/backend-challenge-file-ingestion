import { StringProperty } from '@shared/value-objects';
import { v4 } from 'uuid';

export class JobId extends StringProperty {
  static new(): JobId {
    return new JobId(v4());
  }
}
