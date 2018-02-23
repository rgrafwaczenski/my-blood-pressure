import {MeasurementTime} from "./MeasurementTime";
import {Measurement} from "./Measurement";
import {Datensatz} from "./old/Datensatz";

export class DataItem {
    public id: number;

    constructor(public time: MeasurementTime, public value: Measurement, private old?: Datensatz) {
        if (old != null) {
            this.time = new MeasurementTime(null, old.zeit);
            this.value = new Measurement(old.wert);
        }
    }

    toJSON(): string {
        return JSON.stringify(this);
    }
}
