import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController, LoadingController, NavParams, ModalController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../Services/user.service';


@Component({
  selector: 'app-phone-update',
  templateUrl: './phone-update.page.html',
  styleUrls: ['./phone-update.page.scss'],
})
export class PhoneUpdatePage implements OnInit {

  mobileNumber: any;
  verificationCode: number;
  disableBtn: boolean = false;
  timer: any = 'ReSend Code';

  public todo: FormGroup;
  submitAttempt: boolean = false;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    public loadCtrl: LoadingController,
    private alertCtrl: AlertController,
    private services: UserService,
    private toastController: ToastController,
  ) {
    this.todo = this.formBuilder.group({
      code: ['', [Validators.required, , Validators.maxLength(6)]]
    });
    this.mobileNumber = this.navParams.data.mobileUpdate;
    this.verificationCode = this.navParams.data.verificationCode;
    console.table(this.navParams.data);

  }

  ngOnInit() {
  }

  backArrow() {
    this.navCtrl.navigateBack('account');
  }

  //------- timer function-------//
  timerFunction() {
    this.timer = 59;
    var interval = setInterval(() => {
      this.timer--;
      if (this.timer === 0) {
        this.timer = 'Resend CodeNode';
        clearInterval(interval);
        this.disableBtn = false;
      }
    }, 1000);
  }

  // ----------------resend code-----------//
  async resendCode() {
    this.disableBtn = true;
    const loading = await this.loadCtrl.create({
    });
    await loading.present();
    console.log("type of phone number ", typeof (this.todo.value.phone));
    this.services.resendCode(this.mobileNumber).then((Jsonresponse) => {
      let response = JSON.parse(Jsonresponse);
      console.log("verification response!!", response);
      loading.dismiss();
      if (response.status == true) {
        loading.dismiss();
        this.verificationCode = response.verification_code;
        console.log("staus true", response.status);
        this.timerFunction();

        // this.alertForSuccess()
      }
      else if (response.status == false) {
        console.log("staus false", response.status);
        let msg = response.msg;
        this.presentToast(msg);
        loading.dismiss();
        this.disableBtn = false;
        this.timer = 'Resend CodeNode';
      }
    }).catch(error => {
      console.log("Register Api error", error);
      loading.dismiss();
      let msg = "Server Error!";
      this.presentToast(msg);
      this.disableBtn = false;
      this.timer = 'Resend CodeNode';
    });

  }
  // -------------verification code ------------//
  async verification() {
    if (!this.todo.valid) {
      this.submitAttempt = true;
    }
    else {
      console.log('this code', this.todo.value.code);
      console.log('this verification', this.verificationCode);
      if (this.todo.value.code != this.verificationCode) {
        this.presentToast('Code does not match');
      }

      else if (this.todo.value.code == this.verificationCode) {
        const loading = await this.loadCtrl.create({
        });
        await loading.present();
        console.log("type of phone number ", typeof (this.todo.value.phone));
        this.services.updatePhoneNumber(this.mobileNumber).then((Jsonresponse) => {
          let response = JSON.parse(Jsonresponse);
          console.log("verification response!!", response);
          loading.dismiss();
          if (response.status == true) {
            loading.dismiss();
            console.log("staus true", response.status);
            this.alertForSuccess(response);
          }
          else if (response.status == false) {
            console.log("staus false", response.status);
            let msg = response.msg;
            this.presentToast(msg);
            loading.dismiss();
          }
        }).catch(error => {
          console.log("Register Api error", error);
          loading.dismiss();
          let msg = "Server Error!";
          this.presentToast(msg);

        });
      }

    }
  }

  /////---------- Alert For account success ----------//////
  async alertForSuccess(result: any) {
    const alert = await this.alertCtrl.create({
      header: 'Update',
      message: "Your mobile number updated.",
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.modalController.dismiss(result);
            this.navCtrl.navigateRoot(['account']);
          }
        }
      ]
    });
    await alert.present();
  }

  //------- Toast for error ----//
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3500,
      translucent: true,
    });
    toast.present();
  }

}
