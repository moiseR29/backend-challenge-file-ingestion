import { ValidatorProperty } from './ValidatorProperty';

interface Additionals {
  [key: string]: any;
}

export class ObjectProperty<
  T extends Additionals,
> extends ValidatorProperty<T> {}
