import {Component, Input} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {DataProvider} from "../../providers/DataProvider";
import {MeasurementTime} from "../../modules/model/MeasurementTime";
import {Measurement} from "../../modules/model/Measurement";
import {DataItem} from "../../modules/model/DataItem";
import * as moment from 'moment';


@Component({
    selector: 'page-input',
    templateUrl: 'input.html'
})
export class InputPage {
    @Input() comment: string;
    @Input() time: string;
    @Input() systole: number;
    @Input() diastole: number;
    @Input() pulse: number;
    private id: number;

    constructor(public navCtrl: NavController, private dataProvider: DataProvider, private viewCtrl: ViewController, private navParams: NavParams) {
        let selectedItem: DataItem = this.navParams.get("selectedItem");
        if (selectedItem != null) {
            this.comment = selectedItem.comment;
            this.time = moment(selectedItem.time.orderingTimeStamp).toISOString(true);
            this.systole = selectedItem.value.systole;
            this.diastole = selectedItem.value.diastole;
            this.pulse = selectedItem.value.pulse;
            this.id = selectedItem.id;
        }
        else
            this.time = moment().format();
    }

    public save(): void {
        let time = new MeasurementTime(this.time);
        let measurement: Measurement = {systole: this.systole, diastole: this.diastole, pulse: this.pulse};
        let newItem = new DataItem(time, measurement);
        newItem.comment = this.comment;
        if (this.id != null) {
            newItem.id = this.id;
            this.dataProvider.editItem(newItem);
        }
        else {
            this.dataProvider.newItem(newItem);
            if (this.dataProvider.mostRecentTime != null)
                this.time = MeasurementTime.toMoment(this.dataProvider.mostRecentTime).add(1, 'days').format();
            else
                this.time = moment().format();
            this.systole = null;
            this.diastole = null;
            this.pulse = null;
        }
        this.dismiss();
    }

    public buttonEnabled(): boolean {
        return this.time != null && this.systole != null && this.diastole != null && this.pulse != null;
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
