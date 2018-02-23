import {Messwert} from "./old/Messwert";

export class Measurement {
    public systole: number;
    public diastole: number;
    public pulse: number;

    constructor(old?: Messwert) {
        if (old != null) {
            this.systole = old.systole;
            this.diastole = old.diastole;
            this.pulse = old.puls;
        }
    }
}
