import {Injectable} from '@angular/core';
import {DataItems} from "../modules/model/DataItems";
import {Storage} from '@ionic/storage';
import {PersonalSettings} from "../modules/model/PersonalSettings";
import {DataItem} from "../modules/model/DataItem";
import {MeasurementTime} from "../modules/model/MeasurementTime";

@Injectable()
export class DataProvider {
    private maxId: number;
    public mostRecentTime: MeasurementTime;
    public person: PersonalSettings;
    public dataItems: DataItems;

    constructor(private storage: Storage) {
        // Load data from storage waterfall-style:
        storage.get("maxId").then(
            (value) => {
                this.maxId = value;
                if (this.maxId == null)
                    this.maxId = 1;
                storage.get("person").then(
                    (value) => {
                        this.person = value;
                        if (this.person == null)
                            this.person = new PersonalSettings();
                        storage.get("dataItems").then(
                            (dataFromStorage) => {
                                this.dataItems = dataFromStorage;
                                if (this.dataItems == null)
                                    this.dataItems = new DataItems();
                            }
                        );
                    }
                );
            }
        );
    }

    public newItem(item: DataItem) {
        item.id = this.maxId++;
        this.insertSorted(item);
        this.store();
    }

    private getByTimestamp(stamp: number) {
        for (let index = 0; index < this.dataItems.length; index++) {
            if (stamp == this.dataItems[index].time.orderingTimeStamp)
                return this.dataItems[index];
        }
        return null;
    }
    public editItem(newVersionOfItem: DataItem) {
        this.deleteById(newVersionOfItem.id);
        this.insertSorted(newVersionOfItem);
        this.store();
    }

    private insertSorted(dataItem: DataItem) {
        let itemInserted = false;
        for (let index = 0; index < this.dataItems.length; index++) {
            if (dataItem.time.orderingTimeStamp < this.dataItems[index].time.orderingTimeStamp) {
                this.dataItems.splice(index, 0, dataItem);
                itemInserted = true;
                break;
            }
        }
        if (!itemInserted)
            this.dataItems.push(dataItem);
        this.mostRecentTime = dataItem.time;
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
