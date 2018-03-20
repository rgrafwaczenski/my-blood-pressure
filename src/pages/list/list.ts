import {AlertController, ModalController, NavController} from 'ionic-angular';
import {Component, Input} from '@angular/core';
import {DataProvider} from "../../providers/DataProvider";
import {MeasurementTime} from "../../modules/model/MeasurementTime";
import {Measurement} from "../../modules/model/Measurement";
import {DataItem} from "../../modules/model/DataItem";
import * as moment from 'moment';
import {InputPage} from "../input/input";
import {SettingsPage} from "../settings/settings";
import {DisplayRow} from "../../modules/model/DisplayRow";

declare var cordova: any;    //global;

@Component({
    selector: 'page-list',
    templateUrl: 'list.html'
})
export class ListPage {
    @Input() zeit: string;
    @Input() systole: number;
    @Input() diastole: number;
    @Input() puls: number;
    private selectedItem: DataItem;
    private maxDisplayIndex: number;
    private pageSize: number = 20;

    constructor(public navCtrl: NavController, private daten: DataProvider, public modalCtrl: ModalController, public alertCtrl: AlertController) {
        this.maxDisplayIndex = this.pageSize;
    }

    ionViewWillEnter() {
        this.zeit = moment().format();
    }

    public save(): void {
        let messzeit = new MeasurementTime(this.zeit);
        let messwert: Measurement = {systole: this.systole, diastole: this.diastole, pulse: this.puls};
        this.daten.newItem(new DataItem(messzeit, messwert));
        this.zeit = moment().format();
        this.systole = null;
        this.diastole = null;
        this.puls = null;
    }

    public getDataItems(): Array<DisplayRow> {
        let shownItems = [];
        if (this.daten.dataItems != null) {
            let effectiveDisplayIndex = Math.min(this.daten.dataItems.length, this.maxDisplayIndex);
            let previousItem: DataItem = null;
            for (let pos = 0; pos < effectiveDisplayIndex; pos++) {
                let dataItem: DataItem = this.daten.dataItems[pos];
                if (previousItem == null || previousItem.time.year != dataItem.time.year || previousItem.time.month != dataItem.time.month) {
                    let month: string = dataItem.time.month < 10 ? '0' + dataItem.time.month : '' + dataItem.time.month;
                    shownItems.push({monthDescription: month + " / " + dataItem.time.year});
                }
                shownItems.push({dataItem: dataItem});
                previousItem = dataItem;
            }
        }
        return shownItems;
    }

    public buttonEnabled(): boolean {
        return this.zeit != null && this.systole != null && this.diastole != null && this.puls != null;
    }

    public isAnyItemSelected(): boolean {
        return this.selectedItem != null;
    }

    public selectItem(dataItem: DataItem): void {
        this.selectedItem = dataItem;
    }

    private isSelected(dataItem: DataItem): boolean {
        return dataItem != null && this.selectedItem != null && this.selectedItem.id == dataItem.id;
    }

    public getRowClass(dataItem: DataItem): string {
        return this.isSelected(dataItem) ? "selektiert" : "normal";
    }

    public formatTime(dataItem: DataItem): string {
        return dataItem == null ? "" : MeasurementTime.toMoment(dataItem.time).format("DD.MM HH:mm");
    }

    public getSystoleClass(dataItem: DataItem): string {
        if (dataItem == null)
            return "";
        if (dataItem.value.systole >= this.daten.person.systoleDanger)
            return "ill";
        else if (dataItem.value.systole > this.daten.person.systoleWarning)
            return "warning";
        else
            return "healthy";

    }

    public getDiastoleClass(dataItem: DataItem): string {
        if (dataItem == null)
            return "";
        if (dataItem.value.diastole >= this.daten.person.diastoleDanger)
            return "ill";
        else if (dataItem.value.diastole > this.daten.person.diastoleWarning)
            return "warning";
        else
            return "healthy";
    }

    public showInput(clearSelected?: boolean): void {
        if (clearSelected)
            this.selectedItem = null;
        let modal = this.modalCtrl.create(InputPage, {selectedItem: this.selectedItem});
        modal.present();
    }


    public showSettings(): void {
        let modal = this.modalCtrl.create(SettingsPage);
        modal.present();
    }

    public createPDF(): void {
        let options = {
            documentsize: 'a4',
            landscape: 'portrait',
            type: 'share'
        };
        let html = '<html><body>' + document.getElementById("dataItems").innerHTML + '</body></html>';
        cordova.plugins.pdf.fromData(html, options)
            .then(() => 'ok');
    }

    public doInfinite(infiniteScroll) {
        setTimeout(() => {
            this.maxDisplayIndex += this.pageSize;
            this.maxDisplayIndex = Math.min(this.maxDisplayIndex, this.daten.dataItems.length);
            infiniteScroll.complete();
        }, 100);
    }

    public deleteSelectedItem(): void {
        //TODO: i18n!
        let alert = this.alertCtrl.create({
            title: 'Wert Löschen',
            message: 'Wirklich löschen?',
            buttons: [
                {
                    text: 'Nein Danke',
                    role: 'cancel',
                    handler: () => {
                        alert.dismiss();
                        return false;
                    }
                },
                {
                    text: 'Ja!',
                    handler: () => {
                        this.daten.deleteById(this.selectedItem.id);
                        this.daten.store();
                        this.selectedItem = null;
                        alert.dismiss();
                        return false;
                    }
                }
            ]
        });
        alert.present();
    }
}
