import * as moment from 'moment';
import {Messzeit} from "./old/Messzeit";

export class MeasurementTime {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    orderingTimeStamp: number;

    constructor(isoDateTime: string, old?: Messzeit) {
        if (old != null) {
            this.year = old.jahr;
            this.month = old.monat;
            this.day = old.tag;
            this.hour = old.stunde;
            this.minute = old.minute;
            this.orderingTimeStamp = old.zeitStempel;
        }
        else {
            let zeit = moment(isoDateTime);
            this.year = zeit.year();
            this.month = zeit.month() + 1;
            this.day = zeit.date();
            this.hour = zeit.hours();
            this.minute = zeit.minutes();
            this.orderingTimeStamp = zeit.utc(true).valueOf();
        }
    }

    public static toMoment(time: MeasurementTime): moment.Moment {
        let timeAsMoment = moment();
        timeAsMoment.year(time.year);
        timeAsMoment.month(time.month - 1);
        timeAsMoment.date(time.day);
        timeAsMoment.hours(time.hour);
        timeAsMoment.minutes(time.minute);
        return timeAsMoment;
    }
}
