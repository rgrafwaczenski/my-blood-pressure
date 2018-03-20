import {Component} from '@angular/core';
import {IonicPage, ViewController} from 'ionic-angular';
import {DataProvider} from "../../providers/DataProvider";

@IonicPage()
@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html',
})
export class SettingsPage {

    constructor(public dataProvider: DataProvider, private viewCtrl: ViewController) {
    }


    dismiss() {
        this.viewCtrl.dismiss();
    }
}
