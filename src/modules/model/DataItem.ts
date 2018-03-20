import {MeasurementTime} from "./MeasurementTime";
import {Measurement} from "./Measurement";
import * as moment from 'moment';

export class DataItem {
    public id: number;
    public changeTimestamp?: number;
    public comment?: string;

    constructor(public time: MeasurementTime, public value: Measurement) {
        this.changeTimestamp = moment().utc(true).valueOf()
    }
}
