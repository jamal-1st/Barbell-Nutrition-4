import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController, ModalController, MenuController, Platform } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/Services/user.service';
import { DataService } from 'src/Services/data.service';
import { Market } from '@ionic-native/market/ngx';
import { PhoneUpdatePage } from '../phone-update/phone-update.page';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  public todo: FormGroup;
  submitAttempt: boolean = false;
  firstName: any;
  lastName: any;
  email: any;
  cellNumber: any;

  constructor(
    public formBuilder: FormBuilder,
    private platform: Platform,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private navCtrl: NavController,
    private service: UserService,
    private market: Market,
    private alertCtrl: AlertController,
    private dataServices: DataService,
    private menuCtrl: MenuController
  ) {
    //this.menuCtrl.enable(false);
    //------ get localStorage data and assign to todo form builder ------//
    var profile = JSON.parse(localStorage.getItem('profile'));
    console.log("profile local storage", profile);
    this.firstName = profile.first_name;
    this.lastName = profile.last_name;
    this.email = profile.email;
    this.cellNumber = profile.mobile_number;

    // --- todo formbuilder -----//
    this.todo = this.formBuilder.group({
      firstName: [this.firstName, [Validators.required]],
      lastName: [this.lastName, [Validators.required]],
      email: [this.email, [Validators.required]],
      number: [this.cellNumber, [Validators.required, Validators.minLength(12), Validators.maxLength(12)]]
    });

  }

  //--------- Back arrow function--------//
  backArrow() {
    this.navCtrl.back();
  }

  async changeProfile() {

    const loading = await this.loadingController.create({
    });
    await loading.present();
    console.log("type of phone number ", typeof (this.todo.value));
    this.service.changeProfile(this.todo.value).then((Jsonresponse) => {
      loading.dismiss();
      let response = JSON.parse(Jsonresponse);
      if (response.status == true) {
        console.log("staus true", response.status);
        console.log("login response data", response.data);
        this.changingLocalStorageData(response.data)
      }
      else {
        console.log("staus false", response.status);
        loading.dismiss();
        let msg = response.msg;
        this.presentToast(msg);
      }
    }).catch(error => {
      console.log("Chnage Password Api error", error);
      loading.dismiss();
    });
  }

  changingLocalStorageData(localStorageData: any) {
    var profile = JSON.parse(localStorage.getItem('profile'));
    console.log("profile local storage", profile);
    localStorage.removeItem('profile');
    var profileData = {
      'email': this.email,
      'first_name': localStorageData.first_name,
      'last_name': localStorageData.last_name,
      'mobile_number': this.cellNumber,
      'customer_id': localStorageData.customer_id
    }
    localStorage.setItem("profile", JSON.stringify(profileData));
    this.navCtrl.navigateBack('/account');
  }


  //--------------- update phone number API ----------//
  async updatePhoneNumber(mobileNumber: any) {
    const loading = await this.loadingController.create({
    });
    await loading.present();
    console.log(' mobile number', mobileNumber);
    this.service.updatePhone(mobileNumber).then((Jsonresponse) => {
      let response = JSON.parse(Jsonresponse);

      if (response.status == true) {
        console.log("status ", response.status);
        console.log("update phone number ", response);
        response.verification_code;
        response.mobile_number;
        loading.dismiss();
        this.presentModal(response.verification_code, response.mobile_number)
      }
      else if (response.status == false) {
        loading.dismiss();
        this.presentToast(response.msg);
      }

    }).catch((error) => {

      loading.dismiss();
      this.presentToast('Server Error!');
      console.log('error for phone update', error);
    })
  }


  // ------------- Alert Function ------------//
  async presentPrompt() {
    const alert = await this.alertCtrl.create({
      header: 'Update Cell Number',
      //message: message,
      inputs: [
        {
          name: 'phoneNO',
          type: 'tel',
          placeholder: 'Enter phone number',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked', data);

          }
        },
        {
          text: 'Update',
          handler: data => {
            console.log('data of alert pnone number', data);
            this.updatePhoneNumber(data.phoneNO);

          }
        }
      ]
    });
    await alert.present();
  }

  //// -----------open modal for phone update ------//
  async presentModal(verificationCode: any, mobileNumber: any) {
    const modal = await this.modalController.create({
      component: PhoneUpdatePage,
      componentProps: {
        "mobileUpdate": mobileNumber,
        "verificationCode": verificationCode
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      console.table(dataReturned);
      var profile = JSON.parse(localStorage.getItem('profile'));
      console.log("profile local storage", profile);
      localStorage.removeItem('profile');
      var profileData = {
        'email': this.email,
        'first_name': this.firstName,
        'last_name': this.lastName,
        'mobile_number': dataReturned.data.mobile_number,
        'customer_id': dataReturned.data.customer_id,
      }
      localStorage.setItem("profile", JSON.stringify(profileData));
      this.updateProfielAfterPhoneUpdate();

    });
    return await modal.present();
  }

  updateProfielAfterPhoneUpdate(){
    var profile = JSON.parse(localStorage.getItem('profile'));
    console.log("profile local storage", profile);
    this.firstName = profile.first_name;
    this.lastName = profile.last_name;
    this.email = profile.email;
    this.cellNumber = profile.mobile_number;
  }
  /**
    * Name:        PresentToast
    * Params: 
    *              (msg)    - Employee Name,
    *              (Number) - Salary 
    * Description: Calculate tax per Anum
    * Optional:    Deductions, Bonuses
    **/
  //------- This func shows err msg upon wrong credentials on Login --------//
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3500
    });
    toast.present();
  }

  /////---------- Alert For Delete Item ----------//////
  async alertDelteForItem() {
    const alert = await this.alertCtrl.create({
      header: 'Update Info',
      message: "Are you sure to update profile info.",
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
            this.changeProfile();
          }
        }
      ]
    });
    await alert.present();
  }
}