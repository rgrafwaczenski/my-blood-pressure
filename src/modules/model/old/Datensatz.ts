import {Messzeit} from "./Messzeit";
import {Messwert} from "./Messwert";

export interface Datensatz {
    id: number;
    zeit: Messzeit;
    wert: Messwert
}
