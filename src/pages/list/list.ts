import {AlertController, ModalController, NavController} from 'ionic-angular';
import {Component, Input} from '@angular/core';
import {DataProvider} from "../../providers/DatenProvider";
import {MeasurementTime} from "../../modules/model/MeasurementTime";
import {Measurement} from "../../modules/model/Measurement";
import {DataItem} from "../../modules/model/DataItem";
import {DataItems} from "../../modules/model/DataItems";
import * as moment from 'moment';
import {InputPage} from "../input/input";


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

    constructor(public navCtrl: NavController, private daten: DataProvider, public modalCtrl: ModalController, public alertCtrl: AlertController) {
    }

    ionViewWillEnter() {
        this.zeit = moment().format();
    }

    public speichern(): void {
        let messzeit = new MeasurementTime(this.zeit);
        let messwert: Measurement = {systole: this.systole, diastole: this.diastole, pulse: this.puls};
        this.daten.newItem(new DataItem(messzeit, messwert));
        this.zeit = moment().format();
        this.systole = null;
        this.diastole = null;
        this.puls = null;
    }

    public getDataItems(): DataItems {
        return this.daten.dataItems;
    }

    public buttonEnabled(): boolean {
        return this.zeit != null && this.systole != null && this.diastole != null && this.puls != null;
    }

    public isAnyItemSelected(): boolean {
        return this.selectedItem != null;
    }

    public selectItem(wert: DataItem): void {
        this.selectedItem = wert;
    }

    private isSelected(wert: DataItem): boolean {
        return this.selectedItem != null && this.selectedItem.id == wert.id;
    }

    public getRowClass(wert: DataItem): string {
        return this.isSelected(wert) ? "selektiert" : "normal";
    }

    public formatTime(wert: DataItem): string {
        return MeasurementTime.toMoment(wert.time).format("DD.MM.YYYY HH:mm");
    }

    public getSystoleClass(wert: DataItem): string {
        if (wert.value.systole >= this.daten.person.systoleDanger)
            return "ill";
        else if (wert.value.systole > this.daten.person.systoleWarning)
            return "warning";
        else
            return "healthy";

    }

    public getDiastoleClass(wert: DataItem): string {
        if (wert.value.diastole >= this.daten.person.diastoleDanger)
            return "ill";
        else if (wert.value.diastole > this.daten.person.diastoleWarning)
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
