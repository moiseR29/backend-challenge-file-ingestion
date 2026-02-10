import moment from 'moment-timezone';
import { ValidatorProperty } from './ValidatorProperty';

export class DateProperty extends ValidatorProperty<moment.Moment> {
  static now(): DateProperty {
    return new DateProperty(moment().utc());
  }

  static newToUTC(dateTime: string | Date): DateProperty {
    return new DateProperty(moment(dateTime).utc());
  }

  static newFromUTC(dateTime: string | Date): DateProperty {
    return new DateProperty(moment.utc(dateTime));
  }

  changeTimeZone(timeZone: string) {
    this._value = this.value.tz(timeZone);
  }
}
