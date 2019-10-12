import { Component } from '@angular/core';
import { MenuController, ToastController, LoadingController, AlertController, Platform, NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { BarbellInfoService } from 'src/Services/barbell-info.service';
import { DataService } from 'src/Services/data.service';
import { Market } from '@ionic-native/market/ngx';
import { NativePageTransitions,NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})

export class MenuPage {
  data: any;
  menuItemsArray: any;
  categoriesArray: any;
  menuItemsPass: any = [];
  totalQty: number = 0;
  dataSkelton = true;
  errorPic = "../assets/img/errorP.png";
  closedRestuarantImage = "../assets/img/defualtImg.jpg";
  errorScreen = false;
  mainContent = false;
  appVersionForApp: any;
  avaliablity: boolean = true;
  restuarantAvaliablityMessage: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private services: BarbellInfoService,
    private platform: Platform,
    private dataServices: DataService,
    private alertCtrl: AlertController,
    private market: Market,
    private nativePageTransitions:NativePageTransitions,
    private navCtrl: NavController,
    private toastController: ToastController,
    private loadCtrl: LoadingController,
    private menuCtrl: MenuController) {
    this.route.queryParams.subscribe(params => {
      console.log("param reviced", params.special);
      this.data = params.special;
      if (params && params.special) {
        this.getValue(this.data);
      }
    });
    this.getMenuItem();
  }

  ionViewDidEnter() {
    this.totalQuantity();
    // this.checkingNetwork();
  }

  //-----------Function After constructor----------////
  getValue(value: any) {
    console.log("enter in get value method", value);
    if (value == 'true') {
      console.log("params data demoMenu", this.data);
      console.log("params data Menu", this.data);
      this.menuCtrl.enable(true, 'Menu');
    }
    else {
      console.log("params data demoMenu", this.data);
      this.menuCtrl.enable(true, 'demoMenu');
    }
  }

  //----------Take param values-------//
  async goToItemsList(categoryId: any) {
    const loading = await this.loadCtrl.create({
    });
    await loading.present();
    console.log("categoryId get!!", categoryId);
    this.menuItemsPass = [];
    for (let i = 0; i < this.menuItemsArray.length; i++) {
      if (categoryId == this.menuItemsArray[i].category_id) {
        this.menuItemsPass.push(this.menuItemsArray[i]);
      }
    }
    console.log(" this.menuItemsPass", this.menuItemsPass);
    this.dataServices.menuDetailToNextPage = [];
    this.dataServices.menuDetailToNextPage = this.menuItemsPass;
    this.router.navigate(['item-list']);
    //this.navCtrl.navigateRoot('item-list');
    loading.dismiss();
  }

  //--------- Main function-----------//
  async getMenuItem() {
    this.services.getMenuItems().then((jsonresponse) => {
      let response = JSON.parse(jsonresponse);
      console.log("API Menu Item response!!", response);
      if (response.status == true) {
        console.log("staus true", response.status);
        console.log("API Menu data response!!", response.data);
        this.menuItemsArray = response.data.menu;
        console.log("     this.menuItemsArray  data response!!", this.menuItemsArray);
        this.categoriesArray = response.data.categories;
        console.log(" this.categoriesArray data response!!", this.categoriesArray);
        this.dataServices.setting = response.data.setting;
        this.mainContent = true;
        this.dataSkelton = false;
        this.appVerionAPI();
      }
      else if (response.status == false) {

        console.log("staus false", response.status);
        this.restuarantAvaliablityMessage = response.msg;
        this.presentToastForRestClosed(this.restuarantAvaliablityMessage);
        this.dataSkelton = false;
        this.avaliablity = false;

      }
    }).catch(error => {
      console.log(" Api error", error);
      this.dataSkelton = false;
      this.errorScreen = true;
    });;
  }

  ////--------------- Check version of app -------//
  appVerionAPI() {
    this.services.checkVersion().then((Jsonresponse) => {
      let response = JSON.parse(Jsonresponse);
      console.log("respose", response)
      if (response.status == true) {

        this.dataServices.checkVersionRes = response.data;
        console.log(" status true", this.dataServices.checkVersionRes);
        this.checkAppVersion()
      }
      else if (response.status == false) {
        console.log(" status false", this.dataServices.checkVersionRes);
      }
    }).catch(error => {
      console.log('error', error);
    })
  }

  //-----------  Take to apple store or google play ---------//
  checkAppVersion() {
    this.dataServices.checkVersionRes;
    if (this.platform.is('android')) {
      if (this.dataServices.checkVersionRes.android_update_status == 1) {
        var androidVersion = parseFloat(this.dataServices.checkVersionRes.app_version_android);
        console.log("android app version from serve ", androidVersion);
        if (this.dataServices.checkVersionRes.app_version_android != this.dataServices.androidAppVersion) {
          console.log("app version in respose")
          this.alerForUpdate('com.barbell.nutrition.android');
        }
        else {
          console.log("App up to date");
        }
      }
      else {
        console.log("App up to date");
      }

    }
    if (this.platform.is('ios')) {

      if (this.dataServices.checkVersionRes.ios_update_status == 1) {
        if (this.dataServices.checkVersionRes.app_version_ios != this.dataServices.iosAppVersion) {
          this.alerForUpdate('id1454483537');
        }
        else {
          console.log("App up to date");
        }
      }
    }
    else {
      console.log(" app version from serve ");
    }
  }

  //------- Error when api hit --------//
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'middle',
      duration: 3500,
      translucent: true,
    });
    toast.present();
  }
  async presentToastForRestClosed(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'bottom',
      duration: 3500,
      translucent: true,
    });
    toast.present();
  }

  /////---------- Open cart page  ----------//////
  cartOpen() {
    var storeItem = JSON.parse(localStorage.getItem("cart"));
    if (storeItem == null || storeItem.length == 0) {
      var msg = 'Your cart is empty';
      console.log("if storeitem", storeItem);
      this.presentToast(msg);
    }
    else {
      console.log("else storeitem");
      
    let options: NativeTransitionOptions = {
      direction: 'down',
      duration: 600
     };
    this.nativePageTransitions.flip(options);
      this.router.navigate(['cart1']);
    }
  }

  /////---------- Alert For Network  ----------//////
  async alerForUpdate(packageName: any) {
    const alert = await this.alertCtrl.create({
      header: 'Update Avaliable',
      message: "New update avaliable on store.",
      backdropDismiss: false,
      buttons: [
        {
          text: 'Update',
          handler: () => {
            this.market.open(packageName);
            navigator['app'].exitApp();
          }
        }
      ]
    });
    await alert.present();
  }

  //------------- calculate quantity of cart local storage----------------//
  totalQuantity() {
    this.totalQty = 0;
    var storeItem = JSON.parse(localStorage.getItem("cart"));
    if (storeItem == null) {
      console.log("cart is empty");
    }
    else {
      for (let i = 0; i < storeItem.length; i++) {
        console.log("quantity ", storeItem[i].quantity);
        this.totalQty = this.totalQty + storeItem[i].quantity;
      }
    }
  }
}