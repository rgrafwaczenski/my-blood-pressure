import {DataItem} from "./DataItem";
import {Datensaetze} from "./old/Daten";

export class DataItems extends Array<DataItem> {
    constructor(old?: Datensaetze) {
        super();
        if (old != null) {
            for (let i = 0; i < old.length; i++)
                this.push(new DataItem(null, null, old[i]));
        }
    }
}