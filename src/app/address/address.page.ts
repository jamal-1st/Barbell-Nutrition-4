import { Component } from '@angular/core';
import { ModalController, LoadingController, Platform, ToastController, AlertController, NavController } from '@ionic/angular';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/Services/user.service';
import { DataService } from 'src/Services/data.service';
import { Market } from '@ionic-native/market/ngx';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage {

  addressArray: any = [];
  selectedAddress: any;
  selectedAddressArray: any = [];
  additionalIntruction: any;
  isenabled: boolean;
  emptyAddress = false;
  imageAddress = '../assets/img/address.png';
  totalOrderPrice: any;
  restuarantAvaliablityMessage: any;
  availabilityStatus: any;

  constructor(public modalController: ModalController,
    public loadCtrl: LoadingController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private dataServices: DataService,
    private toastController: ToastController,
    private market: Market,
    private platform: Platform,
    private route: ActivatedRoute,
    private services: UserService,
    private router: Router) {

    var localData = JSON.parse((localStorage.getItem('Price')));
    console.log("local storage data", localData);
    this.totalOrderPrice = localData.subTotal;
    console.log("total price", this.totalOrderPrice);


  }

  addDeliveryAddress() {
    this.router.navigate(['add-address']);
  }

  //------- This func  enable btn of payment method ----///
  radioSelectedButton() {
    this.isenabled = true;
    console.log(this.isenabled);
  }


  ionViewDidEnter() {
    this.getAddress();
    // this. appVerionAPI();
  }

  //--------------- Check version of app -------//
  appVerionAPI() {
    // this.services.checkVersion().then((Jsonresponse) => {
    //   let response = JSON.parse(Jsonresponse);
    //   console.log("respose", response)
    //   if (response.status == true) {
    //     this.dataServices.checkVersionRes = response.data;
    //     console.log(" status true", this.dataServices.checkVersionRes);
    //     this.checkAppVersion()
    //   }
    //   else if (response.status == false) {
    //     console.log(" status false", this.dataServices.checkVersionRes);
    //   }
    // }).catch(error => {
    //   console.log('error', error);
    // })
  }

  //-----------  check app version ---------//
  // checkAppVersion() {
  //   this.dataServices.checkVersionRes;
  //   if (this.platform.is('android')) {
  //     var androidVersion = parseFloat(this.dataServices.checkVersionRes.app_version_android);
  //     console.log("android app version from serve ", androidVersion);
  //     if (this.dataServices.checkVersionRes.app_version_android != this.dataServices.androidAppVersion) {
  //       console.log("app version in respose")
  //       this.alerForUpdate('com.barbell.nutrition.android');
  //     }
  //     else {
  //       console.log("App up to date");
  //     }
  //   }
  //   if (this.platform.is('ios')) {
  //     this.dataServices.checkVersionRes.app_version_ios;
  //     if (this.dataServices.checkVersionRes.app_version_ios > this.dataServices.androidAppVersion) {
  //       this.alerForUpdate('id1454483537');
  //     }
  //     else {
  //       console.log("App up to date");
  //     }
  //   }
  //   else {
  //     var androidVersion = parseFloat(this.dataServices.checkVersionRes.app_version_android);
  //     console.log("android app version from serve ", androidVersion);
  //     if (this.dataServices.checkVersionRes.app_version_android != this.dataServices.androidAppVersion) {
  //       console.log("app version in respose")
  //       this.alerForUpdate('com.barbell.nutrition.android');
  //     }

  //   }
  // }

  // /////---------- Alert For Network  ----------//////
  // async alerForUpdate(packageName: any) {
  //   const alert = await this.alertCtrl.create({
  //     header: 'New Update!',
  //     message: "New update avaliable on store.",
  //     backdropDismiss: false,
  //     buttons: [
  //       {
  //         text: 'Update',
  //         handler: () => {
  //           this.market.open(packageName);
  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();
  // }

  //--------- Back arrow function--------//
  backArrow() {
    this.navCtrl.back();
    //this.navCtrl.navigateRoot('cart');
  }

  //------- This func get all address from address array --------//
  async getAddress() {
    this.isenabled = false;
    const loading = await this.loadCtrl.create({
    });
    await loading.present();
    this.services.getAddress().then((Jsonresponse) => {
      let response = JSON.parse(Jsonresponse);
      loading.dismiss();
      if (response.status == true) {
        this.addressArray = response.data;
        console.log("staus true", response.status);
        console.log("response data", response);
        this.emptyAddress = false;
        this.closedRestaurant(response, loading);
      }
      else if (response.status == false) {
        console.log("staus false", response.status);
        console.log("response msg", response);
        loading.dismiss();
        this.emptyAddress = true;
        let msg = response.msg;
        this.presentToast(msg);
      }
    }).catch(error => {
      console.log("get Address Api error", error);
      loading.dismiss();
      let msg = "Server Error!";
      this.presentToast(msg);
    });
  }

  //------- This func shows delete address  --------//
  deleteAddress(addressId: any) {
    this.services.deleteAddress(addressId).then((Jsonresponse) => {
      let response = JSON.parse(Jsonresponse);
      if (response.status == true) {
        this.getAddress();
        console.log("staus true", response.status);
        console.log("response data", response);

      }
      else if (response.status == false) {
        console.log("staus false", response.status);
        console.log("response msg", response);
        let msg = response.msg;
        this.presentToast(msg);
      }
    }).catch(err => {
      console.log("failed to retrieved then: ", err);
      let msg = "Server Error!";
      this.presentToast(msg);
    });
  }

  closedRestaurant(responseData: any, loading: any) {
    console.log("staus false", responseData.a);

    this.restuarantAvaliablityMessage = responseData.availability_msg;
    this.availabilityStatus = responseData.availability_status;
    if (this.availabilityStatus == true) {
      console.log('availabilityStatus', this.availabilityStatus);
    }
    else if (this.availabilityStatus == false) {
      // this.presentToast(this.restuarantAvaliablityMessage);
      this.navCtrl.navigateRoot('menu');

    }
  }

  /////---------- Alert For Delete Address ----------//////
  async alertDelteForItem(addressId: any) {
    const alert = await this.alertCtrl.create({
      header: 'Delete',
      message: "Are you sure  to delete this address.",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'OK',
          handler: () => {
            this.deleteAddress(addressId);
          }
        }
      ]
    });
    await alert.present();
  }

  getSelectedRadioBtn() {
    this.selectedAddressArray = document.getElementsByClassName('addAddress');
    for (var i = 0; i < this.selectedAddressArray.length; i++) {
      if (this.selectedAddressArray[i].checked) {
        this.selectedAddress = (this.selectedAddressArray[i].value);
        console.log(" this.selectedAddress ", this.selectedAddress);
      }
    }
    this.paymentMethod(this.selectedAddress);
  }


  //---------- check minimiun delivery charges --------//
  paymentMethod(addressData: any) {
    var totalPrice = parseFloat(this.totalOrderPrice);
    if (totalPrice >= addressData.minimum_order) {
      if (this.dataServices.restuarantClosed) {
        this.alertFor('Closed!', 'Restuarant closed.');
      }
      else {
        var addressDataParam = JSON.stringify(addressData)
        let navigationExtras: NavigationExtras = {
          queryParams: {
            address: addressDataParam
          }
        };
        this.router.navigate(['payment-method'], navigationExtras);
      }
    }
    else {
      let msg = "Minumun order should be " + "£" + addressData.minimum_order + ". But your current order is " + "£" + this.totalOrderPrice + "!";
      this.presentToast(msg);
    }
  }


  //------- This func  enable btn of payment method ----///
  async alertFor(heading: any, message: any) {
    const alert = await this.alertCtrl.create({
      header: heading,
      message: message,
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['restuarant-closed']);
          }
        }
      ]
    });
    await alert.present();
  }

  //------- This func shows err msg upon wrong  data enter in address info --------//
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3500,
      position: 'bottom',
      translucent: true
    });
    toast.present();
  }
}