import { Component } from '@angular/core';
import { MenuController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DataService } from 'src/Services/data.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { timer } from 'rxjs';
import { Market } from '@ionic-native/market/ngx';
//import { UserService } from 'src/Services/user.service';
import { FCM } from '@ionic-native/fcm/ngx';
import { Network } from '@ionic-native/network/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {

  showSplash = true;
  public appPages = [
    {
      title: 'MENU',
      url: '/menu',
      icon: 'pizza'
    },
    {
      title: 'MY BASKET',
      url: '/cart',
      icon: 'cart'
    },
    {
      title: 'ABOUT US',
      url: '/aboutus',
      icon: 'pin'
    },
    {
      title: 'MY ORDERS',
      url: '/order-history',
      icon: 'paper'
    },
    {
      title: 'MY ACCOUNT',
      url: '/account',
      icon: 'person'
    },
    {
      title: 'NOTIFICATION',
      url: '/notification',
      icon: 'notifications'
    },
    {
      title: 'SIGN OUT',
      url: '/login',
      icon: 'log-out'
    }
  ];
  public demoMenu = [
    {
      title: 'MENU',
      url: '/menu',
      icon: 'pizza'
    },
    {
      title: 'ABOUT US',
      url: '/aboutus',
      icon: 'pin'
    },
    {
      title: 'SIGN IN',
      url: '/login',
      icon: 'log-in'
    },
    {
      title: 'SIGN UP',
      url: '/register',
      icon: 'person-add'
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private router: Router,
    private dataUser: DataService,
    private statusBar: StatusBar,
    // private userServices: UserService,
    private network: Network,
    private alertCtrl: AlertController,
    private fcm: FCM,
    private market: Market,
    private loadCtrl: LoadingController,
    private toastController: ToastController,
    private screenOrientation: ScreenOrientation
  ) {
    this.initializeApp();
  }

  initializeApp() {

    this.platform.ready().then(() => {
      localStorage.removeItem("cart");
      localStorage.removeItem('time');
      this.screenOrientationLock()
      var loginSuccess = JSON.parse(localStorage.getItem('profile'));
      if (loginSuccess == null) {
        this.router.navigate(['home']);
      }
      else {
        console.log(" this.dataUser loginSuccess  ", loginSuccess);
        this.dataUser.customerId = loginSuccess.customer_id;
        console.log(" this.dataUser.customerId =", this.dataUser.customerId);
        let navigationExtras: NavigationExtras = {
          queryParams: {
            special: true
          }
        };
        this.router.navigate(['menu'], navigationExtras);

      }
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      timer(3000).subscribe(() => this.showSplash = false);
    });
    this.notificationSetup();
    this.checkNetwork();
  }

  screenOrientationLock() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }


  ////----------------- Push notification from firebas function --------------/////
  private notificationSetup() {
    this.fcm.onNotification().subscribe(data => {
      var loginSuccess = JSON.parse(localStorage.getItem('profile'));
      if (loginSuccess == null) {
        this.router.navigate(['home']);
      }
      else {
        if (data.wasTapped) {
          console.log("Received in background");
          let navigationExtras: NavigationExtras = {
            queryParams: {
              special: true
            }
          };
          this.router.navigate(['menu'], navigationExtras);
        } else {
          console.log("Received in foreground");
          this.alertForNewNotification();
        }
      }
    });

  }

  /////---------- Alert for new notification ----------//////
  async alertForNewNotification() {
    const alert = await this.alertCtrl.create({
      header: 'New Notification!',
      message: "Check new notification.",
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['notification']);
          }
        }
      ]
    });
    await alert.present();
  }

  // --------------checking network connection --------------//
  checkNetwork() {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      this.alertForNetworkCheck(disconnectSubscription);
    });

    // stop disconnect watch



    // watch network for a connection
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      this.presentToastForNetworkConnect(connectSubscription);
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
        }
      }, 3000);
    });

    // stop connect watch
    connectSubscription.unsubscribe();
  }

  /////---------- Alert for  network error ----------//////
  async alertForNetworkCheck(disconnectSubscription: any) {
    const alert = await this.alertCtrl.create({
      header: 'Network Error',
      message: "Check you network connection.",
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // disconnectSubscription.unsubscribe();
            this.checkNetwork();
          }
        }
      ]
    });
    await alert.present();
  }

  // ----------------toast for network connected ------------//
  async presentToastForNetworkConnect(connectSubscription: any) {
    const toast = await this.toastController.create({
      message: 'Connected',
      position: 'bottom',
      duration: 3500,
      translucent: true,
    });
    toast.present();
    // connectSubscription.unsubscribe();
  }
  ////--------------- Check version of app -------//
  // checkAppVersion() {
  //   this.userServices.checkVersion().then((Jsonresponse) => {
  //     let response = JSON.parse(Jsonresponse);
  //     console.log("respose", response)
  //     if (response.status == true) {
  //       this.dataUser.checkVersionRes = response.data;
  //       console.log(" status true", this.dataUser.checkVersionRes);
  //     }
  //     else if (response.status == false) {
  //       console.log(" status false", this.dataUser.checkVersionRes);
  //     }
  //   }).catch(error => {
  //     console.log('error', error);
  //   })
  // }
}