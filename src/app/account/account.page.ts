import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, ModalController, ToastController, LoadingController,NavController } from '@ionic/angular';
import { UserService } from 'src/Services/user.service';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';




@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})

export class AccountPage {

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private services: UserService,
    private nativePageTransitions:NativePageTransitions,
    private modalController: ModalController,
    private navCtrl:NavController,
    private toastController: ToastController,
    private loadCtrl: LoadingController,

  ) {
  }

  address() {
    let value;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        address: value
      }
    };
    this.router.navigate(['addressM'], navigationExtras);
  }

  changePassword() {
    let options: NativeTransitionOptions = {
      direction: 'up',
      duration: 400
     };
    this.nativePageTransitions.curl(options);
    this.navCtrl.navigateForward('change-password')
    //this.router.navigate(['change-password']);
  }

  profile() {
    let options: NativeTransitionOptions = {
      direction: 'up',
      duration: 400
     };
    this.nativePageTransitions.curl(options);
    this.router.navigate(['profile']);
  }

  // changePhoneNumber() {
  //   this.presentPrompt()

  // }

  // //--------------- update phone number API ----------//
  // async updatePhoneNumber(mobileNumber: any) {
  //   const loading = await this.loadCtrl.create({
  //   });
  //   await loading.present();
  //   console.log(' mobile number', mobileNumber);
  //   this.services.updatePhone(mobileNumber).then((Jsonresponse) => {
  //     let response = JSON.parse(Jsonresponse);

  //     if (response.status == true) {
  //       console.log("status ", response.status);
  //       console.log("update phone number ", response);
  //       response.verification_code;
  //       response.mobile_number;
  //       loading.dismiss();
  //       this.presentModal(response.verification_code, response.mobile_number)
  //     }
  //     else if (response.status == false) {
  //       loading.dismiss();
  //       this.presentToast(response.msg);
  //     }

  //   }).catch((error) => {

  //     loading.dismiss();
  //     this.presentToast('Server Error!');
  //     console.log('error for phone update', error);
  //   })
  // }


  // // ------------- Alert Function ------------//
  // async presentPrompt() {
  //   const alert = await this.alertCtrl.create({
  //     header: 'Update Cell Number',
  //     //message: message,
  //     inputs: [
  //       {
  //         name: 'phoneNO',
  //         type: 'tel',
  //         placeholder: 'Enter phone number',
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: data => {
  //           console.log('Cancel clicked', data);

  //         }
  //       },
  //       {
  //         text: 'Update',
  //         handler: data => {
  //           console.log('data of alert pnone number', data);
  //           this.updatePhoneNumber(data.phoneNO);

  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();
  // }

  // // -----------open modal for phone update ------//
  // async presentModal(verificationCode: any, mobileNumber: any) {
  //   const modal = await this.modalController.create({
  //     component: PhoneUpdatePage,
  //     componentProps: {
  //       "mobileUpdate": mobileNumber,
  //       "verificationCode": verificationCode
  //     }
  //   });
  //   return await modal.present();
  // }

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