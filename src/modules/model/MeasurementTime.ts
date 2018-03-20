import * as moment from 'moment';

export class MeasurementTime {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    orderingTimeStamp: number;

    constructor(isoDateTime: string) {
        let zeit = moment(isoDateTime);
        this.year = zeit.year();
        this.month = zeit.month() + 1;
        this.day = zeit.date();
        this.hour = zeit.hours();
        this.minute = zeit.minutes();
        this.orderingTimeStamp = zeit.utc(true).valueOf();
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
