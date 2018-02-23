import {Injectable} from '@angular/core';
import {DataItems} from "../modules/model/DataItems";
import {Storage} from '@ionic/storage';
import {PersonalSettings} from "../modules/model/PersonalSettings";
import {DataItem} from "../modules/model/DataItem";
import {MeasurementTime} from "../modules/model/MeasurementTime";
import {Datensaetze} from "../modules/model/old/Daten";

@Injectable()
export class DataProvider {
    private maxId: number;
    public mostRecentTime: MeasurementTime;
    public person: PersonalSettings;
    public dataItems: DataItems;
    public messwerte: Datensaetze;


    constructor(private storage: Storage) {
        storage.get("maxId").then(
            (value) => {
                this.maxId = value;
                if (this.maxId == null)
                    this.maxId = 1;
            }
        );
        this.person = new PersonalSettings();
        // Code below currently not needed (personal settings can not be edited yet)
        // storage.get("person").then(
        //   (value) => {
        //     this.person = value;
        //     if (this.person == null)
        //       this.person = new PersonalSettings();
        //   }
        // );
        storage.get("dataItems").then(
            (value) => {
                this.dataItems = value;
                if (this.dataItems == null) {
                    storage.get("messwerte").then(
                        (value) => {
                            // Data conversion fallback: Pre-alpha version of data stored with german property names
                            this.dataItems = new DataItems(value);
                        });
                }
            }
        );
    }

    public newItem(item: DataItem) {
        item.id = this.maxId++;
        this.insertSorted(item);
        this.store();
    }


    public editItem(newVersionOfItem: DataItem) {
        this.deleteById(newVersionOfItem.id);
        this.insertSorted(newVersionOfItem);
        this.store();
    }

    private insertSorted(messwert: DataItem) {
        let drin = false;
        for (let index = 0; index < this.dataItems.length; index++) {
            if (messwert.time.orderingTimeStamp < this.dataItems[index].time.orderingTimeStamp) {
                this.dataItems.splice(index, 0, messwert);
                drin = true;
                break;
            }
        }
        if (!drin)
            this.dataItems.push(messwert);
        this.mostRecentTime = messwert.time;
    }

    public deleteById(id: number) {
        for (let index = 0; index < this.dataItems.length; index++) {
            if (id == this.dataItems[index].id) {
                this.dataItems.splice(index, 1);
                break;
            }
        }
    }

    public store() {
        this.storage.set("person", this.person);
        this.storage.set("dataItems", this.dataItems);
        this.storage.set("maxId", this.maxId);
    }
}
