import { Component } from '@angular/core';
import { ModalController, LoadingController, ToastController, AlertController, NavController } from '@ionic/angular';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/Services/user.service';

@Component({
  selector: 'app-address',
  templateUrl: './address-menu.page.html',
  styleUrls: ['./address-menu.page.scss'],
})

export class AddressMenuPage {

  addressArray: any = [];
  selectedAddress: any;
  selectedAddressArray: any = [];
  additionalIntruction: any;
  isenabled: boolean;
  emptyAddress = false;
  imageAddress = '../assets/img/address.png';


  constructor(public modalController: ModalController,
    public loadCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private toastController: ToastController,
    private route: ActivatedRoute,
    private services: UserService,
    private router: Router) {
    //constructor
  }

  async addDeliveryAddress() {
    this.router.navigate(['add-address']);
  }

  ionViewDidEnter() {
    this.getAddress();
  }

  //--------- Back arrow function--------//
  backArrow() {
    this.navCtrl.back();
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
        this.emptyAddress = false;
        console.log("staus true", response.status);
        console.log("response data", response);
      }
      else if (response.status == false) {
        console.log("staus false", response.status);
        console.log("response msg", response);
        loading.dismiss();
        this.emptyAddress = true;
        // let msg = response.error;
        // this.presentToast(msg);
      }
    }).catch(error => {
      console.log("get Address Api error", error);
      loading.dismiss();
      // let msg = "Server Error!";
      // this.presentToast(msg);
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
      else {
        console.log("staus false", response.status);
        console.log("response msg", response);
        // let msg = response.error;
        // this.presentToast(msg);
      }
    }).catch(err => {
      console.log("failed to retrieved then: ", err);
      // let msg = "Server Error!";
      // this.presentToast(msg);

    });
  }

  /////---------- Alert For Delete Address ----------//////
  async alertDelteForItem(addressId: any) {
    const alert = await this.alertCtrl.create({
      header: 'Delete!',
      message: "Are you sure you want to delete address",
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
    console.log(" this.selectedAddress.addressID ", this.selectedAddress.address_id);
    this.paymentMethod(this.selectedAddress.address_id);
  }

  paymentMethod(addressId: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        addressId: addressId
      }
    };
    this.router.navigate(['payment-method'], navigationExtras);
  }

  //------- This func  enable btn of payment method ----///
  radioSelectedButton() {
    this.isenabled = true;
    console.log(this.isenabled);
  }

  //------- This func shows err msg upon wrong  data enter in address info --------//
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3500,
      position: "bottom",
      translucent: true
    });
    toast.present();
  }
}