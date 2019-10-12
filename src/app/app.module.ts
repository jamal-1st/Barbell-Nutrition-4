import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from 'src/Services/user.service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReOrderModalPageModule } from '../app/re-order-modal/re-order-modal.module';
import { PhoneUpdatePageModule } from '../app/phone-update/phone-update.module'


////////////------------- Plugin imports----------/////////////

import { HTTP } from '@ionic-native/http/ngx';
import { AgmCoreModule } from '@agm/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Market } from '@ionic-native/market/ngx';
import { Network } from '@ionic-native/network/ngx';
import { NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';


/////////---------- FireBase import ---------------/////////////////

import { AngularFireModule } from '@angular/fire';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { environment } from '../environments/environment';
import { FCM } from '@ionic-native/fcm/ngx';

//import { Firebase } from '@ionic-native/firebase/ngx';
// import { AngularFireModule } from 'angularfire2';
// import { AngularFirestoreModule } from 'angularfire2/firestore';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [
  ],

  imports: [
    BrowserModule,
    FormsModule, ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReOrderModalPageModule,
    PhoneUpdatePageModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDYeh2o2-AXsF5sSgCk1mtq_tIb3UAHdI4'
      /* apiKey is required, unless you are a 
      premium customer, in which case you can 
      use clientId 
      */
    }),


  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    HTTP,
    Market,
    //Firebase,
    NativePageTransitions,
    Network,
    FCM,
    ScreenOrientation,
    UniqueDeviceID,
    UserService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
