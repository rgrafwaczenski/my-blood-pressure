import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {ListPage} from '../pages/list/list';
import {IonicStorageModule} from "@ionic/storage";
import {DataProvider} from '../providers/DataProvider';
import {InputPage} from "../pages/input/input";
import {SettingsPage} from "../pages/settings/settings";
import {File} from "@ionic-native/file";
import {Device} from "@ionic-native/device";


@NgModule({
    declarations: [
        MyApp,
        ListPage,
        InputPage,
        SettingsPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        ListPage,
        InputPage,
        SettingsPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        File,
        Device,
        DataProvider
    ]
})
export class AppModule {
}
