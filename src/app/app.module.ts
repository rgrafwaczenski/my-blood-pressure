import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {ListPage} from '../pages/list/list';
import {IonicStorageModule} from "@ionic/storage";
import {DataProvider} from '../providers/DatenProvider';
import {InputPage} from "../pages/input/input";


@NgModule({
    declarations: [
        MyApp,
        ListPage,
        InputPage
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
        InputPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        DataProvider
    ]
})
export class AppModule {
}
