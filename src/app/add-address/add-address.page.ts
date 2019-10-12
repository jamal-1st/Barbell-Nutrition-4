import { Component } from '@angular/core';
import { ModalController, LoadingController, ToastController, AlertController, NavController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/Services/user.service';
import { Router } from '@angular/router';
//import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
})
export class AddAddressPage {

  public todo: FormGroup;
  submitAttempt: boolean = false;
  constructor(public modalController: ModalController,
    private router: Router,
    public loadCtrl: LoadingController,
    private toastController: ToastController,
    //private nativePageTransitions:NativePageTransitions,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private services: UserService,
    private formBuilder: FormBuilder) {
    this.todo = this.formBuilder.group({
      country: ['', Validators.required],
      address: ['', Validators.required],
      town: ['', Validators.required],
      description: ['', Validators.required],
      postCode: ['', Validators.required],
    });
  }

  //--------- Back arrow function--------//
  backArrow() {
    console.log("back function");
    // let options: NativeTransitionOptions = {
    //   direction: 'right',
    //   duration: 400,
    //   slowdownfactor: -1,
    //   iosdelay: 50
    //  };
    // this.nativePageTransitions.slide(options);
    this.navCtrl.back();
  }

  
  async addAddress() {
    if (!this.todo.valid) {
      this.submitAttempt = true;
      let msg = "Address's fields are invalid or empty" 
      this.presentToast(msg) 
    }
    else {
      const loading = await this.loadCtrl.create({
      });
      await loading.present();
      this.services.addAddress(this.todo.value).then((Jsonresponse) => {
        loading.dismiss();
        let response = JSON.parse(Jsonresponse);
        if (response.status == true) {
          console.log("staus true", response.status);
          this.alertForSuccess();
        }
        else if(response.status == false){
          console.log("staus false", response.status);
          console.log("staus false", response);
          loading.dismiss();
          let msg = response.msg;
          this.presentToast(msg);
        }
      }).catch(err => {
        console.log("failed to retrieved then: ", err);
        loading.dismiss();
        let msg = "Server Error!";
        this.presentToast(msg);
      });
    }
  }

  ///////------- This func shows err msg upon wrong  data enter in address info --------///////
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3500,
      translucent:true,
    });
    toast.present();
  }

  /////---------- Alert For Delete Item ----------//////
  async alertForSuccess() {
    const alert = await this.alertCtrl.create({
      message: "New address added Successfully!",
      backdropDismiss:false,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            this.navCtrl.back();

          }
        }
      ]
    });
    await alert.present();
  }
}